import { renderHook, act } from '@testing-library/react'
import { useTechnologiesStore } from '../technologies'
import { mockApiClient, mockTechnologies, mockCategories } from '@/test-utils'

// Mock the API client
jest.mock('@/lib/api', () => ({
  __esModule: true,
  default: mockApiClient,
}))

describe('Technologies Store', () => {
  beforeEach(() => {
    // Reset the store state before each test
    useTechnologiesStore.getState().clearData()
    jest.clearAllMocks()
  })

  it('should have initial state', () => {
    const { result } = renderHook(() => useTechnologiesStore())
    
    expect(result.current.technologies).toEqual([])
    expect(result.current.categories).toEqual([])
    expect(result.current.isLoading).toBe(false)
    expect(result.current.error).toBeNull()
  })

  describe('fetchTechnologies', () => {
    it('should fetch technologies successfully', async () => {
      const { result } = renderHook(() => useTechnologiesStore())
      
      const mockResponse = {
        success: true,
        data: mockTechnologies
      }
      
      mockApiClient.getTechnologies.mockResolvedValue(mockResponse)
      
      await act(async () => {
        await result.current.fetchTechnologies()
      })
      
      expect(result.current.technologies).toEqual(mockTechnologies)
      expect(result.current.isLoading).toBe(false)
      expect(result.current.error).toBeNull()
      expect(mockApiClient.getTechnologies).toHaveBeenCalledWith()
    })

    it('should fetch technologies with parameters', async () => {
      const { result } = renderHook(() => useTechnologiesStore())
      
      const params = {
        limit: 10,
        status: 'ACTIVE',
        category: '1'
      }
      
      const mockResponse = {
        success: true,
        data: mockTechnologies
      }
      
      mockApiClient.getTechnologies.mockResolvedValue(mockResponse)
      
      await act(async () => {
        await result.current.fetchTechnologies(params)
      })
      
      expect(result.current.technologies).toEqual(mockTechnologies)
      expect(mockApiClient.getTechnologies).toHaveBeenCalledWith(params)
    })

    it('should handle fetch technologies error', async () => {
      const { result } = renderHook(() => useTechnologiesStore())
      
      const error = new Error('API Error')
      mockApiClient.getTechnologies.mockRejectedValue(error)
      
      await act(async () => {
        await result.current.fetchTechnologies()
      })
      
      expect(result.current.technologies).toEqual([])
      expect(result.current.isLoading).toBe(false)
      expect(result.current.error).toBe('API Error')
    })

    it('should set loading state during fetch', async () => {
      const { result } = renderHook(() => useTechnologiesStore())
      
      // Mock a delayed response
      let resolvePromise: (value: any) => void
      const promise = new Promise(resolve => {
        resolvePromise = resolve
      })
      mockApiClient.getTechnologies.mockReturnValue(promise)
      
      // Start fetch
      act(() => {
        result.current.fetchTechnologies()
      })
      
      // Check loading state
      expect(result.current.isLoading).toBe(true)
      
      // Resolve the promise
      await act(async () => {
        resolvePromise!({
          success: true,
          data: mockTechnologies
        })
      })
      
      expect(result.current.isLoading).toBe(false)
    })
  })

  describe('fetchCategories', () => {
    it('should fetch categories successfully', async () => {
      const { result } = renderHook(() => useTechnologiesStore())
      
      const mockResponse = {
        success: true,
        data: mockCategories
      }
      
      mockApiClient.getCategories.mockResolvedValue(mockResponse)
      
      await act(async () => {
        await result.current.fetchCategories()
      })
      
      expect(result.current.categories).toEqual(mockCategories)
      expect(result.current.isLoading).toBe(false)
      expect(result.current.error).toBeNull()
      expect(mockApiClient.getCategories).toHaveBeenCalledWith()
    })

    it('should handle fetch categories error', async () => {
      const { result } = renderHook(() => useTechnologiesStore())
      
      const error = new Error('API Error')
      mockApiClient.getCategories.mockRejectedValue(error)
      
      await act(async () => {
        await result.current.fetchCategories()
      })
      
      expect(result.current.categories).toEqual([])
      expect(result.current.isLoading).toBe(false)
      expect(result.current.error).toBe('API Error')
    })
  })

  describe('createTechnology', () => {
    it('should create technology successfully', async () => {
      const { result } = renderHook(() => useTechnologiesStore())
      
      const newTechnology = {
        title: 'New Technology',
        public_summary: 'New technology description',
        category_id: '1',
        trl_level: 5,
        asking_price: 500000,
        currency: 'VND'
      }
      
      const mockResponse = {
        success: true,
        data: { id: '3', ...newTechnology }
      }
      
      mockApiClient.createTechnology.mockResolvedValue(mockResponse)
      
      await act(async () => {
        await result.current.createTechnology(newTechnology)
      })
      
      expect(result.current.technologies).toContainEqual({ id: '3', ...newTechnology })
      expect(result.current.isLoading).toBe(false)
      expect(result.current.error).toBeNull()
      expect(mockApiClient.createTechnology).toHaveBeenCalledWith(newTechnology)
    })

    it('should handle create technology error', async () => {
      const { result } = renderHook(() => useTechnologiesStore())
      
      const newTechnology = {
        title: 'New Technology',
        public_summary: 'New technology description',
        category_id: '1'
      }
      
      const error = new Error('Validation failed')
      mockApiClient.createTechnology.mockRejectedValue(error)
      
      await act(async () => {
        await result.current.createTechnology(newTechnology)
      })
      
      expect(result.current.technologies).toEqual([])
      expect(result.current.isLoading).toBe(false)
      expect(result.current.error).toBe('Validation failed')
    })
  })

  describe('updateTechnology', () => {
    it('should update technology successfully', async () => {
      const { result } = renderHook(() => useTechnologiesStore())
      
      // First set some technologies
      act(() => {
        result.current.setTechnologies(mockTechnologies)
      })
      
      const technologyId = '1'
      const updateData = {
        title: 'Updated Technology',
        asking_price: 1500000
      }
      
      const mockResponse = {
        success: true,
        data: { id: technologyId, ...updateData }
      }
      
      mockApiClient.updateTechnology.mockResolvedValue(mockResponse)
      
      await act(async () => {
        await result.current.updateTechnology(technologyId, updateData)
      })
      
      const updatedTechnology = result.current.technologies.find(t => t.id === technologyId)
      expect(updatedTechnology).toEqual({ id: technologyId, ...updateData })
      expect(result.current.isLoading).toBe(false)
      expect(result.current.error).toBeNull()
      expect(mockApiClient.updateTechnology).toHaveBeenCalledWith(technologyId, updateData)
    })

    it('should handle update technology error', async () => {
      const { result } = renderHook(() => useTechnologiesStore())
      
      const technologyId = '1'
      const updateData = { title: 'Updated Technology' }
      
      const error = new Error('Unauthorized')
      mockApiClient.updateTechnology.mockRejectedValue(error)
      
      await act(async () => {
        await result.current.updateTechnology(technologyId, updateData)
      })
      
      expect(result.current.isLoading).toBe(false)
      expect(result.current.error).toBe('Unauthorized')
    })
  })

  describe('deleteTechnology', () => {
    it('should delete technology successfully', async () => {
      const { result } = renderHook(() => useTechnologiesStore())
      
      // First set some technologies
      act(() => {
        result.current.setTechnologies(mockTechnologies)
      })
      
      const technologyId = '1'
      const mockResponse = {
        success: true,
        data: { success: true }
      }
      
      mockApiClient.deleteTechnology.mockResolvedValue(mockResponse)
      
      await act(async () => {
        await result.current.deleteTechnology(technologyId)
      })
      
      const deletedTechnology = result.current.technologies.find(t => t.id === technologyId)
      expect(deletedTechnology).toBeUndefined()
      expect(result.current.isLoading).toBe(false)
      expect(result.current.error).toBeNull()
      expect(mockApiClient.deleteTechnology).toHaveBeenCalledWith(technologyId)
    })

    it('should handle delete technology error', async () => {
      const { result } = renderHook(() => useTechnologiesStore())
      
      const technologyId = '1'
      const error = new Error('Technology not found')
      mockApiClient.deleteTechnology.mockRejectedValue(error)
      
      await act(async () => {
        await result.current.deleteTechnology(technologyId)
      })
      
      expect(result.current.isLoading).toBe(false)
      expect(result.current.error).toBe('Technology not found')
    })
  })

  describe('utility methods', () => {
    it('should set technologies', () => {
      const { result } = renderHook(() => useTechnologiesStore())
      
      act(() => {
        result.current.setTechnologies(mockTechnologies)
      })
      
      expect(result.current.technologies).toEqual(mockTechnologies)
    })

    it('should set categories', () => {
      const { result } = renderHook(() => useTechnologiesStore())
      
      act(() => {
        result.current.setCategories(mockCategories)
      })
      
      expect(result.current.categories).toEqual(mockCategories)
    })

    it('should clear data', () => {
      const { result } = renderHook(() => useTechnologiesStore())
      
      // First set some data
      act(() => {
        result.current.setTechnologies(mockTechnologies)
        result.current.setCategories(mockCategories)
      })
      
      // Then clear
      act(() => {
        result.current.clearData()
      })
      
      expect(result.current.technologies).toEqual([])
      expect(result.current.categories).toEqual([])
      expect(result.current.error).toBeNull()
    })

    it('should set error', () => {
      const { result } = renderHook(() => useTechnologiesStore())
      
      act(() => {
        result.current.setError('Test error')
      })
      
      expect(result.current.error).toBe('Test error')
    })

    it('should clear error', () => {
      const { result } = renderHook(() => useTechnologiesStore())
      
      // First set error
      act(() => {
        result.current.setError('Test error')
      })
      
      expect(result.current.error).toBe('Test error')
      
      // Then clear error
      act(() => {
        result.current.clearError()
      })
      
      expect(result.current.error).toBeNull()
    })
  })
})
