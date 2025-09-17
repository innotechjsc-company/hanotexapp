/**
 * Category Types for Hanotex CMS
 * Định nghĩa các interface cho Category collection
 */

// Main Category Interface
export interface Category {
  id: string
  name: string
  code: string
  parent?: string | Category
  level: number
  description?: string

  // Timestamps
  createdAt: string
  updatedAt: string
}

// Category hierarchy helpers
export interface CategoryHierarchy extends Category {
  children?: CategoryHierarchy[]
  parent?: string | Category
}

// Types for form data and API responses
export interface CategoryCreateData extends Omit<Category, 'id' | 'createdAt' | 'updatedAt'> {}
export interface CategoryUpdateData extends Partial<CategoryCreateData> {}

// Category tree structure for navigation
export interface CategoryTree {
  id: string
  name: string
  code: string
  level: number
  children: CategoryTree[]
}
