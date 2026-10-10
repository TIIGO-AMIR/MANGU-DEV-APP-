import React, { useState } from 'react';
import {
  Store,
  Package,
  ShoppingBag,
  Wallet,
  Clock,
  CheckCircle,
  Plus,
  AlertCircle,
  ChevronRight,
  TrendingUp,
  DollarSign,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Product, SellerProfile } from '../../types';

export const SellerApp: React.FC = () => {
  const {
    sellers,
    products,
    orders,
    currentSellerId,
    setCurrentSellerId,
    sellerConfirmOrder,
    sellerMarkReady,
    toggleProductAvailability,
    updateProductStock,
    addProduct,
    submitSellerApplication,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'orders' | 'inventory' | 'wallet' | 'profile'>('orders');
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [showNewStoreApplication, setShowNewStoreApplication] = useState(false);

  // Form states for new product
  const [newProdName, setNewProdName] = useState('');
  const [newProdCategory, setNewProdCategory] = useState('Food & Luwombo');
  const [newProdPrice, setNewProdPrice] = useState(15000);
  const [newProdDesc, setNewProdDesc] = useState('');
  const [newProdPrepTime, setNewProdPrepTime] = useState(15);
  const [newProdInventory, setNewProdInventory] = useState(25);

  // Form states for new seller application
  const [appBizName, setAppBizName] = useState('');
  const [appOwnerName, setAppOwnerName] = useState('');
  const [appPhone, setAppPhone] = useState('+256 7');
  const [appZone, setAppZone] = useState('Nyendo Market');
  const [appPermit, setAppPermit] = useState('MSK-TRADE-2026-');
  const [appNin, setAppNin] = useState('CM');

  const currentSeller: SellerProfile | undefined =
    sellers.find((s) => s.id === currentSellerId) || sellers[0];

  const sellerProducts = products.filter((p) => p.sellerId === currentSeller?.id);
  const sellerOrders = orders.filter((o) => o.sellerId === currentSeller?.id);

  const pendingConfirmationOrders = sellerOrders.filter((o) => o.orderStatus === 'PAID');
  const inPreparationOrders = sellerOrders.filter((o) => o.orderStatus === 'SELLER_CONFIRMED');

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentSeller) return;

    addProduct({
      sellerId: currentSeller.id,
      name: newProdName,
      category: newProdCategory,
      priceUgx: Number(newProdPrice),
      description: newProdDesc,
      imageUrl:
        'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80',
      isAvailable: true,
      inventoryCount: Number(newProdInventory),
      preparationMinutes: Number(newProdPrepTime),
    });

    setShowAddProductModal(false);
    setNewProdName('');
    setNewProdDesc('');
  };

  const handleApplicationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitSellerApplication({
      businessName: appBizName,
      ownerName: appOwnerName,
      phone: appPhone,
      locationZone: appZone,
      permitNumber: appPermit,
      nationalIdNumber: appNin,
      description: 'Masaka city local merchant shop.',
    });
    setShowNewStoreApplication(false);
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-950 font-sans text-slate-100 select-none pb-14">
      {/* Seller Header */}
      <div className="bg-slate-900 border-b border-slate-800 px-4 py-3 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold">
            <Store className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white truncate max-w-[150px]">
                {currentSeller?.businessName || 'Merchant'}
              </span>
              <span
                className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full ${
                  currentSeller?.status === 'APPROVED'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                }`}
              >
                {currentSeller?.status === 'APPROVED' ? 'VERIFIED' : 'PENDING'}
              </span>
            </div>
            <p className="text-[10px] text-slate-400">{currentSeller?.locationZone}</p>
          </div>
        </div>

        {/* Switch Seller store selector */}
        <select
          value={currentSellerId}
          onChange={(e) => setCurrentSellerId(e.target.value)}
          className="bg-slate-950 border border-slate-700 text-[10px] text-slate-300 rounded-lg px-2 py-1 max-w-[120px] truncate"
        >
          {sellers.map((s) => (
            <option key={s.id} value={s.id}>
              {s.businessName} ({s.status === 'APPROVED' ? '✓' : '⌛'})
            </option>
          ))}
        </select>
      </div>

      {/* If current seller is PENDING APPROVAL - Screen per Section 4.1 & 10 */}
      {currentSeller?.status === 'PENDING_APPROVAL' && (
        <div className="p-4 m-4 bg-amber-950/40 border border-amber-500/40 rounded-2xl space-y-3">
          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-amber-400 shrink-0 mt-0.5 animate-spin-slow" />
            <div>
              <h3 className="font-bold text-xs text-amber-200">
                Application Under Admin Review
              </h3>
              <p className="text-[11px] text-slate-300 mt-1">
                Your store application is awaiting verification by ManguDelivery Admin in Masaka. Once approved, product listings and live orders will be unlocked.
              </p>
            </div>
          </div>
          <div className="p-2.5 bg-slate-950 rounded-xl text-[10px] font-mono text-slate-400 space-y-1">
            <div>Permit: {currentSeller.permitNumber}</div>
            <div>Zone: {currentSeller.locationZone}</div>
            <div>Owner: {currentSeller.ownerName}</div>
          </div>
          <p className="text-[10px] text-emerald-400 font-medium">
            💡 Tip: Switch to Admin Web view to approve this store instantly!
          </p>
        </div>
      )}

      {/* TAB 1: ORDERS MANAGEMENT */}
      {activeTab === 'orders' && (
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Quick Metrics */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
              <span className="text-[10px] text-slate-400">Today's Sales</span>
              <div className="text-sm font-black text-emerald-400 mt-0.5">
                UGX {currentSeller?.walletBalance.toLocaleString()}
              </div>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
              <span className="text-[10px] text-slate-400">Total Fulfilled</span>
              <div className="text-sm font-black text-white mt-0.5">
                {currentSeller?.totalOrders} orders
              </div>
            </div>
          </div>

          {/* Incoming Orders requiring acceptance */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-200">
              <span className="flex items-center gap-1.5 text-amber-400">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                <span>New Incoming Orders ({pendingConfirmationOrders.length})</span>
              </span>
            </div>

            {pendingConfirmationOrders.length === 0 ? (
              <div className="p-4 bg-slate-900/50 border border-slate-800 rounded-xl text-center text-xs text-slate-500">
                No orders waiting for confirmation.
              </div>
            ) : (
              pendingConfirmationOrders.map((ord) => (
                <div
                  key={ord.id}
                  className="p-3 bg-slate-900 border border-amber-500/40 rounded-xl space-y-2.5 shadow-md"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-mono font-bold text-xs text-white">
                      {ord.orderNumber}
                    </span>
                    <span className="text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded">
                      NEW ORDER
                    </span>
                  </div>

                  <div className="text-xs text-slate-300">
                    <div className="font-semibold text-white">{ord.buyerName}</div>
                    <div className="text-[11px] text-slate-400">
                      Destination: {ord.deliveryAddress.zone}
                    </div>
                  </div>

                  <div className="bg-slate-950 p-2 rounded-lg text-xs space-y-1">
                    {ord.items.map((it) => (
                      <div key={it.id} className="flex justify-between text-slate-300">
                        <span>
                          {it.quantity}x {it.productName}
                        </span>
                        <span>UGX {it.totalUgx.toLocaleString()}</span>
                      </div>
                    ))}
                    <div className="pt-1 border-t border-slate-800 flex justify-between font-bold text-emerald-400 text-xs">
                      <span>Store Earning (Net 95%):</span>
                      <span>UGX {(ord.subtotalUgx - ord.commissionUgx).toLocaleString()}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => sellerConfirmOrder(ord.id)}
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 rounded-lg text-xs transition shadow"
                  >
                    Accept & Start Preparing Order
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Orders in preparation (Ready for pickup) */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-200">
              In Kitchen / Preparation ({inPreparationOrders.length})
            </h3>

            {inPreparationOrders.length === 0 ? (
              <div className="p-3 bg-slate-900/40 border border-slate-800 rounded-xl text-center text-xs text-slate-500">
                No orders currently in prep.
              </div>
            ) : (
              inPreparationOrders.map((ord) => (
                <div
                  key={ord.id}
                  className="p-3 bg-slate-900 border border-cyan-500/30 rounded-xl space-y-2.5"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-mono font-bold text-xs text-white">
                      {ord.orderNumber}
                    </span>
                    <span className="text-[10px] font-bold bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded">
                      PREPARING
                    </span>
                  </div>

                  <div className="text-xs text-slate-300">
                    <div>
                      {ord.items.map((i) => `${i.quantity}x ${i.productName}`).join(', ')}
                    </div>
                  </div>

                  <button
                    onClick={() => sellerMarkReady(ord.id)}
                    className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2 rounded-lg text-xs transition shadow"
                  >
                    Package Ready → Dispatch Masaka Boda Rider
                  </button>
                </div>
              ))
            )}
          </div>

          {/* All seller order history */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Recent Activity
            </h3>
            {sellerOrders.slice(0, 4).map((ord) => (
              <div
                key={ord.id}
                className="p-2.5 bg-slate-900/60 border border-slate-800 rounded-xl flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-mono font-bold text-slate-200">{ord.orderNumber}</span>
                  <div className="text-[10px] text-slate-400">{ord.buyerName}</div>
                </div>
                <div className="text-right">
                  <span className="font-semibold text-emerald-400">
                    UGX {ord.subtotalUgx.toLocaleString()}
                  </span>
                  <div className="text-[10px] text-slate-400">{ord.orderStatus}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: INVENTORY & PRODUCTS */}
      {activeTab === 'inventory' && (
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-white">Product Catalog & Stock</h2>
              <p className="text-[10px] text-slate-400">Toggle stock in real-time</p>
            </div>
            <button
              onClick={() => setShowAddProductModal(true)}
              className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 shadow"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Item</span>
            </button>
          </div>

          <div className="space-y-2.5">
            {sellerProducts.map((p) => (
              <div
                key={p.id}
                className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={p.imageUrl}
                      alt={p.name}
                      className="w-12 h-12 rounded-lg object-cover bg-slate-800"
                    />
                    <div>
                      <h4 className="font-bold text-xs text-white">{p.name}</h4>
                      <div className="text-xs font-bold text-emerald-400">
                        UGX {p.priceUgx.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  {/* Availability toggle */}
                  <button
                    onClick={() => toggleProductAvailability(p.id)}
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-full transition ${
                      p.isAvailable
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                    }`}
                  >
                    {p.isAvailable ? 'IN STOCK' : 'SOLD OUT'}
                  </button>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-slate-800 text-[11px] text-slate-400">
                  <span>Stock: {p.inventoryCount} units</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => updateProductStock(p.id, -1)}
                      className="w-5 h-5 bg-slate-800 rounded flex items-center justify-center text-slate-300"
                    >
                      -
                    </button>
                    <span className="font-bold text-slate-200">{p.inventoryCount}</span>
                    <button
                      onClick={() => updateProductStock(p.id, 1)}
                      className="w-5 h-5 bg-slate-800 rounded flex items-center justify-center text-slate-300"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: WALLET & EARNINGS */}
      {activeTab === 'wallet' && (
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Wallet Balance Hero */}
          <div className="p-4 bg-gradient-to-br from-amber-950/40 via-slate-900 to-emerald-950/40 border border-amber-500/30 rounded-2xl space-y-3">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Store Available Balance
            </span>
            <div className="text-2xl font-black text-emerald-400">
              UGX {currentSeller?.walletBalance.toLocaleString()}
            </div>
            <p className="text-[10px] text-slate-400">
              Payouts automatically settled via MTN MoMo / Airtel Money after order delivery PIN is verified.
            </p>

            <button
              onClick={() => alert(`Withdraw request of UGX ${currentSeller?.walletBalance.toLocaleString()} sent to Masaka mobile money gateway.`)}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-xl text-xs transition"
            >
              Request MoMo Payout
            </button>
          </div>

          <div className="space-y-2 text-xs">
            <h3 className="font-bold text-slate-300">Commission Policy (Section 17)</h3>
            <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-1.5 text-slate-400 text-[11px]">
              <div className="flex justify-between">
                <span>ManguDelivery Commission:</span>
                <span className="text-white font-bold">5% per order</span>
              </div>
              <div className="flex justify-between">
                <span>Merchant Net Share:</span>
                <span className="text-emerald-400 font-bold">95%</span>
              </div>
              <div className="flex justify-between">
                <span>Settlement Frequency:</span>
                <span className="text-white font-bold">Instant upon PIN confirmation</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: STORE PROFILE */}
      {activeTab === 'profile' && (
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-2 text-xs">
            <h3 className="font-bold text-white text-sm">{currentSeller?.businessName}</h3>
            <p className="text-slate-400">{currentSeller?.description}</p>
            <div className="pt-2 border-t border-slate-800 space-y-1 text-[11px] text-slate-300">
              <div>📍 {currentSeller?.addressDetails}</div>
              <div>📞 {currentSeller?.phone}</div>
              <div>📜 Permit: {currentSeller?.permitNumber}</div>
            </div>
          </div>

          <button
            onClick={() => setShowNewStoreApplication(true)}
            className="w-full p-3 bg-slate-900 border border-slate-700 hover:border-emerald-500 rounded-xl text-xs font-semibold text-slate-200 transition text-center"
          >
            + Register Another Masaka Merchant
          </button>
        </div>
      )}

      {/* ADD PRODUCT MODAL */}
      {showAddProductModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-sm w-full p-5 space-y-3">
            <h3 className="font-bold text-sm text-white">Add New Product to Store</h3>
            <form onSubmit={handleCreateProduct} className="space-y-2.5 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Product Name</label>
                <input
                  type="text"
                  required
                  value={newProdName}
                  onChange={(e) => setNewProdName(e.target.value)}
                  placeholder="e.g. Beef Luwombo Special"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Category</label>
                <select
                  value={newProdCategory}
                  onChange={(e) => setNewProdCategory(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white"
                >
                  <option value="Food & Luwombo">Food & Luwombo</option>
                  <option value="Fresh Market Produce">Fresh Market Produce</option>
                  <option value="Meat & Butchery">Meat & Butchery</option>
                  <option value="Pharmacy & Health">Pharmacy & Health</option>
                  <option value="Electronics & Phones">Electronics & Phones</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 block mb-1">Price (UGX)</label>
                  <input
                    type="number"
                    required
                    value={newProdPrice}
                    onChange={(e) => setNewProdPrice(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Stock Count</label>
                  <input
                    type="number"
                    required
                    value={newProdInventory}
                    onChange={(e) => setNewProdInventory(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Description</label>
                <textarea
                  value={newProdDesc}
                  onChange={(e) => setNewProdDesc(e.target.value)}
                  placeholder="Describe your item..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white h-16"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddProductModal(false)}
                  className="w-1/2 py-2 text-slate-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 rounded-lg"
                >
                  Save Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* REGISTER NEW SELLER APPLICATION MODAL */}
      {showNewStoreApplication && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-sm w-full p-5 space-y-3">
            <h3 className="font-bold text-sm text-white">Submit Merchant Application (Masaka)</h3>
            <p className="text-[10px] text-slate-400">
              Application will be sent to Admin Web for approval (Section 4.1).
            </p>

            <form onSubmit={handleApplicationSubmit} className="space-y-2.5 text-xs">
              <div>
                <label className="text-slate-400 block mb-0.5">Business Name</label>
                <input
                  type="text"
                  required
                  value={appBizName}
                  onChange={(e) => setAppBizName(e.target.value)}
                  placeholder="e.g. Masaka Town Electronics"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-0.5">Owner Full Name</label>
                <input
                  type="text"
                  required
                  value={appOwnerName}
                  onChange={(e) => setAppOwnerName(e.target.value)}
                  placeholder="e.g. Kato Moses"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-0.5">Masaka Zone</label>
                <select
                  value={appZone}
                  onChange={(e) => setAppZone(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white"
                >
                  <option value="Nyendo Market">Nyendo Market</option>
                  <option value="Masaka CBD">Masaka CBD</option>
                  <option value="Katwe Industrial">Katwe Industrial</option>
                  <option value="Bwala Hill">Bwala Hill</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-0.5">Trading Permit Number</label>
                <input
                  type="text"
                  required
                  value={appPermit}
                  onChange={(e) => setAppPermit(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white font-mono"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewStoreApplication(false)}
                  className="w-1/2 py-2 text-slate-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 rounded-lg"
                >
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bottom App Navigation */}
      <div className="h-14 bg-slate-900 border-t border-slate-800 px-4 flex items-center justify-around fixed bottom-0 left-0 right-0 max-w-sm mx-auto z-40">
        <button
          onClick={() => setActiveTab('orders')}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-medium transition ${
            activeTab === 'orders' ? 'text-amber-400' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Orders</span>
        </button>

        <button
          onClick={() => setActiveTab('inventory')}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-medium transition ${
            activeTab === 'inventory' ? 'text-amber-400' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Products</span>
        </button>

        <button
          onClick={() => setActiveTab('wallet')}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-medium transition ${
            activeTab === 'wallet' ? 'text-amber-400' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Wallet className="w-4 h-4" />
          <span>Wallet</span>
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-medium transition ${
            activeTab === 'profile' ? 'text-amber-400' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Store className="w-4 h-4" />
          <span>Profile</span>
        </button>
      </div>
    </div>
  );
};
