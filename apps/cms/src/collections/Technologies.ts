import type { CollectionConfig } from 'payload'

export const Technologies: CollectionConfig = {
  slug: 'technologies',
  admin: {
    useAsTitle: 'title',
    group: 'Technology Management',
    defaultColumns: ['title', 'status', 'trl_level', 'submitter_id'],
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => !!user,
    update: ({ req: { user } }) => !!user,
    delete: ({ req: { user } }) => !!user,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Technology Title',
    },
    {
      name: 'public_summary',
      type: 'textarea',
      label: 'Public Summary',
      admin: {
        description: 'Summary visible to public users',
      },
    },
    {
      name: 'confidential_detail',
      type: 'richText',
      label: 'Confidential Details',
      admin: {
        description: 'Detailed information for authorized users only',
      },
    },
    {
      name: 'trl_level',
      type: 'number',
      label: 'TRL Level',
      min: 1,
      max: 9,
      admin: {
        description: 'Technology Readiness Level (1-9)',
      },
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      label: 'Category',
    },
    {
      name: 'submitter',
      type: 'relationship',
      relationTo: 'users',
      label: 'Submitter',
      required: true,
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'DRAFT',
      options: [
        { label: 'Draft', value: 'DRAFT' },
        { label: 'Pending', value: 'PENDING' },
        { label: 'Approved', value: 'APPROVED' },
        { label: 'Rejected', value: 'REJECTED' },
        { label: 'Active', value: 'ACTIVE' },
        { label: 'Inactive', value: 'INACTIVE' },
      ],
    },
    {
      name: 'visibility_mode',
      type: 'select',
      defaultValue: 'public',
      options: [
        { label: 'Public', value: 'public' },
        { label: 'Private', value: 'private' },
        { label: 'Restricted', value: 'restricted' },
      ],
    },
    // Technology Owners
    {
      name: 'owners',
      type: 'array',
      label: 'Technology Owners',
      fields: [
        {
          name: 'owner_type',
          type: 'select',
          required: true,
          options: [
            { label: 'Individual', value: 'INDIVIDUAL' },
            { label: 'Company', value: 'COMPANY' },
            { label: 'Research Institution', value: 'RESEARCH_INSTITUTION' },
          ],
        },
        {
          name: 'owner_name',
          type: 'text',
          required: true,
        },
        {
          name: 'ownership_percentage',
          type: 'number',
          required: true,
          min: 0,
          max: 100,
          admin: {
            description: 'Ownership percentage (0-100)',
          },
        },
      ],
    },
    // Intellectual Property Details
    {
      name: 'ip_details',
      type: 'array',
      label: 'Intellectual Property Details',
      fields: [
        {
          name: 'ip_type',
          type: 'select',
          required: true,
          options: [
            { label: 'Patent', value: 'PATENT' },
            { label: 'Utility Model', value: 'UTILITY_MODEL' },
            { label: 'Industrial Design', value: 'INDUSTRIAL_DESIGN' },
            { label: 'Trademark', value: 'TRADEMARK' },
            { label: 'Software Copyright', value: 'SOFTWARE_COPYRIGHT' },
            { label: 'Trade Secret', value: 'TRADE_SECRET' },
          ],
        },
        {
          name: 'ip_number',
          type: 'text',
          label: 'IP Number',
        },
        {
          name: 'status',
          type: 'text',
          label: 'IP Status',
        },
        {
          name: 'territory',
          type: 'text',
          label: 'Territory',
        },
      ],
    },
    // Legal Certification
    {
      name: 'legal_certification',
      type: 'group',
      label: 'Legal Certification',
      fields: [
        {
          name: 'protection_scope',
          type: 'array',
          label: 'Protection Scope',
          fields: [
            {
              name: 'scope',
              type: 'text',
            },
          ],
        },
        {
          name: 'standard_certifications',
          type: 'array',
          label: 'Standard Certifications',
          fields: [
            {
              name: 'certification',
              type: 'text',
            },
          ],
        },
        {
          name: 'local_certification_url',
          type: 'text',
          label: 'Local Certification URL',
        },
      ],
    },
    // Pricing Information
    {
      name: 'pricing',
      type: 'group',
      label: 'Pricing Information',
      fields: [
        {
          name: 'pricing_type',
          type: 'select',
          required: true,
          options: [
            { label: 'Appraisal', value: 'APPRAISAL' },
            { label: 'Ask', value: 'ASK' },
            { label: 'Auction', value: 'AUCTION' },
            { label: 'Offer', value: 'OFFER' },
          ],
        },
        {
          name: 'asking_price',
          type: 'number',
          label: 'Asking Price',
          min: 0,
        },
        {
          name: 'currency',
          type: 'select',
          required: true,
          defaultValue: 'VND',
          options: [
            { label: 'Vietnamese Dong (VND)', value: 'VND' },
            { label: 'US Dollar (USD)', value: 'USD' },
            { label: 'Euro (EUR)', value: 'EUR' },
          ],
        },
        {
          name: 'price_type',
          type: 'text',
          label: 'Price Type',
        },
        {
          name: 'appraisal_purpose',
          type: 'text',
          label: 'Appraisal Purpose',
        },
        {
          name: 'appraisal_scope',
          type: 'text',
          label: 'Appraisal Scope',
        },
        {
          name: 'appraisal_deadline',
          type: 'date',
          label: 'Appraisal Deadline',
        },
      ],
    },
    // Investment & Transfer Information
    {
      name: 'investment_transfer',
      type: 'group',
      label: 'Investment & Transfer Information',
      fields: [
        {
          name: 'investment_stage',
          type: 'text',
          label: 'Investment Stage',
        },
        {
          name: 'commercialization_methods',
          type: 'array',
          label: 'Commercialization Methods',
          fields: [
            {
              name: 'method',
              type: 'text',
            },
          ],
        },
        {
          name: 'transfer_methods',
          type: 'array',
          label: 'Transfer Methods',
          fields: [
            {
              name: 'method',
              type: 'text',
            },
          ],
        },
        {
          name: 'territory_scope',
          type: 'text',
          label: 'Territory Scope',
        },
        {
          name: 'financial_methods',
          type: 'array',
          label: 'Financial Methods',
          fields: [
            {
              name: 'method',
              type: 'text',
            },
          ],
        },
        {
          name: 'usage_limitations',
          type: 'textarea',
          label: 'Usage Limitations',
        },
        {
          name: 'current_partners',
          type: 'textarea',
          label: 'Current Partners',
        },
        {
          name: 'potential_partners',
          type: 'textarea',
          label: 'Potential Partners',
        },
      ],
    },
    // Additional Data
    {
      name: 'additional_data',
      type: 'group',
      label: 'Additional Data',
      fields: [
        {
          name: 'test_results',
          type: 'richText',
          label: 'Test Results',
        },
        {
          name: 'economic_social_impact',
          type: 'richText',
          label: 'Economic & Social Impact',
        },
        {
          name: 'financial_support_info',
          type: 'richText',
          label: 'Financial Support Information',
        },
      ],
    },
    // Related Documents
    {
      name: 'documents',
      type: 'relationship',
      relationTo: 'media',
      hasMany: true,
      label: 'Related Documents',
    },
  ],
  timestamps: true,
}
