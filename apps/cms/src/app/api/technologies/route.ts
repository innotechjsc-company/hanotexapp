import {
  Currency,
  DisplayMode,
  OwnerType,
  PricingType,
  TechnologyStatus,
  VisibilityMode,
} from '@/types'
import { IPStatus, IPType } from '@/types/IntellectualProperty'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

interface OwnerInput {
  owner_type: OwnerType
  owner_name: string
  ownership_percentage: number
}

interface PricingInput {
  pricing_type: PricingType
  price_from: number
  price_to: number
  currency: Currency
}

interface LegalCertificationInput {
  protection_scope?: { scope: string }[]
  standard_certifications?: { certification: string }[]
  local_certification_url?: string
}

interface IntellectualPropertyInput {
  code: string
  type: IPType
  status?: IPStatus
}

interface CreateTechnologyBody {
  title?: string
  public_summary?: string
  category?: string
  confidential_detail?: string
  trl_level?: string
  submitter?: string
  status?: TechnologyStatus
  visibility_mode?: VisibilityMode
  owners?: OwnerInput[]
  legal_certification?: LegalCertificationInput
  pricing?: PricingInput
  additional_data?: {
    test_results?: unknown
    economic_social_impact?: unknown
    financial_support_info?: unknown
  }
  documents?: string[]
  display_mode?: DisplayMode
  intellectual_property?: IntellectualPropertyInput[]
}

function badRequest(message: string, details?: unknown) {
  return new Response(JSON.stringify({ success: false, error: message, details }), {
    status: 400,
    headers: { 'Content-Type': 'application/json' },
  })
}

