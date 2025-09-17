import type { CollectionConfig } from 'payload'

export const Companies: CollectionConfig = {
  slug: 'companies',
  admin: {
    useAsTitle: 'company_name',
    group: 'User Management',
    defaultColumns: ['company_name', 'tax_code', 'legal_representative'],
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => !!user,
    update: ({ req: { user } }) => !!user,
    delete: ({ req: { user } }) => !!user,
  },
  fields: [
    {
      name: 'company_name',
      type: 'text',
      required: true,
      label: 'Company Name',
      admin: {
        description: 'Official company name',
      },
    },
    {
      name: 'tax_code',
      type: 'text',
      required: true,
      unique: true,
      label: 'Tax Code',
      admin: {
        description: 'Unique tax identification code',
      },
    },
    {
      name: 'business_license',
      type: 'text',
      label: 'Business License',
      admin: {
        description: 'Business registration license number',
      },
    },
    {
      name: 'legal_representative',
      type: 'text',
      required: true,
      label: 'Legal Representative',
      admin: {
        description: 'Name of the legal representative',
      },
    },
    {
      name: 'contact_email',
      type: 'email',
      label: 'Contact Email',
      admin: {
        description: 'Official company contact email',
      },
    },
    {
      name: 'contact_phone',
      type: 'text',
      label: 'Contact Phone',
      admin: {
        description: 'Official company contact phone number',
      },
    },
    {
      name: 'address',
      type: 'group',
      label: 'Company Address',
      fields: [
        {
          name: 'street',
          type: 'text',
          label: 'Street Address',
        },
        {
          name: 'city',
          type: 'text',
          label: 'City',
        },
        {
          name: 'state',
          type: 'text',
          label: 'State/Province',
        },
        {
          name: 'country',
          type: 'text',
          label: 'Country',
        },
        {
          name: 'postal_code',
          type: 'text',
          label: 'Postal Code',
        },
      ],
    },
    {
      name: 'production_capacity',
      type: 'textarea',
      label: 'Production Capacity',
      admin: {
        description: 'Description of company production capabilities',
      },
    },
    {
      name: 'business_sectors',
      type: 'array',
      label: 'Business Sectors',
      fields: [
        {
          name: 'sector',
          type: 'text',
          required: true,
        },
      ],
      admin: {
        description: 'Main business sectors of the company',
      },
    },
    {
      name: 'employee_count',
      type: 'number',
      label: 'Employee Count',
      min: 0,
      admin: {
        description: 'Number of employees',
      },
    },
    {
      name: 'established_year',
      type: 'number',
      label: 'Established Year',
      min: 1900,
      max: new Date().getFullYear(),
      admin: {
        description: 'Year the company was established',
      },
    },
    {
      name: 'website',
      type: 'text',
      label: 'Company Website',
      admin: {
        description: 'Official company website URL',
      },
    },
    {
      name: 'is_active',
      type: 'checkbox',
      defaultValue: true,
      label: 'Active Status',
      admin: {
        description: 'Whether the company is currently active',
      },
    },
  ],
  timestamps: true,
}
