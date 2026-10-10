import React, { useState } from 'react';
import {
  Search,
  ShoppingBag,
  MapPin,
  Clock,
  Star,
  Plus,
  Minus,
  ArrowLeft,
  Bike,
  CheckCircle2,
  Phone,
  Shield,
  CreditCard,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MasakaInteractiveMap } from '../masaka-map/MasakaInteractiveMap';
import { Product, PaymentMethod, SellerProfile, Order } from '../../types';

export const BuyerApp: React.FC = () => {
  const {
    categories,
    sellers,
    products,
    orders,
    cart,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    cartTotal,
    cartCount,
    placeOrder,
    submitBuyerReview,
    selectedOrderId,
    setSelectedOrderId,
  } = useApp();

  // Navigation states
  const [currentView, setCurrentView] = useState<'home' | 'store' | 'product' | 'cart' | 'tracking' | 'history'>('home');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSeller, setActiveSeller] = useState<SellerProfile | null>(null);
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);

  // Checkout modal / state
  const [showCheckout, setShowCheckout] = useState(false);
  const [selectedZone, setSelectedZone] = useState('Masaka CBD');
  const [streetAddress, setStreetAddress] = useState('Hobart Street, Plot 14');
  const [landmark, setLandmark] = useState('Near Stanbic Bank ATM');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('MTN_MOMO');
  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentSimulationPrompt, setPaymentSimulationPrompt] = useState('');

  // Rating review state
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  // Active tracked order (default to most recent active or selected)
  const activeOrder: Order | undefined =
    orders.find((o) => o.id === selectedOrderId) ||
    orders.find((o) => ['PAID', 'SELLER_CONFIRMED', 'READY_FOR_PICKUP', 'RIDER_ASSIGNED', 'PICKED_UP', 'ON_THE_WAY'].includes(o.orderStatus)) ||
    orders[0];

  // Filtered products
  const approvedSellers = sellers.filter((s) => s.status === 'APPROVED');
  const approvedSellerIds = approvedSellers.map((s) => s.id);

  const filteredProducts = products.filter((p) => {
    if (!approvedSellerIds.includes(p.sellerId)) return false;
    if (selectedCategoryId !== 'all') {
      const cat = categories.find((c) => c.id === selectedCategoryId);
      if (cat && p.category !== cat.name) return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessingPayment(true);

    if (paymentMethod === 'MTN_MOMO') {
      setPaymentSimulationPrompt('Sending USSD Push to +256 702 334 190 (MTN Mobile Money)... Enter PIN: ****');
    } else if (paymentMethod === 'AIRTEL_MONEY') {
      setPaymentSimulationPrompt('Dialing Airtel Money USSD gateway... Authorize UGX ' + (cartTotal + 4500).toLocaleString());
    } else {
      setPaymentSimulationPrompt('Confirming Cash on Delivery booking with rider...');
    }

    setTimeout(() => {
      const created = placeOrder({
        deliveryZone: selectedZone,
        street: streetAddress,
        landmark,
        paymentMethod,
        notes: deliveryNotes,
      });

      setIsProcessingPayment(false);
      setPaymentSimulationPrompt('');
      setShowCheckout(false);

      if (created) {
        setSelectedOrderId(created.id);
        setCurrentView('tracking');
      }
    }, 1200);
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-950 font-sans text-slate-100 select-none pb-14">
      {/* Top Header */}
      <div className="bg-slate-900/90 border-b border-slate-800 px-4 py-3 flex items-center justify-between sticky top-0 z-30 backdrop-blur-md">
        <div className="flex items-center gap-2">
          {currentView !== 'home' ? (
            <button
              onClick={() => setCurrentView('home')}
              className="p-1 hover:bg-slate-800 rounded-lg text-slate-300 transition"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          ) : (
            <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center font-black text-white text-base">
              M
            </div>
          )}

          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-white">
              <span>ManguDelivery</span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.2 rounded-full font-semibold">
                Masaka
              </span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-slate-400">
              <MapPin className="w-3 h-3 text-emerald-400 shrink-0" />
              <span className="truncate max-w-[170px]">{selectedZone}</span>
            </div>
          </div>
        </div>

        {/* Cart button */}
        <button
          onClick={() => setCurrentView('cart')}
          className="relative p-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-slate-200 transition"
        >
          <ShoppingBag className="w-4 h-4" />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-black flex items-center justify-center animate-bounce">
              {cartCount}
            </span>
          )}
        </button>
      </div>

      {/* VIEW: HOME MARKETPLACE */}
      {currentView === 'home' && (
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Active Order Sticky Alert (if any order in progress) */}
          {activeOrder && activeOrder.orderStatus !== 'COMPLETED' && (
            <div
              onClick={() => {
                setSelectedOrderId(activeOrder.id);
                setCurrentView('tracking');
              }}
              className="bg-gradient-to-r from-emerald-900/60 to-slate-900 border border-emerald-500/40 rounded-2xl p-3 flex items-center justify-between cursor-pointer shadow-lg hover:border-emerald-400 transition"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <Bike className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>Order #{activeOrder.orderNumber}</span>
                    <span className="text-[10px] bg-emerald-500 text-slate-950 px-1.5 py-0.2 rounded font-bold">
                      {activeOrder.orderStatus}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-300">
                    PIN:{' '}
                    <span className="font-mono font-bold text-emerald-400">
                      {activeOrder.deliveryPin}
                    </span>{' '}
                    • Tap to view live Boda map
                  </div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-emerald-400" />
            </div>
          )}

          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Luwombo, Samosas, Butchery, Meds..."
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Masaka Banner Hero */}
          <div className="rounded-2xl p-3.5 bg-gradient-to-br from-amber-600/30 via-slate-900 to-emerald-950/40 border border-amber-500/30 relative overflow-hidden">
            <div className="relative z-10 max-w-[220px]">
              <span className="text-[10px] font-bold text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded-full border border-amber-500/30 uppercase tracking-wide">
                Fast Masaka Delivery
              </span>
              <h2 className="text-sm font-black text-white mt-1 leading-tight">
                Fresh Food & Essentials to your doorstep by Boda
              </h2>
              <p className="text-[11px] text-slate-300 mt-1">
                Verified Masaka sellers • UGX 3,500 standard delivery
              </p>
            </div>
            <div className="absolute -bottom-2 -right-2 w-28 h-28 opacity-25">
              <Bike className="w-full h-full text-emerald-400" />
            </div>
          </div>

          {/* Categories Horizontal Scroll */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-200">
              <span>Categories</span>
              <button
                onClick={() => setSelectedCategoryId('all')}
                className={`text-[11px] ${
                  selectedCategoryId === 'all' ? 'text-emerald-400 font-bold' : 'text-slate-400'
                }`}
              >
                All Items
              </button>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
              {categories.map((cat) => {
                const isSelected = selectedCategoryId === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategoryId(isSelected ? 'all' : cat.id)}
                    className={`shrink-0 px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition border ${
                      isSelected
                        ? 'bg-emerald-600 text-white border-emerald-500 shadow-md'
                        : 'bg-slate-900/90 text-slate-300 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <span>{cat.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Featured Masaka Merchants */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-200">
              <span>Popular Masaka Shops</span>
              <span className="text-[11px] text-slate-400">{approvedSellers.length} active</span>
            </div>

            <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
              {approvedSellers.map((seller) => (
                <div
                  key={seller.id}
                  onClick={() => {
                    setActiveSeller(seller);
                    setCurrentView('store');
                  }}
                  className="shrink-0 w-44 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden cursor-pointer hover:border-emerald-500/60 transition group"
                >
                  <div className="h-20 w-full relative overflow-hidden bg-slate-800">
                    <img
                      src={seller.bannerUrl}
                      alt={seller.businessName}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                    <div className="absolute top-1.5 right-1.5 bg-slate-950/80 px-1.5 py-0.5 rounded-md flex items-center gap-0.5 text-[10px] text-amber-300 font-bold">
                      <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                      <span>{seller.rating}</span>
                    </div>
                  </div>
                  <div className="p-2.5 space-y-1">
                    <h3 className="font-bold text-xs text-white truncate">{seller.businessName}</h3>
                    <p className="text-[10px] text-slate-400 flex items-center gap-1">
                      <MapPin className="w-2.5 h-2.5 text-emerald-400 shrink-0" />
                      <span className="truncate">{seller.locationZone}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Products Grid */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-200">
              <span>Masaka Marketplace Items</span>
              <span className="text-[11px] text-slate-400">{filteredProducts.length} items</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {filteredProducts.map((prod) => {
                const seller = sellers.find((s) => s.id === prod.sellerId);
                return (
                  <div
                    key={prod.id}
                    className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col justify-between hover:border-slate-700 transition"
                  >
                    <div
                      className="cursor-pointer"
                      onClick={() => {
                        setActiveProduct(prod);
                        setCurrentView('product');
                      }}
                    >
                      <div className="h-28 w-full bg-slate-800 relative">
                        <img
                          src={prod.imageUrl}
                          alt={prod.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute bottom-1 left-1 bg-slate-950/80 backdrop-blur-sm px-1.5 py-0.5 rounded text-[9px] text-slate-300 flex items-center gap-1">
                          <Clock className="w-2.5 h-2.5 text-amber-400" />
                          <span>{prod.preparationMinutes}m prep</span>
                        </div>
                      </div>

                      <div className="p-2.5 space-y-1">
                        <h4 className="font-bold text-xs text-white line-clamp-1">{prod.name}</h4>
                        <p className="text-[10px] text-slate-400 truncate">{seller?.businessName}</p>
                      </div>
                    </div>

                    <div className="p-2.5 pt-0 flex items-center justify-between mt-auto">
                      <span className="font-bold text-xs text-emerald-400">
                        UGX {prod.priceUgx.toLocaleString()}
                      </span>
                      <button
                        onClick={() => addToCart(prod, 1)}
                        className="w-7 h-7 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center transition shadow"
                        title="Add to cart"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* VIEW: STORE DETAIL */}
      {currentView === 'store' && activeSeller && (
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="relative h-32 rounded-2xl overflow-hidden bg-slate-800">
            <img
              src={activeSeller.bannerUrl}
              alt={activeSeller.businessName}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
            <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
              <div>
                <h2 className="text-base font-black text-white">{activeSeller.businessName}</h2>
                <p className="text-xs text-slate-300 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-emerald-400" />
                  <span>{activeSeller.addressDetails}</span>
                </p>
              </div>
              <div className="bg-slate-900/90 px-2 py-1 rounded-lg text-xs font-bold text-amber-300 flex items-center gap-1 border border-slate-700">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                <span>{activeSeller.rating}</span>
              </div>
            </div>
          </div>

          <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-xs text-slate-300">
            <p>{activeSeller.description}</p>
            <div className="mt-2 pt-2 border-t border-slate-800 flex justify-between text-[11px] text-slate-400">
              <span>Owner: {activeSeller.ownerName}</span>
              <span>Masaka Permit: {activeSeller.permitNumber}</span>
            </div>
          </div>

          {/* Products in this store */}
          <div className="space-y-3">
            <h3 className="font-bold text-xs text-slate-200 uppercase tracking-wider">
              Store Menu / Inventory
            </h3>
            <div className="space-y-2.5">
              {products
                .filter((p) => p.sellerId === activeSeller.id)
                .map((prod) => (
                  <div
                    key={prod.id}
                    className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={prod.imageUrl}
                        alt={prod.name}
                        className="w-14 h-14 rounded-lg object-cover bg-slate-800 shrink-0"
                      />
                      <div>
                        <h4 className="font-bold text-xs text-white">{prod.name}</h4>
                        <p className="text-[11px] text-slate-400 line-clamp-1">{prod.description}</p>
                        <span className="font-bold text-xs text-emerald-400 mt-1 block">
                          UGX {prod.priceUgx.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => addToCart(prod, 1)}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold shrink-0 transition"
                    >
                      + Add
                    </button>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* VIEW: PRODUCT DETAIL */}
      {currentView === 'product' && activeProduct && (
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="h-56 rounded-2xl overflow-hidden bg-slate-800">
            <img
              src={activeProduct.imageUrl}
              alt={activeProduct.name}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                {activeProduct.category}
              </span>
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-emerald-400" />
                <span>Prep: {activeProduct.preparationMinutes} mins</span>
              </span>
            </div>

            <h2 className="text-lg font-black text-white">{activeProduct.name}</h2>
            <div className="text-xl font-black text-emerald-400">
              UGX {activeProduct.priceUgx.toLocaleString()}
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">{activeProduct.description}</p>
          </div>

          <button
            onClick={() => {
              addToCart(activeProduct, 1);
              setCurrentView('cart');
            }}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg transition"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Add to Cart & Checkout</span>
          </button>
        </div>
      )}

      {/* VIEW: CART */}
      {currentView === 'cart' && (
        <div className="flex-1 overflow-y-auto p-4 space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <h2 className="text-base font-black text-white flex items-center justify-between">
              <span>Your Basket</span>
              <span className="text-xs text-slate-400 font-normal">{cartCount} items</span>
            </h2>

            {cart.length === 0 ? (
              <div className="text-center py-16 space-y-3">
                <ShoppingBag className="w-12 h-12 text-slate-700 mx-auto" />
                <p className="text-xs text-slate-400">Your basket is empty.</p>
                <button
                  onClick={() => setCurrentView('home')}
                  className="bg-emerald-600 text-white text-xs font-bold px-4 py-2 rounded-xl"
                >
                  Browse Masaka Market
                </button>
              </div>
            ) : (
              <div className="space-y-2.5">
                {cart.map((item) => (
                  <div
                    key={item.product.id}
                    className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between"
                  >
                    <div>
                      <h4 className="font-bold text-xs text-white">{item.product.name}</h4>
                      <div className="text-xs text-emerald-400 font-semibold">
                        UGX {item.product.priceUgx.toLocaleString()}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                        className="w-6 h-6 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-bold text-white w-4 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                        className="w-6 h-6 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}

                {/* Price Breakdown */}
                <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl space-y-1.5 text-xs text-slate-300">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Subtotal:</span>
                    <span>UGX {cartTotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Mangu Service Fee:</span>
                    <span>UGX 1,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Masaka Boda Delivery:</span>
                    <span>UGX 3,500</span>
                  </div>
                  <div className="pt-2 border-t border-slate-800 flex justify-between font-bold text-sm text-white">
                    <span>Total:</span>
                    <span className="text-emerald-400">
                      UGX {(cartTotal + 4500).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {cart.length > 0 && (
            <button
              onClick={() => setShowCheckout(true)}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg transition"
            >
              <span>Proceed to Checkout</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      )}

      {/* VIEW: LIVE TRACKING SCREEN */}
      {currentView === 'tracking' && activeOrder && (
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Order Header Card */}
          <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-2xl space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 block font-mono">ORDER NUMBER</span>
                <span className="font-mono font-black text-sm text-white">
                  {activeOrder.orderNumber}
                </span>
              </div>
              <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full">
                {activeOrder.orderStatus}
              </span>
            </div>

            {/* Crucial Delivery PIN Display */}
            <div className="bg-gradient-to-r from-emerald-950 via-slate-950 to-emerald-950 border border-emerald-500/60 rounded-xl p-3 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-emerald-300 block">
                  Security Delivery PIN (Section 13)
                </span>
                <p className="text-[10px] text-slate-400">
                  Give this 4-digit code to your Boda rider upon arrival.
                </p>
              </div>
              <div className="bg-emerald-500 text-slate-950 font-mono font-black text-lg px-3 py-1 rounded-lg tracking-widest shadow-md">
                {activeOrder.deliveryPin}
              </div>
            </div>
          </div>

          {/* Live Masaka Map */}
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-slate-300 mb-1.5">
              <span>Live Boda Tracking Radar</span>
              <span className="text-[11px] text-emerald-400">
                ETA: ~{activeOrder.estimatedDeliveryMinutes || 12} mins
              </span>
            </div>
            <MasakaInteractiveMap
              sellers={sellers}
              riders={useApp().riders}
              activeOrder={activeOrder}
              height="h-56"
            />
          </div>

          {/* Assigned Boda Rider Details */}
          {activeOrder.riderName ? (
            <div className="p-3 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                  <Bike className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-white">{activeOrder.riderName}</h4>
                  <div className="text-[10px] text-slate-400 flex items-center gap-1.5">
                    <span className="font-mono font-bold text-amber-300 bg-amber-500/10 px-1 rounded">
                      {activeOrder.riderBodaPlate}
                    </span>
                    <span>• {activeOrder.riderPhone}</span>
                  </div>
                </div>
              </div>

              <a
                href={`tel:${activeOrder.riderPhone}`}
                className="w-8 h-8 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center transition"
                title="Call Rider"
              >
                <Phone className="w-3.5 h-3.5" />
              </a>
            </div>
          ) : (
            <div className="p-3 bg-slate-900/60 border border-dashed border-slate-800 rounded-xl text-center text-xs text-slate-400 flex items-center justify-center gap-2">
              <Clock className="w-4 h-4 text-amber-400 animate-spin" />
              <span>Merchant preparing items. Dispatching closest Masaka boda partner...</span>
            </div>
          )}

          {/* Items Summary */}
          <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-1 text-xs">
            <span className="font-bold text-slate-300 block mb-1">Ordered Items:</span>
            {activeOrder.items.map((it) => (
              <div key={it.id} className="flex justify-between text-slate-400">
                <span>
                  {it.quantity}x {it.productName}
                </span>
                <span className="text-slate-200">UGX {it.totalUgx.toLocaleString()}</span>
              </div>
            ))}
          </div>

          {/* Review Card if Completed */}
          {activeOrder.orderStatus === 'COMPLETED' && (
            <div className="p-4 bg-emerald-950/40 border border-emerald-500/40 rounded-2xl space-y-3">
              <div className="flex items-center gap-2 text-emerald-300 font-bold text-xs">
                <CheckCircle2 className="w-4 h-4" />
                <span>Delivery Completed Successfully!</span>
              </div>

              {!activeOrder.buyerReview && !reviewSubmitted ? (
                <div className="space-y-2">
                  <p className="text-[11px] text-slate-300">
                    How was your experience with {activeOrder.sellerName} and boda rider{' '}
                    {activeOrder.riderName}?
                  </p>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setReviewRating(star)}
                        className={`p-1 ${star <= reviewRating ? 'text-amber-400' : 'text-slate-600'}`}
                      >
                        <Star className="w-5 h-5 fill-current" />
                      </button>
                    ))}
                  </div>
                  <input
                    type="text"
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="Add a friendly review..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white"
                  />
                  <button
                    onClick={() => {
                      submitBuyerReview(
                        activeOrder.id,
                        reviewRating,
                        reviewComment || 'Excellent and fast boda delivery in Masaka!'
                      );
                      setReviewSubmitted(true);
                    }}
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 rounded-lg text-xs"
                  >
                    Submit Review
                  </button>
                </div>
              ) : (
                <p className="text-[11px] text-emerald-300">
                  Thank you! Your feedback helps Masaka merchants and riders.
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* VIEW: ORDER HISTORY */}
      {currentView === 'history' && (
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          <h2 className="text-base font-black text-white">Your Masaka Orders</h2>
          {orders.map((ord) => (
            <div
              key={ord.id}
              onClick={() => {
                setSelectedOrderId(ord.id);
                setCurrentView('tracking');
              }}
              className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-2 cursor-pointer hover:border-slate-700 transition"
            >
              <div className="flex justify-between items-center">
                <span className="font-mono font-bold text-xs text-white">{ord.orderNumber}</span>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                  {ord.orderStatus}
                </span>
              </div>
              <div className="text-xs text-slate-300 font-medium">{ord.sellerName}</div>
              <div className="flex justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800">
                <span>{ord.items.length} items</span>
                <span className="font-bold text-white">UGX {ord.totalUgx.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CHECKOUT BOTTOM SHEET MODAL */}
      {showCheckout && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end justify-center">
          <div className="w-full max-w-sm bg-slate-900 border-t border-slate-800 rounded-t-3xl p-5 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-base text-white">Confirm Masaka Delivery</h3>
              <button
                onClick={() => setShowCheckout(false)}
                className="text-slate-400 hover:text-white text-xs"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleCheckoutSubmit} className="space-y-3 text-xs">
              {/* Delivery Destination */}
              <div>
                <label className="text-slate-400 font-semibold block mb-1">Masaka Zone</label>
                <select
                  value={selectedZone}
                  onChange={(e) => setSelectedZone(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
                >
                  <option value="Masaka CBD">Masaka CBD (Town Center)</option>
                  <option value="Nyendo Market">Nyendo Commercial Hub</option>
                  <option value="Katwe Industrial">Katwe Trading Zone</option>
                  <option value="Bwala Hill">Bwala Hill Residential</option>
                  <option value="Ssaza">Ssaza & Golf Course</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 font-semibold block mb-1">Street Address</label>
                <input
                  type="text"
                  required
                  value={streetAddress}
                  onChange={(e) => setStreetAddress(e.target.value)}
                  placeholder="e.g. Elgin Road, Plot 5"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
                />
              </div>

              <div>
                <label className="text-slate-400 font-semibold block mb-1">Landmark / Gate</label>
                <input
                  type="text"
                  required
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                  placeholder="e.g. Near Stanbic Bank or Blue Gate"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
                />
              </div>

              {/* Payment Method Selector */}
              <div>
                <label className="text-slate-400 font-semibold block mb-1">Payment Method</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('MTN_MOMO')}
                    className={`p-2.5 rounded-xl border text-left transition ${
                      paymentMethod === 'MTN_MOMO'
                        ? 'border-amber-400 bg-amber-500/10 text-amber-300'
                        : 'border-slate-800 bg-slate-950 text-slate-400'
                    }`}
                  >
                    <div className="font-bold text-xs">MTN MoMo</div>
                    <div className="text-[10px]">Mobile Money Instant</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('AIRTEL_MONEY')}
                    className={`p-2.5 rounded-xl border text-left transition ${
                      paymentMethod === 'AIRTEL_MONEY'
                        ? 'border-rose-400 bg-rose-500/10 text-rose-300'
                        : 'border-slate-800 bg-slate-950 text-slate-400'
                    }`}
                  >
                    <div className="font-bold text-xs">Airtel Money</div>
                    <div className="text-[10px]">Direct USSD Push</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('CASH_ON_DELIVERY')}
                    className={`p-2.5 rounded-xl border text-left transition ${
                      paymentMethod === 'CASH_ON_DELIVERY'
                        ? 'border-emerald-400 bg-emerald-500/10 text-emerald-300'
                        : 'border-slate-800 bg-slate-950 text-slate-400'
                    }`}
                  >
                    <div className="font-bold text-xs">Cash on Delivery</div>
                    <div className="text-[10px]">Pay Boda Rider</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('CARD')}
                    className={`p-2.5 rounded-xl border text-left transition ${
                      paymentMethod === 'CARD'
                        ? 'border-blue-400 bg-blue-500/10 text-blue-300'
                        : 'border-slate-800 bg-slate-950 text-slate-400'
                    }`}
                  >
                    <div className="font-bold text-xs">Visa / Card</div>
                    <div className="text-[10px]">Secured via Bank</div>
                  </button>
                </div>
              </div>

              {/* Simulation prompt if paying */}
              {isProcessingPayment && (
                <div className="p-3 bg-slate-950 border border-emerald-500/50 rounded-xl text-emerald-400 text-xs text-center animate-pulse">
                  {paymentSimulationPrompt}
                </div>
              )}

              <button
                type="submit"
                disabled={isProcessingPayment}
                className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-black py-3 rounded-xl text-xs shadow-lg transition mt-2"
              >
                {isProcessingPayment ? 'Authorizing Payment...' : `Pay UGX ${(cartTotal + 4500).toLocaleString()} & Place Order`}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Bottom App Navigation Bar */}
      <div className="h-14 bg-slate-900 border-t border-slate-800 px-4 flex items-center justify-around fixed bottom-0 left-0 right-0 max-w-sm mx-auto z-40">
        <button
          onClick={() => setCurrentView('home')}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-medium transition ${
            currentView === 'home' ? 'text-emerald-400' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Search className="w-4 h-4" />
          <span>Browse</span>
        </button>

        <button
          onClick={() => setCurrentView('cart')}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-medium transition relative ${
            currentView === 'cart' ? 'text-emerald-400' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Cart</span>
          {cartCount > 0 && (
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 absolute top-0 right-2" />
          )}
        </button>

        <button
          onClick={() => setCurrentView('tracking')}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-medium transition ${
            currentView === 'tracking' ? 'text-emerald-400' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Bike className="w-4 h-4" />
          <span>Track</span>
        </button>

        <button
          onClick={() => setCurrentView('history')}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-medium transition ${
            currentView === 'history' ? 'text-emerald-400' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>History</span>
        </button>
      </div>
    </div>
  );
};
