import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query, transaction } from '../config/database';
import { authenticateToken } from '../middleware/auth';
import { validate, schemas } from '../middleware/validation';
import { ApiResponse, LoginRequest, RegisterRequest, JWTPayload, IndividualProfile, CompanyProfile, ResearchProfile } from '../types';

const router = express.Router();

// Login endpoint
router.post('/login', validate(schemas.login), async (req, res) => {
  try {
    const { email, password }: LoginRequest = req.body;

    // Find user by email
    const userResult = await query(
      'SELECT id, email, password_hash, user_type, role, is_verified, is_active FROM users WHERE email = $1',
      [email]
    );

    if (userResult.rows.length === 0) {
      const response: ApiResponse = {
        success: false,
        error: 'Invalid email or password'
      };
      return res.status(401).json(response);
    }

    const user = userResult.rows[0];

    // Check if user is active
    if (!user.is_active) {
      const response: ApiResponse = {
        success: false,
        error: 'Account is deactivated'
      };
      return res.status(401).json(response);
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      const response: ApiResponse = {
        success: false,
        error: 'Invalid email or password'
      };
      return res.status(401).json(response);
    }

    // Generate JWT token
    const jwtSecret = process.env.JWT_SECRET;
    const jwtExpiresIn = process.env.JWT_EXPIRES_IN || '7d';

    if (!jwtSecret) {
      throw new Error('JWT_SECRET not configured');
    }

    const tokenPayload: JWTPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
      userType: user.user_type
    };

    const token = (jwt as any).sign(tokenPayload, jwtSecret, { expiresIn: jwtExpiresIn });

    // Get user profile based on type
    let profile = null;
    if (user.user_type === 'INDIVIDUAL') {
      const profileResult = await query(
        'SELECT * FROM individual_profiles WHERE user_id = $1',
        [user.id]
      );
      profile = profileResult.rows[0];
    } else if (user.user_type === 'COMPANY') {
      const profileResult = await query(
        'SELECT * FROM company_profiles WHERE user_id = $1',
        [user.id]
      );
      profile = profileResult.rows[0];
    } else if (user.user_type === 'RESEARCH_INSTITUTION') {
      const profileResult = await query(
        'SELECT * FROM research_profiles WHERE user_id = $1',
        [user.id]
      );
      profile = profileResult.rows[0];
    }

    const response: ApiResponse = {
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          user_type: user.user_type,
          role: user.role,
          is_verified: user.is_verified,
          profile
        },
        token,
        expiresIn: jwtExpiresIn
      },
      message: 'Login successful'
    };

    res.json(response);
  } catch (error) {
    console.error('Login error:', error);
    const response: ApiResponse = {
      success: false,
      error: 'Login failed'
    };
    res.status(500).json(response);
  }
});

