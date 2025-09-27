"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { 
  Search, 
  Filter, 
  Clock, 
  User, 
  Building, 
  DollarSign, 
  Users, 
  TrendingUp,
  MapPin,
  Calendar,
  Star,
  ArrowRight,
  FolderOpen,
  Newspaper,
  CalendarDays
} from "lucide-react";
import AnimatedIcon from "@/components/ui/AnimatedIcon";
import SectionBanner from "@/components/ui/SectionBanner";

interface SearchResult {
  id: string;
  type: 'technology' | 'demand' | 'expert' | 'organization' | 'fund' | 'project' | 'news' | 'event';
  title: string;
  description: string;
  category?: string;
  image?: string;
  url: string;
  metadata?: any;
}

interface SearchResponse {
  success: boolean;
  data?: {
    results: SearchResult[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    query: string;
    types: {
      technology: number;
      demand: number;
      expert: number;
      organization: number;
      fund: number;
      project: number;
      news: number;
      event: number;
    };
  };
  error?: string;
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const type = searchParams.get('type') || 'all';
  
  const [searchQuery, setSearchQuery] = useState(query);
  const [searchType, setSearchType] = useState(type);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    total: 0,
    totalPages: 0
  });

  const searchTypes = [
    { value: 'all', label: 'Tất cả', icon: Search },
    { value: 'technology', label: 'Công nghệ', icon: TrendingUp },
    { value: 'demand', label: 'Nhu cầu', icon: Clock },
    { value: 'expert', label: 'Chuyên gia', icon: User },
    { value: 'organization', label: 'Tổ chức', icon: Building },
    { value: 'fund', label: 'Quỹ đầu tư', icon: DollarSign },
    { value: 'project', label: 'Dự án', icon: FolderOpen },
    { value: 'news', label: 'Tin tức', icon: Newspaper },
    { value: 'event', label: 'Sự kiện', icon: CalendarDays },
  ];

  const getTypeIcon = (type: string) => {
    const typeConfig = searchTypes.find(t => t.value === type);
    return typeConfig?.icon || Search;
  };

  const getTypeLabel = (type: string) => {
    const typeConfig = searchTypes.find(t => t.value === type);
    return typeConfig?.label || type;
  };

  const getTypeColor = (type: string) => {
    const colors = {
      technology: 'bg-blue-100 text-blue-800',
      demand: 'bg-blue-100 text-blue-700',
      expert: 'bg-blue-100 text-blue-800',
      organization: 'bg-blue-100 text-blue-700',
      fund: 'bg-blue-100 text-blue-800',
      project: 'bg-blue-100 text-blue-700',
      news: 'bg-blue-100 text-blue-800',
      event: 'bg-blue-100 text-blue-700',
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const performSearch = async (q: string, t: string, page: number = 1) => {
    if (!q.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(
        `/api/search?q=${encodeURIComponent(q)}&type=${t}&page=${page}&limit=12`
      );
      
      const data: SearchResponse = await response.json();
      
      if (data.success && data.data) {
        setResults(data.data.results);
        setPagination({
          page: data.data.page,
          total: data.data.total,
          totalPages: data.data.totalPages
        });
      } else {
        setError(data.error || 'Có lỗi xảy ra khi tìm kiếm');
      }
    } catch (err) {
      setError('Không thể kết nối đến server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (query) {
      performSearch(query, searchType);
    }
  }, [query, searchType]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const url = new URL(window.location.href);
      url.searchParams.set('q', searchQuery.trim());
      url.searchParams.set('type', searchType);
      window.history.pushState({}, '', url.toString());
      performSearch(searchQuery.trim(), searchType);
    }
  };

  const handleTypeChange = (newType: string) => {
    setSearchType(newType);
    if (searchQuery.trim()) {
      performSearch(searchQuery.trim(), newType);
    }
  };

  return (
    <div className="min-h-screen bg-blue-50">
      {/* Header Banner */}
      <SectionBanner
        title="Tìm kiếm"
        subtitle={`Kết quả tìm kiếm cho "${query}"`}
        icon={<AnimatedIcon animation="pulse" delay={500}><Search className="h-12 w-12 text-white" /></AnimatedIcon>}
        variant="default"
        className="mb-8"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Form */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Tìm công nghệ, nhu cầu, chuyên gia, tổ chức, quỹ đầu tư, dự án, tin tức, sự kiện..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Tìm kiếm
              </button>
            </div>
            
            {/* Search Type Filters */}
            <div className="flex flex-wrap gap-2">
              {searchTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => handleTypeChange(type.value)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                      searchType === type.value
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-blue-50 hover:border-blue-300'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {type.label}
                  </button>
                );
              })}
            </div>
          </form>
        </div>

        {/* Results */}
        {loading ? (
          <div className="text-center py-12">
            <AnimatedIcon animation="pulse" className="mx-auto mb-4">
              <Search className="h-12 w-12 text-blue-600" />
            </AnimatedIcon>
            <p className="text-gray-600">Đang tìm kiếm...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="text-red-600 mb-4">
              <Search className="h-12 w-12 mx-auto" />
            </div>
            <p className="text-gray-600">{error}</p>
          </div>
        ) : results.length === 0 ? (
          <div className="text-center py-12">
            <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Không tìm thấy kết quả nào</p>
          </div>
        ) : (
          <>
            {/* Results Summary */}
            <div className="mb-6">
              <p className="text-gray-600">
                Tìm thấy <span className="font-semibold text-blue-600">{pagination.total}</span> kết quả
                {searchType !== 'all' && ` trong ${getTypeLabel(searchType)}`}
              </p>
            </div>

            {/* Results Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map((result, index) => {
                const TypeIcon = getTypeIcon(result.type);
                return (
                  <Link
                    key={`${result.type}-${result.id}`}
                    href={result.url}
                    className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="p-6">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${getTypeColor(result.type)}`}>
                            <TypeIcon className="h-5 w-5" />
                          </div>
                          <div>
                            <span className={`text-xs font-medium px-2 py-1 rounded-full ${getTypeColor(result.type)}`}>
                              {getTypeLabel(result.type)}
                            </span>
                          </div>
                        </div>
                        <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
                      </div>

                      {/* Content */}
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                        {result.title}
                      </h3>
                      
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {result.description}
                      </p>

                      {/* Metadata */}
                      {result.metadata && (
                        <div className="space-y-2">
                          {result.metadata.price && (
                            <div className="flex items-center gap-2 text-sm text-green-600">
                              <DollarSign className="h-4 w-4" />
                              <span>{result.metadata.price}</span>
                            </div>
                          )}
                          {result.metadata.location && (
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <MapPin className="h-4 w-4" />
                              <span>{result.metadata.location}</span>
                            </div>
                          )}
                          {result.metadata.deadline && (
                            <div className="flex items-center gap-2 text-sm text-orange-600">
                              <Calendar className="h-4 w-4" />
                              <span>{result.metadata.deadline}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <div className="flex gap-2">
                  {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => performSearch(searchQuery, searchType, page)}
                      className={`px-4 py-2 rounded-lg border transition-colors ${
                        page === pagination.page
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
