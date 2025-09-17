import express from 'express';
import { query, transaction } from '../config/database';
import { authenticateToken } from '../middleware/auth';
import { validate, validateQuery, schemas } from '../middleware/validation';
import { ApiResponse } from '../types';

const router = express.Router();

// Get all auctions
router.get('/', validateQuery(schemas.pagination), async (req, res) => {
  try {
    const { page = 1, limit = 20, sort = 'start_time', order = 'ASC' } = req.query;
    const pageNum = parseInt(page as string) || 1;
    const limitNum = parseInt(limit as string) || 20;
    const offset = (pageNum - 1) * limitNum;

    // Get total count
    const countResult = await query(
      'SELECT COUNT(*) as total FROM auctions WHERE status IN ($1, $2)',
      ['SCHEDULED', 'ACTIVE']
    );
    const total = parseInt(countResult.rows[0].total);

    // Get auctions
    const auctionsResult = await query(`
      SELECT 
        a.id,
        a.auction_type,
        a.start_price,
        a.reserve_price,
        a.current_price,
        a.start_time,
        a.end_time,
        a.status,
        a.created_at,
        t.title as technology_title,
        t.trl_level,
        u.email as submitter_email,
        u.user_type as submitter_type
      FROM auctions a
      LEFT JOIN technologies t ON a.technology_id = t.id
      LEFT JOIN users u ON t.submitter_id = u.id
      WHERE a.status IN ($1, $2)
      ORDER BY a.${sort} ${order}
      LIMIT $3 OFFSET $4
    `, ['SCHEDULED', 'ACTIVE', limit, offset]);

    const response: ApiResponse = {
      success: true,
      data: auctionsResult.rows,
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        total,
        totalPages: Math.ceil(total / parseInt(limit as string))
      }
    };

    res.json(response);
  } catch (error) {
    console.error('Get auctions error:', error);
    const response: ApiResponse = {
      success: false,
      error: 'Failed to fetch auctions'
    };
    res.status(500).json(response);
  }
});

