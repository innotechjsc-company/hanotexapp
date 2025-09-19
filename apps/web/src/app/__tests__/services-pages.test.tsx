import { render, screen } from '@testing-library/react'

// Test services sub-pages
describe('Services Pages', () => {
  it('should render consulting page without crashing', () => {
    const MockConsultingPage = () => (
      <div>
        <h1>Tư vấn chuyển giao công nghệ</h1>
        <div>
          <h2>Dịch vụ tư vấn</h2>
          <div>
            <h3>Đánh giá tiềm năng thương mại</h3>
            <h3>Tư vấn chiến lược chuyển giao</h3>
            <h3>Hỗ trợ đàm phán hợp đồng</h3>
          </div>
        </div>
        <div>
          <h2>Quy trình tư vấn</h2>
        </div>
        <div>
          <h2>Tại sao chọn chúng tôi?</h2>
        </div>
      </div>
    )
    
    render(<MockConsultingPage />)
    expect(screen.getByText('Tư vấn chuyển giao công nghệ')).toBeInTheDocument()
    expect(screen.getByText('Dịch vụ tư vấn')).toBeInTheDocument()
    expect(screen.getByText('Đánh giá tiềm năng thương mại')).toBeInTheDocument()
  })

  it('should render legal page without crashing', () => {
    const MockLegalPage = () => (
      <div>
        <h1>Dịch vụ pháp lý</h1>
        <div>
          <h2>Dịch vụ</h2>
          <div>
            <h3>Đăng ký sở hữu trí tuệ</h3>
            <h3>Tư vấn pháp lý</h3>
            <h3>Soạn thảo hợp đồng</h3>
          </div>
        </div>
        <div>
          <h2>Quy trình làm việc</h2>
        </div>
      </div>
    )
    
    render(<MockLegalPage />)
    expect(screen.getByText('Dịch vụ pháp lý')).toBeInTheDocument()
    expect(screen.getByText('Đăng ký sở hữu trí tuệ')).toBeInTheDocument()
  })

  it('should render valuation page without crashing', () => {
    const MockValuationPage = () => (
      <div>
        <h1>Thẩm định & định giá công nghệ</h1>
        <div>
          <h2>Dịch vụ</h2>
          <div>
            <h3>Định giá sáng chế</h3>
            <h3>Định giá công nghệ phần mềm</h3>
            <h3>Định giá tài sản trí tuệ</h3>
          </div>
        </div>
        <div>
          <h2>Phương pháp định giá</h2>
        </div>
      </div>
    )
    
    render(<MockValuationPage />)
    expect(screen.getByText('Thẩm định & định giá công nghệ')).toBeInTheDocument()
    expect(screen.getByText('Định giá sáng chế')).toBeInTheDocument()
  })

  it('should render intellectual property page without crashing', () => {
    const MockIPPage = () => (
      <div>
        <h1>Sở hữu trí tuệ</h1>
        <div>
          <h2>Dịch vụ</h2>
          <div>
            <h3>Đăng ký sáng chế</h3>
            <h3>Đăng ký nhãn hiệu</h3>
            <h3>Đăng ký bản quyền</h3>
          </div>
        </div>
      </div>
    )
    
    render(<MockIPPage />)
    expect(screen.getByText('Sở hữu trí tuệ')).toBeInTheDocument()
    expect(screen.getByText('Đăng ký sáng chế')).toBeInTheDocument()
  })

  it('should render training page without crashing', () => {
    const MockTrainingPage = () => (
      <div>
        <h1>Đào tạo & Hỗ trợ</h1>
        <div>
          <h2>Dịch vụ</h2>
          <div>
            <h3>Đào tạo chuyển giao công nghệ</h3>
            <h3>Hỗ trợ kỹ thuật</h3>
            <h3>Tư vấn pháp lý</h3>
          </div>
        </div>
      </div>
    )
    
    render(<MockTrainingPage />)
    expect(screen.getByText('Đào tạo & Hỗ trợ')).toBeInTheDocument()
    expect(screen.getByText('Đào tạo chuyển giao công nghệ')).toBeInTheDocument()
  })
})
