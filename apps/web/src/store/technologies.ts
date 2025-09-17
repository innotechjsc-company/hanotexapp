import { create } from 'zustand';
import { Technology, Category, TechnologySearchParams, TechnologyState } from '@/types';
import apiClient from '@/lib/api';

interface TechnologyStore extends TechnologyState {
  // Actions
  fetchTechnologies: (params?: TechnologySearchParams) => Promise<void>;
  fetchTechnology: (id: string) => Promise<void>;
  fetchCategories: () => Promise<void>;
  createTechnology: (data: any) => Promise<boolean>;
  updateTechnology: (id: string, data: any) => Promise<boolean>;
  deleteTechnology: (id: string) => Promise<boolean>;
  submitTechnology: (id: string) => Promise<boolean>;
  setSearchParams: (params: TechnologySearchParams) => void;
  clearCurrentTechnology: () => void;
  clearError: () => void;
}

export const useTechnologyStore = create<TechnologyStore>((set, get) => ({
  // Initial state
  technologies: [],
  currentTechnology: null,
  categories: [],
  searchParams: {
    page: 1,
    limit: 20,
    sort: 'created_at',
    order: 'DESC',
  },
  isLoading: false,
  error: null,

  // Actions
  fetchTechnologies: async (params?: TechnologySearchParams) => {
    set({ isLoading: true, error: null });
    
    try {
      const searchParams = { ...get().searchParams, ...params };
      const response = await apiClient.getTechnologies(searchParams);
      
      if (response.success && response.data) {
        set({
          technologies: response.data,
          searchParams,
          isLoading: false,
        });
      } else {
        set({
          error: response.error || 'Failed to fetch technologies',
          isLoading: false,
        });
      }
    } catch (error) {
      console.error('Fetch technologies error:', error);
      set({
        error: 'Failed to fetch technologies',
        isLoading: false,
      });
    }
  },

  fetchTechnology: async (id: string) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await apiClient.getTechnology(id);
      
      if (response.success && response.data) {
        set({
          currentTechnology: response.data,
          isLoading: false,
        });
      } else {
        set({
          error: response.error || 'Failed to fetch technology',
          isLoading: false,
        });
      }
    } catch (error) {
      console.error('Fetch technology error:', error);
      set({
        error: 'Failed to fetch technology',
        isLoading: false,
      });
    }
  },

  fetchCategories: async () => {
    try {
      const response = await apiClient.getCategories();
      
      if (response.success && response.data) {
        set({ categories: response.data });
      }
    } catch (error) {
      console.error('Fetch categories error:', error);
    }
  },

  createTechnology: async (data: any) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await apiClient.createTechnology(data);
      
      if (response.success) {
        // Refresh technologies list
        await get().fetchTechnologies();
        set({ isLoading: false });
        return true;
      } else {
        set({
          error: response.error || 'Failed to create technology',
          isLoading: false,
        });
        return false;
      }
    } catch (error) {
      console.error('Create technology error:', error);
      set({
        error: 'Failed to create technology',
        isLoading: false,
      });
      return false;
    }
  },

  updateTechnology: async (id: string, data: any) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await apiClient.updateTechnology(id, data);
      
      if (response.success) {
        // Update current technology if it's the one being updated
        const { currentTechnology } = get();
        if (currentTechnology && currentTechnology.id === id) {
          set({ currentTechnology: { ...currentTechnology, ...data } });
        }
        
        // Refresh technologies list
        await get().fetchTechnologies();
        set({ isLoading: false });
        return true;
      } else {
        set({
          error: response.error || 'Failed to update technology',
          isLoading: false,
        });
        return false;
      }
    } catch (error) {
      console.error('Update technology error:', error);
      set({
        error: 'Failed to update technology',
        isLoading: false,
      });
      return false;
    }
  },

  deleteTechnology: async (id: string) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await apiClient.deleteTechnology(id);
      
      if (response.success) {
        // Remove from technologies list
        const { technologies } = get();
        set({
          technologies: technologies.filter(tech => tech.id !== id),
          isLoading: false,
        });
        return true;
      } else {
        set({
          error: response.error || 'Failed to delete technology',
          isLoading: false,
        });
        return false;
      }
    } catch (error) {
      console.error('Delete technology error:', error);
      set({
        error: 'Failed to delete technology',
        isLoading: false,
      });
      return false;
    }
  },

  submitTechnology: async (id: string) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await apiClient.submitTechnology(id);
      
      if (response.success) {
        // Update current technology status
        const { currentTechnology } = get();
        if (currentTechnology && currentTechnology.id === id) {
          set({ currentTechnology: { ...currentTechnology, status: 'PENDING' } });
        }
        
        // Refresh technologies list
        await get().fetchTechnologies();
        set({ isLoading: false });
        return true;
      } else {
        set({
          error: response.error || 'Failed to submit technology',
          isLoading: false,
        });
        return false;
      }
    } catch (error) {
      console.error('Submit technology error:', error);
      set({
        error: 'Failed to submit technology',
        isLoading: false,
      });
      return false;
    }
  },

  setSearchParams: (params: TechnologySearchParams) => {
    set({ searchParams: { ...get().searchParams, ...params } });
  },

  clearCurrentTechnology: () => {
    set({ currentTechnology: null });
  },

  clearError: () => {
    set({ error: null });
  },
}));

// Selectors
export const useTechnologies = () => useTechnologyStore((state) => state.technologies);
export const useCurrentTechnology = () => useTechnologyStore((state) => state.currentTechnology);
export const useCategories = () => useTechnologyStore((state) => state.categories);
export const useSearchParams = () => useTechnologyStore((state) => state.searchParams);
export const useIsLoading = () => useTechnologyStore((state) => state.isLoading);
export const useError = () => useTechnologyStore((state) => state.error);

export const useTechnologyActions = () => useTechnologyStore((state) => ({
  fetchTechnologies: state.fetchTechnologies,
  fetchTechnology: state.fetchTechnology,
  fetchCategories: state.fetchCategories,
  createTechnology: state.createTechnology,
  updateTechnology: state.updateTechnology,
  deleteTechnology: state.deleteTechnology,
  submitTechnology: state.submitTechnology,
  setSearchParams: state.setSearchParams,
  clearCurrentTechnology: state.clearCurrentTechnology,
  clearError: state.clearError,
}));

