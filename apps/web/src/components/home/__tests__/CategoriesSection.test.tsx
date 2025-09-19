import { render, screen } from '@testing-library/react'
import CategoriesSection from '../CategoriesSection'

// Mock the categories data
const mockCategories = [
  {
    id: '1',
    name: 'Điện – Điện tử – CNTT',
    code_vn: 'CNTT001',
    code_intl: 'ICT001'
  },
  {
    id: '2', 
    name: 'Vật liệu & Công nghệ vật liệu',
    code_vn: 'VTL001',
    code_intl: 'MAT001'
  }
]

// Mock the hook
jest.mock('@/hooks/useCategories', () => ({
  useCategories: () => ({
    categories: mockCategories,
    loading: false,
    error: null
  })
}))

describe('CategoriesSection', () => {
  it('renders without crashing', () => {
    render(<CategoriesSection />)
    expect(screen.getByText('Danh mục lĩnh vực')).toBeInTheDocument()
  })

  it('renders categories', () => {
    render(<CategoriesSection />)
    
    expect(screen.getByText('Điện – Điện tử – CNTT')).toBeInTheDocument()
    expect(screen.getByText('Vật liệu & Công nghệ vật liệu')).toBeInTheDocument()
  })

  it('shows loading state', () => {
    // Mock loading state
    jest.doMock('@/hooks/useCategories', () => ({
      useCategories: () => ({
        categories: [],
        loading: true,
        error: null
      })
    }))

    render(<CategoriesSection />)
    expect(screen.getByText('Đang tải...')).toBeInTheDocument()
  })
})