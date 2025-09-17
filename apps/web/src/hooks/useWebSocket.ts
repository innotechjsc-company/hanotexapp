import { useEffect, useRef, useState } from 'react';
import { useSession } from 'next-auth/react';
import webSocketManager from '@/lib/websocket';

export function useWebSocket() {
  const { data: session } = useSession();
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const socketRef = useRef<any>(null);

  useEffect(() => {
    if (session?.apiToken) {
      const socket = webSocketManager.connect(session.apiToken);
      socketRef.current = socket;

      const handleConnect = () => {
        setIsConnected(true);
        setConnectionError(null);
      };

      const handleDisconnect = () => {
        setIsConnected(false);
      };

      const handleError = (error: any) => {
        setConnectionError(error.message || 'Connection error');
        setIsConnected(false);
      };

      socket.on('connect', handleConnect);
      socket.on('disconnect', handleDisconnect);
      socket.on('connect_error', handleError);

      return () => {
        socket.off('connect', handleConnect);
        socket.off('disconnect', handleDisconnect);
        socket.off('connect_error', handleError);
      };
    }
  }, [session?.apiToken]);

  useEffect(() => {
    return () => {
      if (socketRef.current) {
        webSocketManager.disconnect();
      }
    };
  }, []);

  return {
    socket: socketRef.current,
    isConnected,
    connectionError,
    connect: () => webSocketManager.connect(session?.apiToken),
    disconnect: () => webSocketManager.disconnect(),
  };
}

// Hook for auction-specific WebSocket functionality
export function useAuctionWebSocket(auctionId?: string) {
  const { socket, isConnected } = useWebSocket();
  const [bids, setBids] = useState<any[]>([]);
  const [currentPrice, setCurrentPrice] = useState<number>(0);
  const [auctionStatus, setAuctionStatus] = useState<string>('');

  useEffect(() => {
    if (socket && auctionId) {
      // Join auction room
      webSocketManager.joinAuction(auctionId);

      // Set up event listeners
      const handleBidUpdate = (data: any) => {
        setBids(prev => [data, ...prev]);
        setCurrentPrice(data.bidAmount);
      };

      const handleAuctionStatusChange = (data: any) => {
        setAuctionStatus(data.status);
      };

      webSocketManager.onBidUpdate(handleBidUpdate);
      webSocketManager.onAuctionStatusChange(handleAuctionStatusChange);

      return () => {
        webSocketManager.leaveAuction(auctionId);
        webSocketManager.off('bid_update', handleBidUpdate);
        webSocketManager.off('auction_status_change', handleAuctionStatusChange);
      };
    }
  }, [socket, auctionId]);

  const placeBid = (bidAmount: number) => {
    if (socket && auctionId) {
      webSocketManager.placeBid(auctionId, bidAmount);
    }
  };

  return {
    bids,
    currentPrice,
    auctionStatus,
    placeBid,
    isConnected,
  };
}

// Hook for notifications
export function useNotifications() {
  const { socket } = useWebSocket();
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    if (socket) {
      const handleNotification = (data: any) => {
        setNotifications(prev => [data, ...prev]);
      };

      webSocketManager.onNotification(handleNotification);

      return () => {
        webSocketManager.off('notification', handleNotification);
      };
    }
  }, [socket]);

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId 
          ? { ...notif, isRead: true }
          : notif
      )
    );
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  return {
    notifications,
    markAsRead,
    clearNotifications,
    unreadCount: notifications.filter(n => !n.isRead).length,
  };
}
