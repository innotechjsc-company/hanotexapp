import { NextRequest, NextResponse } from 'next/server';
import { getPayload } from 'payload';
import config from '@payload-config';

type SearchableCollections = 'technologies' | 'demand' | 'organizations' | 'experts' | 'funds' | 'project' | 'news' | 'events';

// Helper function to convert collection names to singular types
function getSingularType(collectionName: SearchableCollections): string {
  const mapping: { [key in SearchableCollections]: string } = {
    'technologies': 'technology',
    'demand': 'demand',
    'organizations': 'organization', 
    'experts': 'expert',
    'funds': 'fund',
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
    'organizations': 'organizations', 
    'experts': 'experts',
    'funds': 'funds',
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
    const results: any[] = [];
    const searchTypes: SearchableCollections[] = ['technologies', 'demand', 'organizations', 'experts', 'funds', 'project', 'news', 'events'];

    // Search in each collection
    for (const collectionName of searchTypes) {
      // Map collection names to their singular forms for type comparison
      const singularType = getSingularType(collectionName);
      if (type !== 'all' && type !== singularType) {
        continue;
      }

      try {
        let whereClause: any = {
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
          };
        } else if (collectionName === 'demand') {
          whereClause = {
            or: [
              { title: { contains: searchQuery } },
              { description: { contains: searchQuery } },
              { category: { contains: searchQuery } }
            ]
          };
        } else if (collectionName === 'organizations') {
          whereClause = {
            or: [
              { name: { contains: searchQuery } },
              { description: { contains: searchQuery } },
              { 'location.city': { contains: searchQuery } }
            ]
          };
        } else if (collectionName === 'experts') {
          whereClause = {
            or: [
              { name: { contains: searchQuery } },
              { specialization: { contains: searchQuery } },
              { field: { contains: searchQuery } }
            ]
          };
        } else if (collectionName === 'funds') {
          whereClause = {
            or: [
              { name: { contains: searchQuery } },
              { description: { contains: searchQuery } },
              { type: { contains: searchQuery } }
            ]
          };
        } else if (collectionName === 'project') {
          whereClause = {
            or: [
              { title: { contains: searchQuery } },
              { description: { contains: searchQuery } },
              { type: { contains: searchQuery } },
              { organization: { contains: searchQuery } }
            ]
          };
        } else if (collectionName === 'news') {
          whereClause = {
            or: [
              { title: { contains: searchQuery } },
              { content: { contains: searchQuery } },
              { category: { contains: searchQuery } }
            ]
          };
        } else if (collectionName === 'events') {
          whereClause = {
            or: [
              { title: { contains: searchQuery } },
              { description: { contains: searchQuery } },
              { location: { contains: searchQuery } },
              { type: { contains: searchQuery } }
            ]
          };
        }

        const searchResults = await payload.find({
          collection: collectionName,
          where: whereClause,
          limit: limit,
          page: page,
          depth: 1
        });

        // Transform results based on collection type
        const transformedResults = searchResults.docs.map((doc: any) => {
          const singularType = getSingularType(collectionName);
          const urlPath = getUrlPath(collectionName);
          const baseResult = {
            id: doc.id,
            type: singularType,
            title: doc.title || doc.name,
            description: doc.description || '',
            image: doc.image?.url || doc.logo?.url || doc.avatar?.url,
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
          } else if (collectionName === 'organizations') {
            baseResult.metadata = {
              type: doc.type,
              website: doc.website,
              location: doc.location?.city,
              size: doc.size
            };
          } else if (collectionName === 'experts') {
            baseResult.metadata = {
              field: doc.field,
              experience: doc.experience,
              organization: doc.organization,
              availability: doc.availability
            };
          } else if (collectionName === 'funds') {
            baseResult.metadata = {
              type: doc.type,
              size: doc.size,
              focus: doc.focus,
              status: doc.status
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
      } catch (error) {
        console.error(`Error searching ${collectionName}:`, error);
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
    const typeCounts: any = {};
    for (const collectionName of searchTypes) {
      try {
        const countResult = await payload.count({
          collection: collectionName,
          where: {
            or: [
              { title: { contains: searchQuery } },
              { name: { contains: searchQuery } },
              { description: { contains: searchQuery } }
            ]
          }
        });
        const singularType = getSingularType(collectionName);
        typeCounts[singularType] = countResult.totalDocs;
      } catch (error) {
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

function calculateRelevanceScore(result: any, query: string): number {
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
