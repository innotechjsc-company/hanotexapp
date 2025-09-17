import React, { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Mock API client
export const mockApiClient = {
  getTechnologies: jest.fn(),
  getCategories: jest.fn(),
  getUsers: jest.fn(),
  login: jest.fn(),
  register: jest.fn(),
  getTechnologyById: jest.fn(),
  createTechnology: jest.fn(),
  updateTechnology: jest.fn(),
  deleteTechnology: jest.fn(),
}

// Mock Zustand stores
jest.mock('@/store/auth', () => ({
  useAuthStore: () => ({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    login: jest.fn(),
    logout: jest.fn(),
    register: jest.fn(),
  }),
}))

jest.mock('@/store/technologies', () => ({
  useTechnologiesStore: () => ({
    technologies: [],
    categories: [],
    isLoading: false,
    error: null,
    fetchTechnologies: jest.fn(),
    fetchCategories: jest.fn(),
    createTechnology: jest.fn(),
    updateTechnology: jest.fn(),
    deleteTechnology: jest.fn(),
  }),
}))

// Create a custom render function that includes providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options })

// Mock data
export const mockTechnologies = [
  {
    id: '1',
    title: 'AI Machine Learning Platform',
    public_summary: 'Advanced AI platform for machine learning applications',
    status: 'ACTIVE',
    trl_level: 7,
    asking_price: 1000000,
    currency: 'VND',
    category_name: 'Công nghệ thông tin',
    submitter_type: 'COMPANY',
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z',
  },
  {
    id: '2',
    title: 'Green Energy Solution',
    public_summary: 'Sustainable energy solution for industrial applications',
    status: 'ACTIVE',
    trl_level: 5,
    asking_price: 2000000,
    currency: 'VND',
    category_name: 'Công nghệ năng lượng',
    submitter_type: 'RESEARCH_INSTITUTION',
    created_at: '2024-01-14T10:00:00Z',
    updated_at: '2024-01-14T10:00:00Z',
  },
]

export const mockCategories = [
  {
    id: '1',
    name: 'Công nghệ thông tin',
    code: 'IT_TECH',
    description: 'Các công nghệ liên quan đến thông tin và truyền thông',
    parent_id: null,
    children: [],
  },
  {
    id: '2',
    name: 'Công nghệ năng lượng',
    code: 'ENERGY_TECH',
    description: 'Các công nghệ liên quan đến năng lượng và môi trường',
    parent_id: null,
    children: [],
  },
]

export const mockUser = {
  id: '1',
  email: 'test@example.com',
  name: 'Test User',
  user_type: 'INDIVIDUAL',
  role: 'USER',
  is_active: true,
  created_at: '2024-01-01T10:00:00Z',
  updated_at: '2024-01-01T10:00:00Z',
}

// Helper functions
export const createMockApiResponse = (data: any, success = true) => ({
  success,
  data,
  message: success ? 'Success' : 'Error',
})

export const waitForLoadingToFinish = () => {
  return new Promise(resolve => setTimeout(resolve, 100))
}

// Re-export everything
export * from '@testing-library/react'
export { customRender as render }
export { mockApiClient }
