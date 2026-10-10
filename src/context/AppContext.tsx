import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Category,
  Product,
  SellerProfile,
  RiderProfile,
  Order,
  CartItem,
  ServiceArea,
  AuditLog,
  Dispute,
  SettlementRecord,
  OrderStatus,
  PaymentMethod,
  UserRole,
} from '../types';
import {
  INITIAL_CATEGORIES,
  INITIAL_SELLERS,
  INITIAL_PRODUCTS,
  INITIAL_RIDERS,
  INITIAL_SERVICE_AREAS,
  INITIAL_ORDERS,
  INITIAL_AUDIT_LOGS,
  INITIAL_DISPUTES,
  INITIAL_SETTLEMENTS,
} from '../data/initialData';

interface AppContextType {
  // Roles & View navigation
  activePlatform: UserRole | 'SIMULATOR' | 'PORTAL';
  setActivePlatform: (platform: UserRole | 'SIMULATOR' | 'PORTAL') => void;
  isStandaloneMode: boolean;
  setIsStandaloneMode: (val: boolean) => void;

  // Data Collections
  categories: Category[];
  sellers: SellerProfile[];
  riders: RiderProfile[];
  products: Product[];
  orders: Order[];
  cart: CartItem[];
  serviceAreas: ServiceArea[];
  auditLogs: AuditLog[];
  disputes: Dispute[];
  settlements: SettlementRecord[];

  // Active contexts
  currentSellerId: string;
  setCurrentSellerId: (id: string) => void;
  currentRiderId: string;
  setCurrentRiderId: (id: string) => void;
  selectedOrderId: string | null;
  setSelectedOrderId: (id: string | null) => void;

  // Cart operations
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;

  // Order Lifecycle Operations
  placeOrder: (params: {
    deliveryZone: string;
    street: string;
    landmark: string;
    coordinates?: { x: number; y: number };
    paymentMethod: PaymentMethod;
    notes?: string;
  }) => Order | null;
  sellerConfirmOrder: (orderId: string) => void;
  sellerMarkReady: (orderId: string) => void;
  riderAcceptJob: (orderId: string, riderId?: string) => void;
  riderPickupPackage: (orderId: string) => void;
  riderVerifyDeliveryPin: (orderId: string, enteredPin: string) => { success: boolean; message: string };
  submitBuyerReview: (orderId: string, rating: number, comment: string) => void;

  // Admin Controls
  adminApproveSeller: (sellerId: string) => void;
  adminRejectSeller: (sellerId: string, reason: string) => void;
  adminApproveRider: (riderId: string) => void;
  adminRejectRider: (riderId: string, reason: string) => void;
  adminOverrideOrderStatus: (orderId: string, status: OrderStatus) => void;
  toggleServiceArea: (areaId: string) => void;
  resolveDispute: (disputeId: string, resolution: string) => void;

  // Seller operations
  toggleProductAvailability: (productId: string) => void;
  updateProductStock: (productId: string, delta: number) => void;
  addProduct: (product: Omit<Product, 'id'>) => void;
  submitSellerApplication: (data: Partial<SellerProfile>) => void;

  // Rider operations
  toggleRiderOnline: (riderId?: string) => void;
  submitRiderApplication: (data: Partial<RiderProfile>) => void;

