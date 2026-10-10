import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  Play,
  RotateCcw,
  CheckCircle2,
  Bike,
  Store,
  ShoppingBag,
  ShieldAlert,
  Layers,
  KeyRound,
  Eye,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MasakaInteractiveMap } from '../masaka-map/MasakaInteractiveMap';

export const EcosystemSimulator: React.FC = () => {
  const {
    orders,
    sellers,
    riders,
    fastTrackDemoOrder,
    stepForwardOrder,
    resetDemoData,
    adminApproveSeller,
    adminApproveRider,
    selectedOrderId,
    setSelectedOrderId,
    setActivePlatform,
  } = useApp();

  const [activeStep, setActiveStep] = useState(1);

  const latestOrder = orders[0];

  const getStepNumber = (status?: string) => {
    switch (status) {
      case 'PENDING_PAYMENT':
        return 1;
      case 'PAID':
        return 2;
      case 'SELLER_CONFIRMED':
        return 3;
      case 'READY_FOR_PICKUP':
      case 'RIDER_ASSIGNED':
        return 4;
      case 'PICKED_UP':
      case 'ON_THE_WAY':
        return 5;
      case 'COMPLETED':
        return 6;
      default:
        return 1;
    }
  };

  const currentStep = getStepNumber(latestOrder?.orderStatus);

  return (
    <div className="flex-1 bg-slate-950 p-4 sm:p-6 lg:p-8 space-y-6 text-slate-100 overflow-y-auto">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-emerald-950/70 via-slate-900 to-amber-950/40 border border-emerald-500/30 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl">
        <div className="max-w-2xl relative z-10 space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-[11px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-3 py-1 rounded-full font-bold uppercase tracking-wider">
              ManguDelivery System Simulator • v3.0
            </span>
            <span className="text-xs text-amber-300 font-medium">Masaka City Pilot</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Four Linked Platforms, One Shared Backend
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            As specified in the technical documentation: ManguDelivery connects{' '}
            <strong className="text-emerald-400">Admin Control Plane (React)</strong>,{' '}
            <strong className="text-amber-400">Buyer Mobile App</strong>,{' '}
            <strong className="text-purple-400">Seller Mobile App</strong>, and{' '}
            <strong className="text-cyan-400">Independent Boda-Boda Rider App</strong> sharing
            a Java Spring Boot backend and PostgreSQL database.
          </p>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={fastTrackDemoOrder}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-lg transition"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Simulate Fresh Masaka Order</span>
            </button>

            {latestOrder && latestOrder.orderStatus !== 'COMPLETED' && (
              <button
                onClick={() => stepForwardOrder(latestOrder.id)}
                className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-lg transition"
              >
                <Play className="w-4 h-4" />
                <span>Advance Next State: ({latestOrder.orderStatus})</span>
              </button>
            )}

            <button
              onClick={resetDemoData}
              className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs px-3.5 py-2.5 rounded-xl flex items-center gap-1.5 transition border border-slate-700"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset State</span>
            </button>
          </div>
        </div>
      </div>

      {/* Realtime 6-Step Critical Scenario Tracker (Per Section 17 & 20) */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-sm text-white">
              Critical Order Lifecycle Pipeline (Doc Page 17)
            </h3>
            <p className="text-xs text-slate-400">
              Buyer orders → Seller accepts → Seller prepares → Rider accepts → Rider picks up → Rider travels → Buyer confirms PIN → Order completes → Financial records finalized.
            </p>
          </div>
          {latestOrder && (
            <span className="font-mono text-xs text-emerald-400 font-bold bg-emerald-950/60 border border-emerald-500/40 px-3 py-1 rounded-xl">
              Order #{latestOrder.orderNumber}
            </span>
          )}
        </div>

        {/* 6 Step Visual Progress Bar */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-2 text-xs">
          <div
            className={`p-3 rounded-xl border transition ${
              currentStep >= 1
                ? 'bg-emerald-950/50 border-emerald-500/50 text-emerald-300'
                : 'bg-slate-950 border-slate-800 text-slate-500'
            }`}
          >
            <div className="font-bold">1. Order Placed</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Paid via MTN MoMo / Airtel</div>
          </div>

          <div
            className={`p-3 rounded-xl border transition ${
              currentStep >= 2
                ? 'bg-emerald-950/50 border-emerald-500/50 text-emerald-300'
                : 'bg-slate-950 border-slate-800 text-slate-500'
            }`}
          >
            <div className="font-bold">2. Seller Confirmed</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Merchant accepted prep</div>
          </div>

          <div
            className={`p-3 rounded-xl border transition ${
              currentStep >= 3
                ? 'bg-emerald-950/50 border-emerald-500/50 text-emerald-300'
                : 'bg-slate-950 border-slate-800 text-slate-500'
            }`}
          >
            <div className="font-bold">3. Ready for Pickup</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Kitchen packed items</div>
          </div>

          <div
            className={`p-3 rounded-xl border transition ${
              currentStep >= 4
                ? 'bg-emerald-950/50 border-emerald-500/50 text-emerald-300'
                : 'bg-slate-950 border-slate-800 text-slate-500'
            }`}
          >
            <div className="font-bold">4. Boda Assigned</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Closest online rider</div>
          </div>

          <div
            className={`p-3 rounded-xl border transition ${
              currentStep >= 5
                ? 'bg-emerald-950/50 border-emerald-500/50 text-emerald-300'
                : 'bg-slate-950 border-slate-800 text-slate-500'
            }`}
          >
            <div className="font-bold">5. In Transit</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Rider on Masaka map</div>
          </div>

          <div
            className={`p-3 rounded-xl border transition ${
              currentStep >= 6
                ? 'bg-emerald-950/50 border-emerald-500/50 text-emerald-300'
                : 'bg-slate-950 border-slate-800 text-slate-500'
            }`}
          >
            <div className="font-bold">6. PIN Verified</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Ledger settled (5% fee)</div>
          </div>
        </div>

        {/* Live Step Controller */}
        {latestOrder && (
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <span className="font-bold text-slate-300">Active Order Info:</span>
              <span className="text-amber-300 font-semibold">{latestOrder.sellerName}</span>
              <span className="text-slate-500">→</span>
              <span className="text-slate-200">{latestOrder.deliveryAddress.zone}</span>
              <span className="text-emerald-400 font-mono font-bold">
                UGX {latestOrder.totalUgx.toLocaleString()}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-slate-400 text-[11px]">Delivery PIN:</span>
              <span className="bg-emerald-500 text-slate-950 font-mono font-black px-2 py-0.5 rounded text-xs">
                {latestOrder.deliveryPin}
              </span>
              {latestOrder.orderStatus !== 'COMPLETED' ? (
                <button
                  onClick={() => stepForwardOrder(latestOrder.id)}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3 py-1.5 rounded-lg transition"
                >
                  Step Forward →
                </button>
              ) : (
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Settled & Closed</span>
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Masaka Live Dispatch Map & Platform Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Live Map */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-200">Masaka City Live Movement</h3>
            <span className="text-xs text-slate-400">
              {sellers.filter((s) => s.status === 'APPROVED').length} Stores •{' '}
              {riders.filter((r) => r.isOnline).length} Active Bodas
            </span>
          </div>
          <MasakaInteractiveMap
            sellers={sellers.filter((s) => s.status === 'APPROVED')}
            riders={riders}
            activeOrder={latestOrder}
            height="h-72"
          />
        </div>

        {/* Platform Quick Switch Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* Admin Web Card */}
          <div
            onClick={() => setActivePlatform('ADMIN')}
            className="p-4 bg-slate-900/90 border border-slate-800 hover:border-emerald-500/70 rounded-2xl cursor-pointer transition group flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                🖥️
              </div>
              <h4 className="font-black text-sm text-white group-hover:text-emerald-300 transition">
                Admin Web App (React)
              </h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Platform control plane. Approvals for sellers and boda riders, financial commissions, dispute resolution, Masaka zone geofences.
              </p>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs font-semibold text-emerald-400 pt-2 border-t border-slate-800">
              <span>Open Control Plane</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
            </div>
          </div>

          {/* Buyer App Card */}
          <div
            onClick={() => setActivePlatform('BUYER')}
            className="p-4 bg-slate-900/90 border border-slate-800 hover:border-amber-500/70 rounded-2xl cursor-pointer transition group flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                📱
              </div>
              <h4 className="font-black text-sm text-white group-hover:text-amber-300 transition">
                Buyer App (Flutter)
              </h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Browse Masaka stores, Luwombo, butchery, meds. Cart checkout via MTN MoMo / Airtel Money, live map tracking, and 4-digit Delivery PIN.
              </p>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs font-semibold text-amber-400 pt-2 border-t border-slate-800">
              <span>Launch Buyer Mobile</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
            </div>
          </div>

          {/* Seller App Card */}
          <div
            onClick={() => setActivePlatform('SELLER')}
            className="p-4 bg-slate-900/90 border border-slate-800 hover:border-purple-500/70 rounded-2xl cursor-pointer transition group flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">
                🏪
              </div>
              <h4 className="font-black text-sm text-white group-hover:text-purple-300 transition">
                Seller App (Flutter)
              </h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Store registration & approval, catalog management, real-time incoming orders, kitchen prep, dispatching boda partners, wallet payouts.
              </p>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs font-semibold text-purple-400 pt-2 border-t border-slate-800">
              <span>Launch Seller Mobile</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
            </div>
          </div>

          {/* Rider App Card */}
          <div
            onClick={() => setActivePlatform('RIDER')}
            className="p-4 bg-slate-900/90 border border-slate-800 hover:border-cyan-500/70 rounded-2xl cursor-pointer transition group flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
                🛵
              </div>
              <h4 className="font-black text-sm text-white group-hover:text-cyan-300 transition">
                Rider App (Flutter)
              </h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Boda partner app. Online/Offline toggle, dispatch radar, pickup navigation, buyer PIN verification, and daily boda fare wallet earnings.
              </p>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs font-semibold text-cyan-400 pt-2 border-t border-slate-800">
              <span>Launch Rider Mobile</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
