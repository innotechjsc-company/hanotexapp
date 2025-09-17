import React from 'react';
import { Button } from '@/components/ui/Button';
import { 
  Search, 
  Filter, 
  Plus, 
  FileX,
  RefreshCw
} from 'lucide-react';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary' | 'outline';
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  secondaryAction,
  className = ''
}) => {
  return (
    <div className={`flex flex-col items-center justify-center py-12 px-4 text-center ${className}`}>
      {/* Icon */}
      <div className="w-16 h-16 mx-auto mb-4 text-gray-400">
        {icon || <FileX className="w-full h-full" />}
      </div>
      
      {/* Title */}
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {title}
      </h3>
      
      {/* Description */}
      {description && (
        <p className="text-sm text-gray-600 mb-6 max-w-sm">
          {description}
        </p>
      )}
      
      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        {action && (
          <Button
            variant={action.variant || 'primary'}
            onClick={action.onClick}
            icon={<Plus className="h-4 w-4" />}
          >
            {action.label}
          </Button>
        )}
        
        {secondaryAction && (
          <Button
            variant="outline"
            onClick={secondaryAction.onClick}
            icon={<RefreshCw className="h-4 w-4" />}
          >
            {secondaryAction.label}
          </Button>
        )}
      </div>
    </div>
  );
};

// Predefined Empty States
interface NoResultsProps {
  searchQuery?: string;
  onClearSearch?: () => void;
  onClearFilters?: () => void;
  hasFilters?: boolean;
}

export const NoResults: React.FC<NoResultsProps> = ({
  searchQuery,
  onClearSearch,
  onClearFilters,
  hasFilters = false
}) => {
  const handleClearAll = () => {
    if (searchQuery && onClearSearch) {
      onClearSearch();
    }
    if (hasFilters && onClearFilters) {
      onClearFilters();
    }
  };

  return (
    <EmptyState
      icon={<Search className="w-full h-full" />}
      title="Không tìm thấy kết quả"
      description={
        searchQuery 
          ? `Không tìm thấy công nghệ nào cho từ khóa "${searchQuery}"`
          : "Không có công nghệ nào phù hợp với bộ lọc hiện tại"
      }
      action={{
        label: searchQuery ? 'Xóa tìm kiếm' : 'Xóa bộ lọc',
        onClick: handleClearAll,
        variant: 'outline'
      }}
    />
  );
};

interface NoDataProps {
  onCreateNew?: () => void;
  createLabel?: string;
}

export const NoData: React.FC<NoDataProps> = ({
  onCreateNew,
  createLabel = 'Tạo mới'
}) => {
  return (
    <EmptyState
      icon={<Plus className="w-full h-full" />}
      title="Chưa có dữ liệu"
      description="Bắt đầu bằng cách tạo mục đầu tiên của bạn"
      action={onCreateNew ? {
        label: createLabel,
        onClick: onCreateNew,
        variant: 'primary'
      } : undefined}
    />
  );
};

interface ErrorStateProps {
  onRetry?: () => void;
  error?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  onRetry,
  error = 'Có lỗi xảy ra khi tải dữ liệu'
}) => {
  return (
    <EmptyState
      icon={<RefreshCw className="w-full h-full" />}
      title="Lỗi tải dữ liệu"
      description={error}
      action={onRetry ? {
        label: 'Thử lại',
        onClick: onRetry,
        variant: 'primary'
      } : undefined}
    />
  );
};

export default EmptyState;


