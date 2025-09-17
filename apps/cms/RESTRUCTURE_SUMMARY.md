# Database Structure Refactoring Summary

## 🔄 Changes Made

### 1. New Collections Created

#### `Companies.ts`

- **Slug**: `companies`
- **Purpose**: Quản lý thông tin doanh nghiệp
- **Key Fields**:
  - `company_name` (required)
  - `tax_code` (required, unique)
  - `legal_representative` (required)
  - `contact_email`, `contact_phone`
  - `address` (group: street, city, state, country, postal_code)
  - `production_capacity`
  - `business_sectors` (array)
  - `employee_count`, `established_year`
  - `website`, `is_active`

#### `ResearchInstitutions.ts`

- **Slug**: `research-institutions`
- **Purpose**: Quản lý thông tin viện nghiên cứu
- **Key Fields**:
  - `institution_name` (required)
  - `institution_code` (required, unique)
  - `governing_body` (required)
  - `institution_type` (University, Research Institute, etc.)
  - `contact_info` (group: email, phone, website)
  - `address` (same structure as Company)
  - `research_areas` (array)
  - `research_task_code`, `acceptance_report`, `research_group`
  - `established_year`, `staff_count`
  - `accreditation_info` (group: body, level, date, expiry)
  - `is_active`

### 2. Updated Collections

#### `Users.ts` - Major Restructure

**Before**: Nested group fields (`individual_profile`, `company_profile`, `research_profile`)
**After**: Normalized relationships

- **Individual users**: Fields kept directly in User table:
  - `full_name`, `id_number`, `phone`, `profession`, `bank_account`
- **Company users**: Relationship to Companies collection:
  - `company_id` → references `companies`
- **Research Institution users**: Relationship to ResearchInstitutions collection:
  - `research_institution_id` → references `research-institutions`

### 3. New Type Definitions

#### `Company.ts`

```typescript
export interface Company {
  id: string
  company_name: string
  tax_code: string
  legal_representative: string
  address?: Address
  business_sectors?: BusinessSector[]
  // ... other fields
}
```

#### `ResearchInstitution.ts`

```typescript
export interface ResearchInstitution {
  id: string
  institution_name: string
  institution_code: string
  institution_type: InstitutionType
  research_areas?: ResearchArea[]
  // ... other fields
}
```

#### `User.ts` - Updated

```typescript
export interface User {
  id: string
  email: string
  user_type: UserType

  // Individual profile (inline)
  full_name?: string
  id_number?: string
  // ... other individual fields

  // Relationships
  company_id?: string | Company
  research_institution_id?: string | ResearchInstitution
}
```

### 4. Updated Files

- ✅ `collections/Companies.ts` (NEW)
- ✅ `collections/ResearchInstitutions.ts` (NEW)
- ✅ `collections/Users.ts` (UPDATED - replaced groups with relationships)
- ✅ `types/Company.ts` (NEW)
- ✅ `types/ResearchInstitution.ts` (NEW)
- ✅ `types/User.ts` (UPDATED - new structure)
- ✅ `types/index.ts` (UPDATED - export new types)
- ✅ `payload.config.ts` (UPDATED - include new collections)

## 🎯 Benefits of New Structure

### 1. **Data Normalization**

- Eliminates data duplication
- Company/Institution info stored once, referenced by multiple users
- Easier to maintain and update organization information

### 2. **Better Relationships**

- Multiple users can belong to same company/institution
- Company/Institution can exist independently of users
- Easier to track organization history and changes

### 3. **Improved Queries**

- Can query users by company/institution efficiently
- Can get all users in an organization easily
- Better filtering and search capabilities

### 4. **Scalability**

- Can add more fields to companies/institutions without affecting User table
- Can create additional relationships (e.g., departments, branches)
- Easier to extend with new organization types

### 5. **Data Integrity**

- Unique constraints on tax_code/institution_code
- Consistent organization data across all users
- Better validation and business rules

## 🔧 Usage Examples

### Creating Users with Relationships

```typescript
// Individual User
const individualUser = {
  email: 'john@example.com',
  user_type: 'INDIVIDUAL',
  full_name: 'John Doe',
  phone: '+84123456789',
}

// Company User (first create company, then user)
const company = await Companies.create({
  company_name: 'Tech Corp',
  tax_code: 'TC123456789',
  legal_representative: 'Jane Smith',
})

const companyUser = {
  email: 'admin@techcorp.com',
  user_type: 'COMPANY',
  company_id: company.id,
}
```

### Querying with Populated Relationships

```typescript
// Get user with company info
const userWithCompany = await Users.findByID(id, {
  depth: 1, // populates company_id relationship
})

// Get all users in a company
const companyUsers = await Users.find({
  where: {
    company_id: { equals: companyId },
  },
})
```

## 🚀 Next Steps

1. **Database Migration**: Update existing data to new structure
2. **API Updates**: Update API endpoints to handle new relationships
3. **Frontend Updates**: Update forms and displays for new structure
4. **Documentation**: Update API docs and user guides
5. **Testing**: Test all CRUD operations with new structure

## ⚠️ Breaking Changes

- **User API**: `individual_profile`, `company_profile`, `research_profile` fields no longer exist
- **Relationships**: Company and Research Institution data now separate entities
- **Validation**: New required fields for Companies and ResearchInstitutions
- **Queries**: Need to populate relationships to get complete user info

This restructure provides a much more scalable and maintainable database design for the Hanotex platform!