// Register endpoint
router.post('/register', validate(schemas.register), async (req, res) => {
  try {
    const { email, password, user_type, profile }: RegisterRequest = req.body;

    // Check if user already exists
    const existingUser = await query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      const response: ApiResponse = {
        success: false,
        error: 'User with this email already exists'
      };
      return res.status(409).json(response);
    }

    // Hash password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Start transaction
    const result = await transaction(async (client) => {
      // Create user
      const userResult = await client.query(
        'INSERT INTO users (email, password_hash, user_type, role, is_verified, is_active) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, email, user_type, role, is_verified, is_active',
        [email, passwordHash, user_type, 'USER', false, true]
      );

      const user = userResult.rows[0];

      // Create profile based on user type
      let profileResult;
      if (user_type === 'INDIVIDUAL') {
        const individualProfile = profile as Partial<IndividualProfile>;
        profileResult = await client.query(
          'INSERT INTO individual_profiles (user_id, full_name, id_number, phone, profession, bank_account) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
          [user.id, individualProfile.full_name, individualProfile.id_number, individualProfile.phone, individualProfile.profession, individualProfile.bank_account]
        );
      } else if (user_type === 'COMPANY') {
        const companyProfile = profile as Partial<CompanyProfile>;
        profileResult = await client.query(
          'INSERT INTO company_profiles (user_id, company_name, tax_code, business_license, legal_representative, contact_email, production_capacity) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
          [user.id, companyProfile.company_name, companyProfile.tax_code, companyProfile.business_license, companyProfile.legal_representative, companyProfile.contact_email, companyProfile.production_capacity]
        );
      } else if (user_type === 'RESEARCH_INSTITUTION') {
        const researchProfile = profile as Partial<ResearchProfile>;
        profileResult = await client.query(
          'INSERT INTO research_profiles (user_id, institution_name, institution_code, governing_body, research_task_code, acceptance_report, research_group) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
          [user.id, researchProfile.institution_name, researchProfile.institution_code, researchProfile.governing_body, researchProfile.research_task_code, researchProfile.acceptance_report, researchProfile.research_group]
        );
      }

      return {
        user,
        profile: profileResult?.rows[0]
      };
    });

    const response: ApiResponse = {
      success: true,
      data: {
        user: result.user,
        profile: result.profile
      },
      message: 'Registration successful'
    };

    res.status(201).json(response);
  } catch (error) {
    console.error('Registration error:', error);
    const response: ApiResponse = {
      success: false,
      error: 'Registration failed'
    };
    res.status(500).json(response);
  }
});

// Get current user endpoint
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const userId = req.user!.userId;

    // Get user details
    const userResult = await query(
      'SELECT id, email, user_type, role, is_verified, is_active, created_at FROM users WHERE id = $1',
      [userId]
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
        [userId]
      );
      profile = profileResult.rows[0];
    } else if (user.user_type === 'COMPANY') {
      const profileResult = await query(
        'SELECT * FROM company_profiles WHERE user_id = $1',
        [userId]
      );
      profile = profileResult.rows[0];
    } else if (user.user_type === 'RESEARCH_INSTITUTION') {
      const profileResult = await query(
        'SELECT * FROM research_profiles WHERE user_id = $1',
        [userId]
      );
      profile = profileResult.rows[0];
    }

    const response: ApiResponse = {
      success: true,
      data: {
        user,
        profile
      }
    };

    res.json(response);
  } catch (error) {
    console.error('Get user error:', error);
    const response: ApiResponse = {
      success: false,
      error: 'Failed to get user information'
    };
    res.status(500).json(response);
  }
});

// Logout endpoint (client-side token removal)
router.post('/logout', authenticateToken, (req, res) => {
  const response: ApiResponse = {
    success: true,
    message: 'Logout successful'
  };
  res.json(response);
});

// Refresh token endpoint
router.post('/refresh', authenticateToken, async (req, res) => {
  try {
    const userId = req.user!.userId;

    // Verify user still exists and is active
    const userResult = await query(
      'SELECT id, email, role, user_type, is_active FROM users WHERE id = $1',
      [userId]
    );

    if (userResult.rows.length === 0 || !userResult.rows[0].is_active) {
      const response: ApiResponse = {
        success: false,
        error: 'User not found or inactive'
      };
      return res.status(401).json(response);
    }

    const user = userResult.rows[0];

    // Generate new token
    const jwtSecret = process.env.JWT_SECRET;
    const jwtExpiresIn = process.env.JWT_EXPIRES_IN || '7d';

    if (!jwtSecret) {
      throw new Error('JWT_SECRET not configured');
    }

    const tokenPayload: JWTPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
      userType: user.user_type
    };

    const token = (jwt as any).sign(tokenPayload, jwtSecret, { expiresIn: jwtExpiresIn });

    const response: ApiResponse = {
      success: true,
      data: {
        token,
        expiresIn: jwtExpiresIn
      },
      message: 'Token refreshed successfully'
    };

    res.json(response);
  } catch (error) {
    console.error('Token refresh error:', error);
    const response: ApiResponse = {
      success: false,
      error: 'Token refresh failed'
    };
    res.status(500).json(response);
  }
});

export default router;

