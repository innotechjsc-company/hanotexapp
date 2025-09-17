import {
  formatCurrency,
  formatDate,
  getTRLLabel,
  getTRLColor,
  getStatusText,
  getStatusColor,
  cn,
  debounce,
  throttle
} from '../utils'

describe('Utility Functions', () => {
  describe('formatCurrency', () => {
    it('should format VND currency correctly', () => {
      expect(formatCurrency(1000000, 'VND')).toContain('1.000.000')
      expect(formatCurrency(500000, 'VND')).toContain('500.000')
      expect(formatCurrency(0, 'VND')).toContain('0')
    })

    it('should format USD currency correctly', () => {
      expect(formatCurrency(1000, 'USD')).toContain('1.000')
      expect(formatCurrency(500, 'USD')).toContain('500')
      expect(formatCurrency(0, 'USD')).toContain('0')
    })

    it('should handle large numbers', () => {
      expect(formatCurrency(1000000000, 'VND')).toContain('1.000.000.000')
      expect(formatCurrency(1000000000, 'USD')).toContain('1.000.000.000')
    })

    it('should handle decimal numbers', () => {
      expect(formatCurrency(1000.50, 'USD')).toContain('1.000,50')
      expect(formatCurrency(1000.50, 'VND')).toContain('1.001')
    })
  })

  describe('formatDate', () => {
    it('should format ISO date string correctly', () => {
      const date = '2024-01-15T10:30:00Z'
      const formatted = formatDate(date)
      expect(formatted).toContain('2024')
      expect(formatted).toContain('tháng 1')
    })

    it('should format Date object correctly', () => {
      const date = new Date('2024-01-15T10:30:00Z')
      const formatted = formatDate(date)
      expect(formatted).toContain('2024')
      expect(formatted).toContain('tháng 1')
    })

    it('should handle invalid date', () => {
      expect(() => formatDate('invalid-date')).toThrow()
      // Note: null and undefined might not throw in some environments
      expect(formatDate(null as any)).toBe('Invalid Date')
      expect(formatDate(undefined as any)).toBe('Invalid Date')
    })
  })

  describe('getTRLLabel', () => {
    it('should return correct TRL labels', () => {
      expect(getTRLLabel(1)).toBe('Nguyên lý cơ bản được quan sát và báo cáo')
      expect(getTRLLabel(5)).toBe('Thành phần và/hoặc breadboard được xác thực trong môi trường có liên quan')
      expect(getTRLLabel(9)).toBe('Hệ thống thực tế được chứng minh thông qua hoạt động thành công')
    })

    it('should handle invalid TRL levels', () => {
      expect(getTRLLabel(0)).toBe('TRL 0')
      expect(getTRLLabel(10)).toBe('TRL 10')
      expect(getTRLLabel(-1)).toBe('TRL -1')
    })
  })

  describe('getTRLColor', () => {
    it('should return correct TRL colors', () => {
      expect(getTRLColor(1)).toBe('bg-red-100 text-red-800')
      expect(getTRLColor(5)).toBe('bg-yellow-100 text-yellow-800')
      expect(getTRLColor(9)).toBe('bg-green-100 text-green-800')
    })

    it('should handle invalid TRL levels', () => {
      expect(getTRLColor(0)).toBe('bg-red-100 text-red-800')
      expect(getTRLColor(10)).toBe('bg-green-100 text-green-800')
    })
  })

  describe('getStatusText', () => {
    it('should return correct status text', () => {
      expect(getStatusText('ACTIVE')).toBe('Đang diễn ra')
      expect(getStatusText('PENDING')).toBe('Chờ duyệt')
      expect(getStatusText('REJECTED')).toBe('Từ chối')
      expect(getStatusText('DRAFT')).toBe('Bản nháp')
    })

    it('should handle unknown status', () => {
      expect(getStatusText('UNKNOWN')).toBe('UNKNOWN')
      expect(getStatusText('')).toBe('')
    })
  })

  describe('getStatusColor', () => {
    it('should return correct status colors', () => {
      expect(getStatusColor('ACTIVE')).toBe('bg-blue-100 text-blue-800')
      expect(getStatusColor('PENDING')).toBe('bg-yellow-100 text-yellow-800')
      expect(getStatusColor('REJECTED')).toBe('bg-red-100 text-red-800')
      expect(getStatusColor('DRAFT')).toBe('bg-gray-100 text-gray-800')
    })

    it('should handle unknown status', () => {
      expect(getStatusColor('UNKNOWN')).toBe('bg-gray-100 text-gray-800')
    })
  })

  describe('cn (className utility)', () => {
    it('should merge class names correctly', () => {
      expect(cn('class1', 'class2')).toBe('class1 class2')
      expect(cn('class1', 'class2', 'class3')).toBe('class1 class2 class3')
    })

    it('should handle conditional classes', () => {
      expect(cn('class1', true && 'class2', false && 'class3')).toBe('class1 class2')
      expect(cn('class1', false && 'class2', true && 'class3')).toBe('class1 class3')
    })

    it('should handle undefined and null values', () => {
      expect(cn('class1', undefined, 'class2', null)).toBe('class1 class2')
    })

    it('should handle empty strings', () => {
      expect(cn('class1', '', 'class2')).toBe('class1 class2')
    })
  })

  describe('debounce', () => {
    beforeEach(() => {
      jest.useFakeTimers()
    })

    afterEach(() => {
      jest.useRealTimers()
    })

    it('should debounce function calls', () => {
      const mockFn = jest.fn()
      const debouncedFn = debounce(mockFn, 100)

      debouncedFn()
      debouncedFn()
      debouncedFn()

      expect(mockFn).not.toHaveBeenCalled()

      jest.advanceTimersByTime(100)

      expect(mockFn).toHaveBeenCalledTimes(1)
    })

    it('should pass arguments to debounced function', () => {
      const mockFn = jest.fn()
      const debouncedFn = debounce(mockFn, 100)

      debouncedFn('arg1', 'arg2')

      jest.advanceTimersByTime(100)

      expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2')
    })
  })

  describe('throttle', () => {
    beforeEach(() => {
      jest.useFakeTimers()
    })

    afterEach(() => {
      jest.useRealTimers()
    })

    it('should throttle function calls', () => {
      const mockFn = jest.fn()
      const throttledFn = throttle(mockFn, 100)

      throttledFn()
      expect(mockFn).toHaveBeenCalledTimes(1)

      throttledFn()
      throttledFn()
      expect(mockFn).toHaveBeenCalledTimes(1)

      jest.advanceTimersByTime(100)

      throttledFn()
      expect(mockFn).toHaveBeenCalledTimes(2)
    })

    it('should pass arguments to throttled function', () => {
      const mockFn = jest.fn()
      const throttledFn = throttle(mockFn, 100)

      throttledFn('arg1', 'arg2')

      expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2')
    })
  })
})
