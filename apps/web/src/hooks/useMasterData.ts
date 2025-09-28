import { useState, useEffect } from 'react';

export interface MasterDataItem {
  value: string;
  label: string;
  description?: string;
  tooltip?: string;
}

export interface MasterData {
  fields: MasterDataItem[];
  trlLevels: MasterDataItem[];
  categories: MasterDataItem[];
  ipTypes: MasterDataItem[];
  ipStatuses: MasterDataItem[];
  protectionTerritories: MasterDataItem[];
  certifications: MasterDataItem[];
  commercializationMethods: MasterDataItem[];
  transferMethods: MasterDataItem[];
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
        
        const response = await fetch(`${process.env.NEXT_PUBLIC_PAYLOAD_API_URL || 'http://localhost:4000/api'}/master-data/all`);
        const result = await response.json();
        
        if (result.success) {
          // Transform API data to match component expectations
          const transformedData = {
            ...result.data,
            protectionTerritories: result.data.protectionTerritories.map((item: any) => ({
              value: item.value,
              label: item.value,
              description: item.tooltip,
              tooltip: item.tooltip
            })),
            certifications: result.data.certifications.map((item: any) => ({
              value: item.value,
              label: item.value,
              description: item.tooltip,
              tooltip: item.tooltip
            })),
            commercializationMethods: result.data.commercializationMethods.map((item: any) => ({
              value: item.value,
              label: item.value,
              description: item.tooltip,
              tooltip: item.tooltip
            })),
            transferMethods: result.data.transferMethods.map((item: any) => ({
              value: item.value,
              label: item.value,
              description: item.tooltip,
              tooltip: item.tooltip
            }))
          };
          setMasterData(transformedData);
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