  // Simulation & Quick Demo
  fastTrackDemoOrder: () => void;
  stepForwardOrder: (orderId: string) => void;
  resetDemoData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const getInitialPlatform = (): UserRole | 'SIMULATOR' | 'PORTAL' => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const app = params.get('app')?.toUpperCase();
      if (app === 'BUYER') return 'BUYER';
      if (app === 'SELLER') return 'SELLER';
      if (app === 'RIDER') return 'RIDER';
      if (app === 'ADMIN') return 'ADMIN';
      if (app === 'SIMULATOR') return 'SIMULATOR';
      if (app === 'HUB' || app === 'PORTAL') return 'PORTAL';
    }
    return 'PORTAL';
  };

  const [activePlatform, setActivePlatformState] = useState<UserRole | 'SIMULATOR' | 'PORTAL'>(getInitialPlatform);
  const [isStandaloneMode, setIsStandaloneMode] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    const params = new URLSearchParams(window.location.search);
    return (
      params.get('standalone') === 'true' ||
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true
    );
  });

  const setActivePlatform = (platform: UserRole | 'SIMULATOR' | 'PORTAL') => {
    setActivePlatformState(platform);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('app', platform.toLowerCase());
      window.history.replaceState({}, '', url.toString());

      // Update page title & favicon dynamically for the active app
      if (platform === 'BUYER') {
        document.title = 'ManguDelivery - Buyer App (Masaka)';
      } else if (platform === 'SELLER') {
        document.title = 'ManguDelivery - Merchant Store (Masaka)';
      } else if (platform === 'RIDER') {
        document.title = 'ManguDelivery - Boda Rider (Masaka)';
      } else if (platform === 'ADMIN') {
        document.title = 'ManguDelivery - Admin Control Plane';
      } else {
        document.title = 'ManguDelivery - Masaka City Hub';
      }
    }
  };
  const [categories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [sellers, setSellers] = useState<SellerProfile[]>(() => {
    const saved = localStorage.getItem('mangudelivery_sellers');
    return saved ? JSON.parse(saved) : INITIAL_SELLERS;
  });
  const [riders, setRiders] = useState<RiderProfile[]>(() => {
    const saved = localStorage.getItem('mangudelivery_riders');
    return saved ? JSON.parse(saved) : INITIAL_RIDERS;
  });
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('mangudelivery_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('mangudelivery_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('mangudelivery_cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [serviceAreas, setServiceAreas] = useState<ServiceArea[]>(() => {
    const saved = localStorage.getItem('mangudelivery_service_areas');
    return saved ? JSON.parse(saved) : INITIAL_SERVICE_AREAS;
  });
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem('mangudelivery_audit_logs');
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });
  const [disputes, setDisputes] = useState<Dispute[]>(() => {
    const saved = localStorage.getItem('mangudelivery_disputes');
    return saved ? JSON.parse(saved) : INITIAL_DISPUTES;
  });
  const [settlements, setSettlements] = useState<SettlementRecord[]>(() => {
    const saved = localStorage.getItem('mangudelivery_settlements');
    return saved ? JSON.parse(saved) : INITIAL_SETTLEMENTS;
  });

  const [currentSellerId, setCurrentSellerId] = useState<string>('seller-1');
  const [currentRiderId, setCurrentRiderId] = useState<string>('rider-1');
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>('ord-1');

  // Persistence
  useEffect(() => {
    localStorage.setItem('mangudelivery_sellers', JSON.stringify(sellers));
  }, [sellers]);
  useEffect(() => {
    localStorage.setItem('mangudelivery_riders', JSON.stringify(riders));
  }, [riders]);
  useEffect(() => {
    localStorage.setItem('mangudelivery_products', JSON.stringify(products));
  }, [products]);
  useEffect(() => {
    localStorage.setItem('mangudelivery_orders', JSON.stringify(orders));
  }, [orders]);
  useEffect(() => {
    localStorage.setItem('mangudelivery_cart', JSON.stringify(cart));
  }, [cart]);
  useEffect(() => {
    localStorage.setItem('mangudelivery_service_areas', JSON.stringify(serviceAreas));
  }, [serviceAreas]);
  useEffect(() => {
    localStorage.setItem('mangudelivery_audit_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);
  useEffect(() => {
    localStorage.setItem('mangudelivery_settlements', JSON.stringify(settlements));
  }, [settlements]);

  // Helper: Log audit trail
  const addAudit = (action: string, actorRole: UserRole, actorName: string, details: string, targetId?: string) => {
    const newLog: AuditLog = {
      id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
      action,
      actorRole,
      actorName,
      details,
      targetId,
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  // Cart operations
  const addToCart = (product: Product, quantity: number = 1) => {
    setCart((prev) => {
      // Check if item belongs to different seller (enforce single-seller per delivery in Masaka pilot)
      if (prev.length > 0 && prev[0].product.sellerId !== product.sellerId) {
        // Replace cart with new seller's item
        return [{ product, quantity }];
      }
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.product.id === productId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => setCart([]);

  const cartTotal = cart.reduce((sum, item) => sum + item.product.priceUgx * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Place Order (Buyer flow)
  const placeOrder = ({
    deliveryZone,
    street,
    landmark,
    coordinates = { x: 48, y: 52 },
    paymentMethod,
    notes,
  }: {
    deliveryZone: string;
    street: string;
    landmark: string;
    coordinates?: { x: number; y: number };
    paymentMethod: PaymentMethod;
    notes?: string;
  }): Order | null => {
    if (cart.length === 0) return null;

    const seller = sellers.find((s) => s.id === cart[0].product.sellerId);
    if (!seller) return null;

    const subtotalUgx = cartTotal;
    const serviceFeeUgx = 1000; // Platform buyer fee
    const deliveryFeeUgx = 3500; // Standard Masaka Boda fare
    const commissionUgx = Math.round(subtotalUgx * 0.05); // 5%
    const platformDeliveryMarginUgx = 1500;
    const totalUgx = subtotalUgx + serviceFeeUgx + deliveryFeeUgx;

    // Generate secure 4-digit PIN for delivery verification
    const pin = Math.floor(1000 + Math.random() * 9000).toString();
    const orderNumber = `MD-${Math.floor(1000 + Math.random() * 9000)}`;

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber,
      buyerId: 'user-buyer-active',
      buyerName: 'Grace Nalubega',
      buyerPhone: '+256 702 334 190',
      sellerId: seller.id,
      sellerName: seller.businessName,
      sellerZone: seller.locationZone,
      sellerCoordinates: seller.coordinates,
      items: cart.map((item) => ({
        id: `item-${Date.now()}-${item.product.id}`,
        productId: item.product.id,
        productName: item.product.name,
        priceUgx: item.product.priceUgx,
        quantity: item.quantity,
        totalUgx: item.product.priceUgx * item.quantity,
      })),
      subtotalUgx,
      serviceFeeUgx,
      deliveryFeeUgx,
      commissionUgx,
      platformDeliveryMarginUgx,
      totalUgx,
      paymentMethod,
      paymentStatus: paymentMethod === 'CASH_ON_DELIVERY' ? 'PENDING' : 'SUCCESS',
      orderStatus: 'PAID',
      deliveryAddress: {
        zone: deliveryZone,
        street,
        landmark,
        coordinates,
      },
      deliveryPin: pin,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      estimatedDeliveryMinutes: 20,
      notes,
    };

    setOrders((prev) => [newOrder, ...prev]);
    setSelectedOrderId(newOrder.id);
    clearCart();

    addAudit(
      'ORDER_CREATED_AND_PAID',
      'BUYER',
      'Grace Nalubega',
      `Order #${orderNumber} placed for UGX ${totalUgx.toLocaleString()} via ${paymentMethod}. PIN issued.`,
      newOrder.id
    );

    return newOrder;
  };

  // Seller accepts order
  const sellerConfirmOrder = (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          const updated = {
            ...o,
            orderStatus: 'SELLER_CONFIRMED' as OrderStatus,
            updatedAt: new Date().toISOString(),
          };
          addAudit(
            'ORDER_SELLER_CONFIRMED',
            'SELLER',
            o.sellerName,
            `Merchant confirmed preparation for Order #${o.orderNumber}`,
            orderId
          );
          return updated;
        }
        return o;
      })
    );
  };

  // Seller marks ready for pickup -> Dispatches to closest active online Rider!
  const sellerMarkReady = (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          // Find an online rider to auto-dispatch
          const activeRider = riders.find((r) => r.isOnline && r.status === 'APPROVED') || riders[0];

          const updated: Order = {
            ...o,
            orderStatus: 'RIDER_ASSIGNED',
            riderId: activeRider.id,
            riderName: activeRider.fullName,
            riderPhone: activeRider.phone,
            riderBodaPlate: activeRider.bodaRegistrationNo,
            riderCoordinates: { ...activeRider.coordinates },
            updatedAt: new Date().toISOString(),
          };

          addAudit(
            'ORDER_READY_AND_DISPATCHED',
            'SELLER',
            o.sellerName,
            `Order #${o.orderNumber} packed. Dispatched to Rider ${activeRider.fullName} (${activeRider.bodaRegistrationNo}).`,
            orderId
          );
          return updated;
        }
        return o;
      })
    );
  };

  // Rider accepts job explicitly
  const riderAcceptJob = (orderId: string, riderId?: string) => {
    const assignedRider = riders.find((r) => r.id === (riderId || currentRiderId)) || riders[0];
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          const updated: Order = {
            ...o,
            orderStatus: 'RIDER_ASSIGNED',
            riderId: assignedRider.id,
            riderName: assignedRider.fullName,
            riderPhone: assignedRider.phone,
            riderBodaPlate: assignedRider.bodaRegistrationNo,
            riderCoordinates: { ...assignedRider.coordinates },
            updatedAt: new Date().toISOString(),
          };
          addAudit(
            'RIDER_ACCEPTED_JOB',
            'RIDER',
            assignedRider.fullName,
            `Boda rider accepted delivery job for Order #${o.orderNumber}`,
            orderId
          );
          return updated;
        }
        return o;
      })
    );
  };

  // Rider collects package at seller store
  const riderPickupPackage = (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          // Move rider coordinates towards buyer
          const midX = Math.round((o.sellerCoordinates.x + o.deliveryAddress.coordinates.x) / 2);
          const midY = Math.round((o.sellerCoordinates.y + o.deliveryAddress.coordinates.y) / 2);

          const updated: Order = {
            ...o,
            orderStatus: 'ON_THE_WAY',
            riderCoordinates: { x: midX, y: midY },
            updatedAt: new Date().toISOString(),
          };
          addAudit(
            'ORDER_PICKED_UP_ON_THE_WAY',
            'RIDER',
            o.riderName || 'Boda Partner',
            `Package collected from ${o.sellerName}. En route to ${o.deliveryAddress.zone}.`,
            orderId
          );
          return updated;
        }
        return o;
      })
    );
  };

  // Rider enters the 4-digit PIN given by the buyer upon physical handoff
  const riderVerifyDeliveryPin = (
    orderId: string,
    enteredPin: string
  ): { success: boolean; message: string } => {
    const targetOrder = orders.find((o) => o.id === orderId);
    if (!targetOrder) {
      return { success: false, message: 'Order not found.' };
    }

    if (targetOrder.deliveryPin !== enteredPin.trim()) {
      return {
        success: false,
        message: 'Invalid Delivery PIN! Please ask the buyer to check their ManguDelivery app screen.',
      };
    }

    // PIN is correct! Complete order, credit seller wallet, credit rider wallet, record settlements
    const sellerPayout = targetOrder.subtotalUgx - targetOrder.commissionUgx;
    const riderPayout = targetOrder.deliveryFeeUgx;

    // Update Seller Wallet
    setSellers((prev) =>
      prev.map((s) =>
        s.id === targetOrder.sellerId
          ? {
              ...s,
              walletBalance: s.walletBalance + sellerPayout,
              totalOrders: s.totalOrders + 1,
            }
          : s
      )
    );

    // Update Rider Wallet
    if (targetOrder.riderId) {
      setRiders((prev) =>
        prev.map((r) =>
          r.id === targetOrder.riderId
            ? {
                ...r,
                walletBalance: r.walletBalance + riderPayout,
                completedDeliveries: r.completedDeliveries + 1,
                coordinates: { ...targetOrder.deliveryAddress.coordinates },
              }
            : r
        )
      );
    }

    // Record settlements
    const newSettlements: SettlementRecord[] = [
      {
        id: `set-${Date.now()}-seller`,
        recipientType: 'SELLER',
        recipientName: targetOrder.sellerName,
        orderNumber: targetOrder.orderNumber,
        amountUgx: targetOrder.subtotalUgx,
        feeDeductedUgx: targetOrder.commissionUgx,
        netPayoutUgx: sellerPayout,
        method: targetOrder.paymentMethod === 'AIRTEL_MONEY' ? 'AIRTEL_MONEY' : 'MTN_MOMO',
        status: 'PROCESSED',
        timestamp: new Date().toISOString(),
      },
      {
        id: `set-${Date.now()}-rider`,
        recipientType: 'RIDER',
        recipientName: targetOrder.riderName || 'Boda Partner',
        orderNumber: targetOrder.orderNumber,
        amountUgx: riderPayout,
        feeDeductedUgx: 0,
        netPayoutUgx: riderPayout,
        method: 'MTN_MOMO',
        status: 'PROCESSED',
        timestamp: new Date().toISOString(),
      },
    ];
    setSettlements((prev) => [...newSettlements, ...prev]);

    // Update Order to COMPLETED
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              orderStatus: 'COMPLETED',
              paymentStatus: 'SUCCESS',
              riderCoordinates: { ...o.deliveryAddress.coordinates },
              updatedAt: new Date().toISOString(),
            }
          : o
      )
    );

    addAudit(
      'ORDER_DELIVERED_SECURE_PIN_VERIFIED',
      'RIDER',
      targetOrder.riderName || 'Boda Partner',
      `4-Digit PIN (${enteredPin}) verified successfully. Order #${targetOrder.orderNumber} completed. Financials settled.`,
      orderId
    );

    return {
      success: true,
      message: `Delivery confirmed! UGX ${riderPayout.toLocaleString()} credited to Rider Wallet.`,
    };
  };

  const submitBuyerReview = (orderId: string, rating: number, comment: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              buyerReview: {
                rating,
                comment,
                createdAt: new Date().toISOString(),
              },
            }
          : o
      )
    );
    addAudit('BUYER_REVIEW_SUBMITTED', 'BUYER', 'Grace Nalubega', `Rated ${rating} stars: "${comment}"`, orderId);
  };

  // Admin Controls
  const adminApproveSeller = (sellerId: string) => {
    setSellers((prev) =>
      prev.map((s) => (s.id === sellerId ? { ...s, status: 'APPROVED', rejectionReason: undefined } : s))
    );
    const seller = sellers.find((s) => s.id === sellerId);
    addAudit(
      'ADMIN_SELLER_APPROVED',
      'ADMIN',
      'Mangu Admin Control',
      `Approved merchant application for ${seller?.businessName || sellerId}. Trading permit verified.`,
      sellerId
    );
  };

  const adminRejectSeller = (sellerId: string, reason: string) => {
    setSellers((prev) =>
      prev.map((s) => (s.id === sellerId ? { ...s, status: 'REJECTED', rejectionReason: reason } : s))
    );
    addAudit('ADMIN_SELLER_REJECTED', 'ADMIN', 'Mangu Admin Control', `Rejected seller application: ${reason}`, sellerId);
  };

  const adminApproveRider = (riderId: string) => {
    setRiders((prev) =>
      prev.map((r) => (r.id === riderId ? { ...r, status: 'APPROVED', rejectionReason: undefined } : r))
    );
    const rider = riders.find((r) => r.id === riderId);
    addAudit(
      'ADMIN_RIDER_APPROVED',
      'ADMIN',
      'Mangu Admin Control',
      `Approved Boda delivery partner ${rider?.fullName} (${rider?.bodaRegistrationNo}). Driving licence verified.`,
      riderId
    );
  };

  const adminRejectRider = (riderId: string, reason: string) => {
    setRiders((prev) =>
      prev.map((r) => (r.id === riderId ? { ...r, status: 'REJECTED', rejectionReason: reason } : r))
    );
    addAudit('ADMIN_RIDER_REJECTED', 'ADMIN', 'Mangu Admin Control', `Rejected Boda rider application: ${reason}`, riderId);
  };

  const adminOverrideOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, orderStatus: status, updatedAt: new Date().toISOString() } : o))
    );
    addAudit('ADMIN_ORDER_STATUS_OVERRIDE', 'ADMIN', 'Mangu Admin Control', `Overrode status to ${status}`, orderId);
  };

  const toggleServiceArea = (areaId: string) => {
    setServiceAreas((prev) =>
      prev.map((a) => (a.id === areaId ? { ...a, isActive: !a.isActive } : a))
    );
  };

  const resolveDispute = (disputeId: string, resolution: string) => {
    setDisputes((prev) =>
      prev.map((d) => (d.id === disputeId ? { ...d, status: 'RESOLVED', resolutionNote: resolution } : d))
    );
    addAudit('DISPUTE_RESOLVED', 'ADMIN', 'Mangu Admin Control', `Resolved case: ${resolution}`, disputeId);
  };

  // Seller operations
  const toggleProductAvailability = (productId: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, isAvailable: !p.isAvailable } : p))
    );
  };

  const updateProductStock = (productId: string, delta: number) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          const next = Math.max(0, p.inventoryCount + delta);
          return { ...p, inventoryCount: next, isAvailable: next > 0 };
        }
        return p;
      })
    );
  };

  const addProduct = (prodData: Omit<Product, 'id'>) => {
    const newProd: Product = {
      ...prodData,
      id: `prod-${Date.now()}`,
    };
    setProducts((prev) => [newProd, ...prev]);
  };

  const submitSellerApplication = (data: Partial<SellerProfile>) => {
    const newSeller: SellerProfile = {
      id: `seller-${Date.now()}`,
      userId: `user-seller-${Date.now()}`,
      businessName: data.businessName || 'New Masaka Shop',
      ownerName: data.ownerName || 'Merchant Owner',
      phone: data.phone || '+256 772 000 000',
      locationZone: data.locationZone || 'Masaka CBD',
      addressDetails: data.addressDetails || 'Masaka Town',
      categories: data.categories || ['Food & Luwombo'],
      description: data.description || 'Quality local goods and services in Masaka.',
      status: 'PENDING_APPROVAL',
      rating: 5.0,
      totalOrders: 0,
      bannerUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80',
      logoUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=200&auto=format&fit=crop&q=80',
      coordinates: { x: 50, y: 50 },
      permitNumber: data.permitNumber || `MSK-TRADE-${Math.floor(1000 + Math.random() * 9000)}`,
      nationalIdNumber: data.nationalIdNumber || 'CM900000000000X',
      walletBalance: 0,
    };
    setSellers((prev) => [...prev, newSeller]);
    setCurrentSellerId(newSeller.id);
    addAudit(
      'SELLER_APPLICATION_SUBMITTED',
      'SELLER',
      newSeller.businessName,
      `Registered shop "${newSeller.businessName}" in ${newSeller.locationZone}. Pending admin approval.`,
      newSeller.id
    );
  };

  // Rider operations
  const toggleRiderOnline = (riderId?: string) => {
    const targetId = riderId || currentRiderId;
    setRiders((prev) =>
      prev.map((r) => (r.id === targetId ? { ...r, isOnline: !r.isOnline } : r))
    );
  };

  const submitRiderApplication = (data: Partial<RiderProfile>) => {
    const newRider: RiderProfile = {
      id: `rider-${Date.now()}`,
      userId: `user-rider-${Date.now()}`,
      fullName: data.fullName || 'Boda Partner',
      phone: data.phone || '+256 700 000 000',
      nationalId: data.nationalId || 'CM950000000000Y',
      drivingLicenseNo: data.drivingLicenseNo || `DL-UG-${Math.floor(10000 + Math.random() * 90000)}`,
      bodaRegistrationNo: data.bodaRegistrationNo || 'UFC 123Z',
      bodaModel: data.bodaModel || 'Bajaj Boxer 150',
      locationZone: data.locationZone || 'Masaka CBD',
      status: 'PENDING_APPROVAL',
      isOnline: false,
      rating: 5.0,
      completedDeliveries: 0,
      walletBalance: 0,
      coordinates: { x: 52, y: 50 },
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    };
    setRiders((prev) => [...prev, newRider]);
    setCurrentRiderId(newRider.id);
    addAudit(
      'RIDER_APPLICATION_SUBMITTED',
      'RIDER',
      newRider.fullName,
      `Boda registration submitted for ${newRider.bodaRegistrationNo}. Pending admin approval.`,
      newRider.id
    );
  };

  // Fast track order simulation
  const fastTrackDemoOrder = () => {
    const seller = sellers[0];
    const item1 = products[0];
    const item2 = products[2];
    const subtotal = item1.priceUgx + item2.priceUgx;
    const pin = '3914';
    const orderNum = `MD-${Math.floor(2000 + Math.random() * 8000)}`;

    const demoOrder: Order = {
      id: `ord-fast-${Date.now()}`,
      orderNumber: orderNum,
      buyerId: 'user-buyer-active',
      buyerName: 'Grace Nalubega',
      buyerPhone: '+256 702 334 190',
      sellerId: seller.id,
      sellerName: seller.businessName,
      sellerZone: seller.locationZone,
      sellerCoordinates: seller.coordinates,
      riderId: riders[0].id,
      riderName: riders[0].fullName,
      riderPhone: riders[0].phone,
      riderBodaPlate: riders[0].bodaRegistrationNo,
      riderCoordinates: { x: 62, y: 40 },
      items: [
        {
          id: `item-${Date.now()}-1`,
          productId: item1.id,
          productName: item1.name,
          priceUgx: item1.priceUgx,
          quantity: 1,
          totalUgx: item1.priceUgx,
        },
        {
          id: `item-${Date.now()}-2`,
          productId: item2.id,
          productName: item2.name,
          priceUgx: item2.priceUgx,
          quantity: 1,
          totalUgx: item2.priceUgx,
        },
      ],
      subtotalUgx: subtotal,
      serviceFeeUgx: 1000,
      deliveryFeeUgx: 3500,
      commissionUgx: Math.round(subtotal * 0.05),
      platformDeliveryMarginUgx: 1500,
      totalUgx: subtotal + 1000 + 3500,
      paymentMethod: 'MTN_MOMO',
      paymentStatus: 'SUCCESS',
      orderStatus: 'ON_THE_WAY',
      deliveryAddress: {
        zone: 'Masaka CBD',
        street: 'Hobart Street Plot 12',
        landmark: 'Opposite Masaka Post Office',
        coordinates: { x: 48, y: 52 },
      },
      deliveryPin: pin,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      estimatedDeliveryMinutes: 10,
    };

    setOrders((prev) => [demoOrder, ...prev]);
    setSelectedOrderId(demoOrder.id);
    addAudit(
      'DEMO_FAST_TRACK_CREATED',
      'ADMIN',
      'Simulator Runner',
      `Generated live simulated delivery #${demoOrder.orderNumber} with Boda tracking and PIN ${pin}.`,
      demoOrder.id
    );
  };

  // Step forward order state machine helper
  const stepForwardOrder = (orderId: string) => {
    const o = orders.find((ord) => ord.id === orderId);
    if (!o) return;

    switch (o.orderStatus) {
      case 'PAID':
        sellerConfirmOrder(orderId);
        break;
      case 'SELLER_CONFIRMED':
        sellerMarkReady(orderId);
        break;
      case 'READY_FOR_PICKUP':
      case 'RIDER_ASSIGNED':
        riderPickupPackage(orderId);
        break;
      case 'ON_THE_WAY':
        riderVerifyDeliveryPin(orderId, o.deliveryPin);
        break;
      default:
        break;
    }
  };

  const resetDemoData = () => {
    localStorage.removeItem('mangudelivery_sellers');
    localStorage.removeItem('mangudelivery_riders');
    localStorage.removeItem('mangudelivery_products');
    localStorage.removeItem('mangudelivery_orders');
    localStorage.removeItem('mangudelivery_cart');
    localStorage.removeItem('mangudelivery_service_areas');
    localStorage.removeItem('mangudelivery_audit_logs');
    localStorage.removeItem('mangudelivery_settlements');
    setSellers(INITIAL_SELLERS);
    setRiders(INITIAL_RIDERS);
    setProducts(INITIAL_PRODUCTS);
    setOrders(INITIAL_ORDERS);
    setCart([]);
    setServiceAreas(INITIAL_SERVICE_AREAS);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setDisputes(INITIAL_DISPUTES);
    setSettlements(INITIAL_SETTLEMENTS);
    setSelectedOrderId('ord-1');
  };

  return (
    <AppContext.Provider
      value={{
        activePlatform,
        setActivePlatform,
        isStandaloneMode,
        setIsStandaloneMode,
        categories,
        sellers,
        riders,
        products,
        orders,
        cart,
        serviceAreas,
        auditLogs,
        disputes,
        settlements,
        currentSellerId,
        setCurrentSellerId,
        currentRiderId,
        setCurrentRiderId,
        selectedOrderId,
        setSelectedOrderId,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartTotal,
        cartCount,
        placeOrder,
        sellerConfirmOrder,
        sellerMarkReady,
        riderAcceptJob,
        riderPickupPackage,
        riderVerifyDeliveryPin,
        submitBuyerReview,
        adminApproveSeller,
        adminRejectSeller,
        adminApproveRider,
        adminRejectRider,
        adminOverrideOrderStatus,
        toggleServiceArea,
        resolveDispute,
        toggleProductAvailability,
        updateProductStock,
        addProduct,
        submitSellerApplication,
        toggleRiderOnline,
        submitRiderApplication,
        fastTrackDemoOrder,
        stepForwardOrder,
        resetDemoData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
