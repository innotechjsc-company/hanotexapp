/**
 * Category Types for Hanotex CMS
 * Định nghĩa các interface cho Category collection
 */

// Main Category Interface
export interface Category {
  id: string // Mã định danh danh mục
  name: string // Tên danh mục
  code: string // Mã danh mục
  parent?: string | Category // Danh mục cha
  level: number // Cấp độ danh mục
  description?: string // Mô tả danh mục

  // Timestamps
  createdAt: string // Thời gian tạo
  updatedAt: string // Thời gian cập nhật
}

// Category hierarchy helpers
export interface CategoryHierarchy extends Category {
  children?: CategoryHierarchy[] // Danh mục con
  parent?: string | Category // Danh mục cha
}

// Types for form data and API responses
export interface CategoryCreateData extends Omit<Category, 'id' | 'createdAt' | 'updatedAt'> {}
export interface CategoryUpdateData extends Partial<CategoryCreateData> {}

// Category tree structure for navigation
export interface CategoryTree {
  id: string // Mã định danh danh mục
  name: string // Tên danh mục
  code: string // Mã danh mục
  level: number // Cấp độ danh mục
  children: CategoryTree[] // Danh mục con
}
