'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';
import { 
  ArrowUpDown, 
  ArrowUp, 
  ArrowDown,
  Calendar,
  DollarSign,
  Star,
  TrendingUp
} from 'lucide-react';

interface SortPanelProps {
  sortBy: string;
  sortOrder: 'ASC' | 'DESC';
  onSortChange: (sortBy: string, sortOrder: 'ASC' | 'DESC') => void;
  resultCount: number;
}

const SortPanel: React.FC<SortPanelProps> = ({
  sortBy,
  sortOrder,
  onSortChange,
  resultCount
}) => {
  const sortOptions = [
    { 
      key: 'created_at', 
      label: 'Mới nhất', 
      icon: <Calendar className="h-4 w-4" />,
      description: 'Sắp xếp theo thời gian tạo'
    },
    { 
      key: 'updated_at', 
      label: 'Cập nhật gần đây', 
      icon: <TrendingUp className="h-4 w-4" />,
      description: 'Sắp xếp theo thời gian cập nhật'
    },
    { 
      key: 'asking_price', 
      label: 'Giá', 
      icon: <DollarSign className="h-4 w-4" />,
      description: 'Sắp xếp theo giá'
    },
    { 
      key: 'title', 
      label: 'Tên', 
      icon: <Star className="h-4 w-4" />,
      description: 'Sắp xếp theo tên'
    },
  ];

  const handleSort = (key: string) => {
    if (sortBy === key) {
      // Toggle order if same field
      onSortChange(key, sortOrder === 'ASC' ? 'DESC' : 'ASC');
    } else {
      // Default to DESC for new field
      onSortChange(key, 'DESC');
    }
  };

  const getSortIcon = (key: string) => {
    if (sortBy !== key) {
      return <ArrowUpDown className="h-4 w-4" />;
    }
    return sortOrder === 'ASC' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />;
  };

  return (
    <div className="flex items-center justify-between bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
      {/* Results Info */}
      <div className="flex items-center space-x-4">
        <div className="text-sm text-gray-600">
          Hiển thị <span className="font-semibold text-gray-900">{resultCount}</span> kết quả
        </div>
        
        {/* Current Sort Info */}
        {sortBy && (
          <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
            Sắp xếp: {sortOptions.find(opt => opt.key === sortBy)?.label} 
            {sortOrder === 'ASC' ? ' (A→Z)' : ' (Z→A)'}
          </div>
        )}
      </div>

      {/* Sort Options */}
      <div className="flex items-center space-x-2">
        <span className="text-sm text-gray-600 mr-2">Sắp xếp:</span>
        
        {sortOptions.map((option) => (
          <Button
            key={option.key}
            variant={sortBy === option.key ? 'primary' : 'outline'}
            size="sm"
            onClick={() => handleSort(option.key)}
            icon={getSortIcon(option.key)}
            title={option.description}
            className="min-w-0"
          >
            <span className="hidden sm:inline">{option.label}</span>
            <span className="sm:hidden">{option.icon}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default SortPanel;


