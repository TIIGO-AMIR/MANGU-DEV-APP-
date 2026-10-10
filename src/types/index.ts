export type UserRole = 'ADMIN' | 'BUYER' | 'SELLER' | 'RIDER';

export type ApprovalStatus = 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED';

export type OrderStatus =
  | 'PENDING_PAYMENT'
  | 'PAID'
  | 'SELLER_CONFIRMED'
  | 'READY_FOR_PICKUP'
  | 'RIDER_ASSIGNED'
  | 'PICKED_UP'
  | 'ON_THE_WAY'
  | 'DELIVERED'
  | 'COMPLETED'
  | 'PAYMENT_FAILED'
  | 'SELLER_REJECTED'
  | 'RIDER_CANCELLED'
  | 'BUYER_CANCELLED'
  | 'DELIVERY_FAILED'
  | 'DISPUTE'
  | 'REFUNDED';

export type PaymentMethod = 'MTN_MOMO' | 'AIRTEL_MONEY' | 'CASH_ON_DELIVERY' | 'CARD';
export type PaymentStatus = 'PENDING' | 'SUCCESS' | 'FAILED' | 'REFUNDED';

export interface User {
  id: string;
  name: string;
  phone: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  createdAt: string;
}

export interface SellerProfile {
  id: string;
  userId: string;
  businessName: string;
  ownerName: string;
  phone: string;
  locationZone: string; // e.g. "Nyendo", "Masaka CBD"
  addressDetails: string;
  categories: string[];
  description: string;
  status: ApprovalStatus;
  rejectionReason?: string;
  rating: number;
  totalOrders: number;
  bannerUrl: string;
  logoUrl: string;
  coordinates: { x: number; y: number }; // Relative coordinates on Masaka map
  permitNumber: string;
  nationalIdNumber: string;
  walletBalance: number; // in UGX
}

export interface RiderProfile {
  id: string;
  userId: string;
  fullName: string;
  phone: string;
  nationalId: string;
  drivingLicenseNo: string;
  bodaRegistrationNo: string; // e.g. "UEX 421B"
  bodaModel: string; // e.g. "Bajaj Boxer 150"
  locationZone: string; // current active zone
  status: ApprovalStatus;
  rejectionReason?: string;
  isOnline: boolean;
  rating: number;
  completedDeliveries: number;
  walletBalance: number; // in UGX
  coordinates: { x: number; y: number };
  avatarUrl: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  iconName: string;
  color: string;
  itemCount: number;
}

export interface Product {
  id: string;
  sellerId: string;
  name: string;
  description: string;
  category: string;
  priceUgx: number;
  imageUrl: string;
  isAvailable: boolean;
  inventoryCount: number;
  preparationMinutes: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  notes?: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  priceUgx: number; // snapshot at time of order
  quantity: number;
  totalUgx: number;
}

export interface Order {
  id: string;
  orderNumber: string; // e.g. "MG-8421"
  buyerId: string;
  buyerName: string;
  buyerPhone: string;
  sellerId: string;
  sellerName: string;
  sellerZone: string;
  sellerCoordinates: { x: number; y: number };
  riderId?: string;
  riderName?: string;
  riderPhone?: string;
  riderBodaPlate?: string;
  riderCoordinates?: { x: number; y: number };
  items: OrderItem[];
  subtotalUgx: number;
  serviceFeeUgx: number; // e.g. UGX 1,000
  deliveryFeeUgx: number; // e.g. UGX 3,500
  commissionUgx: number; // 5% = platform revenue
  platformDeliveryMarginUgx: number; // e.g. UGX 1,500
  totalUgx: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  deliveryAddress: {
    zone: string;
    street: string;
    landmark: string;
    coordinates: { x: number; y: number };
  };
  deliveryPin: string; // 4-digit PIN e.g. "7294"
  createdAt: string;
  updatedAt: string;
  estimatedDeliveryMinutes: number;
  notes?: string;
  buyerReview?: {
    rating: number;
    comment: string;
    createdAt: string;
  };
}

export interface ServiceArea {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  baseDeliveryFeeUgx: number;
  averageTimeMin: number;
  activeRidersCount: number;
  demandLevel: 'Low' | 'Medium' | 'High' | 'Surge';
  mapCoords: { x: number; y: number; radius: number };
}

export interface AuditLog {
  id: string;
  timestamp: string;
  action: string;
  actorRole: UserRole;
  actorName: string;
  details: string;
  targetId?: string;
}

export interface Dispute {
  id: string;
  orderId: string;
  orderNumber: string;
  raisedBy: 'BUYER' | 'SELLER' | 'RIDER';
  reason: string;
  status: 'OPEN' | 'INVESTIGATING' | 'RESOLVED' | 'DISMISSED';
  amountUgx: number;
  createdAt: string;
  resolutionNote?: string;
}

export interface SettlementRecord {
  id: string;
  recipientType: 'SELLER' | 'RIDER';
  recipientName: string;
  orderNumber: string;
  amountUgx: number;
  feeDeductedUgx: number;
  netPayoutUgx: number;
  method: 'MTN_MOMO' | 'AIRTEL_MONEY' | 'BANK';
  status: 'PROCESSED' | 'PENDING';
  timestamp: string;
}
