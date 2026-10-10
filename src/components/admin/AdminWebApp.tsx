import React, { useState } from 'react';
import {
  LayoutDashboard,
  Store,
  Bike,
  ShoppingBag,
  CreditCard,
  MapPin,
  AlertTriangle,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  ShieldCheck,
  TrendingUp,
  RefreshCw,
  Eye,
  Check,
  X,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MasakaInteractiveMap } from '../masaka-map/MasakaInteractiveMap';
import { OrderStatus, SellerProfile, RiderProfile } from '../../types';

export const AdminWebApp: React.FC = () => {
  const {
    sellers,
    riders,
    orders,
    serviceAreas,
    auditLogs,
    disputes,
    settlements,
    adminApproveSeller,
    adminRejectSeller,
    adminApproveRider,
    adminRejectRider,
    adminOverrideOrderStatus,
    toggleServiceArea,
    resolveDispute,
    fastTrackDemoOrder,
    stepForwardOrder,
    resetDemoData,
  } = useApp();

  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'sellers' | 'riders' | 'orders' | 'financials' | 'zones' | 'disputes' | 'audit'
  >('dashboard');

  const [selectedSellerModal, setSelectedSellerModal] = useState<SellerProfile | null>(null);
  const [selectedRiderModal, setSelectedRiderModal] = useState<RiderProfile | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [disputeResolutionText, setDisputeResolutionText] = useState('');
  const [selectedDisputeId, setSelectedDisputeId] = useState<string | null>(null);

  // Derived metrics
  const pendingSellers = sellers.filter((s) => s.status === 'PENDING_APPROVAL');
  const pendingRiders = riders.filter((r) => r.status === 'PENDING_APPROVAL');
  const approvedSellers = sellers.filter((s) => s.status === 'APPROVED');
  const onlineRiders = riders.filter((r) => r.isOnline && r.status === 'APPROVED');

  const totalPlatformRevenue = orders
    .filter((o) => o.orderStatus === 'COMPLETED' || o.paymentStatus === 'SUCCESS')
    .reduce((sum, o) => sum + o.commissionUgx + o.serviceFeeUgx + o.platformDeliveryMarginUgx, 0);

  const activeDeliveries = orders.filter((o) =>
    ['PAID', 'SELLER_CONFIRMED', 'READY_FOR_PICKUP', 'RIDER_ASSIGNED', 'PICKED_UP', 'ON_THE_WAY'].includes(o.orderStatus)
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Navigation Bar */}
      <header className="h-16 border-b border-slate-800 bg-slate-900/90 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-amber-500 flex items-center justify-center font-black text-xl text-white shadow-lg shadow-emerald-950/40">
            M
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-lg text-white tracking-tight">ManguDelivery Admin</h1>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-semibold">
                Masaka Pilot v3.0
              </span>
            </div>
            <p className="text-xs text-slate-400">Control Plane • Java Backend & Postgres Bridge</p>
          </div>
        </div>

        {/* Quick Tools & Live Status */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700/60 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-300 font-medium">Masaka Dispatch: Active</span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-400">{onlineRiders.length} Bodas Online</span>
          </div>

          <button
            onClick={fastTrackDemoOrder}
            className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-semibold px-3 py-2 rounded-xl shadow-md transition"
            title="Create live simulation order"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span className="hidden sm:inline">Fast-Track Test Order</span>
          </button>

          <button
            onClick={resetDemoData}
            className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700/60 transition"
            title="Reset to default seed data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Workspace Layout */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Sidebar Nav */}
        <aside className="w-full md:w-64 bg-slate-900/60 border-r border-slate-800/80 p-3 flex md:flex-col gap-1 overflow-x-auto md:overflow-y-auto shrink-0">
          <div className="hidden md:block px-3 py-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Operations & Control
          </div>

          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
              activeTab === 'dashboard'
                ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <LayoutDashboard className="w-4 h-4 text-emerald-400" />
            <span>Dashboard Overview</span>
          </button>

          <button
            onClick={() => setActiveTab('sellers')}
            className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
              activeTab === 'sellers'
                ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Store className="w-4 h-4 text-amber-400" />
              <span>Seller Approvals</span>
            </div>
            {pendingSellers.length > 0 && (
              <span className="bg-amber-500 text-slate-950 text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                {pendingSellers.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('riders')}
            className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
              activeTab === 'riders'
                ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Bike className="w-4 h-4 text-cyan-400" />
              <span>Rider Approvals</span>
            </div>
            {pendingRiders.length > 0 && (
              <span className="bg-cyan-500 text-slate-950 text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                {pendingRiders.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
              activeTab === 'orders'
                ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-4 h-4 text-rose-400" />
              <span>Orders & Dispatch</span>
            </div>
            {activeDeliveries.length > 0 && (
              <span className="bg-rose-500/30 text-rose-300 border border-rose-500/40 text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                {activeDeliveries.length}
              </span>
            )}
          </button>

          <div className="hidden md:block my-2 border-t border-slate-800" />
          <div className="hidden md:block px-3 py-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Finance & Governance
          </div>

          <button
            onClick={() => setActiveTab('financials')}
            className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
              activeTab === 'financials'
                ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <CreditCard className="w-4 h-4 text-emerald-400" />
            <span>5% Fees & Settlements</span>
          </button>

          <button
            onClick={() => setActiveTab('zones')}
            className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
              activeTab === 'zones'
                ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <MapPin className="w-4 h-4 text-indigo-400" />
            <span>Masaka Service Areas</span>
          </button>

          <button
            onClick={() => setActiveTab('disputes')}
            className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
              activeTab === 'disputes'
                ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>Disputes & Claims</span>
            </div>
            {disputes.filter((d) => d.status === 'OPEN').length > 0 && (
              <span className="bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                {disputes.filter((d) => d.status === 'OPEN').length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('audit')}
            className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
              activeTab === 'audit'
                ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <FileText className="w-4 h-4 text-slate-400" />
            <span>System Audit Trail</span>
          </button>
        </aside>

        {/* Content Viewport */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
          {/* TAB 1: DASHBOARD OVERVIEW */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Stat Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl relative overflow-hidden">
                  <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
                    <span>Platform Revenue (UGX)</span>
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="mt-2 text-2xl font-black text-white">
                    UGX {totalPlatformRevenue.toLocaleString()}
                  </div>
                  <div className="mt-1 text-[11px] text-emerald-400 font-medium">
                    5% commission + UGX 1k fee + UGX 1.5k margin
                  </div>
                </div>

                <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl relative overflow-hidden">
                  <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
                    <span>Total Orders Today</span>
                    <ShoppingBag className="w-4 h-4 text-rose-400" />
                  </div>
                  <div className="mt-2 text-2xl font-black text-white">{orders.length}</div>
                  <div className="mt-1 text-[11px] text-slate-400">
                    {activeDeliveries.length} active in transit
                  </div>
                </div>

                <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl relative overflow-hidden">
                  <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
                    <span>Verified Boda Partners</span>
                    <Bike className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div className="mt-2 text-2xl font-black text-white">
                    {riders.filter((r) => r.status === 'APPROVED').length}
                  </div>
                  <div className="mt-1 text-[11px] text-cyan-400 font-medium">
                    {onlineRiders.length} currently online in Masaka
                  </div>
                </div>

                <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl relative overflow-hidden">
                  <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
                    <span>Pending Approvals</span>
                    <Clock className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="mt-2 text-2xl font-black text-white">
                    {pendingSellers.length + pendingRiders.length}
                  </div>
                  <div className="mt-1 text-[11px] text-amber-400 font-medium">
                    {pendingSellers.length} Sellers • {pendingRiders.length} Riders
                  </div>
                </div>
              </div>

              {/* Live Masaka Map and Realtime Radar */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-sm text-slate-200">Masaka City Live Dispatch Map</h3>
                      <p className="text-xs text-slate-400">
                        Real-time GPS tracking across Nyendo, CBD, Katwe, Bwala, and Ssaza
                      </p>
                    </div>
                  </div>
                  <MasakaInteractiveMap
                    sellers={approvedSellers}
                    riders={riders}
                    activeOrder={orders.find((o) => o.orderStatus === 'ON_THE_WAY') || orders[0]}
                    height="h-80"
                  />
                </div>

                {/* Live Operations Feed */}
                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex flex-col h-full">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-sm text-slate-200">Live Active Orders</h3>
                    <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full font-mono">
                      {activeDeliveries.length} active
                    </span>
                  </div>

                  <div className="flex-1 space-y-2.5 overflow-y-auto max-h-72 pr-1">
                    {activeDeliveries.length === 0 ? (
                      <div className="text-center py-10 text-slate-500 text-xs">
                        No orders currently in transit.
                        <button
                          onClick={fastTrackDemoOrder}
                          className="block mx-auto mt-2 text-emerald-400 hover:underline"
                        >
                          Generate test order
                        </button>
                      </div>
                    ) : (
                      activeDeliveries.map((order) => (
                        <div
                          key={order.id}
                          className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3 text-xs space-y-2"
                        >
                          <div className="flex items-center justify-between font-mono">
                            <span className="font-bold text-slate-200">{order.orderNumber}</span>
                            <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] px-2 py-0.5 rounded font-semibold">
                              {order.orderStatus}
                            </span>
                          </div>

                          <div className="text-slate-400 text-[11px] flex justify-between">
                            <span>From: {order.sellerName}</span>
                            <span className="text-slate-300 font-semibold">
                              UGX {order.totalUgx.toLocaleString()}
                            </span>
                          </div>

                          <div className="flex items-center justify-between pt-1 border-t border-slate-800 text-[11px]">
                            <span className="text-cyan-400 flex items-center gap-1">
                              <Bike className="w-3 h-3" />
                              {order.riderName || 'Assigning boda...'}
                            </span>
                            <button
                              onClick={() => stepForwardOrder(order.id)}
                              className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-2 py-0.5 rounded text-[10px] font-medium transition"
                            >
                              Fast-Advance State →
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SELLER APPROVALS */}
          {activeTab === 'sellers' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-white">Merchant & Store Approval Pipeline</h2>
                  <p className="text-xs text-slate-400">
                    Section 4.1: Sellers must be reviewed and approved by Admin before listing products in Masaka.
                  </p>
                </div>
              </div>

              {/* Pending Applications Section */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
                  <h3 className="font-bold text-sm text-slate-200">
                    Pending Applications ({pendingSellers.length})
                  </h3>
                </div>

                {pendingSellers.length === 0 ? (
                  <div className="text-xs text-slate-400 py-6 text-center border border-dashed border-slate-800 rounded-xl">
                    No pending seller applications. All merchant accounts have been reviewed.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {pendingSellers.map((seller) => (
                      <div
                        key={seller.id}
                        className="bg-slate-950 border border-amber-500/30 rounded-xl p-4 space-y-3"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-bold text-sm text-amber-200">{seller.businessName}</h4>
                            <p className="text-xs text-slate-400">Owner: {seller.ownerName}</p>
                          </div>
                          <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] px-2 py-0.5 rounded-full font-bold">
                            PENDING APPROVAL
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-xs bg-slate-900 p-2.5 rounded-lg text-slate-300">
                          <div>
                            <span className="text-slate-500 block text-[10px]">Zone / Location:</span>
                            <span>{seller.locationZone}</span>
                          </div>
                          <div>
                            <span className="text-slate-500 block text-[10px]">Trading Permit No:</span>
                            <span className="font-mono">{seller.permitNumber}</span>
                          </div>
                          <div>
                            <span className="text-slate-500 block text-[10px]">National ID (NIN):</span>
                            <span className="font-mono">{seller.nationalIdNumber}</span>
                          </div>
                          <div>
                            <span className="text-slate-500 block text-[10px]">Phone Contact:</span>
                            <span>{seller.phone}</span>
                          </div>
                        </div>

                        <p className="text-xs text-slate-400 line-clamp-2">{seller.description}</p>

                        <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
                          <button
                            onClick={() => adminApproveSeller(seller.id)}
                            className="flex-1 flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs py-2 rounded-lg transition"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Approve Merchant</span>
                          </button>
                          <button
                            onClick={() => {
                              setSelectedSellerModal(seller);
                              setRejectionReason('Trading permit unverified with Masaka City Council');
                            }}
                            className="flex items-center justify-center gap-1 bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 border border-rose-800/60 font-semibold text-xs px-3 py-2 rounded-lg transition"
                          >
                            <X className="w-3.5 h-3.5" />
                            <span>Reject</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Approved Sellers Directory */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4">
                <h3 className="font-bold text-sm text-slate-200">
                  Approved Active Merchants ({approvedSellers.length})
                </h3>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-950 text-slate-400 font-semibold uppercase text-[10px] border-b border-slate-800">
                      <tr>
                        <th className="p-3">Store Name</th>
                        <th className="p-3">Owner & Phone</th>
                        <th className="p-3">Masaka Zone</th>
                        <th className="p-3">Trading Permit</th>
                        <th className="p-3">Orders</th>
                        <th className="p-3">Wallet Balance</th>
                        <th className="p-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 text-slate-300">
                      {approvedSellers.map((s) => (
                        <tr key={s.id} className="hover:bg-slate-800/30">
                          <td className="p-3 font-semibold text-white">{s.businessName}</td>
                          <td className="p-3">
                            <div>{s.ownerName}</div>
                            <div className="text-slate-500 text-[10px]">{s.phone}</div>
                          </td>
                          <td className="p-3 text-slate-400">{s.locationZone}</td>
                          <td className="p-3 font-mono text-slate-400 text-[11px]">{s.permitNumber}</td>
                          <td className="p-3 font-semibold text-slate-200">{s.totalOrders}</td>
                          <td className="p-3 font-bold text-emerald-400">
                            UGX {s.walletBalance.toLocaleString()}
                          </td>
                          <td className="p-3">
                            <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] px-2 py-0.5 rounded-full font-bold">
                              ACTIVE
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: RIDER APPROVALS */}
          {activeTab === 'riders' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold text-white">Independent Boda-Boda Delivery Partner Approval</h2>
                <p className="text-xs text-slate-400">
                  Section 4.2: Independent boda riders must provide Driving Licence and Vehicle Registration before receiving delivery jobs.
                </p>
              </div>

              {/* Pending Riders */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
                  <h3 className="font-bold text-sm text-slate-200">
                    Pending Boda Applications ({pendingRiders.length})
                  </h3>
                </div>

                {pendingRiders.length === 0 ? (
                  <div className="text-xs text-slate-400 py-6 text-center border border-dashed border-slate-800 rounded-xl">
                    No pending rider applications.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {pendingRiders.map((rider) => (
                      <div
                        key={rider.id}
                        className="bg-slate-950 border border-cyan-500/30 rounded-xl p-4 space-y-3"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-bold text-sm text-cyan-200">{rider.fullName}</h4>
                            <p className="text-xs text-slate-400">Stage: {rider.locationZone}</p>
                          </div>
                          <span className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-[10px] px-2 py-0.5 rounded-full font-bold">
                            PENDING APPROVAL
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-xs bg-slate-900 p-2.5 rounded-lg text-slate-300">
                          <div>
                            <span className="text-slate-500 block text-[10px]">Boda Plate:</span>
                            <span className="font-bold text-amber-300 font-mono">
                              {rider.bodaRegistrationNo}
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-500 block text-[10px]">Motorbike Model:</span>
                            <span>{rider.bodaModel}</span>
                          </div>
                          <div>
                            <span className="text-slate-500 block text-[10px]">Driving Licence:</span>
                            <span className="font-mono">{rider.drivingLicenseNo}</span>
                          </div>
                          <div>
                            <span className="text-slate-500 block text-[10px]">National ID (NIN):</span>
                            <span className="font-mono">{rider.nationalId}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
                          <button
                            onClick={() => adminApproveRider(rider.id)}
                            className="flex-1 flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs py-2 rounded-lg transition"
                          >
                            <ShieldCheck className="w-3.5 h-3.5" />
                            <span>Verify & Approve Boda Rider</span>
                          </button>
                          <button
                            onClick={() => {
                              setSelectedRiderModal(rider);
                              setRejectionReason('Driving license or Boda logbook inspection failed');
                            }}
                            className="flex items-center justify-center gap-1 bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 border border-rose-800/60 font-semibold text-xs px-3 py-2 rounded-lg transition"
                          >
                            <X className="w-3.5 h-3.5" />
                            <span>Reject</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Active Riders Fleet */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4">
                <h3 className="font-bold text-sm text-slate-200">
                  Approved Boda-Boda Fleet ({riders.filter((r) => r.status === 'APPROVED').length})
                </h3>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-950 text-slate-400 font-semibold uppercase text-[10px] border-b border-slate-800">
                      <tr>
                        <th className="p-3">Rider Name</th>
                        <th className="p-3">Phone</th>
                        <th className="p-3">Boda Plate & Model</th>
                        <th className="p-3">Current Masaka Stage</th>
                        <th className="p-3">Deliveries</th>
                        <th className="p-3">Wallet</th>
                        <th className="p-3">Duty Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 text-slate-300">
                      {riders
                        .filter((r) => r.status === 'APPROVED')
                        .map((r) => (
                          <tr key={r.id} className="hover:bg-slate-800/30">
                            <td className="p-3 font-semibold text-white">{r.fullName}</td>
                            <td className="p-3 text-slate-400">{r.phone}</td>
                            <td className="p-3">
                              <span className="font-mono font-bold text-amber-300 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                                {r.bodaRegistrationNo}
                              </span>
                              <div className="text-[10px] text-slate-500">{r.bodaModel}</div>
                            </td>
                            <td className="p-3 text-slate-400">{r.locationZone}</td>
                            <td className="p-3 font-semibold">{r.completedDeliveries}</td>
                            <td className="p-3 font-bold text-emerald-400">
                              UGX {r.walletBalance.toLocaleString()}
                            </td>
                            <td className="p-3">
                              <span
                                className={`text-[10px] px-2 py-0.5 rounded-full font-bold inline-flex items-center gap-1 ${
                                  r.isOnline
                                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                    : 'bg-slate-800 text-slate-400 border border-slate-700'
                                }`}
                              >
                                <span
                                  className={`w-1.5 h-1.5 rounded-full ${
                                    r.isOnline ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'
                                  }`}
                                />
                                {r.isOnline ? 'ONLINE' : 'OFFLINE'}
                              </span>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: ORDERS & DISPATCH CENTRAL */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-white">Order Control Plane & State Machine</h2>
                  <p className="text-xs text-slate-400">
                    Section 12: Order lifecycle state machine, delivery PIN control, and backend authority.
                  </p>
                </div>
                <button
                  onClick={fastTrackDemoOrder}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-3 py-2 rounded-xl transition flex items-center gap-1.5 shadow"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>Simulate New Masaka Order</span>
                </button>
              </div>

              {/* State Machine Legend */}
              <div className="bg-slate-900/60 border border-slate-800 p-3 rounded-xl flex items-center gap-2 overflow-x-auto text-[11px] text-slate-400 font-mono">
                <span className="text-emerald-400 font-bold">STATE FLOW:</span>
                <span>PAID</span> →
                <span>SELLER_CONFIRMED</span> →
                <span>READY_FOR_PICKUP</span> →
                <span>RIDER_ASSIGNED</span> →
                <span>PICKED_UP</span> →
                <span>ON_THE_WAY</span> →
                <span className="text-amber-400 font-bold">[PIN VERIFIED]</span> →
                <span className="text-emerald-400 font-bold">COMPLETED</span>
              </div>

              {/* Orders Table */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-950 text-slate-400 font-semibold uppercase text-[10px] border-b border-slate-800">
                      <tr>
                        <th className="p-3">Order ID</th>
                        <th className="p-3">Buyer & Zone</th>
                        <th className="p-3">Merchant</th>
                        <th className="p-3">Items & Subtotal</th>
                        <th className="p-3">Boda Rider</th>
                        <th className="p-3">Delivery PIN</th>
                        <th className="p-3">Payment</th>
                        <th className="p-3">Lifecycle State</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 text-slate-300">
                      {orders.map((o) => (
                        <tr key={o.id} className="hover:bg-slate-800/30">
                          <td className="p-3 font-mono font-bold text-white">{o.orderNumber}</td>
                          <td className="p-3">
                            <div className="font-semibold text-slate-200">{o.buyerName}</div>
                            <div className="text-[10px] text-slate-400">
                              {o.deliveryAddress.zone} • {o.deliveryAddress.street}
                            </div>
                          </td>
                          <td className="p-3 font-medium text-amber-300">{o.sellerName}</td>
                          <td className="p-3">
                            <div>{o.items.length} items</div>
                            <div className="font-semibold text-white">
                              UGX {o.totalUgx.toLocaleString()}
                            </div>
                          </td>
                          <td className="p-3">
                            {o.riderName ? (
                              <div>
                                <span className="font-semibold text-cyan-300">{o.riderName}</span>
                                <div className="font-mono text-[10px] text-slate-400">
                                  {o.riderBodaPlate}
                                </div>
                              </div>
                            ) : (
                              <span className="text-slate-500 italic">Unassigned</span>
                            )}
                          </td>
                          <td className="p-3">
                            <span className="font-mono font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/40 px-2 py-0.5 rounded text-xs">
                              {o.deliveryPin}
                            </span>
                          </td>
                          <td className="p-3">
                            <span className="text-[10px] font-semibold text-slate-300 block">
                              {o.paymentMethod.replace('_', ' ')}
                            </span>
                            <span
                              className={`text-[9px] uppercase font-bold ${
                                o.paymentStatus === 'SUCCESS' ? 'text-emerald-400' : 'text-amber-400'
                              }`}
                            >
                              {o.paymentStatus}
                            </span>
                          </td>
                          <td className="p-3">
                            <span
                              className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                                o.orderStatus === 'COMPLETED'
                                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                  : o.orderStatus === 'ON_THE_WAY'
                                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 animate-pulse'
                                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              }`}
                            >
                              {o.orderStatus}
                            </span>
                          </td>
                          <td className="p-3 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {o.orderStatus !== 'COMPLETED' && (
                                <button
                                  onClick={() => stepForwardOrder(o.id)}
                                  className="bg-emerald-700/60 hover:bg-emerald-600 text-white px-2 py-1 rounded text-[10px] font-medium transition"
                                  title="Advance to next step"
                                >
                                  Advance →
                                </button>
                              )}
                              <select
                                value={o.orderStatus}
                                onChange={(e) =>
                                  adminOverrideOrderStatus(o.id, e.target.value as OrderStatus)
                                }
                                className="bg-slate-900 border border-slate-700 rounded px-1.5 py-1 text-[10px] text-slate-300"
                              >
                                <option value="PAID">PAID</option>
                                <option value="SELLER_CONFIRMED">SELLER_CONFIRMED</option>
                                <option value="READY_FOR_PICKUP">READY_FOR_PICKUP</option>
                                <option value="RIDER_ASSIGNED">RIDER_ASSIGNED</option>
                                <option value="ON_THE_WAY">ON_THE_WAY</option>
                                <option value="COMPLETED">COMPLETED</option>
                                <option value="DISPUTE">DISPUTE</option>
                                <option value="REFUNDED">REFUNDED</option>
                              </select>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: FINANCIALS & SETTLEMENTS */}
          {activeTab === 'financials' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold text-white">Financial Records & Commission Ledger</h2>
                <p className="text-xs text-slate-400">
                  Section 17: Platform commission (5%), buyer service fee (UGX 1,000), and delivery margins.
                </p>
              </div>

              {/* Commission Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl">
                  <span className="text-slate-400 text-xs">Total 5% Seller Commissions</span>
                  <div className="mt-1 text-xl font-bold text-emerald-400">
                    UGX{' '}
                    {orders
                      .reduce((sum, o) => sum + o.commissionUgx, 0)
                      .toLocaleString()}
                  </div>
                </div>

                <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl">
                  <span className="text-slate-400 text-xs">Buyer Service Fees Collected (UGX 1,000/order)</span>
                  <div className="mt-1 text-xl font-bold text-white">
                    UGX{' '}
                    {orders
                      .reduce((sum, o) => sum + o.serviceFeeUgx, 0)
                      .toLocaleString()}
                  </div>
                </div>

                <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl">
                  <span className="text-slate-400 text-xs">Platform Delivery Margins (UGX 1,500/order)</span>
                  <div className="mt-1 text-xl font-bold text-amber-400">
                    UGX{' '}
                    {orders
                      .reduce((sum, o) => sum + o.platformDeliveryMarginUgx, 0)
                      .toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Immutable Settlement Records */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-slate-200">
                    Immutable Payout & Settlement Records ({settlements.length})
                  </h3>
                  <span className="text-[10px] text-slate-400">
                    Section 7.3: Financial records immutable once finalized
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-950 text-slate-400 font-semibold uppercase text-[10px] border-b border-slate-800">
                      <tr>
                        <th className="p-3">Reference / Order</th>
                        <th className="p-3">Recipient Type</th>
                        <th className="p-3">Recipient Name</th>
                        <th className="p-3">Gross Amount</th>
                        <th className="p-3">Fee Deducted</th>
                        <th className="p-3">Net Payout</th>
                        <th className="p-3">Channel</th>
                        <th className="p-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 text-slate-300">
                      {settlements.map((s) => (
                        <tr key={s.id} className="hover:bg-slate-800/30">
                          <td className="p-3 font-mono font-bold text-slate-200">{s.orderNumber}</td>
                          <td className="p-3">
                            <span
                              className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                                s.recipientType === 'SELLER'
                                  ? 'bg-amber-500/20 text-amber-300'
                                  : 'bg-cyan-500/20 text-cyan-300'
                              }`}
                            >
                              {s.recipientType}
                            </span>
                          </td>
                          <td className="p-3 font-semibold text-white">{s.recipientName}</td>
                          <td className="p-3">UGX {s.amountUgx.toLocaleString()}</td>
                          <td className="p-3 text-rose-400">
                            - UGX {s.feeDeductedUgx.toLocaleString()}
                          </td>
                          <td className="p-3 font-bold text-emerald-400">
                            UGX {s.netPayoutUgx.toLocaleString()}
                          </td>
                          <td className="p-3 font-mono text-[11px] text-slate-400">{s.method}</td>
                          <td className="p-3">
                            <span className="text-emerald-400 text-[10px] font-bold bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                              {s.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: MASAKA SERVICE AREAS */}
          {activeTab === 'zones' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold text-white">Masaka City Service Areas & Geofences</h2>
                <p className="text-xs text-slate-400">
                  Section 16: Initial launch Masaka City only. Service zones defined by demand, seller concentration, and rider availability.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {serviceAreas.map((zone) => (
                  <div
                    key={zone.id}
                    className={`bg-slate-900/80 border rounded-2xl p-4 space-y-3 transition ${
                      zone.isActive ? 'border-emerald-500/40' : 'border-slate-800 opacity-60'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-bold text-sm text-white">{zone.name}</h3>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full mt-1 inline-block ${
                            zone.demandLevel === 'Surge'
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                              : zone.demandLevel === 'High'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                              : 'bg-slate-800 text-slate-300'
                          }`}
                        >
                          Demand: {zone.demandLevel}
                        </span>
                      </div>
                      <button
                        onClick={() => toggleServiceArea(zone.id)}
                        className={`text-[11px] font-bold px-3 py-1 rounded-xl transition ${
                          zone.isActive
                            ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400'
                            : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                        }`}
                      >
                        {zone.isActive ? 'Active' : 'Disabled'}
                      </button>
                    </div>

                    <p className="text-xs text-slate-400">{zone.description}</p>

                    <div className="grid grid-cols-2 gap-2 text-xs bg-slate-950 p-2.5 rounded-xl">
                      <div>
                        <span className="text-slate-500 text-[10px] block">Base Delivery Fee</span>
                        <span className="font-bold text-emerald-400">
                          UGX {zone.baseDeliveryFeeUgx.toLocaleString()}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500 text-[10px] block">Avg Delivery Time</span>
                        <span className="font-semibold text-slate-200">
                          {zone.averageTimeMin} mins
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500 text-[10px] block">Active Boda Riders</span>
                        <span className="font-semibold text-cyan-300">
                          {zone.activeRidersCount} riders
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500 text-[10px] block">GPS Geofence</span>
                        <span className="font-mono text-slate-400">R: {zone.mapCoords.radius}km</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: DISPUTES */}
          {activeTab === 'disputes' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold text-white">Dispute & Complaint Cases</h2>
                <p className="text-xs text-slate-400">
                  Section 8: Central control platform handles buyer, seller, and rider disputes.
                </p>
              </div>

              <div className="space-y-4">
                {disputes.map((disp) => (
                  <div
                    key={disp.id}
                    className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="font-mono font-bold text-slate-200 text-sm">
                          Case #{disp.id.toUpperCase()} • Order {disp.orderNumber}
                        </span>
                        <div className="text-xs text-slate-400 mt-0.5">
                          Raised by: <span className="font-semibold text-amber-300">{disp.raisedBy}</span> •{' '}
                          Amount in question: UGX {disp.amountUgx.toLocaleString()}
                        </div>
                      </div>
                      <span
                        className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold ${
                          disp.status === 'RESOLVED'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        }`}
                      >
                        {disp.status}
                      </span>
                    </div>

                    <div className="p-3 bg-slate-950 rounded-xl text-xs text-slate-300 border border-slate-800/60">
                      <span className="font-semibold text-slate-400 block mb-1">Issue Description:</span>
                      {disp.reason}
                    </div>

                    {disp.status === 'RESOLVED' && disp.resolutionNote && (
                      <div className="p-3 bg-emerald-950/40 rounded-xl text-xs text-emerald-300 border border-emerald-500/30">
                        <span className="font-semibold text-emerald-400 block mb-1">
                          Resolution Outcome:
                        </span>
                        {disp.resolutionNote}
                      </div>
                    )}

                    {disp.status !== 'RESOLVED' && (
                      <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
                        <button
                          onClick={() => {
                            resolveDispute(
                              disp.id,
                              'Issued UGX 2,500 refund token to buyer; seller adjusted quantity inventory.'
                            );
                          }}
                          className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs px-4 py-2 rounded-xl transition"
                        >
                          Resolve & Credit Adjustment
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 8: AUDIT TRAIL */}
          {activeTab === 'audit' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold text-white">System Audit Trail</h2>
                <p className="text-xs text-slate-400">
                  Section 7.3 & 15: Immutable logging of all admin actions, dispatch events, and financial operations.
                </p>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-950 text-slate-400 font-semibold uppercase text-[10px] border-b border-slate-800">
                      <tr>
                        <th className="p-3">Timestamp</th>
                        <th className="p-3">Event / Action</th>
                        <th className="p-3">Actor & Role</th>
                        <th className="p-3">Detailed Payload</th>
                        <th className="p-3">Target Reference</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 text-slate-300">
                      {auditLogs.map((log) => (
                        <tr key={log.id} className="hover:bg-slate-800/30">
                          <td className="p-3 font-mono text-[10px] text-slate-400 whitespace-nowrap">
                            {new Date(log.timestamp).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                              second: '2-digit',
                            })}
                          </td>
                          <td className="p-3 font-mono font-bold text-emerald-400 text-[11px]">
                            {log.action}
                          </td>
                          <td className="p-3">
                            <span className="font-semibold text-slate-200">{log.actorName}</span>
                            <span className="text-[10px] text-slate-500 block font-mono">
                              ({log.actorRole})
                            </span>
                          </td>
                          <td className="p-3 text-slate-300">{log.details}</td>
                          <td className="p-3 font-mono text-[10px] text-slate-400">
                            {log.targetId || 'N/A'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Seller Rejection Reason Modal */}
      {selectedSellerModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white">
              Reject Merchant: {selectedSellerModal.businessName}
            </h3>
            <p className="text-xs text-slate-400">
              Provide specific regulatory reason so the seller can address and reapply (Section 4.1).
            </p>

            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-rose-500 h-24"
              placeholder="e.g. Trading license expired or Masaka physical address unverified..."
            />

            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setSelectedSellerModal(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  adminRejectSeller(selectedSellerModal.id, rejectionReason);
                  setSelectedSellerModal(null);
                }}
                className="bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs px-4 py-2 rounded-xl transition"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rider Rejection Modal */}
      {selectedRiderModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white">
              Reject Rider: {selectedRiderModal.fullName}
            </h3>
            <p className="text-xs text-slate-400">
              Provide reason for Boda partner record rejection (Section 4.2).
            </p>

            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-rose-500 h-24"
              placeholder="e.g. Invalid driving license number or boda motorcycle inspection pending..."
            />

            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setSelectedRiderModal(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  adminRejectRider(selectedRiderModal.id, rejectionReason);
                  setSelectedRiderModal(null);
                }}
                className="bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs px-4 py-2 rounded-xl transition"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
