import { authOptions, hasRole, isAdmin, isVerified } from '../auth';

// Mock apiClient
jest.mock('../api', () => ({
  login: jest.fn(),
  getCurrentUser: jest.fn(),
  register: jest.fn(),
}));

describe('Auth Utilities', () => {
  describe('hasRole', () => {
    it('should return true when user has required role', () => {
      expect(hasRole('ADMIN', ['ADMIN', 'USER'])).toBe(true);
      expect(hasRole('USER', ['USER'])).toBe(true);
      expect(hasRole('SUPER_ADMIN', ['ADMIN', 'SUPER_ADMIN'])).toBe(true);
    });

    it('should return false when user does not have required role', () => {
      expect(hasRole('USER', ['ADMIN'])).toBe(false);
      expect(hasRole('GUEST', ['ADMIN', 'USER'])).toBe(false);
    });

    it('should handle empty required roles array', () => {
      expect(hasRole('ADMIN', [])).toBe(false);
    });
  });

  describe('isAdmin', () => {
    it('should return true for admin roles', () => {
      expect(isAdmin('ADMIN')).toBe(true);
      expect(isAdmin('SUPER_ADMIN')).toBe(true);
    });

    it('should return false for non-admin roles', () => {
      expect(isAdmin('USER')).toBe(false);
      expect(isAdmin('MODERATOR')).toBe(false);
      expect(isAdmin('SUPPORT')).toBe(false);
    });
  });

  describe('isVerified', () => {
    it('should return true for verified user', () => {
      const user = { isVerified: true };
      expect(isVerified(user)).toBe(true);
    });

    it('should return false for unverified user', () => {
      const user = { isVerified: false };
      expect(isVerified(user)).toBe(false);
    });

    it('should return false for user without verification status', () => {
      const user = {};
      expect(isVerified(user)).toBe(false);
    });

    it('should return false for null user', () => {
      expect(isVerified(null)).toBe(false);
    });
  });
});

describe('Auth Options', () => {
  it('should have correct configuration', () => {
    expect(authOptions).toBeDefined();
    expect(authOptions.providers).toHaveLength(3); // credentials, google, facebook
    expect(authOptions.pages).toBeDefined();
    expect(authOptions.session).toBeDefined();
    expect(authOptions.jwt).toBeDefined();
  });

  it('should have correct page configurations', () => {
    expect(authOptions.pages?.signIn).toBe('/auth/login');
    expect(authOptions.pages?.signUp).toBe('/auth/register');
    expect(authOptions.pages?.error).toBe('/auth/error');
  });

  it('should have correct session configuration', () => {
    expect(authOptions.session?.strategy).toBe('jwt');
    expect(authOptions.session?.maxAge).toBe(30 * 24 * 60 * 60); // 30 days
  });

  it('should have correct JWT configuration', () => {
    expect(authOptions.jwt?.maxAge).toBe(30 * 24 * 60 * 60); // 30 days
  });
});
