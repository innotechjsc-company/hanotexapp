'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  Search, 
  Filter, 
  X, 
  ChevronDown, 
  MapPin, 
  Calendar,
  DollarSign,
  Tag,
  Star,
  Clock,
  Save,
  History
} from 'lucide-react';
import { TechnologySearchParams } from '@/types';
import { useMasterData } from '@/hooks/useMasterData';

interface AdvancedSearchProps {
  onSearch?: (params: TechnologySearchParams) => void;
  className?: string;
}

export default function AdvancedSearch({ onSearch, className = '' }: AdvancedSearchProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { masterData, loading: masterDataLoading } = useMasterData();
  
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<TechnologySearchParams>({
    category_id: '',
    trl_level: undefined,
    user_type: undefined,
    min_price: undefined,
    max_price: undefined,
    territory: '',
    status: undefined,
    sort: 'created_at',
    order: 'DESC',
  });
  const [savedSearches, setSavedSearches] = useState<any[]>([]);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  // Load initial search params
  useEffect(() => {
    const query = searchParams.get('q') || '';
    const category = searchParams.get('category') || '';
    const trl = searchParams.get('trl');
    const minPrice = searchParams.get('min_price');
    const maxPrice = searchParams.get('max_price');
    
    setSearchQuery(query);
    setFilters(prev => ({
      ...prev,
      query,
      category_id: category,
      trl_level: trl ? parseInt(trl) : undefined,
      min_price: minPrice ? parseFloat(minPrice) : undefined,
      max_price: maxPrice ? parseFloat(maxPrice) : undefined,
    }));
  }, [searchParams]);

  // Load saved searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('hanotex_saved_searches');
    if (saved) {
      setSavedSearches(JSON.parse(saved));
    }
    
    const history = localStorage.getItem('hanotex_search_history');
    if (history) {
      setSearchHistory(JSON.parse(history));
    }
  }, []);

  const handleSearch = () => {
    const searchParams: TechnologySearchParams = {
      ...filters,
      query: searchQuery,
      page: 1,
    };

    // Add to search history
    if (searchQuery.trim()) {
      const newHistory = [searchQuery, ...searchHistory.filter(h => h !== searchQuery)].slice(0, 10);
      setSearchHistory(newHistory);
      localStorage.setItem('hanotex_search_history', JSON.stringify(newHistory));
    }

    // Update URL
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (filters.category_id) params.set('category', filters.category_id);
    if (filters.trl_level) params.set('trl', filters.trl_level.toString());
    if (filters.min_price) params.set('min_price', filters.min_price.toString());
    if (filters.max_price) params.set('max_price', filters.max_price.toString());
    if (filters.territory) params.set('territory', filters.territory);
    if (filters.user_type) params.set('user_type', filters.user_type);
    if (filters.status) params.set('status', filters.status);
    if (filters.sort) params.set('sort', filters.sort);
    if (filters.order) params.set('order', filters.order);

    router.push(`/technologies?${params.toString()}`);
    
    if (onSearch) {
      onSearch(searchParams);
    }
  };

  const handleFilterChange = (key: keyof TechnologySearchParams, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      category_id: '',
      trl_level: undefined,
      user_type: undefined,
      min_price: undefined,
      max_price: undefined,
      territory: '',
      status: undefined,
      sort: 'created_at',
      order: 'DESC',
    });
    setSearchQuery('');
  };

  const saveSearch = () => {
    const searchName = prompt('Enter a name for this search:');
    if (searchName) {
      const newSearch = {
        id: Date.now().toString(),
        name: searchName,
        query: searchQuery,
        filters: { ...filters },
        createdAt: new Date().toISOString(),
      };
      
      const updated = [newSearch, ...savedSearches].slice(0, 10);
      setSavedSearches(updated);
      localStorage.setItem('hanotex_saved_searches', JSON.stringify(updated));
    }
  };

  const loadSavedSearch = (savedSearch: any) => {
    setSearchQuery(savedSearch.query);
    setFilters(savedSearch.filters);
  };

  const deleteSavedSearch = (id: string) => {
    const updated = savedSearches.filter(s => s.id !== id);
    setSavedSearches(updated);
    localStorage.setItem('hanotex_saved_searches', JSON.stringify(updated));
  };

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.category_id) count++;
    if (filters.trl_level !== undefined) count++;
    if (filters.user_type) count++;
    if (filters.min_price !== undefined) count++;
    if (filters.max_price !== undefined) count++;
    if (filters.territory) count++;
    if (filters.status) count++;
    return count;
  }, [filters]);

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>
      {/* Search Bar */}
      <div className="p-4">
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search technologies, categories, or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <button
            onClick={handleSearch}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Search
          </button>
          
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Filter className="h-5 w-5 mr-2" />
            Filters
            {activeFiltersCount > 0 && (
              <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                {activeFiltersCount}
              </span>
            )}
            <ChevronDown className={`h-4 w-4 ml-2 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Search History & Saved Searches */}
        {(searchHistory.length > 0 || savedSearches.length > 0) && (
          <div className="mt-4 flex items-center space-x-4">
            {searchHistory.length > 0 && (
              <div className="flex items-center space-x-2">
                <History className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600">Recent:</span>
                {searchHistory.slice(0, 3).map((term, index) => (
                  <button
                    key={index}
                    onClick={() => setSearchQuery(term)}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    {term}
                  </button>
                ))}
              </div>
            )}
            
            {savedSearches.length > 0 && (
              <div className="flex items-center space-x-2">
                <Save className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600">Saved:</span>
                {savedSearches.slice(0, 2).map((search) => (
                  <button
                    key={search.id}
                    onClick={() => loadSavedSearch(search)}
                    className="text-sm text-green-600 hover:text-green-800"
                  >
                    {search.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Advanced Filters */}
      {isExpanded && (
        <div className="border-t border-gray-200 p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Tag className="h-4 w-4 inline mr-1" />
                Category
              </label>
              <select
                value={filters.category_id || ''}
                onChange={(e) => handleFilterChange('category_id', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={masterDataLoading}
              >
                <option value="">All Categories</option>
                {masterData?.categories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>

            {/* TRL Level Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Star className="h-4 w-4 inline mr-1" />
                TRL Level
              </label>
              <select
                value={filters.trl_level || ''}
                onChange={(e) => handleFilterChange('trl_level', e.target.value ? parseInt(e.target.value) : undefined)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={masterDataLoading}
              >
                <option value="">All Levels</option>
                {masterData?.trlLevels.map((level) => (
                  <option key={level.value} value={level.value}>
                    {level.label}
                  </option>
                ))}
              </select>
            </div>

            {/* User Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Tag className="h-4 w-4 inline mr-1" />
                User Type
              </label>
              <select
                value={filters.user_type || ''}
                onChange={(e) => handleFilterChange('user_type', e.target.value || undefined)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Types</option>
                <option value="INDIVIDUAL">Individual</option>
                <option value="COMPANY">Company</option>
                <option value="RESEARCH_INSTITUTION">Research Institution</option>
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Clock className="h-4 w-4 inline mr-1" />
                Status
              </label>
              <select
                value={filters.status || ''}
                onChange={(e) => handleFilterChange('status', e.target.value || undefined)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Status</option>
                <option value="ACTIVE">Active</option>
                <option value="PENDING">Pending</option>
                <option value="APPROVED">Approved</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>

            {/* Price Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <DollarSign className="h-4 w-4 inline mr-1" />
                Min Price
              </label>
              <input
                type="number"
                placeholder="0"
                value={filters.min_price || ''}
                onChange={(e) => handleFilterChange('min_price', e.target.value ? parseFloat(e.target.value) : undefined)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <DollarSign className="h-4 w-4 inline mr-1" />
                Max Price
              </label>
              <input
                type="number"
                placeholder="No limit"
                value={filters.max_price || ''}
                onChange={(e) => handleFilterChange('max_price', e.target.value ? parseFloat(e.target.value) : undefined)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Territory Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="h-4 w-4 inline mr-1" />
                Territory
              </label>
              <input
                type="text"
                placeholder="e.g., Vietnam, Global"
                value={filters.territory || ''}
                onChange={(e) => handleFilterChange('territory', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Sort Options */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="h-4 w-4 inline mr-1" />
                Sort By
              </label>
              <select
                value={`${filters.sort}-${filters.order}`}
                onChange={(e) => {
                  const [sort, order] = e.target.value.split('-');
                  handleFilterChange('sort', sort);
                  handleFilterChange('order', order as 'ASC' | 'DESC');
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="created_at-DESC">Newest First</option>
                <option value="created_at-ASC">Oldest First</option>
                <option value="title-ASC">Title A-Z</option>
                <option value="title-DESC">Title Z-A</option>
                <option value="asking_price-ASC">Price Low to High</option>
                <option value="asking_price-DESC">Price High to Low</option>
                <option value="trl_level-DESC">TRL High to Low</option>
                <option value="trl_level-ASC">TRL Low to High</option>
              </select>
            </div>
          </div>

          {/* Filter Actions */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center space-x-2">
              <button
                onClick={clearFilters}
                className="flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-800"
              >
                <X className="h-4 w-4 mr-1" />
                Clear All
              </button>
              
              <button
                onClick={saveSearch}
                className="flex items-center px-3 py-2 text-sm text-blue-600 hover:text-blue-800"
              >
                <Save className="h-4 w-4 mr-1" />
                Save Search
              </button>
            </div>
            
            <button
              onClick={handleSearch}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
