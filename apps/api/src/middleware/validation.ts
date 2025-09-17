import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

// Validation middleware factory
export const validate = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error } = schema.validate(req.body);
    
    if (error) {
      res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: error.details.map(detail => ({
          field: detail.path.join('.'),
          message: detail.message
        }))
      });
      return;
    }
    
    next();
  };
};

// Query validation middleware
export const validateQuery = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error } = schema.validate(req.query);
    
    if (error) {
      res.status(400).json({
        success: false,
        error: 'Query validation failed',
        details: error.details.map(detail => ({
          field: detail.path.join('.'),
          message: detail.message
        }))
      });
      return;
    }
    
    next();
  };
};

// Common validation schemas
export const schemas = {
  // User schemas
  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
  }),

  register: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    user_type: Joi.string().valid('INDIVIDUAL', 'COMPANY', 'RESEARCH_INSTITUTION').required(),
    profile: Joi.object().required()
  }),

  individualProfile: Joi.object({
    full_name: Joi.string().min(2).max(255).required(),
    id_number: Joi.string().optional(),
    phone: Joi.string().optional(),
    profession: Joi.string().optional(),
    bank_account: Joi.string().optional()
  }),

  companyProfile: Joi.object({
    company_name: Joi.string().min(2).max(255).required(),
    tax_code: Joi.string().optional(),
    business_license: Joi.string().optional(),
    legal_representative: Joi.string().optional(),
    contact_email: Joi.string().email().optional(),
    production_capacity: Joi.string().optional()
  }),

  researchProfile: Joi.object({
    institution_name: Joi.string().min(2).max(255).required(),
    institution_code: Joi.string().optional(),
    governing_body: Joi.string().optional(),
    research_task_code: Joi.string().optional(),
    acceptance_report: Joi.string().optional(),
    research_group: Joi.string().optional()
  }),

  // Technology schemas
  technology: Joi.object({
    title: Joi.string().min(5).max(500).required(),
    public_summary: Joi.string().max(2000).optional(),
    confidential_detail: Joi.string().max(10000).optional(),
    trl_level: Joi.number().integer().min(1).max(9).optional(),
    category_id: Joi.string().uuid().optional(),
    visibility_mode: Joi.string().valid('PUBLIC_SUMMARY', 'PUBLIC_FULL', 'PRIVATE').optional(),
    owners: Joi.array().items(
      Joi.object({
        owner_type: Joi.string().valid('INDIVIDUAL', 'COMPANY', 'RESEARCH_INSTITUTION').required(),
        owner_name: Joi.string().required(),
        ownership_percentage: Joi.number().min(0).max(100).required()
      })
    ).optional(),
    ip_details: Joi.array().items(
      Joi.object({
        ip_type: Joi.string().valid('PATENT', 'UTILITY_MODEL', 'INDUSTRIAL_DESIGN', 'TRADEMARK', 'SOFTWARE_COPYRIGHT', 'TRADE_SECRET').required(),
        ip_number: Joi.string().optional(),
        status: Joi.string().optional(),
        territory: Joi.string().optional()
      })
    ).optional(),
    pricing: Joi.object({
      pricing_type: Joi.string().valid('APPRAISAL', 'ASK', 'AUCTION', 'OFFER').required(),
      asking_price: Joi.number().min(0).optional(),
      currency: Joi.string().length(3).default('VND'),
      price_type: Joi.string().optional(),
      appraisal_purpose: Joi.string().optional(),
      appraisal_scope: Joi.string().optional(),
      appraisal_deadline: Joi.date().optional()
    }).optional(),
    investment_transfer: Joi.object({
      investment_stage: Joi.string().optional(),
      commercialization_methods: Joi.array().items(Joi.string()).optional(),
      transfer_methods: Joi.array().items(Joi.string()).optional(),
      territory_scope: Joi.string().optional(),
      financial_methods: Joi.array().items(Joi.string()).optional(),
      usage_limitations: Joi.string().optional(),
      current_partners: Joi.string().optional(),
      potential_partners: Joi.string().optional()
    }).optional()
  }),

  // Auction schemas
  auction: Joi.object({
    technology_id: Joi.string().uuid().required(),
    auction_type: Joi.string().valid('ENGLISH', 'DUTCH', 'SEALED_BID').required(),
    start_price: Joi.number().min(0).optional(),
    reserve_price: Joi.number().min(0).optional(),
    start_time: Joi.date().min('now').optional(),
    end_time: Joi.date().min('now').optional()
  }),

  bid: Joi.object({
    auction_id: Joi.string().uuid().required(),
    bid_amount: Joi.number().min(0).required()
  }),

  // Search schemas
  technologySearch: Joi.object({
    query: Joi.string().allow('').optional(),
    search: Joi.string().allow('').optional(), // Support both query and search parameters
    category_id: Joi.string().uuid().allow('').optional(),
    category: Joi.string().allow('').optional(), // Support both category_id and category parameters
    trl_level: Joi.alternatives().try(
      Joi.number().integer().min(1).max(9),
      Joi.string().allow('').optional()
    ).optional(),
    status: Joi.string().valid('DRAFT', 'PENDING', 'APPROVED', 'REJECTED', 'ACTIVE', 'INACTIVE').allow('').optional(),
    user_type: Joi.string().valid('INDIVIDUAL', 'COMPANY', 'RESEARCH_INSTITUTION').allow('').optional(),
    min_price: Joi.number().min(0).optional(),
    max_price: Joi.number().min(0).optional(),
    territory: Joi.string().allow('').optional(),
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(20),
    sort: Joi.string().allow('').optional(),
    order: Joi.string().valid('ASC', 'DESC').default('DESC')
  }),

  userSearch: Joi.object({
    query: Joi.string().optional(),
    user_type: Joi.string().valid('INDIVIDUAL', 'COMPANY', 'RESEARCH_INSTITUTION').optional(),
    role: Joi.string().valid('USER', 'ADMIN', 'MODERATOR', 'SUPPORT').optional(),
    is_verified: Joi.boolean().optional(),
    is_active: Joi.boolean().optional(),
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(20),
    sort: Joi.string().optional(),
    order: Joi.string().valid('ASC', 'DESC').default('DESC')
  }),

  // UUID parameter validation
  uuid: Joi.object({
    id: Joi.string().uuid().required()
  }),

  // Pagination
  pagination: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(20),
    sort: Joi.string().optional(),
    order: Joi.string().valid('ASC', 'DESC').default('DESC')
  })
};

