// Export all types and interfaces
export type {
  NotificationData,
  NotificationType,
  NotificationPriority,
  NotificationResult,
  BatchNotificationResult,
  ProposeContext,
  AuctionContext,
  ContractContext,
  NegotiationContext,
  RoomMessageContext,
} from './NotificationManager'

// Export the main class and instance
export { NotificationManager, notificationManager } from './NotificationManager'

// Export API endpoints (for reference)
export * as acceptProposeAPI from './acceptPropose/route'
export * as auctionBidAPI from './auctionBid/route'
export * as acceptOfferAPI from './acceptOffer/route'
export * as roomMessageAPI from './roomMessage/route'
export * as contractAPI from './contract/route'
export * as customAPI from './custom/route'
