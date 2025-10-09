/**
 * Search API Route - Improved Version
 *
 * Endpoint: GET /api/search
 *
 * Query Parameters:
 * - q: string (required, min 2 chars, max 200 chars)
 * - type: 'all' | 'technology' | 'demand' | 'project' | 'news' | 'event' | 'company' | 'research-institution' (optional, default: 'all')
 * - page: number (optional, default: 1, max: 1000)
 * - limit: number (optional, default: 12, max: 100)
 * - sort: 'relevance' | 'date' | 'title' (optional, default: 'relevance')
 */

import { NextRequest } from 'next/server'
import { handleCORSPreflight, corsResponse, corsErrorResponse } from '@/utils/cors'
import { getPayload, type CollectionSlug } from 'payload'
import config from '@payload-config'

import type { SearchableCollections, SearchResult, GenericDoc, SearchResultType } from './types'
import {
  COLLECTION_CONFIGS,
  validateSearchParams,
  buildWhereClause,
  transformDocToResult,
  calculateRelevanceScore,
  sortResults,
  paginateResults,
  getSingularType,
} from './helpers'

// Constants
const SEARCH_COLLECTIONS: SearchableCollections[] = [
  'technologies',
  'demand',
  'project',
  'news',
  'events',
  'companies',
  'research-institutions',
]

/**
 * Handle CORS preflight
 */
export async function OPTIONS() {
  return handleCORSPreflight()
}

/**
 * Main search endpoint
 */
export async function GET(request: NextRequest) {
  const startTime = Date.now()

  try {
    // Get search params
    const { searchParams } = new URL(request.url)
    const q = searchParams.get('q')
    const type = searchParams.get('type')
    const page = searchParams.get('page')
    const limit = searchParams.get('limit')
    const sort = searchParams.get('sort') || 'relevance'

    // Validate params
    const validation = validateSearchParams({ q, type, page, limit })

    if (!validation.isValid) {
      return corsErrorResponse(validation.error || 'Invalid parameters', 400)
    }

    const { query, type: searchType, page: pageNum, limit: limitNum } = validation.validated!

    // Validate sort param
    const sortBy = ['relevance', 'date', 'title'].includes(sort)
      ? (sort as 'relevance' | 'date' | 'title')
      : 'relevance'

    // Initialize Payload
    const payload = await getPayload({ config })

    // Determine which collections to search
    const collectionsToSearch =
      searchType === 'all'
        ? SEARCH_COLLECTIONS
        : SEARCH_COLLECTIONS.filter((col) => COLLECTION_CONFIGS[col].singular === searchType)

    // Search all collections in parallel
    const searchPromises = collectionsToSearch.map(async (collectionName) => {
      try {
        console.log('🚀 ~ searchPromises ~ collectionName:', collectionName)

        const whereClause = buildWhereClause(collectionName, query)
        console.log('🚀 ~ searchPromises ~ whereClause:', whereClause)

        const searchResults = await payload.find({
          collection: collectionName as CollectionSlug,
          where: whereClause,
          limit: 1000, // Get all matching results for proper sorting
          depth: 1,
        })
        console.log('🚀 ~ searchPromises ~ searchResults:', searchResults)
        // Transform results
        const docs = searchResults.docs as unknown as GenericDoc[]
        return docs.map((doc) => transformDocToResult(doc, collectionName))
      } catch (error) {
        console.error(`Error searching ${collectionName}:`, error)
        return []
      }
    })

    // Wait for all searches to complete
    console.log('🚀 ~ GET ~ searchPromises:', searchPromises)
    const searchResultsArrays = await Promise.all(searchPromises)

    // Flatten results and calculate scores
    const allResults = searchResultsArrays.flat().map((result) => ({
      ...result,
      score: calculateRelevanceScore(result, query),
    }))

    // Sort results
    const sortedResults = sortResults(allResults, sortBy, query)

    // Paginate results
    const { data: paginatedResults, totalPages } = paginateResults(sortedResults, pageNum, limitNum)

    // Get type counts in parallel
    const countPromises = SEARCH_COLLECTIONS.map(async (collectionName) => {
      try {
        const whereClause = buildWhereClause(collectionName, query)
        const countResult = await payload.count({
          collection: collectionName as CollectionSlug,
          where: whereClause,
        })
        return {
          type: getSingularType(collectionName),
          count: countResult.totalDocs,
        }
      } catch (error) {
        console.error(`Error counting ${collectionName}:`, error)
        return {
          type: getSingularType(collectionName),
          count: 0,
        }
      }
    })

    const counts = await Promise.all(countPromises)
    const typeCounts = counts.reduce(
      (acc, { type, count }) => {
        acc[type] = count
        return acc
      },
      {} as Record<SearchResultType, number>,
    )

    // Calculate request duration
    const duration = Date.now() - startTime

    // Build response
    return corsResponse({
      success: true,
      data: {
        results: paginatedResults,
        total: allResults.length,
        page: pageNum,
        limit: limitNum,
        totalPages,
        query,
        types: typeCounts,
        meta: {
          duration: `${duration}ms`,
          sort: sortBy,
          timestamp: new Date().toISOString(),
        },
      },
    })
  } catch (error) {
    console.error('Search API error:', error)

    // Better error messages in development
    const errorMessage =
      process.env.NODE_ENV === 'development' && error instanceof Error
        ? error.message
        : 'Internal server error'

    return corsErrorResponse(errorMessage, 500)
  }
}
