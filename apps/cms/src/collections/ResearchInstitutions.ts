import type { CollectionConfig } from 'payload'

export const ResearchInstitutions: CollectionConfig = {
  slug: 'research-institutions',
  admin: {
    useAsTitle: 'institution_name',
    group: 'User Management',
    defaultColumns: ['institution_name', 'institution_code', 'governing_body'],
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => !!user,
    update: ({ req: { user } }) => !!user,
    delete: ({ req: { user } }) => !!user,
  },
  fields: [
    {
      name: 'institution_name',
      type: 'text',
      required: true,
      label: 'Institution Name',
      admin: {
        description: 'Official name of the research institution',
      },
    },
    {
      name: 'institution_code',
      type: 'text',
      required: true,
      unique: true,
      label: 'Institution Code',
      admin: {
        description: 'Unique institution identification code',
      },
    },
    {
      name: 'governing_body',
      type: 'text',
      required: true,
      label: 'Governing Body',
      admin: {
        description: 'Government body or organization that oversees this institution',
      },
    },
    {
      name: 'institution_type',
      type: 'select',
      required: true,
      defaultValue: 'UNIVERSITY',
      options: [
        { label: 'University', value: 'UNIVERSITY' },
        { label: 'Research Institute', value: 'RESEARCH_INSTITUTE' },
        { label: 'Government Lab', value: 'GOVERNMENT_LAB' },
        { label: 'Private R&D Center', value: 'PRIVATE_RND' },
        { label: 'International Organization', value: 'INTERNATIONAL_ORG' },
      ],
      label: 'Institution Type',
    },
    {
      name: 'contact_info',
      type: 'group',
      label: 'Contact Information',
      fields: [
        {
          name: 'contact_email',
          type: 'email',
          label: 'Contact Email',
        },
        {
          name: 'contact_phone',
          type: 'text',
          label: 'Contact Phone',
        },
        {
          name: 'website',
          type: 'text',
          label: 'Institution Website',
        },
      ],
    },
    {
      name: 'address',
      type: 'group',
      label: 'Institution Address',
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
      name: 'research_areas',
      type: 'array',
      label: 'Research Areas',
      fields: [
        {
          name: 'area',
          type: 'text',
          required: true,
        },
      ],
      admin: {
        description: 'Main research focus areas',
      },
    },
    {
      name: 'research_task_code',
      type: 'text',
      label: 'Research Task Code',
      admin: {
        description: 'Current research project or task identification code',
      },
    },
    {
      name: 'acceptance_report',
      type: 'text',
      label: 'Acceptance Report',
      admin: {
        description: 'Latest research acceptance report reference',
      },
    },
    {
      name: 'research_group',
      type: 'text',
      label: 'Research Group',
      admin: {
        description: 'Specific research group or department within institution',
      },
    },
    {
      name: 'established_year',
      type: 'number',
      label: 'Established Year',
      min: 1800,
      max: new Date().getFullYear(),
      admin: {
        description: 'Year the institution was established',
      },
    },
    {
      name: 'staff_count',
      type: 'number',
      label: 'Staff Count',
      min: 0,
      admin: {
        description: 'Number of research staff',
      },
    },
    {
      name: 'accreditation_info',
      type: 'group',
      label: 'Accreditation Information',
      fields: [
        {
          name: 'accreditation_body',
          type: 'text',
          label: 'Accreditation Body',
        },
        {
          name: 'accreditation_level',
          type: 'text',
          label: 'Accreditation Level',
        },
        {
          name: 'accreditation_date',
          type: 'date',
          label: 'Accreditation Date',
        },
        {
          name: 'accreditation_expiry',
          type: 'date',
          label: 'Accreditation Expiry',
        },
      ],
    },
    {
      name: 'is_active',
      type: 'checkbox',
      defaultValue: true,
      label: 'Active Status',
      admin: {
        description: 'Whether the institution is currently active',
      },
    },
  ],
  timestamps: true,
}
