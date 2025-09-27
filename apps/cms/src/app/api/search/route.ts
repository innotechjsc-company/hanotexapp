import { NextRequest, NextResponse } from 'next/server';
import { getPayload, type CollectionSlug, type Where } from 'payload';
import config from '@payload-config';

// Limit to existing Payload collections
type SearchableCollections = 'technologies' | 'demand' | 'project' | 'news' | 'events';

// Helper function to convert collection names to singular types
function getSingularType(collectionName: SearchableCollections): string {
  const mapping: { [key in SearchableCollections]: string } = {
    'technologies': 'technology',
    'demand': 'demand',
    'project': 'project',
    'news': 'news',
    'events': 'event'
  };
  return mapping[collectionName] || collectionName;
}

// Helper function to get URL path (using plural forms for web routes)
function getUrlPath(collectionName: SearchableCollections): string {
  const urlMapping: { [key in SearchableCollections]: string } = {
    'technologies': 'technologies',
    'demand': 'demands', // Note: demand -> demands for URL
    'project': 'projects', // Note: project -> projects for URL
    'news': 'news',
    'events': 'events'
  };
  return urlMapping[collectionName] || collectionName;
}

export async function GET(request: NextRequest) {
  try {
    const payload = await getPayload({ config });
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const type = searchParams.get('type') || 'all';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    if (!query || query.trim().length < 2) {
      return NextResponse.json({
        success: false,
        error: 'Query must be at least 2 characters long'
      }, { status: 400 });
    }

    const searchQuery = query.trim();
    type SearchResult = {
      id: string;
      type: string;
      title: string;
      description: string;
      image?: string;
      url: string;
      metadata?: Record<string, unknown>;
    };

    type MediaWithUrl = { url?: string } | null | undefined;
    type GenericDoc = {
      id: string;
      title?: string;
      name?: string;
      description?: string;
      image?: MediaWithUrl;
      logo?: MediaWithUrl;
      avatar?: MediaWithUrl;
      category?: unknown;
      trl?: unknown;
      price?: unknown;
      owner?: unknown;
      type?: unknown;
      field?: unknown;
      location?: unknown;
      startDate?: unknown;
      endDate?: unknown;
      organizer?: unknown;
      budget?: unknown;
      publishedAt?: unknown;
      author?: unknown;
      featured?: unknown;
      [key: string]: unknown;
    };

    const results: SearchResult[] = [];
    const searchTypes: SearchableCollections[] = ['technologies', 'demand', 'project', 'news', 'events'];

    // Search in each collection
    for (const collectionName of searchTypes) {
      // Map collection names to their singular forms for type comparison
      const singularType = getSingularType(collectionName);
      if (type !== 'all' && type !== singularType) {
        continue;
      }

      try {
        let whereClause: Where = {
          or: [
            { title: { contains: searchQuery } },
            { name: { contains: searchQuery } },
            { description: { contains: searchQuery } },
            { specialization: { contains: searchQuery } }
          ]
        };

        // Collection-specific search fields
        if (collectionName === 'technologies') {
          whereClause = {
            or: [
              { title: { contains: searchQuery } },
              { description: { contains: searchQuery } },
              { category: { contains: searchQuery } }
            ]
          } as Where;
        } else if (collectionName === 'demand') {
          whereClause = {
            or: [
              { title: { contains: searchQuery } },
              { description: { contains: searchQuery } },
              { category: { contains: searchQuery } }
            ]
          } as Where;
        } else if (collectionName === 'project') {
          whereClause = {
            or: [
              { title: { contains: searchQuery } },
              { description: { contains: searchQuery } },
              { type: { contains: searchQuery } },
              { organization: { contains: searchQuery } }
            ]
          } as Where;
        } else if (collectionName === 'news') {
          whereClause = {
            or: [
              { title: { contains: searchQuery } },
              { content: { contains: searchQuery } },
              { category: { contains: searchQuery } }
            ]
          } as Where;
        } else if (collectionName === 'events') {
          whereClause = {
            or: [
              { title: { contains: searchQuery } },
              { description: { contains: searchQuery } },
              { location: { contains: searchQuery } },
              { type: { contains: searchQuery } }
            ]
          } as Where;
        }

        const searchResults = await payload.find({
          collection: collectionName as CollectionSlug,
          where: whereClause,
          limit: limit,
          page: page,
          depth: 1
        });

        // Transform results based on collection type
        const docs = searchResults.docs as unknown as GenericDoc[];
        const transformedResults = docs.map((doc) => {
          const singularType = getSingularType(collectionName);
          const urlPath = getUrlPath(collectionName);
          const getMediaUrl = (m: MediaWithUrl): string | undefined => (m && typeof m === 'object' && 'url' in m && typeof m.url === 'string') ? m.url : undefined;
          const baseResult: SearchResult = {
            id: doc.id,
            type: singularType,
            title: doc.title || doc.name || '',
            description: doc.description || '',
            image: getMediaUrl(doc.image) || getMediaUrl(doc.logo) || getMediaUrl(doc.avatar),
            url: `/${urlPath}/${doc.id}`,
            metadata: {}
          };

          // Add collection-specific metadata
          if (collectionName === 'technologies') {
            baseResult.metadata = {
              category: doc.category,
              trl: doc.trl,
              price: doc.price,
              owner: doc.owner
            };
          } else if (collectionName === 'demand') {
            baseResult.metadata = {
              category: doc.category,
              budget: doc.budget,
              deadline: doc.deadline,
              user: doc.user
            };
          } else if (collectionName === 'project') {
            baseResult.metadata = {
              type: doc.type,
              organization: doc.organization,
              status: doc.status,
              startDate: doc.startDate,
              endDate: doc.endDate,
              budget: doc.budget
            };
          } else if (collectionName === 'news') {
            baseResult.metadata = {
              category: doc.category,
              publishedAt: doc.publishedAt,
              author: doc.author,
              featured: doc.featured
            };
          } else if (collectionName === 'events') {
            baseResult.metadata = {
              type: doc.type,
              location: doc.location,
              startDate: doc.startDate,
              endDate: doc.endDate,
              organizer: doc.organizer
            };
          }

          return baseResult;
        });

        results.push(...transformedResults);
      } catch (_error) {
        console.error(`Error searching ${collectionName}:`, _error);
        // Continue with other collections even if one fails
      }
    }

    // Sort by relevance (simple scoring)
    const sortedResults = results.sort((a, b) => {
      const aScore = calculateRelevanceScore(a, searchQuery);
      const bScore = calculateRelevanceScore(b, searchQuery);
      return bScore - aScore;
    });

    // Get total counts for each type
    const typeCounts: Record<string, number> = {};
    for (const collectionName of searchTypes) {
      try {
        const countResult = await payload.count({
          collection: collectionName as CollectionSlug,
          where: {
            or: [
              { title: { contains: searchQuery } },
              { name: { contains: searchQuery } },
              { description: { contains: searchQuery } }
            ]
          } as Where,
        });
        const singularType = getSingularType(collectionName);
        typeCounts[singularType] = countResult.totalDocs;
      } catch (_error) {
        const singularType = getSingularType(collectionName);
        typeCounts[singularType] = 0;
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        results: sortedResults,
        total: results.length,
        page: page,
        limit: limit,
        totalPages: Math.ceil(results.length / limit),
        query: searchQuery,
        types: typeCounts
      }
    });

  } catch (error) {
    console.error('CMS Search API error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}

function calculateRelevanceScore(result: { title: string; description: string; metadata?: Record<string, unknown> }, query: string): number {
  const queryLower = query.toLowerCase();
  const titleLower = (result.title || '').toLowerCase();
  const descLower = (result.description || '').toLowerCase();
  
  let score = 0;
  
  // Title exact match gets highest score
  if (titleLower.includes(queryLower)) {
    score += 100;
  }
  
  // Description match gets medium score
  if (descLower.includes(queryLower)) {
    score += 50;
  }
  
  // Category/field match gets lower score
  const category = result.metadata?.category;
  const field = result.metadata?.field;
  
  if (category && typeof category === 'string' && category.toLowerCase().includes(queryLower)) {
    score += 25;
  }
  
  if (field && typeof field === 'string' && field.toLowerCase().includes(queryLower)) {
    score += 25;
  }
  
  return score;
}
