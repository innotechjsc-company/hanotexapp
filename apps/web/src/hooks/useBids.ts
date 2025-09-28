/**
 * Custom hook for bid management
 */

import { useState } from 'react';
import { createBid, getBidsByAuction } from '@/api/bids';
import { Bid } from '@/types/bids';
import { useAuthStore } from '@/store/auth';
import toast from 'react-hot-toast';

export interface UseBidsReturn {
  bids: Bid[];
  loading: boolean;
  error: string | null;
  placeBid: (auctionId: string, amount: number, bidType?: 'MANUAL' | 'AUTO') => Promise<boolean>;
  fetchBids: (auctionId: string) => Promise<void>;
  refreshBids: () => Promise<void>;
}

export function useBids(): UseBidsReturn {
  const [bids, setBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentAuctionId, setCurrentAuctionId] = useState<string | null>(null);

  const fetchBids = async (auctionId: string) => {
    try {
      setLoading(true);
      setError(null);
      setCurrentAuctionId(auctionId);
      
      // Use web API endpoint instead of direct API client
      const response = await fetch(`/api/bids?auction_id=${auctionId}&limit=50&sort=-bid_time`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch bids');
      }
      
      const data = await response.json();
      
      if (data.success) {
        const bidsList = Array.isArray(data.data) ? data.data : (data.data?.docs || []);
        setBids(bidsList);
      } else {
        throw new Error(data.error || 'Failed to fetch bids');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch bids';
      setError(errorMessage);
      console.error('Error fetching bids:', err);
      setBids([]);
    } finally {
      setLoading(false);
    }
  };

  const refreshBids = async () => {
    if (currentAuctionId) {
      await fetchBids(currentAuctionId);
    }
  };

  const placeBid = async (
    auctionId: string, 
    amount: number, 
    bidType: 'MANUAL' | 'AUTO' = 'MANUAL'
  ): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      // Get auth token from store
      const { token, isAuthenticated } = useAuthStore.getState();
      
      if (!isAuthenticated || !token) {
        throw new Error('Authentication required. Please login first.');
      }

      // Call API to place bid
      const response = await fetch('/api/bids', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          auction_id: auctionId,
          amount,
          bid_type: bidType,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to place bid');
      }

      const data = await response.json();
      
      // Update local bids state
      if (data.success && data.data) {
        setBids(prevBids => [data.data, ...prevBids]);
      }

      // Emit events for other components to listen
      window.dispatchEvent(new CustomEvent('bidPlaced', { 
        detail: { auctionId, amount, bid: data.data } 
      }));
      window.dispatchEvent(new CustomEvent('auctionUpdated', { 
        detail: { auctionId } 
      }));

      toast.success('Đặt giá thành công!');
      return true;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to place bid';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('Error placing bid:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    bids,
    loading,
    error,
    placeBid,
    fetchBids,
    refreshBids,
  };
}