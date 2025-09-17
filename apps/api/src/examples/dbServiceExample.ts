import { db, DbService } from '../config/dbService';

/**
 * Example usage of DbService - Mongoose-like interface for PostgreSQL
 * This file demonstrates various ways to use the DbService class
 */

// Example 1: Basic CRUD operations
export async function basicCrudExample() {
  console.log('=== Basic CRUD Operations ===');
  
  // Create a service for the users table
  const userService = db.table('users');
  
  try {
    // Create a new user
    const newUser = await userService.create({
      email: 'john.doe@example.com',
      password_hash: 'hashed_password_here',
      user_type: 'INDIVIDUAL',
      is_verified: false,
      is_active: true
    });
    console.log('Created user:', newUser);

    // Find users with conditions
    const activeUsers = await userService.find({
      where: { is_active: true },
      select: ['id', 'email', 'user_type', 'created_at'],
      orderBy: { created_at: 'DESC' },
      limit: 10
    });
    console.log('Active users:', activeUsers);

    // Find a single user by ID
    const user = await userService.findById(newUser.id);
    console.log('Found user by ID:', user);

    // Update user
    const updatedUser = await userService.updateById(newUser.id, {
      is_verified: true
    });
    console.log('Updated user:', updatedUser);

    // Count users
    const totalUsers = await userService.count();
    console.log('Total users:', totalUsers);

    // Check if user exists
    const userExists = await userService.exists({
      where: { email: 'john.doe@example.com' }
    });
    console.log('User exists:', userExists);

  } catch (error) {
    console.error('Error in basic CRUD example:', error);
  }
}

// Example 2: Advanced queries with operators
export async function advancedQueriesExample() {
  console.log('=== Advanced Queries ===');
  
  const userService = db.table('users');
  
  try {
    // Query with various operators
    const users = await userService.find({
      where: {
        created_at: { $gte: '2023-01-01' },
        email: { $like: '%@gmail.com' },
        user_type: { $in: ['INDIVIDUAL', 'COMPANY'] },
        is_active: true
      },
      select: ['id', 'email', 'user_type', 'created_at'],
      orderBy: { created_at: 'DESC' }
    });
    console.log('Users with advanced filters:', users);

    // Query with NOT IN
    const nonGmailUsers = await userService.find({
      where: {
        email: { $nin: ['test@gmail.com', 'admin@gmail.com'] },
        is_active: true
      }
    });
    console.log('Non-Gmail users:', nonGmailUsers);

  } catch (error) {
    console.error('Error in advanced queries example:', error);
  }
}

// Example 3: Pagination
export async function paginationExample() {
  console.log('=== Pagination Example ===');
  
  const userService = db.table('users');
  
  try {
    const page1 = await userService.paginate({
      where: { is_active: true },
      orderBy: { created_at: 'DESC' }
    }, 1, 5); // page 1, 5 items per page
    
    console.log('Page 1 result:', {
      data: page1.data,
      pagination: {
        page: page1.page,
        limit: page1.limit,
        total: page1.total,
        totalPages: page1.totalPages
      }
    });

  } catch (error) {
    console.error('Error in pagination example:', error);
  }
}

// Example 4: Upsert operations
export async function upsertExample() {
  console.log('=== Upsert Example ===');
  
  const userService = db.table('users');
  
  try {
    // Upsert user - insert if not exists, update if exists
    const user = await userService.upsert(
      {
        email: 'jane.doe@example.com',
        password_hash: 'hashed_password',
        user_type: 'INDIVIDUAL',
        is_verified: false
      },
      ['email'], // conflict columns
      { is_verified: true } // update data on conflict
    );
    console.log('Upserted user:', user);

  } catch (error) {
    console.error('Error in upsert example:', error);
  }
}

// Example 5: Transactions
export async function transactionExample() {
  console.log('=== Transaction Example ===');
  
  const userService = db.table('users');
  
  try {
    const result = await userService.transaction(async (client) => {
      // Create user
      const userResult = await client.query(
        'INSERT INTO users (email, password_hash, user_type) VALUES ($1, $2, $3) RETURNING id',
        ['transaction.user@example.com', 'hashed_password', 'INDIVIDUAL']
      );
      const userId = userResult.rows[0].id;

      // Create profile (assuming individual_profiles table exists)
      await client.query(
        'INSERT INTO individual_profiles (user_id, full_name) VALUES ($1, $2)',
        [userId, 'Transaction User']
      );

      return { userId, message: 'User and profile created successfully' };
    });
    
    console.log('Transaction result:', result);

  } catch (error) {
    console.error('Error in transaction example:', error);
  }
}

// Example 6: Working with technologies table
export async function technologiesExample() {
  console.log('=== Technologies Example ===');
  
  const techService = db.table('technologies');
  
  try {
    // Create multiple technologies
    const technologies = await techService.createMany([
      {
        title: 'AI-powered Analytics',
        description: 'Advanced analytics using artificial intelligence',
        status: 'ACTIVE',
        submitter_id: '123e4567-e89b-12d3-a456-426614174000' // example UUID
      },
      {
        title: 'Blockchain Solution',
        description: 'Secure blockchain implementation',
        status: 'PENDING',
        submitter_id: '123e4567-e89b-12d3-a456-426614174000'
      }
    ]);
    console.log('Created technologies:', technologies);

    // Find active technologies
    const activeTech = await techService.find({
      where: { status: 'ACTIVE' },
      select: ['id', 'title', 'description', 'status'],
      orderBy: { created_at: 'DESC' }
    });
    console.log('Active technologies:', activeTech);

  } catch (error) {
    console.error('Error in technologies example:', error);
  }
}

// Example 7: Joins (if needed)
export async function joinExample() {
  console.log('=== Join Example ===');
  
  const userService = db.table('users');
  
  try {
    // Join users with their profiles
    const usersWithProfiles = await userService.find({
      select: [
        'users.id',
        'users.email',
        'users.user_type',
        'profiles.full_name'
      ],
      join: [{
        table: 'individual_profiles profiles',
        on: 'users.id = profiles.user_id',
        type: 'LEFT'
      }],
      where: { 'users.is_active': true },
      limit: 10
    });
    console.log('Users with profiles:', usersWithProfiles);

  } catch (error) {
    console.error('Error in join example:', error);
  }
}

// Example 8: Raw SQL queries
export async function rawQueryExample() {
  console.log('=== Raw Query Example ===');
  
  const userService = db.table('users');
  
  try {
    // Execute raw SQL
    const result = await userService.raw(
      `SELECT user_type, COUNT(*) as count 
       FROM users 
       WHERE is_active = $1 
       GROUP BY user_type`,
      [true]
    );
    console.log('User type statistics:', result);

  } catch (error) {
    console.error('Error in raw query example:', error);
  }
}

// Run all examples
export async function runAllExamples() {
  console.log('🚀 Running DbService Examples...\n');
  
  await basicCrudExample();
  console.log('\n');
  
  await advancedQueriesExample();
  console.log('\n');
  
  await paginationExample();
  console.log('\n');
  
  await upsertExample();
  console.log('\n');
  
  await transactionExample();
  console.log('\n');
  
  await technologiesExample();
  console.log('\n');
  
  await joinExample();
  console.log('\n');
  
  await rawQueryExample();
  
  console.log('\n✅ All examples completed!');
}

// Uncomment to run examples
// runAllExamples().catch(console.error);
