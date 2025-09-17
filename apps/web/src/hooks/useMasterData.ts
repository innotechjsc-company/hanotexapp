import { useState, useEffect } from 'react';

export interface MasterData {
  fields: Array<{ value: string; label: string }>;
  industries: Array<{ value: string; label: string }>;
  specialties: Array<{ value: string; label: string }>;
  trlLevels: Array<{ value: string; label: string }>;
  categories: Array<{ value: string; label: string }>;
  ipTypes: Array<{ value: string; label: string; description: string }>;
  ipStatuses: Array<{ value: string; label: string }>;
  protectionTerritories: Array<{ value: string; tooltip: string }>;
  certifications: Array<{ value: string; tooltip: string }>;
  commercializationMethods: Array<{ value: string; tooltip: string }>;
  transferMethods: Array<{ value: string; tooltip: string }>;
}

export const useMasterData = () => {
  const [masterData, setMasterData] = useState<MasterData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadMasterData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('/api/master-data/all');
        const result = await response.json();
        
        if (result.success) {
          setMasterData(result.data);
        } else {
          setError(result.error || 'Failed to load master data');
        }
      } catch (err) {
        setError('Network error while loading master data');
        console.error('Master data loading error:', err);
      } finally {
        setLoading(false);
      }
    };

    loadMasterData();
  }, []);

  return { masterData, loading, error };
};
