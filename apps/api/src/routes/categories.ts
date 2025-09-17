import express from 'express';
import { query } from '../config/database';
import { ApiResponse } from '../types';

const router = express.Router();

// Get all categories
router.get('/', async (req, res) => {
  try {
    const categoriesResult = await query(`
      SELECT 
        id,
        name,
        code,
        parent_id,
        description,
        created_at
      FROM categories 
      ORDER BY name
    `);

    // Organize categories into hierarchy
    const categories = categoriesResult.rows;
    const categoryMap = new Map();
    const rootCategories: any[] = [];

    // Create a map of all categories
    categories.forEach((category: any) => {
      categoryMap.set(category.id, { ...category, children: [] });
    });

    // Build hierarchy
    categories.forEach((category: any) => {
      if (category.parent_id) {
        const parent = categoryMap.get(category.parent_id);
        if (parent) {
          parent.children.push(categoryMap.get(category.id));
        }
      } else {
        rootCategories.push(categoryMap.get(category.id));
      }
    });

    const response: ApiResponse = {
      success: true,
      data: rootCategories
    };

    res.json(response);
  } catch (error) {
    console.error('Get categories error:', error);
    const response: ApiResponse = {
      success: false,
      error: 'Failed to fetch categories'
    };
    res.status(500).json(response);
  }
});

// Get category by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const categoryResult = await query(
      'SELECT * FROM categories WHERE id = $1',
      [id]
    );

    if (categoryResult.rows.length === 0) {
      const response: ApiResponse = {
        success: false,
        error: 'Category not found'
      };
      return res.status(404).json(response);
    }

    const category = categoryResult.rows[0];

    // Get children categories
    const childrenResult = await query(
      'SELECT * FROM categories WHERE parent_id = $1 ORDER BY name',
      [id]
    );

    const response: ApiResponse = {
      success: true,
      data: {
        ...category,
        children: childrenResult.rows
      }
    };

    res.json(response);
  } catch (error) {
    console.error('Get category error:', error);
    const response: ApiResponse = {
      success: false,
      error: 'Failed to fetch category'
    };
    res.status(500).json(response);
  }
});

// Get technologies by category
router.get('/:id/technologies', async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 20 } = req.query;
    const pageNum = parseInt(page as string) || 1;
    const limitNum = parseInt(limit as string) || 20;
    const offset = (pageNum - 1) * limitNum;

    // Get total count
    const countResult = await query(
      'SELECT COUNT(*) as total FROM technologies WHERE category_id = $1 AND status IN ($2, $3)',
      [id, 'APPROVED', 'ACTIVE']
    );
    const total = parseInt(countResult.rows[0].total);

    // Get technologies
    const technologiesResult = await query(`
      SELECT 
        t.id,
        t.title,
        t.public_summary,
        t.trl_level,
        t.status,
        t.created_at,
        u.email as submitter_email,
        u.user_type as submitter_type,
        p.asking_price,
        p.currency
      FROM technologies t
      LEFT JOIN users u ON t.submitter_id = u.id
      LEFT JOIN pricing p ON t.id = p.technology_id
      WHERE t.category_id = $1 AND t.status IN ($2, $3)
      ORDER BY t.created_at DESC
      LIMIT $4 OFFSET $5
    `, [id, 'APPROVED', 'ACTIVE', limit, offset]);

    const response: ApiResponse = {
      success: true,
      data: technologiesResult.rows,
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        total,
        totalPages: Math.ceil(total / parseInt(limit as string))
      }
    };

    res.json(response);
  } catch (error) {
    console.error('Get category technologies error:', error);
    const response: ApiResponse = {
      success: false,
      error: 'Failed to fetch category technologies'
    };
    res.status(500).json(response);
  }
});

export default router;

