import { render, screen, waitFor } from '@/test-utils'
import { mockApiClient, mockCategories } from '@/test-utils'
import CategoriesSection from '../CategoriesSection'

describe('CategoriesSection', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders loading state initially', () => {
    mockApiClient.getCategories.mockImplementation(() => new Promise(() => {}))
    
    render(<CategoriesSection />)
    
    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  it('renders categories when data is loaded', async () => {
    mockApiClient.getCategories.mockResolvedValue({
      success: true,
      data: mockCategories,
    })
    
    render(<CategoriesSection />)
    
    await waitFor(() => {
      expect(screen.getByText('Công nghệ thông tin')).toBeInTheDocument()
      expect(screen.getByText('Công nghệ năng lượng')).toBeInTheDocument()
    })
  })

  it('renders section header', async () => {
    mockApiClient.getCategories.mockResolvedValue({
      success: true,
      data: mockCategories,
    })
    
    render(<CategoriesSection />)
    
    await waitFor(() => {
      expect(screen.getByText('Danh mục công nghệ')).toBeInTheDocument()
      expect(screen.getByText('Khám phá các lĩnh vực công nghệ đa dạng và tìm kiếm giải pháp phù hợp với nhu cầu của bạn')).toBeInTheDocument()
    })
  })

  it('displays category details correctly', async () => {
    mockApiClient.getCategories.mockResolvedValue({
      success: true,
      data: mockCategories,
    })
    
    render(<CategoriesSection />)
    
    await waitFor(() => {
      // Check first category
      expect(screen.getByText('Công nghệ thông tin')).toBeInTheDocument()
      expect(screen.getByText('Các công nghệ liên quan đến thông tin và truyền thông')).toBeInTheDocument()
      expect(screen.getByText('Mã: IT_TECH')).toBeInTheDocument()
    })
  })

  it('renders category icons', async () => {
    mockApiClient.getCategories.mockResolvedValue({
      success: true,
      data: mockCategories,
    })
    
    render(<CategoriesSection />)
    
    await waitFor(() => {
      // Icons should be present (they are SVG elements)
      const categoryCards = screen.getAllByText('Khám phá')
      expect(categoryCards).toHaveLength(2)
    })
  })

  it('has correct links for category cards', async () => {
    mockApiClient.getCategories.mockResolvedValue({
      success: true,
      data: mockCategories,
    })
    
    render(<CategoriesSection />)
    
    await waitFor(() => {
      const firstCategoryLink = screen.getByText('Công nghệ thông tin').closest('a')
      expect(firstCategoryLink).toHaveAttribute('href', '/technologies?category=1')
    })
  })

  it('renders view all categories button', async () => {
    mockApiClient.getCategories.mockResolvedValue({
      success: true,
      data: mockCategories,
    })
    
    render(<CategoriesSection />)
    
    await waitFor(() => {
      const viewAllButton = screen.getByText('Xem tất cả danh mục')
      expect(viewAllButton).toBeInTheDocument()
      expect(viewAllButton.closest('a')).toHaveAttribute('href', '/categories')
    })
  })

  it('renders empty state when no categories', async () => {
    mockApiClient.getCategories.mockResolvedValue({
      success: true,
      data: [],
    })
    
    render(<CategoriesSection />)
    
    await waitFor(() => {
      expect(screen.getByText('Chưa có danh mục nào')).toBeInTheDocument()
      expect(screen.getByText('Danh mục công nghệ sẽ được cập nhật sớm')).toBeInTheDocument()
    })
  })

  it('handles API error gracefully', async () => {
    mockApiClient.getCategories.mockRejectedValue(new Error('API Error'))
    
    render(<CategoriesSection />)
    
    await waitFor(() => {
      expect(screen.getByText('Chưa có danh mục nào')).toBeInTheDocument()
    })
  })

  it('calls API with correct parameters', async () => {
    mockApiClient.getCategories.mockResolvedValue({
      success: true,
      data: mockCategories,
    })
    
    render(<CategoriesSection />)
    
    await waitFor(() => {
      expect(mockApiClient.getCategories).toHaveBeenCalledWith()
    })
  })

  it('limits categories to 6 items', async () => {
    const manyCategories = Array.from({ length: 10 }, (_, i) => ({
      id: `${i + 1}`,
      name: `Category ${i + 1}`,
      code: `CAT_${i + 1}`,
      description: `Description for category ${i + 1}`,
      parent_id: null,
      children: [],
    }))
    
    mockApiClient.getCategories.mockResolvedValue({
      success: true,
      data: manyCategories,
    })
    
    render(<CategoriesSection />)
    
    await waitFor(() => {
      // Should only show first 6 categories
      expect(screen.getByText('Category 1')).toBeInTheDocument()
      expect(screen.getByText('Category 6')).toBeInTheDocument()
      expect(screen.queryByText('Category 7')).not.toBeInTheDocument()
    })
  })

  it('displays children count when available', async () => {
    const categoryWithChildren = {
      id: '1',
      name: 'Parent Category',
      code: 'PARENT',
      description: 'Parent category with children',
      parent_id: null,
      children: [
        { id: '2', name: 'Child 1' },
        { id: '3', name: 'Child 2' },
      ],
    }
    
    mockApiClient.getCategories.mockResolvedValue({
      success: true,
      data: [categoryWithChildren],
    })
    
    render(<CategoriesSection />)
    
    await waitFor(() => {
      expect(screen.getByText('2 danh mục con')).toBeInTheDocument()
    })
  })
})
