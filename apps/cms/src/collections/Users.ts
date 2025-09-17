import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
    group: 'User Management',
    defaultColumns: ['email', 'user_type', 'role', 'is_verified'],
  },
  auth: true,
  access: {
    read: () => true,
    create: () => true,
    update: ({ req: { user } }) => !!user,
    delete: ({ req: { user } }) => !!user,
  },
  fields: [
    // Email added by default
    {
      name: 'user_type',
      type: 'select',
      required: true,
      defaultValue: 'INDIVIDUAL',
      options: [
        { label: 'Individual', value: 'INDIVIDUAL' },
        { label: 'Company', value: 'COMPANY' },
        { label: 'Research Institution', value: 'RESEARCH_INSTITUTION' },
      ],
    },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'USER',
      options: [
        { label: 'User', value: 'USER' },
        { label: 'Admin', value: 'ADMIN' },
        { label: 'Moderator', value: 'MODERATOR' },
        { label: 'Support', value: 'SUPPORT' },
      ],
    },
    {
      name: 'is_verified',
      type: 'checkbox',
      defaultValue: false,
      label: 'Email Verified',
    },
    {
      name: 'is_active',
      type: 'checkbox',
      defaultValue: true,
      label: 'Account Active',
    },
    // Individual Profile - for INDIVIDUAL users
    {
      name: 'full_name',
      type: 'text',
      label: 'Full Name',
      admin: {
        condition: (data) => data.user_type === 'INDIVIDUAL',
        description: 'Full name for individual users',
      },
    },
    {
      name: 'id_number',
      type: 'text',
      label: 'ID Number',
      admin: {
        condition: (data) => data.user_type === 'INDIVIDUAL',
        description: 'National ID or passport number',
      },
    },
    {
      name: 'phone',
      type: 'text',
      label: 'Phone Number',
      admin: {
        condition: (data) => data.user_type === 'INDIVIDUAL',
        description: 'Personal phone number',
      },
    },
    {
      name: 'profession',
      type: 'text',
      label: 'Profession',
      admin: {
        condition: (data) => data.user_type === 'INDIVIDUAL',
        description: 'Professional occupation',
      },
    },
    {
      name: 'bank_account',
      type: 'text',
      label: 'Bank Account',
      admin: {
        condition: (data) => data.user_type === 'INDIVIDUAL',
        description: 'Bank account information for payments',
      },
    },

    // Company Profile - relationship to Companies collection
    {
      name: 'company',
      type: 'relationship',
      relationTo: 'companies',
      label: 'Company Profile',
      admin: {
        condition: (data) => data.user_type === 'COMPANY',
        description: 'Link to company information',
      },
    },

    // Research Institution Profile - relationship to ResearchInstitutions collection
    {
      name: 'research_institution',
      type: 'relationship',
      relationTo: 'research-institutions',
      label: 'Research Institution Profile',
      admin: {
        condition: (data) => data.user_type === 'RESEARCH_INSTITUTION',
        description: 'Link to research institution information',
      },
    },
  ],
  timestamps: true,
}
