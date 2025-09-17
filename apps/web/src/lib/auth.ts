import { NextAuthOptions, User as NextAuthUser } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import FacebookProvider from 'next-auth/providers/facebook';
import { JWT } from 'next-auth/jwt';
import { User } from '@/types';
import apiClient from './api';

// Extend NextAuth types
declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: string;
      userType: string;
      isVerified: boolean;
    };
    accessToken?: string;
    apiToken?: string;
  }

  interface User {
    id: string;
    email: string;
    name: string;
    role?: string;
    userType?: string;
    isVerified?: boolean;
    token?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role?: string;
    userType?: string;
    isVerified?: boolean;
    apiToken?: string;
    accessToken?: string;
    provider?: string;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // Mock authentication for development - only for admin access
        if (credentials.email === 'admin@hanotex.com' && credentials.password === 'admin123') {
          return {
            id: 'admin-1',
            email: 'admin@hanotex.com',
            name: 'Admin HANOTEX',
            role: 'ADMIN',
            userType: 'ADMIN',
            isVerified: true,
            token: 'mock-admin-token'
          };
        }

        // For regular users, try to authenticate against user database
        try {
          // In real implementation, this would query the users table
          // For now, we'll simulate user authentication
          console.log('User authentication attempt:', credentials.email);
          
          // Mock user data - in real app, this would come from database
          const mockUsers = [
            {
              id: 'user-1',
              email: '123@gmail.com',
              password: '123456', // In real app, this would be hashed
              profile: {
                full_name: 'Nguyễn Văn A',
                company_name: '',
                institution_name: '',
                phone: '0123456789',
                profession: 'Nhà nghiên cứu'
              },
              role: 'USER',
              user_type: 'INDIVIDUAL',
              is_verified: true,
              created_at: '2024-01-01T00:00:00Z'
            }
          ];

          const user = mockUsers.find(u => u.email === credentials.email);
          
          if (user && user.password === credentials.password) {
            return {
              id: user.id,
              email: user.email,
              name: user.profile.full_name || user.email,
              role: user.role,
              userType: user.user_type,
              isVerified: user.is_verified,
              token: `user-token-${user.id}`,
              profile: user.profile
            };
          }

          console.log('User not found or invalid password for:', credentials.email);
          return null;

        } catch (error) {
          console.error('User authentication error:', error);
          return null;
        }
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID || '',
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET || '',
    })
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      // Persist the OAuth access_token and or the user id to the token right after signin
      if (account) {
        token.accessToken = account.access_token;
        token.provider = account.provider;
      }
      
      if (user) {
        token.role = user.role;
        token.userType = user.userType;
        token.isVerified = user.isVerified;
        token.apiToken = user.token;
      }
      
      return token;
    },
    async session({ session, token }) {
      // Send properties to the client
      if (token && session.user) {
        session.user.id = token.sub!;
        session.user.role = token.role as string;
        session.user.userType = token.userType as string;
        session.user.isVerified = token.isVerified as boolean;
        session.accessToken = token.accessToken as string;
        session.apiToken = token.apiToken as string;
      }
      
      return session;
    },
    async signIn({ user, account, profile }) {
      // Handle OAuth sign-ins
      if (account?.provider === 'google' || account?.provider === 'facebook') {
        try {
          // Check if user exists in our system
          const existingUser = await apiClient.getCurrentUser();
          
          if (!existingUser.success) {
            // Create new user with OAuth data
            const userData = {
              email: user.email!,
              password: 'oauth-user', // Temporary password for OAuth users
              user_type: 'INDIVIDUAL' as const,
              profile: {
                full_name: user.name || '',
                email: user.email!
              }
            };
            
            await apiClient.register(userData);
          }
          
          return true;
        } catch (error) {
          console.error('OAuth sign-in error:', error);
          return false;
        }
      }
      
      return true;
    }
  },
  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET || 'fallback-secret-for-development',
  debug: false, // Disable debug to prevent _log requests
  logger: {
    error: (code: string, metadata: any) => {
      console.error('NextAuth Error:', code, metadata);
    },
    warn: (code: string) => {
      console.warn('NextAuth Warning:', code);
    },
    debug: (code: string, metadata: any) => {
      // Disable debug logging to prevent _log requests
    }
  }
};

// Helper function to get server-side session
export async function getServerSession() {
  const { getServerSession } = await import('next-auth');
  return getServerSession(authOptions);
}

// Helper function to check if user has required role
export function hasRole(userRole: string, requiredRoles: string[]): boolean {
  return requiredRoles.includes(userRole);
}

// Helper function to check if user is admin
export function isAdmin(userRole: string): boolean {
  return ['ADMIN', 'SUPER_ADMIN'].includes(userRole);
}

// Helper function to check if user is verified
export function isVerified(user: any): boolean {
  return user?.isVerified === true;
}
