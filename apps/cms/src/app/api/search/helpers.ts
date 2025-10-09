/**
 * Search API Helpers
 */

import type { Where } from 'payload'
import type {
  SearchableCollections,
  SearchResultType,
  CollectionConfig,
  MediaWithUrl,
  SearchResult,
  GenericDoc,
} from './types'

// Collection configurations
export const COLLECTION_CONFIGS: Record<SearchableCollections, CollectionConfig> = {
  technologies: {
    singular: 'technology',
    urlPath: 'technologies',
    searchFields: ['title'], // Only title exists
    metadataFields: ['category', 'trl_level', 'pricing', 'owners'],
  },
  demand: {
    singular: 'demand',
    urlPath: 'demands',
    searchFields: ['title'], // Only title exists
    metadataFields: ['category', 'budget', 'deadline', 'user'],
  },
  project: {
    singular: 'project',
    urlPath: 'projects',
    searchFields: ['name', 'description'], // Project uses 'name' field
    metadataFields: ['status', 'user', 'end_date', 'goal_money', 'revenue', 'profit'],
  },
  news: {
    singular: 'news',
    urlPath: 'news',
    searchFields: ['title', 'content'], // Search in title and content
    metadataFields: ['hashtags', 'views', 'likes', 'createdAt'],
  },
  events: {
    singular: 'event',
    urlPath: 'events',
    searchFields: ['title', 'content'], // Search in title and content
    metadataFields: ['location', 'start_date', 'end_date', 'status', 'hashtags'],
  },
  companies: {
    singular: 'company',
    urlPath: 'companies',
    searchFields: ['company_name', 'production_capacity'], // Search in company_name and production_capacity
    metadataFields: [
      'tax_code',
      'legal_representative',
      'contact_email',
      'contact_phone',
      'employee_count',
      'established_year',
      'website',
      'business_sectors',
    ],
  },
  'research-institutions': {
    singular: 'research-institution',
    urlPath: 'research-institutions',
    searchFields: ['institution_name', 'governing_body'], // Search in institution_name and governing_body
    metadataFields: [
      'institution_code',
      'institution_type',
      'research_areas',
      'staff_count',
      'established_year',
      'contact_info',
    ],
  },
}

/**
 * Convert collection name to singular type
 */
export function getSingularType(collectionName: SearchableCollections): SearchResultType {
  return COLLECTION_CONFIGS[collectionName].singular
}

/**
 * Get URL path for collection
 */
export function getUrlPath(collectionName: SearchableCollections): string {
  return COLLECTION_CONFIGS[collectionName].urlPath
}

/**
 * Build search where clause for a collection
 */
export function buildWhereClause(
  collectionName: SearchableCollections,
  searchQuery: string,
): Where {
  const config = COLLECTION_CONFIGS[collectionName]

  const orConditions = config.searchFields.map((field) => ({
    [field]: { contains: searchQuery },
  }))

  return { or: orConditions } as Where
}

/**
 * Extract media URL from Payload media object
 */
export function getMediaUrl(media: MediaWithUrl): string | undefined {
  if (!media || typeof media !== 'object') return undefined
  if ('url' in media && typeof media.url === 'string') return media.url
  return undefined
}

/**
 * Extract name from object or return string
 */
export function extractName(value: unknown): string | undefined {
  if (!value) return undefined
  if (typeof value === 'string') return value
  if (typeof value === 'object' && value !== null) {
    const obj = value as Record<string, unknown>
    if ('name' in obj && typeof obj.name === 'string') return obj.name
    if ('title' in obj && typeof obj.title === 'string') return obj.title
  }
  return undefined
}

/**
 * Transform Payload document to SearchResult
 */
