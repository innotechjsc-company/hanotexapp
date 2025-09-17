'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Brain, FlaskConical, Cpu, Leaf, Zap, Shield, Heart, Wheat, Wind } from 'lucide-react';
import { Category } from '@/types';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import apiClient from '@/lib/api';

const categoryIcons: Record<string, any> = {
  'AI': Brain,
  'Công nghệ sinh học': FlaskConical,
  'Vật liệu mới': Cpu,
  'Y tế': Heart,
  'Nông nghiệp CNC': Wheat,
  'Năng lượng sạch': Wind,
  'Công nghệ thông tin': Cpu,
  'Công nghệ môi trường': Leaf,
  'Công nghệ năng lượng': Zap,
  'Công nghệ an ninh': Shield,
};

export default function CategoriesSection() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await apiClient.getCategories();
        if (response.success && response.data && Array.isArray(response.data)) {
          // Get top-level categories (no parent)
          const topCategories = response.data.slice(0, 6);
          setCategories(topCategories);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <LoadingSpinner size="lg" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Danh mục nổi bật
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Khám phá các lĩnh vực công nghệ đa dạng và tìm kiếm giải pháp phù hợp với nhu cầu của bạn
          </p>
        </div>

        {/* Categories Grid */}
        {categories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {categories.map((category, index) => {
              const IconComponent = categoryIcons[category.name] || FlaskConical;
              
              return (
                <div key={category.id}>
                  <Link
                    href={`/technologies?category=${category.id}`}
                    className="block bg-white rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 group"
                  >
                    <div className="px-6 py-4 text-center">
                      {/* Icon */}
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-blue-600 mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        <IconComponent className="h-8 w-8" />
                      </div>

                      {/* Category Name */}
                      <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                        {category.name}
                      </h3>

                      {/* Description */}
                      {category.description && (
                        <p className="text-gray-600 mb-4 overflow-hidden" style={{display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical'}}>
                          {category.description}
                        </p>
                      )}

                      {/* Code */}
                      <div className="text-sm text-gray-500 mb-4">
                        Mã: {category.code}
                      </div>

                      {/* Children Count */}
                      {category.children && category.children.length > 0 && (
                        <div className="text-sm text-gray-500 mb-4">
                          {category.children.length} danh mục con
                        </div>
                      )}

                      {/* Arrow */}
                      <div className="flex items-center justify-center text-blue-600 group-hover:translate-x-1 transition-transform">
                        <span className="text-sm font-medium mr-1">Khám phá</span>
                        <ArrowRight className="h-4 w-4" />
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <FlaskConical className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-500 mb-2">
              Chưa có danh mục nào
            </h3>
            <p className="text-gray-400">
              Danh mục công nghệ sẽ được cập nhật sớm
            </p>
          </div>
        )}

        {/* View All Categories Button */}
        <div className="text-center">
          <Link
            href="/categories"
            className="inline-flex items-center justify-center rounded-lg px-6 py-3 text-base font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-gray-500 group"
          >
            Xem tất cả danh mục
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}