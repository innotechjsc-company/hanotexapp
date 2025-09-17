import { Request, Response } from "express";
import { db, DbService } from "../config/dbService";
import { ApiResponse } from "../types";

export interface BaseControllerOptions {
  tableName: string;
  idField?: string;
  selectFields?: string[];
  allowedSortFields?: string[];
  defaultSort?: string;
  defaultOrder?: "ASC" | "DESC";
  allowedFilters?: string[]; // New: specify which fields can be filtered
}

export class BaseController {
  protected dbService: DbService;
  protected idField: string;
  protected selectFields: string[];
  protected allowedSortFields: string[];
  protected allowedFilters: string[];
  protected defaultSort: string;
  protected defaultOrder: "ASC" | "DESC";

  constructor(options: BaseControllerOptions) {
    this.dbService = db.table(options.tableName);
    this.idField = options.idField || "id";
    this.selectFields = options.selectFields || ["*"];
    this.allowedSortFields = options.allowedSortFields || [
      "created_at",
      "updated_at",
    ];
    this.allowedFilters = options.allowedFilters || [];
    this.defaultSort = options.defaultSort || "created_at";
    this.defaultOrder = options.defaultOrder || "DESC";
  }

  public create = async (req: Request, res: Response) => {
    try {
      const data = req.body;

      // Use DbService to create record
      const options =
        this.selectFields.length > 0 && this.selectFields[0] !== "*"
          ? { returning: this.selectFields }
          : {};

      const result = await this.dbService.create(data, options);

      const response: ApiResponse = {
        success: true,
        data: result,
      };

      return res.status(201).json(response);
    } catch (error: any) {
      console.error(`Error creating record:`, error);
      const response: ApiResponse = {
        success: false,
        error: error.message || "Failed to create record",
      };
      return res.status(400).json(response);
    }
  };

  public find = async (req: Request, res: Response) => {
    try {
      const {
        page = 1,
        limit = 20,
        sort = this.defaultSort,
        order = this.defaultOrder,
        ...filters
      } = req.query;

      // Build where conditions from query parameters
      const where: Record<string, any> = {};

      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          // Only allow filtering on specified fields if allowedFilters is set
          if (
            this.allowedFilters.length === 0 ||
            this.allowedFilters.includes(key)
          ) {
            where[key] = value;
          }
        }
      });

      // Validate sort field
      const sortField = this.allowedSortFields.includes(sort as string)
        ? (sort as string)
        : this.defaultSort;

      // Build query options
      const queryOptions: any = {
        where,
        orderBy: { [sortField]: order as "ASC" | "DESC" },
      };

      // Add select fields if specified
      if (this.selectFields.length > 0 && this.selectFields[0] !== "*") {
        queryOptions.select = this.selectFields;
      }

      // Use DbService pagination
      const result = await this.dbService.paginate(
        queryOptions,
        Number(page),
        Number(limit)
      );

      const response: ApiResponse = {
        success: true,
        data: result.data,
        pagination: {
          page: result.page,
          limit: result.limit,
          total: result.total,
          totalPages: result.totalPages,
        },
      };

      return res.status(200).json(response);
    } catch (error: any) {
      console.error(`Error finding records:`, error);
      const response: ApiResponse = {
        success: false,
        error: error.message || "Failed to fetch records",
      };
      return res.status(400).json(response);
    }
  };

  public findOne = async (req: Request, res: Response) => {
    try {
      const id = req.params.id;

      // Build query options
      const queryOptions: any = {
        where: { [this.idField]: id },
      };

      // Add select fields if specified
      if (this.selectFields.length > 0 && this.selectFields[0] !== "*") {
        queryOptions.select = this.selectFields;
      }

      // Use DbService to find one record
      const result = await this.dbService.findOne(queryOptions);

      if (!result) {
        const response: ApiResponse = {
          success: false,
          error: "Record not found",
        };
        return res.status(404).json(response);
      }

      const response: ApiResponse = {
        success: true,
        data: result,
      };

      return res.status(200).json(response);
    } catch (error: any) {
      console.error(`Error finding record by id:`, error);
      const response: ApiResponse = {
        success: false,
        error: error.message || "Failed to fetch record",
      };
      return res.status(400).json(response);
    }
  };

  public update = async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      const data = req.body;

      // Add updated_at timestamp if not provided
      if (!data.updated_at) {
        data.updated_at = new Date().toISOString();
      }

      // Determine returning fields
      const returningFields =
        this.selectFields.length > 0 && this.selectFields[0] !== "*"
          ? this.selectFields
          : ["*"];

      // Use DbService to update record
      const result = await this.dbService.updateById(
        id as string,
        data,
        returningFields
      );

      if (!result) {
        const response: ApiResponse = {
          success: false,
          error: "Record not found",
        };
        return res.status(404).json(response);
      }

      const response: ApiResponse = {
        success: true,
        data: result,
      };

      return res.status(200).json(response);
    } catch (error: any) {
      console.error(`Error updating record:`, error);
      const response: ApiResponse = {
        success: false,
        error: error.message || "Failed to update record",
      };
      return res.status(400).json(response);
    }
  };

  public delete = async (req: Request, res: Response) => {
    try {
      const id = req.params.id;

      // Use DbService to delete record
      const result = await this.dbService.deleteById(id as string, [
        this.idField,
      ]);

      if (!result) {
        const response: ApiResponse = {
          success: false,
          error: "Record not found",
        };
        return res.status(404).json(response);
      }

      const response: ApiResponse = {
        success: true,
        message: "Record deleted successfully",
      };

      return res.status(200).json(response);
    } catch (error: any) {
      console.error(`Error deleting record:`, error);
      const response: ApiResponse = {
        success: false,
        error: error.message || "Failed to delete record",
      };
      return res.status(400).json(response);
    }
  };

  /**
   * Additional helper methods using DbService
   */

  /**
   * Count records with optional filters
   */
  public count = async (req: Request, res: Response) => {
    try {
      const { ...filters } = req.query;

      // Build where conditions from query parameters
      const where: Record<string, any> = {};

      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          // Only allow filtering on specified fields if allowedFilters is set
          if (
            this.allowedFilters.length === 0 ||
            this.allowedFilters.includes(key)
          ) {
            where[key] = value;
          }
        }
      });

      const count = await this.dbService.count({ where });

      const response: ApiResponse = {
        success: true,
        data: { count },
      };

      return res.status(200).json(response);
    } catch (error: any) {
      console.error(`Error counting records:`, error);
      const response: ApiResponse = {
        success: false,
        error: error.message || "Failed to count records",
      };
      return res.status(400).json(response);
    }
  };

  /**
   * Check if record exists
   */
  public exists = async (req: Request, res: Response) => {
    try {
      const id = req.params.id;

      const exists = await this.dbService.exists({
        where: { [this.idField]: id },
      });

      const response: ApiResponse = {
        success: true,
        data: { exists },
      };

      return res.status(200).json(response);
    } catch (error: any) {
      console.error(`Error checking record existence:`, error);
      const response: ApiResponse = {
        success: false,
        error: error.message || "Failed to check record existence",
      };
      return res.status(400).json(response);
    }
  };
}
