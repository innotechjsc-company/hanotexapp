import { io, Socket } from 'socket.io-client';

class WebSocketManager {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;

  connect(token?: string): Socket {
    if (this.socket?.connected) {
      return this.socket;
    }

    const socketUrl = process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:3001';
    
    this.socket = io(socketUrl, {
      auth: {
        token: token
      },
      transports: ['websocket', 'polling'],
      timeout: 20000,
      forceNew: true
    });

    this.setupEventListeners();
    return this.socket;
  }

  private setupEventListeners() {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('WebSocket connected:', this.socket?.id);
      this.reconnectAttempts = 0;
    });

    this.socket.on('disconnect', (reason) => {
      console.log('WebSocket disconnected:', reason);
      this.handleReconnect();
    });

    this.socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
      this.handleReconnect();
    });

    this.socket.on('error', (error) => {
      console.error('WebSocket error:', error);
    });
  }

  private handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
      
      setTimeout(() => {
        console.log(`Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
        this.socket?.connect();
      }, delay);
    } else {
      console.error('Max reconnection attempts reached');
    }
  }

  // Auction events
  joinAuction(auctionId: string) {
    this.socket?.emit('join_auction', { auctionId });
  }

  leaveAuction(auctionId: string) {
    this.socket?.emit('leave_auction', { auctionId });
  }

  placeBid(auctionId: string, bidAmount: number) {
    this.socket?.emit('place_bid', { auctionId, bidAmount });
  }

  onBidUpdate(callback: (data: any) => void) {
    this.socket?.on('bid_update', callback);
  }

  onAuctionStatusChange(callback: (data: any) => void) {
    this.socket?.on('auction_status_change', callback);
  }

  // Notification events
  onNotification(callback: (data: any) => void) {
    this.socket?.on('notification', callback);
  }

  // Technology events
  onTechnologyUpdate(callback: (data: any) => void) {
    this.socket?.on('technology_update', callback);
  }

  onTechnologyApproval(callback: (data: any) => void) {
    this.socket?.on('technology_approval', callback);
  }

  // User events
  onUserStatusChange(callback: (data: any) => void) {
    this.socket?.on('user_status_change', callback);
  }

  // Generic event handlers
  on(event: string, callback: (...args: any[]) => void) {
    this.socket?.on(event, callback);
  }

  off(event: string, callback?: (...args: any[]) => void) {
    this.socket?.off(event, callback);
  }

  emit(event: string, data?: any) {
    this.socket?.emit(event, data);
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  getSocket(): Socket | null {
    return this.socket;
  }
}

// Create singleton instance
const webSocketManager = new WebSocketManager();

export default webSocketManager;

// Hook for React components
export function useWebSocket() {
  return webSocketManager;
}