export const POST = async (req: Request) => {
  const payload = await getPayload({ config: configPromise })

  let data: CreateTechnologyBody
  try {
    data = await req.json()
  } catch (e) {
    return badRequest('Payload must be valid JSON')
  }

  // Basic required field checks aligned with collection schema
  const errors: string[] = []
  if (!data?.title || typeof data.title !== 'string' || !data.title.trim()) {
    errors.push('Missing or invalid field: title')
  }
  if (!data?.trl_level || typeof data.trl_level !== 'string') {
    errors.push('Missing or invalid field: trl_level')
  }
  if (!data?.submitter || typeof data.submitter !== 'string') {
    errors.push('Missing or invalid field: submitter')
  }
  if (!data?.pricing) {
    errors.push('Missing field: pricing')
  } else {
    const { pricing_type, price_from, price_to, currency } = data.pricing
    const allowedPricing: PricingType[] = ['GRANT_SEED', 'VC_JOINT_VENTURE', 'GROWTH_STRATEGIC']
    const allowedCurrency: Currency[] = ['VND', 'USD', 'EUR']
    if (!allowedPricing.includes(pricing_type as PricingType)) {
      errors.push('Invalid pricing.pricing_type')
    }
    if (typeof price_from !== 'number' || typeof price_to !== 'number') {
      errors.push('pricing.price_from and pricing.price_to must be numbers')
    } else if (price_from < 0 || price_to < 0 || price_from > price_to) {
      errors.push('Invalid price range: price_from must be <= price_to and non-negative')
    }
    if (!allowedCurrency.includes(currency as Currency)) {
      errors.push('Invalid pricing.currency')
    }
  }

  // Owners validation if provided
  if (Array.isArray(data?.owners)) {
    let sum = 0
    const allowedOwnerTypes: OwnerType[] = ['INDIVIDUAL', 'COMPANY', 'RESEARCH_INSTITUTION']
    for (const [idx, owner] of data.owners.entries()) {
      if (!owner) {
        errors.push(`owners[${idx}] is invalid`)
        continue
      }
      if (!allowedOwnerTypes.includes(owner.owner_type)) {
        errors.push(`owners[${idx}].owner_type is invalid`)
      }
      if (typeof owner.owner_name !== 'string' || !owner.owner_name.trim()) {
        errors.push(`owners[${idx}].owner_name is required`)
      }
      if (
        typeof owner.ownership_percentage !== 'number' ||
        owner.ownership_percentage < 0 ||
        owner.ownership_percentage > 100
      ) {
        errors.push(`owners[${idx}].ownership_percentage must be between 0 and 100`)
      }
      sum += typeof owner.ownership_percentage === 'number' ? owner.ownership_percentage : 0
    }
    if (sum > 100) {
      errors.push('Sum of ownership_percentage cannot exceed 100')
    }
  }
  if (data.visibility_mode) {
    const allowed: VisibilityMode[] = ['public', 'private', 'restricted']
    if (!allowed.includes(data.visibility_mode)) errors.push('Invalid visibility_mode')
  }
  if (data.display_mode) {
    const allowed: DisplayMode[] = [
      'public_summary_with_nda_details',
      'fully_public',
      'private_by_invitation',
    ]
    if (!allowed.includes(data.display_mode)) errors.push('Invalid display_mode')
  }

  if (errors.length) {
    return badRequest('Validation failed', { errors })
  }

  // Referential checks for required relations
  try {
    await payload.findByID({ collection: 'trl', id: data.trl_level as string })
  } catch {
    return badRequest('trl_level does not reference an existing TRL')
  }

  try {
    await payload.findByID({ collection: 'users', id: data.submitter as string })
  } catch {
    return badRequest('submitter does not reference an existing user')
  }

  if (data.category) {
    try {
      await payload.findByID({ collection: 'categories', id: data.category })
    } catch {
      return badRequest('category does not reference an existing category')
    }
  }

  // Build technology payload
  const technologyData: Record<string, any> = {
    title: data.title,
    public_summary: data.public_summary,
    category: data.category,
    confidential_detail: data.confidential_detail,
    trl_level: data.trl_level,
    submitter: data.submitter,
    status: data.status ?? 'DRAFT',
    visibility_mode: data.visibility_mode ?? 'public',
    owners: data.owners,
    legal_certification: data.legal_certification,
    pricing: data.pricing,
    additional_data: data.additional_data,
    documents: data.documents,
    display_mode: data.display_mode ?? 'public_summary_with_nda_details',
  }

  try {
    const createdTechnology = await payload.create({
      collection: 'technologies',
      data: technologyData,
    })

    // Create related Intellectual Property entries if provided
    let createdIPs: any[] | undefined
    if (Array.isArray(data.intellectual_property) && data.intellectual_property.length) {
      createdIPs = []
      for (const ip of data.intellectual_property) {
        if (!ip?.code) {
          return badRequest('intellectual_property.code is required for each item')
        }
        // Map/validate type and status against collection options
        const allowedTypes: IPType[] = [
          'patent',
          'utility_solution',
          'industrial_design',
          'trademark',
          'copyright',
          'trade_secret',
        ]
        const allowedStatus = ['pending', 'granted', 'expired', 'rejected'] as const
        if (ip.type && !allowedTypes.includes(ip.type)) {
          return badRequest('intellectual_property.type is invalid')
        }
        if (ip.status && !allowedStatus.includes(ip.status)) {
          return badRequest('intellectual_property.status is invalid')
        }

        try {
          const createdIP = await payload.create({
            collection: 'intellectual_property',
            data: {
              technology: createdTechnology.id,
              code: ip.code,
              type: ip.type,
              status: ip.status,
            },
          })
          createdIPs.push(createdIP)
        } catch (e: any) {
          // If IP creation fails (e.g., duplicate code), roll forward: return partial success with error detail
          return new Response(
            JSON.stringify({
              success: true,
              technology: createdTechnology,
              intellectual_property: createdIPs,
              warning: 'Some Intellectual Property records could not be created',
              error: e?.message ?? String(e),
            }),
            { status: 201, headers: { 'Content-Type': 'application/json' } },
          )
        }
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        technology: createdTechnology,
        intellectual_property: createdIPs,
      }),
      { status: 201, headers: { 'Content-Type': 'application/json' } },
    )
  } catch (e: any) {
    const message = e?.message ?? 'Failed to create technology'
    return new Response(JSON.stringify({ success: false, error: message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
