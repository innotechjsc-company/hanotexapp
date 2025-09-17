import { Pool, PoolClient } from "pg";
import { pool } from "./database";

// Types for query options
export interface QueryOptions {
  select?: string[];
  where?: Record<string, any>;
  orderBy?: Record<string, "ASC" | "DESC">;
  limit?: number;
  offset?: number;
  join?: JoinOptions[];
}

export interface JoinOptions {
  table: string;
  on: string;
  type?: "INNER" | "LEFT" | "RIGHT" | "FULL";
}

export interface UpdateOptions {
  where: Record<string, any>;
  returning?: string[];
}

export interface DeleteOptions {
  where: Record<string, any>;
  returning?: string[];
}

export interface InsertOptions {
  returning?: string[];
  onConflict?: {
    columns: string[];
    action: "DO NOTHING" | "DO UPDATE";
    updateSet?: Record<string, any>;
  };
}

export interface PaginationResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface TransactionCallback<T> {
  (client: PoolClient): Promise<T>;
}

/**
 * Database Service Class - Mongoose-like interface for PostgreSQL
 * Provides easy CRUD operations with a fluent API
 */
export class DbService {
  private tableName: string;
  private pool: Pool;

  constructor(tableName: string) {
    this.tableName = tableName;
    this.pool = pool;
  }

  /**
   * Create a new record
   * @param data - Data to insert
   * @param options - Insert options
   * @returns Promise<any>
   */
  async create(
    data: Record<string, any>,
    options: InsertOptions = {}
  ): Promise<any> {
    const fields = Object.keys(data);
    const values = Object.values(data);
    const placeholders = fields.map((_, index) => `$${index + 1}`).join(", ");

    let sql = `INSERT INTO ${this.tableName} (${fields.join(
      ", "
    )}) VALUES (${placeholders})`;

    // Handle ON CONFLICT
    if (options.onConflict) {
      const { columns, action, updateSet } = options.onConflict;
      sql += ` ON CONFLICT (${columns.join(", ")}) ${action}`;

      if (action === "DO UPDATE" && updateSet) {
        const updateFields = Object.keys(updateSet)
          .map((field) => `${field} = EXCLUDED.${field}`)
          .join(", ");
        sql += ` SET ${updateFields}`;
      }
    }

    // Handle RETURNING
    if (options.returning && options.returning.length > 0) {
      sql += ` RETURNING ${options.returning.join(", ")}`;
    } else {
      sql += " RETURNING *";
    }

    const result = await this.pool.query(sql, values);
    return result.rows[0];
  }

  /**
   * Create multiple records
   * @param dataArray - Array of data to insert
   * @param options - Insert options
   * @returns Promise<any[]>
   */
  async createMany(
    dataArray: Record<string, any>[],
    options: InsertOptions = {}
  ): Promise<any[]> {
    if (dataArray.length === 0) return [];

    const fields = Object.keys(dataArray[0] || {});
    if (fields.length === 0) return [];

    const valueRows: string[] = [];
    const allValues: any[] = [];

    dataArray.forEach((data, rowIndex) => {
      const rowPlaceholders = fields
        .map((_, fieldIndex) => `$${rowIndex * fields.length + fieldIndex + 1}`)
        .join(", ");
      valueRows.push(`(${rowPlaceholders})`);
      allValues.push(...Object.values(data));
    });

    let sql = `INSERT INTO ${this.tableName} (${fields.join(
      ", "
    )}) VALUES ${valueRows.join(", ")}`;

    // Handle ON CONFLICT
    if (options.onConflict) {
      const { columns, action, updateSet } = options.onConflict;
      sql += ` ON CONFLICT (${columns.join(", ")}) ${action}`;

      if (action === "DO UPDATE" && updateSet) {
        const updateFields = Object.keys(updateSet)
          .map((field) => `${field} = EXCLUDED.${field}`)
          .join(", ");
        sql += ` SET ${updateFields}`;
      }
    }

    // Handle RETURNING
    if (options.returning && options.returning.length > 0) {
      sql += ` RETURNING ${options.returning.join(", ")}`;
    } else {
      sql += " RETURNING *";
    }

    const result = await this.pool.query(sql, allValues);
    return result.rows;
  }

  /**
   * Find records with options
   * @param options - Query options
   * @returns Promise<any[]>
   */
  async find(options: QueryOptions = {}): Promise<any[]> {
    const { sql, params } = this.buildSelectQuery(options);
    const result = await this.pool.query(sql, params);
    return result.rows;
  }

