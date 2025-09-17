import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useRouter, useSearchParams } from 'next/navigation';
import AdvancedSearch from '../AdvancedSearch';
import { useMasterData } from '@/hooks/useMasterData';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
}));

// Mock useMasterData hook
jest.mock('@/hooks/useMasterData', () => ({
  useMasterData: jest.fn(),
}));

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('AdvancedSearch', () => {
  const mockPush = jest.fn();
  const mockOnSearch = jest.fn();

  const mockMasterData = {
    categories: [
      { value: 'AI', label: 'Artificial Intelligence' },
      { value: 'BIOTECH', label: 'Biotechnology' },
    ],
    trlLevels: [
      { value: '1', label: 'TRL 1 - Basic Research' },
      { value: '2', label: 'TRL 2 - Technology Formulation' },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
    
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });

    (useSearchParams as jest.Mock).mockReturnValue({
      get: jest.fn().mockReturnValue(null),
    });

    (useMasterData as jest.Mock).mockReturnValue({
      masterData: mockMasterData,
      loading: false,
      error: null,
    });

    localStorageMock.getItem.mockReturnValue(null);
  });

  it('renders search input and search button', () => {
    render(<AdvancedSearch onSearch={mockOnSearch} />);
    
    expect(screen.getByPlaceholderText(/search technologies/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
  });

  it('renders filters button with correct text', () => {
    render(<AdvancedSearch onSearch={mockOnSearch} />);
    
    expect(screen.getByRole('button', { name: /filters/i })).toBeInTheDocument();
  });

  it('expands filters when filters button is clicked', () => {
    render(<AdvancedSearch onSearch={mockOnSearch} />);
    
    const filtersButton = screen.getByRole('button', { name: /filters/i });
    fireEvent.click(filtersButton);
    
    expect(screen.getByText(/category/i)).toBeInTheDocument();
    expect(screen.getByText(/trl level/i)).toBeInTheDocument();
  });

  it('calls onSearch when search button is clicked', () => {
    render(<AdvancedSearch onSearch={mockOnSearch} />);
    
    const searchInput = screen.getByPlaceholderText(/search technologies/i);
    const searchButton = screen.getByRole('button', { name: /search/i });
    
    fireEvent.change(searchInput, { target: { value: 'AI technology' } });
    fireEvent.click(searchButton);
    
    expect(mockOnSearch).toHaveBeenCalledWith(
      expect.objectContaining({
        query: 'AI technology',
        page: 1,
      })
    );
  });

  it('calls onSearch when Enter key is pressed in search input', () => {
    render(<AdvancedSearch onSearch={mockOnSearch} />);
    
    const searchInput = screen.getByPlaceholderText(/search technologies/i);
    
    fireEvent.change(searchInput, { target: { value: 'AI technology' } });
    fireEvent.keyPress(searchInput, { key: 'Enter', code: 'Enter' });
    
    expect(mockOnSearch).toHaveBeenCalledWith(
      expect.objectContaining({
        query: 'AI technology',
        page: 1,
      })
    );
  });

  it('updates filters when filter values change', () => {
    render(<AdvancedSearch onSearch={mockOnSearch} />);
    
    // Expand filters
    const filtersButton = screen.getByRole('button', { name: /filters/i });
    fireEvent.click(filtersButton);
    
    // Change category filter
    const categorySelect = screen.getByDisplayValue(/all categories/i);
    fireEvent.change(categorySelect, { target: { value: 'AI' } });
    
    expect(categorySelect).toHaveValue('AI');
  });

  it('clears all filters when clear button is clicked', () => {
    render(<AdvancedSearch onSearch={mockOnSearch} />);
    
    // Expand filters
    const filtersButton = screen.getByRole('button', { name: /filters/i });
    fireEvent.click(filtersButton);
    
    // Set some filters
    const categorySelect = screen.getByDisplayValue(/all categories/i);
    fireEvent.change(categorySelect, { target: { value: 'AI' } });
    
    // Clear filters
    const clearButton = screen.getByRole('button', { name: /clear all/i });
    fireEvent.click(clearButton);
    
    expect(categorySelect).toHaveValue('');
  });

  it('shows search history when available', () => {
    localStorageMock.getItem.mockImplementation((key) => {
      if (key === 'hanotex_search_history') {
        return JSON.stringify(['AI technology', 'biotech research']);
      }
      return null;
    });

    render(<AdvancedSearch onSearch={mockOnSearch} />);
    
    expect(screen.getByText(/recent:/i)).toBeInTheDocument();
    expect(screen.getByText('AI technology')).toBeInTheDocument();
    expect(screen.getByText('biotech research')).toBeInTheDocument();
  });

  it('shows saved searches when available', () => {
    const savedSearches = [
      { id: '1', name: 'AI Search', query: 'AI', filters: {} },
      { id: '2', name: 'Bio Search', query: 'biotech', filters: {} },
    ];

    localStorageMock.getItem.mockImplementation((key) => {
      if (key === 'hanotex_saved_searches') {
        return JSON.stringify(savedSearches);
      }
      return null;
    });

    render(<AdvancedSearch onSearch={mockOnSearch} />);
    
    expect(screen.getByText(/saved:/i)).toBeInTheDocument();
    expect(screen.getByText('AI Search')).toBeInTheDocument();
    expect(screen.getByText('Bio Search')).toBeInTheDocument();
  });

  it('saves search when save button is clicked', async () => {
    // Mock prompt
    window.prompt = jest.fn().mockReturnValue('My Search');
    
    render(<AdvancedSearch onSearch={mockOnSearch} />);
    
    // Expand filters
    const filtersButton = screen.getByRole('button', { name: /filters/i });
    fireEvent.click(filtersButton);
    
    // Click save button
    const saveButton = screen.getByRole('button', { name: /save search/i });
    fireEvent.click(saveButton);
    
    expect(window.prompt).toHaveBeenCalledWith('Enter a name for this search:');
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'hanotex_saved_searches',
      expect.stringContaining('My Search')
    );
  });

  it('shows loading state when master data is loading', () => {
    (useMasterData as jest.Mock).mockReturnValue({
      masterData: null,
      loading: true,
      error: null,
    });

    render(<AdvancedSearch onSearch={mockOnSearch} />);
    
    // Expand filters
    const filtersButton = screen.getByRole('button', { name: /filters/i });
    fireEvent.click(filtersButton);
    
    const categorySelect = screen.getByDisplayValue(/all categories/i);
    expect(categorySelect).toBeDisabled();
  });

  it('handles error state when master data fails to load', () => {
    (useMasterData as jest.Mock).mockReturnValue({
      masterData: null,
      loading: false,
      error: 'Failed to load data',
    });

    render(<AdvancedSearch onSearch={mockOnSearch} />);
    
    // Component should still render without crashing
    expect(screen.getByPlaceholderText(/search technologies/i)).toBeInTheDocument();
  });

  it('updates URL when search is performed', () => {
    render(<AdvancedSearch onSearch={mockOnSearch} />);
    
    const searchInput = screen.getByPlaceholderText(/search technologies/i);
    const searchButton = screen.getByRole('button', { name: /search/i });
    
    fireEvent.change(searchInput, { target: { value: 'AI technology' } });
    fireEvent.click(searchButton);
    
    expect(mockPush).toHaveBeenCalledWith(
      expect.stringContaining('q=AI%20technology')
    );
  });

  it('loads saved search when clicked', () => {
    const savedSearches = [
      { id: '1', name: 'AI Search', query: 'AI', filters: { category_id: 'AI' } },
    ];

    localStorageMock.getItem.mockImplementation((key) => {
      if (key === 'hanotex_saved_searches') {
        return JSON.stringify(savedSearches);
      }
      return null;
    });

    render(<AdvancedSearch onSearch={mockOnSearch} />);
    
    const savedSearchLink = screen.getByText('AI Search');
    fireEvent.click(savedSearchLink);
    
    const searchInput = screen.getByPlaceholderText(/search technologies/i);
    expect(searchInput).toHaveValue('AI');
  });
});