// Get auction by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const auctionResult = await query(`
      SELECT 
        a.*,
        t.title as technology_title,
        t.public_summary,
        t.trl_level,
        u.email as submitter_email,
        u.user_type as submitter_type
      FROM auctions a
      LEFT JOIN technologies t ON a.technology_id = t.id
      LEFT JOIN users u ON t.submitter_id = u.id
      WHERE a.id = $1
    `, [id]);

    if (auctionResult.rows.length === 0) {
      const response: ApiResponse = {
        success: false,
        error: 'Auction not found'
      };
      return res.status(404).json(response);
    }

    const auction = auctionResult.rows[0];

    // Get bids for this auction
    const bidsResult = await query(`
      SELECT 
        b.*,
        u.email as bidder_email,
        u.user_type as bidder_type
      FROM bids b
      LEFT JOIN users u ON b.bidder_id = u.id
      WHERE b.auction_id = $1
      ORDER BY b.bid_amount DESC, b.bid_time ASC
    `, [id]);

    const response: ApiResponse = {
      success: true,
      data: {
        ...auction,
        bids: bidsResult.rows
      }
    };

    res.json(response);
  } catch (error) {
    console.error('Get auction error:', error);
    const response: ApiResponse = {
      success: false,
      error: 'Failed to fetch auction'
    };
    res.status(500).json(response);
  }
});

// Create auction
router.post('/', authenticateToken, validate(schemas.auction), async (req, res) => {
  try {
    const userId = req.user!.userId;
    const { technology_id, auction_type, start_price, reserve_price, start_time, end_time } = req.body;

    // Check if technology exists and user owns it
    const techResult = await query(
      'SELECT submitter_id FROM technologies WHERE id = $1',
      [technology_id]
    );

    if (techResult.rows.length === 0) {
      const response: ApiResponse = {
        success: false,
        error: 'Technology not found'
      };
      return res.status(404).json(response);
    }

    if (techResult.rows[0].submitter_id !== userId) {
      const response: ApiResponse = {
        success: false,
        error: 'Not authorized to create auction for this technology'
      };
      return res.status(403).json(response);
    }

    // Check if auction already exists for this technology
    const existingAuction = await query(
      'SELECT id FROM auctions WHERE technology_id = $1 AND status IN ($2, $3)',
      [technology_id, 'SCHEDULED', 'ACTIVE']
    );

    if (existingAuction.rows.length > 0) {
      const response: ApiResponse = {
        success: false,
        error: 'Active auction already exists for this technology'
      };
      return res.status(409).json(response);
    }

    // Create auction
    const auctionResult = await query(`
      INSERT INTO auctions (
        technology_id, auction_type, start_price, reserve_price, 
        current_price, start_time, end_time, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `, [
      technology_id,
      auction_type,
      start_price,
      reserve_price,
      start_price || 0,
      start_time,
      end_time,
      'SCHEDULED'
    ]);

    const response: ApiResponse = {
      success: true,
      data: auctionResult.rows[0],
      message: 'Auction created successfully'
    };

    res.status(201).json(response);
  } catch (error) {
    console.error('Create auction error:', error);
    const response: ApiResponse = {
      success: false,
      error: 'Failed to create auction'
    };
    res.status(500).json(response);
  }
});

// Place bid
router.post('/:id/bid', authenticateToken, validate(schemas.bid), async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user!.userId;
    const { bid_amount } = req.body;

    // Check if auction exists and is active
    const auctionResult = await query(
      'SELECT * FROM auctions WHERE id = $1 AND status = $2',
      [id, 'ACTIVE']
    );

    if (auctionResult.rows.length === 0) {
      const response: ApiResponse = {
        success: false,
        error: 'Auction not found or not active'
      };
      return res.status(404).json(response);
    }

    const auction = auctionResult.rows[0];

    // Check if bid amount is valid
    if (bid_amount <= (auction.current_price || auction.start_price || 0)) {
      const response: ApiResponse = {
        success: false,
        error: 'Bid amount must be higher than current price'
      };
      return res.status(400).json(response);
    }

    // Check if auction has ended
    if (auction.end_time && new Date(auction.end_time) < new Date()) {
      const response: ApiResponse = {
        success: false,
        error: 'Auction has ended'
      };
      return res.status(400).json(response);
    }

    // Check if user is not the technology owner
    const techResult = await query(
      'SELECT submitter_id FROM technologies WHERE id = $1',
      [auction.technology_id]
    );

    if (techResult.rows[0].submitter_id === userId) {
      const response: ApiResponse = {
        success: false,
        error: 'Cannot bid on your own technology'
      };
      return res.status(400).json(response);
    }

    // Start transaction
    const result = await transaction(async (client) => {
      // Create bid
      const bidResult = await client.query(`
        INSERT INTO bids (auction_id, bidder_id, bid_amount, bid_time)
        VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
        RETURNING *
      `, [id, userId, bid_amount]);

      // Update auction current price
      await client.query(
        'UPDATE auctions SET current_price = $1 WHERE id = $2',
        [bid_amount, id]
      );

      return bidResult.rows[0];
    });

    const response: ApiResponse = {
      success: true,
      data: result,
      message: 'Bid placed successfully'
    };

    res.status(201).json(response);
  } catch (error) {
    console.error('Place bid error:', error);
    const response: ApiResponse = {
      success: false,
      error: 'Failed to place bid'
    };
    res.status(500).json(response);
  }
});

// Get auction bids
router.get('/:id/bids', async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 20 } = req.query;
    const pageNum = parseInt(page as string) || 1;
    const limitNum = parseInt(limit as string) || 20;
    const offset = (pageNum - 1) * limitNum;

    // Check if auction exists
    const auctionResult = await query(
      'SELECT id FROM auctions WHERE id = $1',
      [id]
    );

    if (auctionResult.rows.length === 0) {
      const response: ApiResponse = {
        success: false,
        error: 'Auction not found'
      };
      return res.status(404).json(response);
    }

    // Get total count
    const countResult = await query(
      'SELECT COUNT(*) as total FROM bids WHERE auction_id = $1',
      [id]
    );
    const total = parseInt(countResult.rows[0].total);

    // Get bids
    const bidsResult = await query(`
      SELECT 
        b.*,
        u.email as bidder_email,
        u.user_type as bidder_type
      FROM bids b
      LEFT JOIN users u ON b.bidder_id = u.id
      WHERE b.auction_id = $1
      ORDER BY b.bid_amount DESC, b.bid_time ASC
      LIMIT $2 OFFSET $3
    `, [id, limit, offset]);

    const response: ApiResponse = {
      success: true,
      data: bidsResult.rows,
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        total,
        totalPages: Math.ceil(total / parseInt(limit as string))
      }
    };

    res.json(response);
  } catch (error) {
    console.error('Get auction bids error:', error);
    const response: ApiResponse = {
      success: false,
      error: 'Failed to fetch auction bids'
    };
    res.status(500).json(response);
  }
});

export default router;

