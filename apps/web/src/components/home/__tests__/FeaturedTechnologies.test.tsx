import { render, screen, waitFor } from '@/test-utils'
import { mockApiClient, mockTechnologies } from '@/test-utils'
import FeaturedTechnologies from '../FeaturedTechnologies'

describe('FeaturedTechnologies', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders loading state initially', () => {
    mockApiClient.getTechnologies.mockImplementation(() => new Promise(() => {}))
    
    render(<FeaturedTechnologies />)
    
    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  it('renders technologies when data is loaded', async () => {
    mockApiClient.getTechnologies.mockResolvedValue({
      success: true,
      data: mockTechnologies,
    })
    
    render(<FeaturedTechnologies />)
    
    await waitFor(() => {
      expect(screen.getByText('AI Machine Learning Platform')).toBeInTheDocument()
      expect(screen.getByText('Green Energy Solution')).toBeInTheDocument()
    })
  })

  it('renders section header', async () => {
    mockApiClient.getTechnologies.mockResolvedValue({
      success: true,
      data: mockTechnologies,
    })
    
    render(<FeaturedTechnologies />)
    
    await waitFor(() => {
      expect(screen.getByText('Công nghệ nổi bật')).toBeInTheDocument()
      expect(screen.getByText('Khám phá những công nghệ mới nhất và tiên tiến nhất được đăng tải trên sàn giao dịch')).toBeInTheDocument()
    })
  })

  it('displays technology details correctly', async () => {
    mockApiClient.getTechnologies.mockResolvedValue({
      success: true,
      data: mockTechnologies,
    })
    
    render(<FeaturedTechnologies />)
    
    await waitFor(() => {
      // Check first technology
      expect(screen.getByText('AI Machine Learning Platform')).toBeInTheDocument()
      expect(screen.getByText('Advanced AI platform for machine learning applications')).toBeInTheDocument()
      expect(screen.getByText('Danh mục: Công nghệ thông tin')).toBeInTheDocument()
      expect(screen.getByText('1,000,000 VND')).toBeInTheDocument()
      expect(screen.getByText('TRL 7')).toBeInTheDocument()
    })
  })

  it('renders status badges', async () => {
    mockApiClient.getTechnologies.mockResolvedValue({
      success: true,
      data: mockTechnologies,
    })
    
    render(<FeaturedTechnologies />)
    
    await waitFor(() => {
      const statusBadges = screen.getAllByText('Hoạt động')
      expect(statusBadges).toHaveLength(2)
    })
  })

  it('renders view details buttons', async () => {
    mockApiClient.getTechnologies.mockResolvedValue({
      success: true,
      data: mockTechnologies,
    })
    
    render(<FeaturedTechnologies />)
    
    await waitFor(() => {
      const viewButtons = screen.getAllByText('Xem chi tiết')
      expect(viewButtons).toHaveLength(2)
    })
  })

  it('has correct links for view details buttons', async () => {
    mockApiClient.getTechnologies.mockResolvedValue({
      success: true,
      data: mockTechnologies,
    })
    
    render(<FeaturedTechnologies />)
    
    await waitFor(() => {
      const firstButton = screen.getAllByText('Xem chi tiết')[0]
      expect(firstButton.closest('a')).toHaveAttribute('href', '/technologies/1')
    })
  })

  it('renders view all technologies button', async () => {
    mockApiClient.getTechnologies.mockResolvedValue({
      success: true,
      data: mockTechnologies,
    })
    
    render(<FeaturedTechnologies />)
    
    await waitFor(() => {
      const viewAllButton = screen.getByText('Xem tất cả công nghệ')
      expect(viewAllButton).toBeInTheDocument()
      expect(viewAllButton.closest('a')).toHaveAttribute('href', '/technologies')
    })
  })

  it('renders empty state when no technologies', async () => {
    mockApiClient.getTechnologies.mockResolvedValue({
      success: true,
      data: [],
    })
    
    render(<FeaturedTechnologies />)
    
    await waitFor(() => {
      expect(screen.getByText('Chưa có công nghệ nào')).toBeInTheDocument()
      expect(screen.getByText('Hãy là người đầu tiên đăng tải công nghệ lên sàn giao dịch')).toBeInTheDocument()
    })
  })

  it('handles API error gracefully', async () => {
    mockApiClient.getTechnologies.mockRejectedValue(new Error('API Error'))
    
    render(<FeaturedTechnologies />)
    
    await waitFor(() => {
      expect(screen.getByText('Chưa có công nghệ nào')).toBeInTheDocument()
    })
  })

  it('calls API with correct parameters', async () => {
    mockApiClient.getTechnologies.mockResolvedValue({
      success: true,
      data: mockTechnologies,
    })
    
    render(<FeaturedTechnologies />)
    
    await waitFor(() => {
      expect(mockApiClient.getTechnologies).toHaveBeenCalledWith({
        limit: 6,
        status: 'ACTIVE',
        sort: 'created_at',
        order: 'DESC'
      })
    })
  })

  it('displays user type labels correctly', async () => {
    mockApiClient.getTechnologies.mockResolvedValue({
      success: true,
      data: mockTechnologies,
    })
    
    render(<FeaturedTechnologies />)
    
    await waitFor(() => {
      expect(screen.getByText('Doanh nghiệp')).toBeInTheDocument()
      expect(screen.getByText('Viện/Trường')).toBeInTheDocument()
    })
  })
})
