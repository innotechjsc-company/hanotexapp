/**
 * API Configuration Helper
 * Tạo các URL API từ environment variables để tránh hardcode
 */

/**
 * Lấy base URL của PayloadCMS API từ environment variable
 */
export const getPayloadApiBaseUrl = (): string => {
  return process.env.NEXT_PUBLIC_PAYLOAD_API_URL || 'http://localhost:4000/api';
};

/**
 * Tạo URL đầy đủ cho PayloadCMS API endpoint
 * @param endpoint - endpoint path (vd: '/auctions', '/users', etc.)
 * @returns URL đầy đủ
 */
export const getPayloadApiUrl = (endpoint: string = ''): string => {
  const baseUrl = getPayloadApiBaseUrl();
  // Đảm bảo endpoint bắt đầu bằng /
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${baseUrl}${cleanEndpoint}`;
};

/**
 * Lấy WebSocket URL từ environment variable
 */
export const getWebSocketUrl = (): string => {
  return process.env.NEXT_PUBLIC_WEBSOCKET_URL || process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:4000';
};

/**
 * Lấy App URL từ environment variable
 */
export const getAppUrl = (): string => {
  return process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
};