  /**
   * Find a single record
   * @param options - Query options
   * @returns Promise<any | null>
   */
  async findOne(options: QueryOptions = {}): Promise<any | null> {
    const queryOptions = { ...options, limit: 1 };
    const { sql, params } = this.buildSelectQuery(queryOptions);
    const result = await this.pool.query(sql, params);
    return result.rows[0] || null;
  }

  /**
   * Find record by ID
   * @param id - Record ID
   * @param options - Query options
   * @returns Promise<any | null>
   */
  async findById(
    id: string | number,
    options: Omit<QueryOptions, "where"> = {}
  ): Promise<any | null> {
    const queryOptions = { ...options, where: { id }, limit: 1 };
    const { sql, params } = this.buildSelectQuery(queryOptions);
    const result = await this.pool.query(sql, params);
    return result.rows[0] || null;
  }

  /**
   * Find records with pagination
   * @param options - Query options
   * @param page - Page number (1-based)
   * @param limit - Records per page
   * @returns Promise<PaginationResult<any>>
   */
  async paginate(
    options: QueryOptions = {},
    page: number = 1,
    limit: number = 10
  ): Promise<PaginationResult<any>> {
    // Get total count
    const countOptions = { ...options };
    delete countOptions.select;
    delete countOptions.orderBy;
    delete countOptions.limit;
    delete countOptions.offset;

    const { sql: countSql, params: countParams } = this.buildSelectQuery(
      countOptions,
      true
    );
    const countResult = await this.pool.query(countSql, countParams);
    const total = parseInt(countResult.rows[0].count);

    // Get data
    const offset = (page - 1) * limit;
    const dataOptions = { ...options, limit, offset };
    const { sql: dataSql, params: dataParams } =
      this.buildSelectQuery(dataOptions);
    const dataResult = await this.pool.query(dataSql, dataParams);

    return {
      data: dataResult.rows,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Update records
   * @param data - Data to update
   * @param options - Update options
   * @returns Promise<any[]>
   */
  async update(
    data: Record<string, any>,
    options: UpdateOptions
  ): Promise<any[]> {
    const fields = Object.keys(data);
    const values = Object.values(data);

    // Build SET clause
    const setClause = fields
      .map((field, index) => `${field} = $${index + 1}`)
      .join(", ");

    // Build WHERE clause
    const { whereClause, whereParams } = this.buildWhereClause(
      options.where,
      fields.length
    );

    let sql = `UPDATE ${this.tableName} SET ${setClause}`;
    if (whereClause) {
      sql += ` WHERE ${whereClause}`;
    }

    // Handle RETURNING
    if (options.returning && options.returning.length > 0) {
      sql += ` RETURNING ${options.returning.join(", ")}`;
    } else {
      sql += " RETURNING *";
    }

    const allParams = [...values, ...whereParams];
    const result = await this.pool.query(sql, allParams);
    return result.rows;
  }

  /**
   * Update record by ID
   * @param id - Record ID
   * @param data - Data to update
   * @param returning - Fields to return
   * @returns Promise<any | null>
   */
  async updateById(
    id: string | number,
    data: Record<string, any>,
    returning: string[] = ["*"]
  ): Promise<any | null> {
    const result = await this.update(data, { where: { id }, returning });
    return result[0] || null;
  }

  /**
   * Delete records
   * @param options - Delete options
   * @returns Promise<any[]>
   */
  async delete(options: DeleteOptions): Promise<any[]> {
    const { whereClause, whereParams } = this.buildWhereClause(options.where);

    let sql = `DELETE FROM ${this.tableName}`;
    if (whereClause) {
      sql += ` WHERE ${whereClause}`;
    }

    // Handle RETURNING
    if (options.returning && options.returning.length > 0) {
      sql += ` RETURNING ${options.returning.join(", ")}`;
    } else {
      sql += " RETURNING *";
    }

    const result = await this.pool.query(sql, whereParams);
    return result.rows;
  }

  /**
   * Delete record by ID
   * @param id - Record ID
   * @param returning - Fields to return
   * @returns Promise<any | null>
   */
  async deleteById(
    id: string | number,
    returning: string[] = ["*"]
  ): Promise<any | null> {
    const result = await this.delete({ where: { id }, returning });
    return result[0] || null;
  }

  /**
   * Count records
   * @param options - Query options
   * @returns Promise<number>
   */
  async count(options: QueryOptions = {}): Promise<number> {
    const countOptions = { ...options };
    delete countOptions.select;
    delete countOptions.orderBy;
    delete countOptions.limit;
    delete countOptions.offset;

    const { sql, params } = this.buildSelectQuery(countOptions, true);
    const result = await this.pool.query(sql, params);
    return parseInt(result.rows[0].count);
  }

  /**
   * Check if record exists
   * @param options - Query options
   * @returns Promise<boolean>
   */
  async exists(options: QueryOptions = {}): Promise<boolean> {
    const count = await this.count(options);
    return count > 0;
  }

  /**
   * Upsert (insert or update) record
   * @param data - Data to upsert
   * @param conflictColumns - Columns to check for conflict
   * @param updateData - Data to update on conflict (optional, defaults to data)
   * @returns Promise<any>
   */
  async upsert(
    data: Record<string, any>,
    conflictColumns: string[],
    updateData?: Record<string, any>
  ): Promise<any> {
    const options: InsertOptions = {
      onConflict: {
        columns: conflictColumns,
        action: "DO UPDATE",
        updateSet: updateData || data,
      },
    };

    return this.create(data, options);
  }

  /**
   * Execute a transaction
   * @param callback - Transaction callback
   * @returns Promise<T>
   */
  async transaction<T>(callback: TransactionCallback<T>): Promise<T> {
    const client = await this.pool.connect();
    try {
      await client.query("BEGIN");
      const result = await callback(client);
      await client.query("COMMIT");
      return result;
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Execute raw SQL query
   * @param sql - SQL query
   * @param params - Query parameters
   * @returns Promise<any>
   */
  async raw(sql: string, params?: any[]): Promise<any> {
    const result = await this.pool.query(sql, params);
    return result.rows;
  }

  /**
   * Build SELECT query from options
   * @param options - Query options
   * @param isCount - Whether this is a count query
   * @returns Object with sql and params
   */
  private buildSelectQuery(
    options: QueryOptions,
    isCount: boolean = false
  ): { sql: string; params: any[] } {
    let sql = "";
    const params: any[] = [];
    let paramIndex = 1;

    // SELECT clause
    if (isCount) {
      sql = `SELECT COUNT(*) as count FROM ${this.tableName}`;
    } else {
      const selectFields =
        options.select && options.select.length > 0
          ? options.select.join(", ")
          : "*";
      sql = `SELECT ${selectFields} FROM ${this.tableName}`;
    }

    // JOIN clause
    if (options.join && options.join.length > 0) {
      for (const join of options.join) {
        const joinType = join.type || "INNER";
        sql += ` ${joinType} JOIN ${join.table} ON ${join.on}`;
      }
    }

    // WHERE clause
    if (options.where && Object.keys(options.where).length > 0) {
      const { whereClause, whereParams } = this.buildWhereClause(
        options.where,
        paramIndex - 1
      );
      if (whereClause) {
        sql += ` WHERE ${whereClause}`;
        params.push(...whereParams);
        paramIndex += whereParams.length;
      }
    }

    // ORDER BY clause (not for count queries)
    if (
      !isCount &&
      options.orderBy &&
      Object.keys(options.orderBy).length > 0
    ) {
      const orderClauses = Object.entries(options.orderBy)
        .map(([field, direction]) => `${field} ${direction}`)
        .join(", ");
      sql += ` ORDER BY ${orderClauses}`;
    }

    // LIMIT clause (not for count queries)
    if (!isCount && options.limit) {
      sql += ` LIMIT $${paramIndex}`;
      params.push(options.limit);
      paramIndex++;
    }

    // OFFSET clause (not for count queries)
    if (!isCount && options.offset) {
      sql += ` OFFSET $${paramIndex}`;
      params.push(options.offset);
      paramIndex++;
    }

    return { sql, params };
  }

  /**
   * Build WHERE clause from conditions
   * @param conditions - Where conditions
   * @param startParamIndex - Starting parameter index
   * @returns Object with whereClause and whereParams
   */
  private buildWhereClause(
    conditions: Record<string, any>,
    startParamIndex: number = 0
  ): { whereClause: string; whereParams: any[] } {
    const whereClauses: string[] = [];
    const whereParams: any[] = [];
    let paramIndex = startParamIndex + 1;

    for (const [field, value] of Object.entries(conditions)) {
      if (value === null) {
        whereClauses.push(`${field} IS NULL`);
      } else if (value === undefined) {
        continue; // Skip undefined values
      } else if (Array.isArray(value)) {
        if (value.length > 0) {
          const placeholders = value.map(() => `$${paramIndex++}`).join(", ");
          whereClauses.push(`${field} IN (${placeholders})`);
          whereParams.push(...value);
        }
      } else if (typeof value === "object" && value !== null) {
        // Handle operators like { $gt: 10 }, { $like: '%test%' }
        for (const [operator, operatorValue] of Object.entries(value)) {
          switch (operator) {
            case "$gt":
              whereClauses.push(`${field} > $${paramIndex++}`);
              whereParams.push(operatorValue);
              break;
            case "$gte":
              whereClauses.push(`${field} >= $${paramIndex++}`);
              whereParams.push(operatorValue);
              break;
            case "$lt":
              whereClauses.push(`${field} < $${paramIndex++}`);
              whereParams.push(operatorValue);
              break;
            case "$lte":
              whereClauses.push(`${field} <= $${paramIndex++}`);
              whereParams.push(operatorValue);
              break;
            case "$ne":
              whereClauses.push(`${field} != $${paramIndex++}`);
              whereParams.push(operatorValue);
              break;
            case "$like":
              whereClauses.push(`${field} LIKE $${paramIndex++}`);
              whereParams.push(operatorValue);
              break;
            case "$ilike":
              whereClauses.push(`${field} ILIKE $${paramIndex++}`);
              whereParams.push(operatorValue);
              break;
            case "$in":
              if (Array.isArray(operatorValue) && operatorValue.length > 0) {
                const placeholders = operatorValue
                  .map(() => `$${paramIndex++}`)
                  .join(", ");
                whereClauses.push(`${field} IN (${placeholders})`);
                whereParams.push(...operatorValue);
              }
              break;
            case "$nin":
              if (Array.isArray(operatorValue) && operatorValue.length > 0) {
                const placeholders = operatorValue
                  .map(() => `$${paramIndex++}`)
                  .join(", ");
                whereClauses.push(`${field} NOT IN (${placeholders})`);
                whereParams.push(...operatorValue);
              }
              break;
            default:
              // Default to equality
              whereClauses.push(`${field} = $${paramIndex++}`);
              whereParams.push(operatorValue);
          }
        }
      } else {
        whereClauses.push(`${field} = $${paramIndex++}`);
        whereParams.push(value);
      }
    }

    return {
      whereClause: whereClauses.join(" AND "),
      whereParams,
    };
  }

  /**
   * Create a new DbService instance for a table
   * @param tableName - Name of the table
   * @returns DbService instance
   */
  static table(tableName: string): DbService {
    return new DbService(tableName);
  }
}

// Export default instance creator
export const db = {
  table: (tableName: string) => new DbService(tableName),
};

// Export the class for direct instantiation
export default DbService;

/*
USAGE EXAMPLES:

// Using the db helper
const userService = db.table('users');
const techService = db.table('technologies');

// Using direct instantiation
const userService = new DbService('users');

// Basic CRUD operations
const user = await userService.create({
  email: 'test@example.com',
  password_hash: 'hashed_password',
  user_type: 'INDIVIDUAL'
});

const users = await userService.find({
  where: { user_type: 'INDIVIDUAL', is_active: true },
  orderBy: { created_at: 'DESC' },
  limit: 10
});

const user = await userService.findById('user-id');

const updatedUser = await userService.updateById('user-id', {
  is_verified: true
});

await userService.deleteById('user-id');

// Advanced queries with operators
const users = await userService.find({
  where: {
    created_at: { $gte: '2023-01-01' },
    email: { $like: '%@gmail.com' },
    user_type: { $in: ['INDIVIDUAL', 'COMPANY'] }
  },
  select: ['id', 'email', 'user_type'],
  orderBy: { created_at: 'DESC' }
});

// Pagination
const result = await userService.paginate({
  where: { is_active: true }
}, 1, 20);

// Count
const totalUsers = await userService.count({
  where: { is_active: true }
});

// Exists check
const userExists = await userService.exists({
  where: { email: 'test@example.com' }
});

// Upsert
const user = await userService.upsert(
  { email: 'test@example.com', name: 'Test User' },
  ['email'], // conflict columns
  { name: 'Updated Test User' } // update data
);

// Transactions
await userService.transaction(async (client) => {
  await client.query('INSERT INTO users ...');
  await client.query('INSERT INTO profiles ...');
  // If any query fails, transaction will be rolled back
});

// Raw queries
const result = await userService.raw(
  'SELECT * FROM users WHERE created_at > $1',
  ['2023-01-01']
);

// Joins
const usersWithProfiles = await userService.find({
  select: ['users.id', 'users.email', 'profiles.name'],
  join: [{
    table: 'individual_profiles profiles',
    on: 'users.id = profiles.user_id',
    type: 'LEFT'
  }],
  where: { 'users.is_active': true }
});
*/
