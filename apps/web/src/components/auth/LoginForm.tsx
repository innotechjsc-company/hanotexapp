'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Input, Card, CardContent, CardHeader } from '@/components/ui';
import { useAuthStore } from '@/store/auth';
import { Eye, EyeOff, Mail, Lock, AlertCircle } from 'lucide-react';

interface LoginFormProps {
  onSuccess?: () => void;
  redirectTo?: string;
}

const LoginForm: React.FC<LoginFormProps> = ({ 
  onSuccess, 
  redirectTo = '/' 
}) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuthStore();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(formData.email, formData.password);
      onSuccess?.();
      router.push(redirectTo);
    } catch (err: any) {
      setError(err.message || 'Đăng nhập thất bại');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader 
        title="Đăng nhập tài khoản"
        subtitle="Chào mừng bạn quay trở lại HANOTEX"
      />
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Error Message */}
          {error && (
            <div className="flex items-center p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
              <span className="text-sm text-red-600">{error}</span>
            </div>
          )}
          
          {/* Email Field */}
          <Input
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Nhập email của bạn"
            required
            icon={<Mail className="h-4 w-4" />}
            autoComplete="email"
          />
          
          {/* Password Field */}
          <div className="relative">
            <Input
              label="Mật khẩu"
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Nhập mật khẩu"
              required
              icon={<Lock className="h-4 w-4" />}
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-8 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">Ghi nhớ đăng nhập</span>
            </label>
            
            <a 
              href="#" 
              className="text-sm text-blue-600 hover:text-blue-500 transition-colors"
            >
              Quên mật khẩu?
            </a>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            loading={loading}
            className="w-full"
            size="lg"
          >
            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </Button>
        </form>

        {/* Social Login */}
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Hoặc đăng nhập bằng</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {/* TODO: Implement Google login */}}
            >
              <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google
            </Button>
            
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {/* TODO: Implement Facebook login */}}
            >
              <svg className="h-4 w-4 mr-2" fill="#1877F2" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              Facebook
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LoginForm;


