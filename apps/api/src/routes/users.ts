import express from 'express';
import { query } from '../config/database';
import { authenticateToken, requireRole } from '../middleware/auth';
import { validateQuery, schemas } from '../middleware/validation';
import { ApiResponse, UserSearchParams } from '../types';

const router = express.Router();

// Get all users (admin only)
router.get('/', authenticateToken, requireRole(['ADMIN', 'MODERATOR']), validateQuery(schemas.userSearch), async (req, res) => {
  try {
    const {
      query: searchQuery,
      user_type,
      role,
      is_verified,
      is_active,
      page = 1,
      limit = 20,
      sort = 'created_at',
      order = 'DESC'
    }: UserSearchParams = req.query;

    const offset = (page - 1) * limit;

    // Build WHERE clause
    let whereConditions = ['1=1'];
    let queryParams: any[] = [];
    let paramIndex = 1;

    if (searchQuery) {
      whereConditions.push(`(u.email ILIKE $${paramIndex} OR ip.full_name ILIKE $${paramIndex} OR cp.company_name ILIKE $${paramIndex} OR rp.institution_name ILIKE $${paramIndex})`);
      queryParams.push(`%${searchQuery}%`);
      paramIndex++;
    }

    if (user_type) {
      whereConditions.push(`u.user_type = $${paramIndex}`);
      queryParams.push(user_type);
      paramIndex++;
    }

    if (role) {
      whereConditions.push(`u.role = $${paramIndex}`);
      queryParams.push(role);
      paramIndex++;
    }

    if (is_verified !== undefined) {
      whereConditions.push(`u.is_verified = $${paramIndex}`);
      queryParams.push(is_verified);
      paramIndex++;
    }

    if (is_active !== undefined) {
      whereConditions.push(`u.is_active = $${paramIndex}`);
      queryParams.push(is_active);
      paramIndex++;
    }

    // Get total count
    const countQuery = `
      SELECT COUNT(*) as total
      FROM users u
      LEFT JOIN individual_profiles ip ON u.id = ip.user_id AND u.user_type = 'INDIVIDUAL'
      LEFT JOIN company_profiles cp ON u.id = cp.user_id AND u.user_type = 'COMPANY'
      LEFT JOIN research_profiles rp ON u.id = rp.user_id AND u.user_type = 'RESEARCH_INSTITUTION'
      WHERE ${whereConditions.join(' AND ')}
    `;
    const countResult = await query(countQuery, queryParams);
    const total = parseInt(countResult.rows[0].total);

    // Get users
    const usersQuery = `
      SELECT 
        u.id,
        u.email,
        u.user_type,
        u.role,
        u.is_verified,
        u.is_active,
        u.created_at,
        u.updated_at,
        ip.full_name,
        cp.company_name,
        rp.institution_name
      FROM users u
      LEFT JOIN individual_profiles ip ON u.id = ip.user_id AND u.user_type = 'INDIVIDUAL'
      LEFT JOIN company_profiles cp ON u.id = cp.user_id AND u.user_type = 'COMPANY'
      LEFT JOIN research_profiles rp ON u.id = rp.user_id AND u.user_type = 'RESEARCH_INSTITUTION'
      WHERE ${whereConditions.join(' AND ')}
      ORDER BY u.${sort} ${order}
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;

    queryParams.push(limit, offset);
    const usersResult = await query(usersQuery, queryParams);

    const response: ApiResponse = {
      success: true,
      data: usersResult.rows,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };

    res.json(response);
  } catch (error) {
    console.error('Get users error:', error);
    const response: ApiResponse = {
      success: false,
      error: 'Failed to fetch users'
    };
    res.status(500).json(response);
  }
});

// Get user by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const currentUserId = req.user!.userId;
    const currentUserRole = req.user!.role;

    // Check if user can view this profile
    if (id !== currentUserId && !['ADMIN', 'MODERATOR'].includes(currentUserRole)) {
      const response: ApiResponse = {
        success: false,
        error: 'Not authorized to view this user profile'
      };
      return res.status(403).json(response);
    }

    // Get user details
    const userResult = await query(
      'SELECT id, email, user_type, role, is_verified, is_active, created_at, updated_at FROM users WHERE id = $1',
      [id]
    );

    if (userResult.rows.length === 0) {
      const response: ApiResponse = {
        success: false,
        error: 'User not found'
      };
      return res.status(404).json(response);
    }

    const user = userResult.rows[0];

    // Get user profile based on type
    let profile = null;
    if (user.user_type === 'INDIVIDUAL') {
      const profileResult = await query(
        'SELECT * FROM individual_profiles WHERE user_id = $1',
        [id]
      );
      profile = profileResult.rows[0];
    } else if (user.user_type === 'COMPANY') {
      const profileResult = await query(
        'SELECT * FROM company_profiles WHERE user_id = $1',
        [id]
      );
      profile = profileResult.rows[0];
    } else if (user.user_type === 'RESEARCH_INSTITUTION') {
      const profileResult = await query(
        'SELECT * FROM research_profiles WHERE user_id = $1',
        [id]
      );
      profile = profileResult.rows[0];
    }

    // Get user's technologies count
    const techCountResult = await query(
      'SELECT COUNT(*) as count FROM technologies WHERE submitter_id = $1',
      [id]
    );

    const response: ApiResponse = {
      success: true,
      data: {
        ...user,
        profile,
        technologies_count: parseInt(techCountResult.rows[0].count)
      }
    };

    res.json(response);
  } catch (error) {
    console.error('Get user error:', error);
    const response: ApiResponse = {
      success: false,
      error: 'Failed to fetch user'
    };
    res.status(500).json(response);
  }
});

// Update user profile
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const currentUserId = req.user!.userId;
    const currentUserRole = req.user!.role;

    // Check if user can update this profile
    if (id !== currentUserId && !['ADMIN', 'MODERATOR'].includes(currentUserRole)) {
      const response: ApiResponse = {
        success: false,
        error: 'Not authorized to update this user profile'
      };
      return res.status(403).json(response);
    }

    const { profile } = req.body;

    // Get user type
    const userResult = await query(
      'SELECT user_type FROM users WHERE id = $1',
      [id]
    );

    if (userResult.rows.length === 0) {
      const response: ApiResponse = {
        success: false,
        error: 'User not found'
      };
      return res.status(404).json(response);
    }

    const userType = userResult.rows[0].user_type;

    // Update profile based on user type
    let updateResult;
    if (userType === 'INDIVIDUAL') {
      updateResult = await query(`
        UPDATE individual_profiles SET
          full_name = $1,
          id_number = $2,
          phone = $3,
          profession = $4,
          bank_account = $5,
          updated_at = CURRENT_TIMESTAMP
        WHERE user_id = $6
        RETURNING *
      `, [
        profile.full_name,
        profile.id_number,
        profile.phone,
        profile.profession,
        profile.bank_account,
        id
      ]);
    } else if (userType === 'COMPANY') {
      updateResult = await query(`
        UPDATE company_profiles SET
          company_name = $1,
          tax_code = $2,
          business_license = $3,
          legal_representative = $4,
          contact_email = $5,
          production_capacity = $6,
          updated_at = CURRENT_TIMESTAMP
        WHERE user_id = $7
        RETURNING *
      `, [
        profile.company_name,
        profile.tax_code,
        profile.business_license,
        profile.legal_representative,
        profile.contact_email,
        profile.production_capacity,
        id
      ]);
    } else if (userType === 'RESEARCH_INSTITUTION') {
      updateResult = await query(`
        UPDATE research_profiles SET
          institution_name = $1,
          institution_code = $2,
          governing_body = $3,
          research_task_code = $4,
          acceptance_report = $5,
          research_group = $6,
          updated_at = CURRENT_TIMESTAMP
        WHERE user_id = $7
        RETURNING *
      `, [
        profile.institution_name,
        profile.institution_code,
        profile.governing_body,
        profile.research_task_code,
        profile.acceptance_report,
        profile.research_group,
        id
      ]);
    }

    const response: ApiResponse = {
      success: true,
      data: updateResult?.rows[0],
      message: 'Profile updated successfully'
    };

    res.json(response);
  } catch (error) {
    console.error('Update user error:', error);
    const response: ApiResponse = {
      success: false,
      error: 'Failed to update user profile'
    };
    res.status(500).json(response);
  }
});

// Verify user (admin only)
router.post('/:id/verify', authenticateToken, requireRole(['ADMIN', 'MODERATOR']), async (req, res) => {
  try {
    const { id } = req.params;

    const updateResult = await query(
      'UPDATE users SET is_verified = true, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *',
      [id]
    );

    if (updateResult.rows.length === 0) {
      const response: ApiResponse = {
        success: false,
        error: 'User not found'
      };
      return res.status(404).json(response);
    }

    const response: ApiResponse = {
      success: true,
      data: updateResult.rows[0],
      message: 'User verified successfully'
    };

    res.json(response);
  } catch (error) {
    console.error('Verify user error:', error);
    const response: ApiResponse = {
      success: false,
      error: 'Failed to verify user'
    };
    res.status(500).json(response);
  }
});

// Deactivate user (admin only)
router.post('/:id/deactivate', authenticateToken, requireRole(['ADMIN']), async (req, res) => {
  try {
    const { id } = req.params;

    const updateResult = await query(
      'UPDATE users SET is_active = false, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *',
      [id]
    );

    if (updateResult.rows.length === 0) {
      const response: ApiResponse = {
        success: false,
        error: 'User not found'
      };
      return res.status(404).json(response);
    }

    const response: ApiResponse = {
      success: true,
      data: updateResult.rows[0],
      message: 'User deactivated successfully'
    };

    res.json(response);
  } catch (error) {
    console.error('Deactivate user error:', error);
    const response: ApiResponse = {
      success: false,
      error: 'Failed to deactivate user'
    };
    res.status(500).json(response);
  }
});

export default router;

