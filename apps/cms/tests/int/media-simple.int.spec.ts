import { getPayload, Payload } from 'payload'
import config from '@/payload.config'
import { describe, it, beforeAll, expect } from 'vitest'

let payload: Payload

/**
 * Media Collection API Tests
 * 
 * Note: These tests focus on read operations and queries since file uploads
 * require actual file system operations and multipart form data which is complex
 * to mock in integration tests.
 * 
 * For comprehensive file upload testing, consider:
 * 1. E2E tests using Playwright
 * 2. Manual testing through the admin UI
 * 3. API endpoint testing with real file uploads
 */
describe('Media Collection API - Read Operations', () => {
  beforeAll(async () => {
    const payloadConfig = await config
    payload = await getPayload({ config: payloadConfig })
  })

  describe('Query Operations', () => {
    it('should fetch all media files', async () => {
      const results = await payload.find({
        collection: 'media',
      })

      expect(results).toBeDefined()
      expect(results.docs).toBeDefined()
      expect(Array.isArray(results.docs)).toBe(true)
      expect(results.totalDocs).toBeDefined()
      expect(typeof results.totalDocs).toBe('number')
    })

    it('should paginate media results correctly', async () => {
      const page1 = await payload.find({
        collection: 'media',
        limit: 5,
        page: 1,
      })

      expect(page1).toBeDefined()
      expect(page1.docs).toBeDefined()
      expect(page1.limit).toBe(5)
      expect(page1.page).toBe(1)
      expect(page1.totalPages).toBeDefined()
      expect(page1.hasNextPage).toBeDefined()
      expect(page1.hasPrevPage).toBe(false)
    })

    it('should filter media by type', async () => {
      const imageMedia = await payload.find({
        collection: 'media',
        where: {
          type: {
            equals: 'image',
          },
        },
      })

      expect(imageMedia).toBeDefined()
      expect(imageMedia.docs).toBeDefined()
      // If there are results, verify they are all images
      if (imageMedia.docs.length > 0) {
        imageMedia.docs.forEach((media) => {
          expect(media.type).toBe('image')
        })
      }
    })

    it('should search media by alt text', async () => {
      const allMedia = await payload.find({
        collection: 'media',
        limit: 1,
      })

      // If there's at least one media item, test search
      if (allMedia.docs.length > 0) {
        const firstMedia = allMedia.docs[0]
        const searchTerm = firstMedia.alt?.substring(0, 5) || ''

        if (searchTerm) {
          const searchResults = await payload.find({
            collection: 'media',
            where: {
              alt: {
                contains: searchTerm,
              },
            },
          })

          expect(searchResults).toBeDefined()
          expect(searchResults.docs).toBeDefined()
          expect(searchResults.docs.length).toBeGreaterThanOrEqual(1)
        }
      }
    })

    it('should sort media by createdAt descending', async () => {
      const results = await payload.find({
        collection: 'media',
        sort: '-createdAt',
        limit: 10,
      })

      expect(results).toBeDefined()
      expect(results.docs).toBeDefined()

      // Verify sorting if there are multiple results
      if (results.docs.length > 1) {
        for (let i = 0; i < results.docs.length - 1; i++) {
          const currentDate = new Date(results.docs[i].createdAt).getTime()
          const nextDate = new Date(results.docs[i + 1].createdAt).getTime()
          expect(currentDate).toBeGreaterThanOrEqual(nextDate)
        }
      }
    })

    it('should sort media by createdAt ascending', async () => {
      const results = await payload.find({
        collection: 'media',
        sort: 'createdAt',
        limit: 10,
      })

      expect(results).toBeDefined()
      expect(results.docs).toBeDefined()

      // Verify sorting if there are multiple results
      if (results.docs.length > 1) {
        for (let i = 0; i < results.docs.length - 1; i++) {
          const currentDate = new Date(results.docs[i].createdAt).getTime()
          const nextDate = new Date(results.docs[i + 1].createdAt).getTime()
          expect(currentDate).toBeLessThanOrEqual(nextDate)
        }
      }
    })

    it('should filter media by multiple types using OR condition', async () => {
      const results = await payload.find({
        collection: 'media',
        where: {
          or: [
            {
              type: {
                equals: 'image',
              },
            },
            {
              type: {
                equals: 'video',
              },
            },
          ],
        },
      })

      expect(results).toBeDefined()
      expect(results.docs).toBeDefined()

      // Verify all results are either image or video
      if (results.docs.length > 0) {
        results.docs.forEach((media) => {
          expect(['image', 'video']).toContain(media.type)
        })
      }
    })
  })

  describe('Individual Media Operations', () => {
    it('should fetch a specific media by ID if media exists', async () => {
      const allMedia = await payload.find({
        collection: 'media',
        limit: 1,
      })

      // Only test if there's at least one media item
      if (allMedia.docs.length > 0) {
        const mediaId = allMedia.docs[0].id

        const media = await payload.findByID({
          collection: 'media',
          id: mediaId,
        })

        expect(media).toBeDefined()
        expect(media.id).toBe(mediaId)
        expect(media.alt).toBeDefined()
        expect(media.type).toBeDefined()
        expect(['image', 'video', 'document', 'other']).toContain(media.type)
        expect(media.createdAt).toBeDefined()
        expect(media.updatedAt).toBeDefined()
      }
    })

    it('should throw error when fetching non-existent media', async () => {
      const fakeId = '000000000000000000000000' // MongoDB ObjectId format

      await expect(
        payload.findByID({
          collection: 'media',
          id: fakeId,
        }),
      ).rejects.toThrow()
    })
  })

  describe('Schema Validation', () => {
    it('should have required fields in media documents', async () => {
      const results = await payload.find({
        collection: 'media',
        limit: 1,
      })

      if (results.docs.length > 0) {
        const media = results.docs[0]

        // Check required fields
        expect(media.id).toBeDefined()
        expect(media.alt).toBeDefined()
        expect(typeof media.alt).toBe('string')
        
        // Check type field
        expect(media.type).toBeDefined()
        expect(['image', 'video', 'document', 'other']).toContain(media.type)

        // Check timestamps
        expect(media.createdAt).toBeDefined()
        expect(media.updatedAt).toBeDefined()
        expect(new Date(media.createdAt)).toBeInstanceOf(Date)
        expect(new Date(media.updatedAt)).toBeInstanceOf(Date)
      }
    })

    it('should have correct type values', async () => {
      const results = await payload.find({
        collection: 'media',
        limit: 100, // Get a good sample
      })

      if (results.docs.length > 0) {
        const validTypes = ['image', 'video', 'document', 'other']
        
        results.docs.forEach((media) => {
          expect(validTypes).toContain(media.type)
        })
      }
    })
  })

  describe('Access Control', () => {
    it('should allow read access to media collection', async () => {
      // This test verifies that read access is granted
      const results = await payload.find({
        collection: 'media',
      })

      expect(results).toBeDefined()
      expect(results.docs).toBeDefined()
      // No error should be thrown, meaning access is allowed
    })

    it('should allow querying with filters', async () => {
      // Test that filtering doesn't cause access issues
      const results = await payload.find({
        collection: 'media',
        where: {
          type: {
            in: ['image', 'video'],
          },
        },
      })

      expect(results).toBeDefined()
      expect(results.docs).toBeDefined()
    })
  })

  describe('Count Operations', () => {
    it('should count total media documents', async () => {
      const results = await payload.find({
        collection: 'media',
        limit: 0, // Don't fetch docs, just count
      })

      expect(results).toBeDefined()
      expect(results.totalDocs).toBeDefined()
      expect(typeof results.totalDocs).toBe('number')
      expect(results.totalDocs).toBeGreaterThanOrEqual(0)
    })

    it('should count media by type', async () => {
      const types = ['image', 'video', 'document', 'other']
      
      for (const type of types) {
        const results = await payload.find({
          collection: 'media',
          where: {
            type: {
              equals: type,
            },
          },
          limit: 0,
        })

        expect(results).toBeDefined()
        expect(results.totalDocs).toBeDefined()
        expect(typeof results.totalDocs).toBe('number')
        expect(results.totalDocs).toBeGreaterThanOrEqual(0)
      }
    })
  })

  describe('Complex Queries', () => {
    it('should handle complex AND conditions', async () => {
      const results = await payload.find({
        collection: 'media',
        where: {
          and: [
            {
              type: {
                equals: 'image',
              },
            },
            {
              alt: {
                exists: true,
              },
            },
          ],
        },
      })

      expect(results).toBeDefined()
      expect(results.docs).toBeDefined()

      // Verify all results meet both conditions
      results.docs.forEach((media) => {
        expect(media.type).toBe('image')
        expect(media.alt).toBeDefined()
      })
    })

    it('should handle date range queries', async () => {
      const now = new Date()
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

      const results = await payload.find({
        collection: 'media',
        where: {
          createdAt: {
            greater_than_equal: oneWeekAgo.toISOString(),
          },
        },
      })

      expect(results).toBeDefined()
      expect(results.docs).toBeDefined()

      // Verify all results are within the date range
      results.docs.forEach((media) => {
        const createdAt = new Date(media.createdAt)
        expect(createdAt.getTime()).toBeGreaterThanOrEqual(oneWeekAgo.getTime())
      })
    })

    it('should support text search across fields', async () => {
      // Get a sample media to search for
      const sample = await payload.find({
        collection: 'media',
        limit: 1,
      })

      if (sample.docs.length > 0 && sample.docs[0].alt) {
        const searchTerm = sample.docs[0].alt.split(' ')[0] // Get first word

        if (searchTerm && searchTerm.length > 2) {
          const results = await payload.find({
            collection: 'media',
            where: {
              or: [
                {
                  alt: {
                    contains: searchTerm,
                  },
                },
                {
                  caption: {
                    contains: searchTerm,
                  },
                },
              ],
            },
          })

          expect(results).toBeDefined()
          expect(results.docs).toBeDefined()
          expect(results.docs.length).toBeGreaterThanOrEqual(1)
        }
      }
    })
  })
})
