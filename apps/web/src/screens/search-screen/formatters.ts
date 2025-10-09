/**
 * Format date to Vietnamese locale
 */
export const formatDate = (date: string | Date | unknown): string => {
  if (!date) return '';
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date as Date;
    return dateObj.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch {
    return String(date);
  }
};

/**
 * Format currency (VND)
 */
export const formatCurrency = (amount: number | string | unknown): string => {
  if (!amount) return '';
  
  try {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount as number;
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(numAmount);
  } catch {
    return String(amount);
  }
};

/**
 * Format metadata value to string
 */
export const formatMetadataValue = (value: unknown): string => {
  if (value === null || value === undefined) return '';
  
  // Handle objects
  if (typeof value === 'object') {
    // Check if it has a name or title property
    const obj = value as Record<string, unknown>;
    if ('name' in obj && obj.name) return String(obj.name);
    if ('title' in obj && obj.title) return String(obj.title);
    
    // Otherwise return JSON
    try {
      return JSON.stringify(value);
    } catch {
      return String(value);
    }
  }
  
  return String(value);
};

/**
 * Truncate text to specified length
 */
export const truncateText = (text: string, maxLength: number = 100): string => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Check if value is a date string
 */
export const isDateString = (value: unknown): boolean => {
  if (typeof value !== 'string') return false;
  
  const date = new Date(value);
  return !isNaN(date.getTime()) && value.includes('-');
};

/**
 * Check if value is a number (for currency formatting)
 */
export const isNumeric = (value: unknown): boolean => {
  if (typeof value === 'number') return true;
  if (typeof value === 'string') {
    return !isNaN(parseFloat(value)) && isFinite(parseFloat(value));
  }
  return false;
};