export function transformDocToResult(
  doc: GenericDoc,
  collectionName: SearchableCollections,
): SearchResult {
  const config = COLLECTION_CONFIGS[collectionName]

  // Handle title/name/company_name extraction
  let title = ''
  if (collectionName === 'companies') {
    title = doc.company_name || doc.name || doc.title || ''
  } else if (collectionName === 'research-institutions') {
    title = doc.institution_name || doc.name || doc.title || ''
  } else if (collectionName === 'project') {
    title = doc.name || doc.title || ''
  } else {
    title = doc.title || doc.name || ''
  }

  // Handle description extraction
  let description = ''
  if (collectionName === 'companies') {
    description =
      (typeof doc.production_capacity === 'string'
        ? doc.production_capacity.substring(0, 200)
        : '') ||
      (typeof doc.description === 'string' ? doc.description.substring(0, 200) : '') ||
      ''
  } else if (collectionName === 'project') {
    description =
      (typeof doc.description === 'string' ? doc.description.substring(0, 200) : '') ||
      (typeof doc.business_model === 'string' ? doc.business_model.substring(0, 200) : '') ||
      ''
  } else if (collectionName === 'research-institutions') {
    // Research institutions don't have a description field, use research areas or institution type
    let descText = ''
    if (Array.isArray(doc.research_areas) && doc.research_areas.length > 0) {
      const areas = doc.research_areas.map((area: any) => area?.area || '').filter(Boolean)
      descText = areas.join(', ')
    } else if (doc.institution_type) {
      descText = typeof doc.institution_type === 'string' ? doc.institution_type : ''
    }
    description = descText.substring(0, 200) || ''
  } else {
    description =
      (typeof doc.description === 'string' ? doc.description.substring(0, 200) : '') ||
      (typeof doc.content === 'string' ? doc.content.substring(0, 200) : '') ||
      ''
  }

  const baseResult: SearchResult = {
    id: doc.id,
    type: config.singular,
    title: title,
    description: description,
    image: getMediaUrl(doc.image) || getMediaUrl(doc.logo) || getMediaUrl(doc.avatar),
    url: `/${config.urlPath}/${doc.id}`,
    metadata: {},
  }

  // Extract metadata fields
  const metadata: Record<string, unknown> = {}
  for (const field of config.metadataFields) {
    if (field in doc && doc[field] !== undefined && doc[field] !== null) {
      let value = doc[field]

      // Extract name from objects
      if (typeof value === 'object' && value !== null) {
        const extracted = extractName(value)
        if (extracted) {
          value = extracted
        }
      }

      metadata[field] = value
    }
  }

  baseResult.metadata = metadata

  return baseResult
}

/**
 * Calculate relevance score for a result
 * Only considers title/name matches (no content/category)
 */
export function calculateRelevanceScore(result: SearchResult, query: string): number {
  const queryLower = query.toLowerCase()
  const titleLower = (result.title || '').toLowerCase()

  let score = 0

  // Title exact match
  if (titleLower === queryLower) {
    score += 200
  } else if (titleLower.startsWith(queryLower)) {
    score += 150
  } else if (titleLower.includes(queryLower)) {
    score += 100
  }

  return score
}

/**
 * Sort results by relevance, date, or title
 */
export function sortResults(
  results: SearchResult[],
  sortBy: 'relevance' | 'date' | 'title',
  query: string,
): SearchResult[] {
  return results.sort((a, b) => {
    switch (sortBy) {
      case 'relevance':
        const aScore = a.score || calculateRelevanceScore(a, query)
        const bScore = b.score || calculateRelevanceScore(b, query)
        return bScore - aScore

      case 'date':
        const aDate = a.metadata?.publishedAt || a.metadata?.startDate
        const bDate = b.metadata?.publishedAt || b.metadata?.startDate
        if (!aDate && !bDate) return 0
        if (!aDate) return 1
        if (!bDate) return -1
        return new Date(bDate as string).getTime() - new Date(aDate as string).getTime()

      case 'title':
        return (a.title || '').localeCompare(b.title || '', 'vi')

      default:
        return 0
    }
  })
}

/**
 * Paginate results
 */
export function paginateResults<T>(
  results: T[],
  page: number,
  limit: number,
): { data: T[]; totalPages: number } {
  const totalPages = Math.ceil(results.length / limit)
  const startIndex = (page - 1) * limit
  const endIndex = startIndex + limit

  return {
    data: results.slice(startIndex, endIndex),
    totalPages,
  }
}

/**
 * Validate search params
 */
export function validateSearchParams(params: {
  q?: string | null
  type?: string | null
  page?: string | null
  limit?: string | null
}): {
  isValid: boolean
  error?: string
  validated?: {
    query: string
    type: SearchResultType | 'all'
    page: number
    limit: number
  }
} {
  const query = params.q?.trim()

  // Validate query
  if (!query) {
    return { isValid: false, error: 'Query parameter "q" is required' }
  }

  if (query.length < 2) {
    return { isValid: false, error: 'Query must be at least 2 characters long' }
  }

  if (query.length > 200) {
    return { isValid: false, error: 'Query must be less than 200 characters' }
  }

  // Validate type
  const type = params.type || 'all'
  const validTypes = [
    'all',
    'technology',
    'demand',
    'project',
    'news',
    'event',
    'company',
    'research-institution',
  ]
  if (!validTypes.includes(type)) {
    return { isValid: false, error: `Invalid type. Must be one of: ${validTypes.join(', ')}` }
  }

  // Validate page
  const page = parseInt(params.page || '1')
  if (isNaN(page) || page < 1) {
    return { isValid: false, error: 'Page must be a positive integer' }
  }

  if (page > 1000) {
    return { isValid: false, error: 'Page must be less than 1000' }
  }

  // Validate limit
  const limit = parseInt(params.limit || '12')
  if (isNaN(limit) || limit < 1) {
    return { isValid: false, error: 'Limit must be a positive integer' }
  }

  if (limit > 100) {
    return { isValid: false, error: 'Limit must be less than or equal to 100' }
  }

  return {
    isValid: true,
    validated: {
      query,
      type: type as SearchResultType | 'all',
      page,
      limit,
    },
  }
}
