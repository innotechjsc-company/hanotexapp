import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useSession } from 'next-auth/react';
import LiveAuction from '../LiveAuction';
import { useAuctionWebSocket } from '@/hooks/useWebSocket';

// Mock next-auth/react
jest.mock('next-auth/react', () => ({
  useSession: jest.fn(),
}));

// Mock useAuctionWebSocket hook
jest.mock('@/hooks/useWebSocket', () => ({
  useAuctionWebSocket: jest.fn(),
}));

describe('LiveAuction', () => {
  const mockOnBidPlaced = jest.fn();
  const mockOnAuctionEnd = jest.fn();

  const mockAuction = {
    id: '1',
    technology_id: 'tech-1',
    auction_type: 'ENGLISH',
    start_price: 10000,
    reserve_price: 15000,
    current_price: 12000,
    start_time: new Date().toISOString(),
    end_time: new Date(Date.now() + 3600000).toISOString(), // 1 hour from now
    status: 'ACTIVE',
    technology_title: 'AI Technology',
    trl_level: 6,
    submitter_email: 'test@example.com',
    submitter_type: 'COMPANY',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const mockBids = [
    {
      id: '1',
      auction_id: '1',
      bidder_id: 'user-1',
      bid_amount: 12000,
      bid_time: new Date().toISOString(),
      is_winning: true,
      bidder_email: 'bidder@example.com',
      bidder_type: 'INDIVIDUAL',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    
    (useSession as jest.Mock).mockReturnValue({
      data: {
        user: {
          id: 'user-1',
          email: 'test@example.com',
          name: 'Test User',
          role: 'USER',
          userType: 'INDIVIDUAL',
        },
      },
    });

    (useAuctionWebSocket as jest.Mock).mockReturnValue({
      bids: mockBids,
      currentPrice: 12000,
      auctionStatus: 'ACTIVE',
      placeBid: jest.fn(),
      isConnected: true,
    });
  });

  it('renders auction information correctly', () => {
    render(
      <LiveAuction 
        auction={mockAuction} 
        onBidPlaced={mockOnBidPlaced}
        onAuctionEnd={mockOnAuctionEnd}
      />
    );
    
    expect(screen.getByText('AI Technology')).toBeInTheDocument();
    expect(screen.getByText('$12,000')).toBeInTheDocument();
    expect(screen.getByText('1 bids')).toBeInTheDocument();
    expect(screen.getByText('TRL 6')).toBeInTheDocument();
  });

  it('shows active status for active auction', () => {
    render(
      <LiveAuction 
        auction={mockAuction} 
        onBidPlaced={mockOnBidPlaced}
        onAuctionEnd={mockOnAuctionEnd}
      />
    );
    
    expect(screen.getByText('ACTIVE')).toBeInTheDocument();
  });

  it('shows ended status for ended auction', () => {
    (useAuctionWebSocket as jest.Mock).mockReturnValue({
      bids: mockBids,
      currentPrice: 12000,
      auctionStatus: 'ENDED',
      placeBid: jest.fn(),
      isConnected: true,
    });

    render(
      <LiveAuction 
        auction={mockAuction} 
        onBidPlaced={mockOnBidPlaced}
        onAuctionEnd={mockOnAuctionEnd}
      />
    );
    
    expect(screen.getByText('ENDED')).toBeInTheDocument();
    expect(screen.getByText('Auction Ended')).toBeInTheDocument();
  });

  it('renders bid history correctly', () => {
    render(
      <LiveAuction 
        auction={mockAuction} 
        onBidPlaced={mockOnBidPlaced}
        onAuctionEnd={mockOnAuctionEnd}
      />
    );
    
    expect(screen.getByText('Bid History')).toBeInTheDocument();
    expect(screen.getByText('$12,000')).toBeInTheDocument();
    expect(screen.getByText('bidder@example.com')).toBeInTheDocument();
    expect(screen.getByText('Winning')).toBeInTheDocument();
  });

  it('shows no bids message when no bids exist', () => {
    (useAuctionWebSocket as jest.Mock).mockReturnValue({
      bids: [],
      currentPrice: 10000,
      auctionStatus: 'ACTIVE',
      placeBid: jest.fn(),
      isConnected: true,
    });

    render(
      <LiveAuction 
        auction={mockAuction} 
        onBidPlaced={mockOnBidPlaced}
        onAuctionEnd={mockOnAuctionEnd}
      />
    );
    
    expect(screen.getByText('No bids yet')).toBeInTheDocument();
  });

  it('allows placing a bid when user is logged in', () => {
    render(
      <LiveAuction 
        auction={mockAuction} 
        onBidPlaced={mockOnBidPlaced}
        onAuctionEnd={mockOnAuctionEnd}
      />
    );
    
    const bidInput = screen.getByDisplayValue('13000');
    const placeBidButton = screen.getByRole('button', { name: /place bid/i });
    
    expect(bidInput).toBeInTheDocument();
    expect(placeBidButton).toBeInTheDocument();
    expect(placeBidButton).not.toBeDisabled();
  });

  it('disables bid button when user is not logged in', () => {
    (useSession as jest.Mock).mockReturnValue({
      data: null,
    });

    render(
      <LiveAuction 
        auction={mockAuction} 
        onBidPlaced={mockOnBidPlaced}
        onAuctionEnd={mockOnAuctionEnd}
      />
    );
    
    const placeBidButton = screen.getByRole('button', { name: /place bid/i });
    expect(placeBidButton).toBeDisabled();
    expect(screen.getByText(/sign in/i)).toBeInTheDocument();
  });

  it('shows connection status when not connected', () => {
    (useAuctionWebSocket as jest.Mock).mockReturnValue({
      bids: mockBids,
      currentPrice: 12000,
      auctionStatus: 'ACTIVE',
      placeBid: jest.fn(),
      isConnected: false,
    });

    render(
      <LiveAuction 
        auction={mockAuction} 
        onBidPlaced={mockOnBidPlaced}
        onAuctionEnd={mockOnAuctionEnd}
      />
    );
    
    expect(screen.getByText(/connecting to auction/i)).toBeInTheDocument();
  });

  it('validates bid amount is higher than current price', async () => {
    render(
      <LiveAuction 
        auction={mockAuction} 
        onBidPlaced={mockOnBidPlaced}
        onAuctionEnd={mockOnAuctionEnd}
      />
    );
    
    const bidInput = screen.getByDisplayValue('13000');
    const placeBidButton = screen.getByRole('button', { name: /place bid/i });
    
    // Set bid amount lower than current price
    fireEvent.change(bidInput, { target: { value: '11000' } });
    fireEvent.click(placeBidButton);
    
    await waitFor(() => {
      expect(screen.getByText(/bid amount must be higher/i)).toBeInTheDocument();
    });
  });

  it('calls onBidPlaced when bid is successfully placed', async () => {
    const mockPlaceBid = jest.fn();
    (useAuctionWebSocket as jest.Mock).mockReturnValue({
      bids: mockBids,
      currentPrice: 12000,
      auctionStatus: 'ACTIVE',
      placeBid: mockPlaceBid,
      isConnected: true,
    });

    render(
      <LiveAuction 
        auction={mockAuction} 
        onBidPlaced={mockOnBidPlaced}
        onAuctionEnd={mockOnAuctionEnd}
      />
    );
    
    const bidInput = screen.getByDisplayValue('13000');
    const placeBidButton = screen.getByRole('button', { name: /place bid/i });
    
    fireEvent.change(bidInput, { target: { value: '15000' } });
    fireEvent.click(placeBidButton);
    
    expect(mockPlaceBid).toHaveBeenCalledWith(15000);
  });

  it('shows reserve price when current price is below reserve', () => {
    (useAuctionWebSocket as jest.Mock).mockReturnValue({
      bids: mockBids,
      currentPrice: 12000,
      auctionStatus: 'ACTIVE',
      placeBid: jest.fn(),
      isConnected: true,
    });

    render(
      <LiveAuction 
        auction={mockAuction} 
        onBidPlaced={mockOnBidPlaced}
        onAuctionEnd={mockOnAuctionEnd}
      />
    );
    
    expect(screen.getByText(/reserve: \$15,000/i)).toBeInTheDocument();
  });

  it('calculates and displays time remaining', () => {
    render(
      <LiveAuction 
        auction={mockAuction} 
        onBidPlaced={mockOnBidPlaced}
        onAuctionEnd={mockOnAuctionEnd}
      />
    );
    
    // Should show some time remaining (exact format may vary)
    expect(screen.getByText(/h|m|s/)).toBeInTheDocument();
  });

  it('calls onAuctionEnd when auction time expires', () => {
    const pastAuction = {
      ...mockAuction,
      end_time: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    };

    render(
      <LiveAuction 
        auction={pastAuction} 
        onBidPlaced={mockOnBidPlaced}
        onAuctionEnd={mockOnAuctionEnd}
      />
    );
    
    expect(screen.getByText('Auction Ended')).toBeInTheDocument();
  });

  it('shows minimum bid amount correctly', () => {
    render(
      <LiveAuction 
        auction={mockAuction} 
        onBidPlaced={mockOnBidPlaced}
        onAuctionEnd={mockOnAuctionEnd}
      />
    );
    
    expect(screen.getByText(/minimum bid: \$13,000/i)).toBeInTheDocument();
  });

  it('displays auction type and submitter information', () => {
    render(
      <LiveAuction 
        auction={mockAuction} 
        onBidPlaced={mockOnBidPlaced}
        onAuctionEnd={mockOnAuctionEnd}
      />
    );
    
    expect(screen.getByText(/auction type/i)).toBeInTheDocument();
    expect(screen.getByText(/english/i)).toBeInTheDocument();
    expect(screen.getByText(/starting price/i)).toBeInTheDocument();
    expect(screen.getByText(/submitter/i)).toBeInTheDocument();
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
  });
});
