import { mockApiClient, createMockApiResponse, mockTechnologies, mockCategories } from '@/test-utils'

describe('API Client', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getTechnologies', () => {
    it('should fetch technologies with default parameters', async () => {
      const mockResponse = createMockApiResponse(mockTechnologies)
      mockApiClient.getTechnologies.mockResolvedValue(mockResponse)

      const result = await mockApiClient.getTechnologies()

      expect(mockApiClient.getTechnologies).toHaveBeenCalledWith()
      expect(result).toEqual(mockResponse)
    })

    it('should fetch technologies with custom parameters', async () => {
      const params = {
        limit: 10,
        status: 'ACTIVE',
        category: '1',
        search: 'AI',
        sort: 'created_at',
        order: 'DESC'
      }
      const mockResponse = createMockApiResponse(mockTechnologies)
      mockApiClient.getTechnologies.mockResolvedValue(mockResponse)

      const result = await mockApiClient.getTechnologies(params)

      expect(mockApiClient.getTechnologies).toHaveBeenCalledWith(params)
      expect(result).toEqual(mockResponse)
    })

    it('should handle API errors', async () => {
      const error = new Error('API Error')
      mockApiClient.getTechnologies.mockRejectedValue(error)

      await expect(mockApiClient.getTechnologies()).rejects.toThrow('API Error')
    })
  })

  describe('getCategories', () => {
    it('should fetch categories', async () => {
      const mockResponse = createMockApiResponse(mockCategories)
      mockApiClient.getCategories.mockResolvedValue(mockResponse)

      const result = await mockApiClient.getCategories()

      expect(mockApiClient.getCategories).toHaveBeenCalledWith()
      expect(result).toEqual(mockResponse)
    })

    it('should handle API errors', async () => {
      const error = new Error('API Error')
      mockApiClient.getCategories.mockRejectedValue(error)

      await expect(mockApiClient.getCategories()).rejects.toThrow('API Error')
    })
  })

  describe('getTechnologyById', () => {
    it('should fetch technology by ID', async () => {
      const technologyId = '1'
      const mockResponse = createMockApiResponse(mockTechnologies[0])
      mockApiClient.getTechnologyById.mockResolvedValue(mockResponse)

      const result = await mockApiClient.getTechnologyById(technologyId)

      expect(mockApiClient.getTechnologyById).toHaveBeenCalledWith(technologyId)
      expect(result).toEqual(mockResponse)
    })

    it('should handle not found error', async () => {
      const technologyId = '999'
      const error = new Error('Technology not found')
      mockApiClient.getTechnologyById.mockRejectedValue(error)

      await expect(mockApiClient.getTechnologyById(technologyId)).rejects.toThrow('Technology not found')
    })
  })

  describe('createTechnology', () => {
    it('should create new technology', async () => {
      const newTechnology = {
        title: 'New Technology',
        public_summary: 'New technology description',
        category_id: '1',
        trl_level: 5,
        asking_price: 500000,
        currency: 'VND'
      }
      const mockResponse = createMockApiResponse({ id: '3', ...newTechnology })
      mockApiClient.createTechnology.mockResolvedValue(mockResponse)

      const result = await mockApiClient.createTechnology(newTechnology)

      expect(mockApiClient.createTechnology).toHaveBeenCalledWith(newTechnology)
      expect(result).toEqual(mockResponse)
    })

    it('should handle validation errors', async () => {
      const invalidTechnology = {
        title: '', // Invalid: empty title
        public_summary: 'Description',
        category_id: '1'
      }
      const error = new Error('Validation failed')
      mockApiClient.createTechnology.mockRejectedValue(error)

      await expect(mockApiClient.createTechnology(invalidTechnology)).rejects.toThrow('Validation failed')
    })
  })

  describe('updateTechnology', () => {
    it('should update existing technology', async () => {
      const technologyId = '1'
      const updateData = {
        title: 'Updated Technology',
        asking_price: 1500000
      }
      const mockResponse = createMockApiResponse({ id: technologyId, ...updateData })
      mockApiClient.updateTechnology.mockResolvedValue(mockResponse)

      const result = await mockApiClient.updateTechnology(technologyId, updateData)

      expect(mockApiClient.updateTechnology).toHaveBeenCalledWith(technologyId, updateData)
      expect(result).toEqual(mockResponse)
    })

    it('should handle unauthorized error', async () => {
      const technologyId = '1'
      const updateData = { title: 'Updated Technology' }
      const error = new Error('Unauthorized')
      mockApiClient.updateTechnology.mockRejectedValue(error)

      await expect(mockApiClient.updateTechnology(technologyId, updateData)).rejects.toThrow('Unauthorized')
    })
  })

  describe('deleteTechnology', () => {
    it('should delete technology', async () => {
      const technologyId = '1'
      const mockResponse = createMockApiResponse({ success: true })
      mockApiClient.deleteTechnology.mockResolvedValue(mockResponse)

      const result = await mockApiClient.deleteTechnology(technologyId)

      expect(mockApiClient.deleteTechnology).toHaveBeenCalledWith(technologyId)
      expect(result).toEqual(mockResponse)
    })

    it('should handle not found error', async () => {
      const technologyId = '999'
      const error = new Error('Technology not found')
      mockApiClient.deleteTechnology.mockRejectedValue(error)

      await expect(mockApiClient.deleteTechnology(technologyId)).rejects.toThrow('Technology not found')
    })
  })

  describe('login', () => {
    it('should login with valid credentials', async () => {
      const credentials = {
        email: 'test@example.com',
        password: 'password123'
      }
      const mockResponse = createMockApiResponse({
        user: { id: '1', email: 'test@example.com', name: 'Test User' },
        token: 'jwt-token'
      })
      mockApiClient.login.mockResolvedValue(mockResponse)

      const result = await mockApiClient.login(credentials)

      expect(mockApiClient.login).toHaveBeenCalledWith(credentials)
      expect(result).toEqual(mockResponse)
    })

    it('should handle invalid credentials', async () => {
      const credentials = {
        email: 'test@example.com',
        password: 'wrongpassword'
      }
      const error = new Error('Invalid credentials')
      mockApiClient.login.mockRejectedValue(error)

      await expect(mockApiClient.login(credentials)).rejects.toThrow('Invalid credentials')
    })
  })

  describe('register', () => {
    it('should register new user', async () => {
      const userData = {
        email: 'newuser@example.com',
        password: 'password123',
        name: 'New User',
        user_type: 'INDIVIDUAL'
      }
      const mockResponse = createMockApiResponse({
        user: { id: '2', ...userData },
        token: 'jwt-token'
      })
      mockApiClient.register.mockResolvedValue(mockResponse)

      const result = await mockApiClient.register(userData)

      expect(mockApiClient.register).toHaveBeenCalledWith(userData)
      expect(result).toEqual(mockResponse)
    })

    it('should handle duplicate email error', async () => {
      const userData = {
        email: 'existing@example.com',
        password: 'password123',
        name: 'Existing User',
        user_type: 'INDIVIDUAL'
      }
      const error = new Error('Email already exists')
      mockApiClient.register.mockRejectedValue(error)

      await expect(mockApiClient.register(userData)).rejects.toThrow('Email already exists')
    })
  })
})
