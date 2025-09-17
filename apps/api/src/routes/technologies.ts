import express from 'express';
import { query, transaction } from '../config/database';
import { authenticateToken, optionalAuth, requireRole } from '../middleware/auth';
import { validate, validateQuery, schemas } from '../middleware/validation';
import { ApiResponse, TechnologySearchParams, TechnologyCreateRequest } from '../types';

const router = express.Router();

// Get all technologies with search and pagination
router.get('/', validateQuery(schemas.technologySearch), optionalAuth, async (req, res) => {
  try {
    const {
      query: searchQuery,
      search,
      category_id,
      category,
      trl_level,
      status,
      user_type,
      min_price,
      max_price,
      territory,
      page = 1,
      limit = 20,
      sort = 'created_at',
      order = 'DESC'
    }: TechnologySearchParams = req.query;

    // Use search parameter if query is not provided
    const finalSearchQuery = searchQuery || search;
    const finalCategoryId = category_id || category;

    const offset = (page - 1) * limit;
    const userId = req.user?.userId;

    // Build WHERE clause
    let whereConditions = ['t.status IN ($1, $2)']; // Only show approved and active by default
    let queryParams: any[] = ['APPROVED', 'ACTIVE'];
    let paramIndex = 3;

    if (finalSearchQuery && finalSearchQuery.trim() !== '') {
      whereConditions.push(`(t.title ILIKE $${paramIndex} OR t.public_summary ILIKE $${paramIndex})`);
      queryParams.push(`%${finalSearchQuery}%`);
      paramIndex++;
    }

    if (finalCategoryId && finalCategoryId.trim() !== '') {
      whereConditions.push(`t.category_id = $${paramIndex}`);
      queryParams.push(finalCategoryId);
      paramIndex++;
    }

    if (trl_level && trl_level !== '' && !isNaN(Number(trl_level))) {
      whereConditions.push(`t.trl_level = $${paramIndex}`);
      queryParams.push(Number(trl_level));
      paramIndex++;
    }

    if (status && status.trim() !== '') {
      whereConditions = ['t.status = $1']; // Override default status filter
      queryParams = [status];
      paramIndex = 2;
    }

    if (user_type) {
      whereConditions.push(`u.user_type = $${paramIndex}`);
      queryParams.push(user_type);
      paramIndex++;
    }

    // Build the main query
    const baseQuery = `
      FROM technologies t
      LEFT JOIN users u ON t.submitter_id = u.id
      LEFT JOIN categories c ON t.category_id = c.id
      LEFT JOIN pricing p ON t.id = p.technology_id
      WHERE ${whereConditions.join(' AND ')}
    `;

    // Get total count
    const countQuery = `SELECT COUNT(DISTINCT t.id) as total ${baseQuery}`;
    const countResult = await query(countQuery, queryParams);
    const total = parseInt(countResult.rows[0].total);

    // Get technologies
    const technologiesQuery = `
      SELECT DISTINCT
        t.id,
        t.title,
        t.public_summary,
        t.trl_level,
        t.status,
        t.visibility_mode,
        t.created_at,
        t.updated_at,
        u.id as submitter_id,
        u.email as submitter_email,
        u.user_type as submitter_type,
        c.name as category_name,
        c.code as category_code,
        p.asking_price,
        p.currency,
        p.pricing_type
      ${baseQuery}
      ORDER BY t.${sort} ${order}
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;

    queryParams.push(limit, offset);
    const technologiesResult = await query(technologiesQuery, queryParams);

    // Get technology owners for each technology
    const technologies = await Promise.all(
      technologiesResult.rows.map(async (tech: any) => {
        const ownersResult = await query(
          'SELECT owner_type, owner_name, ownership_percentage FROM technology_owners WHERE technology_id = $1',
          [tech.id]
        );

        return {
          ...tech,
          owners: ownersResult.rows
        };
      })
    );

    const response: ApiResponse = {
      success: true,
      data: technologies,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };

    res.json(response);
  } catch (error) {
    console.error('Get technologies error:', error);
    const response: ApiResponse = {
      success: false,
      error: 'Failed to fetch technologies'
    };
    res.status(500).json(response);
  }
});

// Get single technology by ID
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;

    // Get technology details
    const techResult = await query(`
      SELECT 
        t.*,
        u.email as submitter_email,
        u.user_type as submitter_type,
        c.name as category_name,
        c.code as category_code
      FROM technologies t
      LEFT JOIN users u ON t.submitter_id = u.id
      LEFT JOIN categories c ON t.category_id = c.id
      WHERE t.id = $1
    `, [id]);

    if (techResult.rows.length === 0) {
      const response: ApiResponse = {
        success: false,
        error: 'Technology not found'
      };
      return res.status(404).json(response);
    }

    const technology = techResult.rows[0];

    // Check if user can see confidential details
    const canSeeConfidential = userId && (
      userId === technology.submitter_id || 
      technology.visibility_mode === 'PUBLIC_FULL'
    );

    // Get technology owners
    const ownersResult = await query(
      'SELECT * FROM technology_owners WHERE technology_id = $1',
      [id]
    );

    // Get intellectual properties
    const ipResult = await query(
      'SELECT * FROM intellectual_properties WHERE technology_id = $1',
      [id]
    );

    // Get pricing information
    const pricingResult = await query(
      'SELECT * FROM pricing WHERE technology_id = $1',
      [id]
    );

    // Get investment transfer information
    const investmentResult = await query(
      'SELECT * FROM investment_transfer WHERE technology_id = $1',
      [id]
    );

    // Get documents
    const documentsResult = await query(
      'SELECT * FROM documents WHERE technology_id = $1 AND is_public = true',
      [id]
    );

    // Get auctions
    const auctionsResult = await query(
      'SELECT * FROM auctions WHERE technology_id = $1',
      [id]
    );

    const response: ApiResponse = {
      success: true,
      data: {
        ...technology,
        confidential_detail: canSeeConfidential ? technology.confidential_detail : null,
        owners: ownersResult.rows,
        intellectual_properties: ipResult.rows,
        pricing: pricingResult.rows[0] || null,
        investment_transfer: investmentResult.rows[0] || null,
        documents: documentsResult.rows,
        auctions: auctionsResult.rows
      }
    };

    res.json(response);
  } catch (error) {
    console.error('Get technology error:', error);
    const response: ApiResponse = {
      success: false,
      error: 'Failed to fetch technology'
    };
    res.status(500).json(response);
  }
});

// Create new technology
router.post('/', authenticateToken, validate(schemas.technology), async (req, res) => {
  try {
    const userId = req.user!.userId;
    const technologyData: TechnologyCreateRequest = req.body;

    // Start transaction
    const result = await transaction(async (client) => {
      // Create technology
      const techResult = await client.query(`
        INSERT INTO technologies (
          title, public_summary, confidential_detail, trl_level, 
          category_id, submitter_id, status, visibility_mode
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *
      `, [
        technologyData.title,
        technologyData.public_summary,
        technologyData.confidential_detail,
        technologyData.trl_level,
        technologyData.category_id,
        userId,
        'DRAFT',
        technologyData.visibility_mode || 'PUBLIC_SUMMARY'
      ]);

      const technology = techResult.rows[0];

      // Create technology owners
      if (technologyData.owners && technologyData.owners.length > 0) {
        for (const owner of technologyData.owners) {
          await client.query(`
            INSERT INTO technology_owners (technology_id, owner_type, owner_name, ownership_percentage)
            VALUES ($1, $2, $3, $4)
          `, [technology.id, owner.owner_type, owner.owner_name, owner.ownership_percentage]);
        }
      }

      // Create intellectual properties
      if (technologyData.ip_details && technologyData.ip_details.length > 0) {
        for (const ip of technologyData.ip_details) {
          await client.query(`
            INSERT INTO intellectual_properties (technology_id, ip_type, ip_number, status, territory)
            VALUES ($1, $2, $3, $4, $5)
          `, [technology.id, ip.ip_type, ip.ip_number, ip.status, ip.territory]);
        }
      }

      // Create pricing information
      if (technologyData.pricing) {
        await client.query(`
          INSERT INTO pricing (
            technology_id, pricing_type, asking_price, currency, price_type,
            appraisal_purpose, appraisal_scope, appraisal_deadline
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        `, [
          technology.id,
          technologyData.pricing.pricing_type,
          technologyData.pricing.asking_price,
          technologyData.pricing.currency || 'VND',
          technologyData.pricing.price_type,
          technologyData.pricing.appraisal_purpose,
          technologyData.pricing.appraisal_scope,
          technologyData.pricing.appraisal_deadline
        ]);
      }

      // Create investment transfer information
      if (technologyData.investment_transfer) {
        await client.query(`
          INSERT INTO investment_transfer (
            technology_id, investment_stage, commercialization_methods, transfer_methods,
            territory_scope, financial_methods, usage_limitations, current_partners, potential_partners
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        `, [
          technology.id,
          technologyData.investment_transfer.investment_stage,
          technologyData.investment_transfer.commercialization_methods,
          technologyData.investment_transfer.transfer_methods,
          technologyData.investment_transfer.territory_scope,
          technologyData.investment_transfer.financial_methods,
          technologyData.investment_transfer.usage_limitations,
          technologyData.investment_transfer.current_partners,
          technologyData.investment_transfer.potential_partners
        ]);
      }

      return technology;
    });

    const response: ApiResponse = {
      success: true,
      data: result,
      message: 'Technology created successfully'
    };

    res.status(201).json(response);
  } catch (error) {
    console.error('Create technology error:', error);
    const response: ApiResponse = {
      success: false,
      error: 'Failed to create technology'
    };
    res.status(500).json(response);
  }
});

// Update technology
router.put('/:id', authenticateToken, validate(schemas.technology), async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user!.userId;
    const technologyData: TechnologyCreateRequest = req.body;

    // Check if technology exists and user owns it
    const existingTech = await query(
      'SELECT submitter_id FROM technologies WHERE id = $1',
      [id]
    );

    if (existingTech.rows.length === 0) {
      const response: ApiResponse = {
        success: false,
        error: 'Technology not found'
      };
      return res.status(404).json(response);
    }

    if (existingTech.rows[0].submitter_id !== userId) {
      const response: ApiResponse = {
        success: false,
        error: 'Not authorized to update this technology'
      };
      return res.status(403).json(response);
    }

    // Update technology
    const updateResult = await query(`
      UPDATE technologies SET
        title = $1,
        public_summary = $2,
        confidential_detail = $3,
        trl_level = $4,
        category_id = $5,
        visibility_mode = $6,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $7
      RETURNING *
    `, [
      technologyData.title,
      technologyData.public_summary,
      technologyData.confidential_detail,
      technologyData.trl_level,
      technologyData.category_id,
      technologyData.visibility_mode,
      id
    ]);

    const response: ApiResponse = {
      success: true,
      data: updateResult.rows[0],
      message: 'Technology updated successfully'
    };

    res.json(response);
  } catch (error) {
    console.error('Update technology error:', error);
    const response: ApiResponse = {
      success: false,
      error: 'Failed to update technology'
    };
    res.status(500).json(response);
  }
});

// Delete technology
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user!.userId;

    // Check if technology exists and user owns it
    const existingTech = await query(
      'SELECT submitter_id FROM technologies WHERE id = $1',
      [id]
    );

    if (existingTech.rows.length === 0) {
      const response: ApiResponse = {
        success: false,
        error: 'Technology not found'
      };
      return res.status(404).json(response);
    }

    if (existingTech.rows[0].submitter_id !== userId) {
      const response: ApiResponse = {
        success: false,
        error: 'Not authorized to delete this technology'
      };
      return res.status(403).json(response);
    }

    // Delete technology (cascade will handle related records)
    await query('DELETE FROM technologies WHERE id = $1', [id]);

    const response: ApiResponse = {
      success: true,
      message: 'Technology deleted successfully'
    };

    res.json(response);
  } catch (error) {
    console.error('Delete technology error:', error);
    const response: ApiResponse = {
      success: false,
      error: 'Failed to delete technology'
    };
    res.status(500).json(response);
  }
});

// Submit technology for approval
router.post('/:id/submit', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user!.userId;

    // Check if technology exists and user owns it
    const existingTech = await query(
      'SELECT submitter_id, status FROM technologies WHERE id = $1',
      [id]
    );

    if (existingTech.rows.length === 0) {
      const response: ApiResponse = {
        success: false,
        error: 'Technology not found'
      };
      return res.status(404).json(response);
    }

    if (existingTech.rows[0].submitter_id !== userId) {
      const response: ApiResponse = {
        success: false,
        error: 'Not authorized to submit this technology'
      };
      return res.status(403).json(response);
    }

    if (existingTech.rows[0].status !== 'DRAFT') {
      const response: ApiResponse = {
        success: false,
        error: 'Technology is not in draft status'
      };
      return res.status(400).json(response);
    }

    // Update status to pending
    const updateResult = await query(
      'UPDATE technologies SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      ['PENDING', id]
    );

    const response: ApiResponse = {
      success: true,
      data: updateResult.rows[0],
      message: 'Technology submitted for approval'
    };

    res.json(response);
  } catch (error) {
    console.error('Submit technology error:', error);
    const response: ApiResponse = {
      success: false,
      error: 'Failed to submit technology'
    };
    res.status(500).json(response);
  }
});

export default router;

