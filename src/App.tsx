import React, { useState, useEffect } from 'react';
import { useApp, AppProvider } from './context/AppContext';
import { AdminWebApp } from './components/admin/AdminWebApp';
import { BuyerApp } from './components/buyer/BuyerApp';
import { SellerApp } from './components/seller/SellerApp';
import { RiderApp } from './components/rider/RiderApp';
import { EcosystemSimulator } from './components/simulator/EcosystemSimulator';
import { AppPortal } from './components/portal/AppPortal';
import { DeviceFrame } from './components/common/DeviceFrame';
import { PWAInstallModal } from './components/common/PWAInstallModal';
import {
  LayoutDashboard,
  ShoppingBag,
  Store,
  Bike,
  Activity,
  Compass,
  Download,
  QrCode,
  Smartphone,
  ExternalLink,
  ChevronDown,
} from 'lucide-react';

const MainLayout: React.FC = () => {
  const {
    activePlatform,
    setActivePlatform,
    isStandaloneMode,
    setIsStandaloneMode,
    orders,
    sellers,
    riders,
  } = useApp();

  const [installModalApp, setInstallModalApp] = useState<{
    name: string;
    role: 'BUYER' | 'SELLER' | 'RIDER' | 'ADMIN' | 'HUB';
    url: string;
  } | null>(null);

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';

  // Get active app install details
  const getAppInstallMeta = (platform: string) => {
    switch (platform) {
      case 'BUYER':
        return {
          name: 'ManguDelivery - Buyer App',
          role: 'BUYER' as const,
          url: `${baseUrl}/?app=buyer&standalone=true`,
        };
      case 'SELLER':
        return {
          name: 'ManguDelivery - Seller App',
          role: 'SELLER' as const,
          url: `${baseUrl}/?app=seller&standalone=true`,
        };
      case 'RIDER':
        return {
          name: 'ManguDelivery - Rider App',
          role: 'RIDER' as const,
          url: `${baseUrl}/?app=rider&standalone=true`,
        };
      case 'ADMIN':
        return {
          name: 'ManguDelivery - Admin Web',
          role: 'ADMIN' as const,
          url: `${baseUrl}/?app=admin&standalone=true`,
        };
      default:
        return {
          name: 'ManguDelivery - Masaka Hub',
          role: 'HUB' as const,
          url: `${baseUrl}/?app=portal&standalone=true`,
        };
    }
  };

  const pendingApprovalsCount =
    sellers.filter((s) => s.status === 'PENDING_APPROVAL').length +
    riders.filter((r) => r.status === 'PENDING_APPROVAL').length;

  const activeOrdersCount = orders.filter((o) =>
    ['PAID', 'SELLER_CONFIRMED', 'READY_FOR_PICKUP', 'RIDER_ASSIGNED', 'PICKED_UP', 'ON_THE_WAY'].includes(
      o.orderStatus
    )
  ).length;

  // IF RUNNING IN PURE STANDALONE MODE (e.g. Launched from Home Screen or ?standalone=true)
  if (isStandaloneMode) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans select-none">
        {/* Floating helper strip to exit or switch if needed */}
        <div className="bg-slate-900/90 border-b border-slate-800 px-3 py-1 flex items-center justify-between text-[11px] text-slate-400 z-50">
          <div className="flex items-center gap-1.5 font-bold text-white">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>ManguDelivery {activePlatform}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setInstallModalApp(getAppInstallMeta(activePlatform))}
              className="text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1"
            >
              <Download className="w-3 h-3" />
              <span>Install to Home</span>
            </button>
            <span className="text-slate-600">|</span>
            <button
              onClick={() => {
                setIsStandaloneMode(false);
                setActivePlatform('PORTAL');
              }}
              className="text-slate-300 hover:text-white"
            >
              All Apps Hub
            </button>
          </div>
        </div>

        {/* Pure native viewport */}
        <div className="flex-1 flex flex-col overflow-y-auto">
          {activePlatform === 'BUYER' && <BuyerApp />}
          {activePlatform === 'SELLER' && <SellerApp />}
          {activePlatform === 'RIDER' && <RiderApp />}
          {activePlatform === 'ADMIN' && <AdminWebApp />}
          {activePlatform === 'SIMULATOR' && <EcosystemSimulator />}
          {activePlatform === 'PORTAL' && <AppPortal onLaunchApp={setActivePlatform} />}
        </div>

        {installModalApp && (
          <PWAInstallModal
            appName={installModalApp.name}
            appRole={installModalApp.role}
            appUrl={installModalApp.url}
            isOpen={true}
            onClose={() => setInstallModalApp(null)}
          />
        )}
      </div>
    );
  }

  // STANDARD WORKSPACE VIEW WITH MULTI-APP NAVIGATION & CHASSIS
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-black">
      {/* Top Navbar */}
      <nav className="h-14 bg-slate-900 border-b border-slate-800 px-3 sm:px-6 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActivePlatform('PORTAL')}
            className="flex items-center gap-2 hover:opacity-80 transition text-left"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center font-black text-slate-950 text-base shadow">
              M
            </div>
            <div>
              <span className="font-extrabold text-sm text-white tracking-tight">ManguDelivery</span>
              <span className="text-[10px] text-emerald-400 block -mt-1 font-semibold">
                Masaka Multi-Platform Hub
              </span>
            </div>
          </button>
        </div>

        {/* Platform View Switcher Buttons */}
        <div className="flex items-center gap-1 sm:gap-1.5 bg-slate-950/80 p-1 rounded-2xl border border-slate-800 overflow-x-auto max-w-full">
          <button
            onClick={() => setActivePlatform('PORTAL')}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activePlatform === 'PORTAL'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
            title="App Download & Install Portal"
          >
            <Smartphone className="w-3.5 h-3.5 text-emerald-300" />
            <span>Install Apps</span>
          </button>

          <button
            onClick={() => setActivePlatform('BUYER')}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activePlatform === 'BUYER'
                ? 'bg-amber-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
            title="Buyer Flutter Mobile App"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-amber-300" />
            <span>Buyer App</span>
          </button>

          <button
            onClick={() => setActivePlatform('SELLER')}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activePlatform === 'SELLER'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
            title="Seller Flutter Mobile App"
          >
            <Store className="w-3.5 h-3.5 text-purple-300" />
            <span>Seller App</span>
          </button>

          <button
            onClick={() => setActivePlatform('RIDER')}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activePlatform === 'RIDER'
                ? 'bg-cyan-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
            title="Rider Flutter Mobile App"
          >
            <Bike className="w-3.5 h-3.5 text-cyan-300" />
            <span>Rider App</span>
            {activeOrdersCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            )}
          </button>

          <button
            onClick={() => setActivePlatform('ADMIN')}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activePlatform === 'ADMIN'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
            title="React Admin Web App"
          >
            <LayoutDashboard className="w-3.5 h-3.5 text-emerald-300" />
            <span>Admin</span>
            {pendingApprovalsCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-amber-400 text-slate-950 text-[9px] font-black flex items-center justify-center">
                {pendingApprovalsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActivePlatform('SIMULATOR')}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activePlatform === 'SIMULATOR'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
            title="Interactive Ecosystem Simulator"
          >
            <Activity className="w-3.5 h-3.5 text-emerald-300" />
            <span>Simulator</span>
          </button>
        </div>

        {/* Install Current App Quick Action */}
        <div className="flex items-center gap-2">
          {activePlatform !== 'PORTAL' && (
            <button
              onClick={() => setInstallModalApp(getAppInstallMeta(activePlatform))}
              className="hidden sm:flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-sm"
              title="Install this specific app on your phone"
            >
              <QrCode className="w-3.5 h-3.5 text-emerald-400" />
              <span>Install {activePlatform} App</span>
            </button>
          )}
        </div>
      </nav>

      {/* Main Platform Body */}
      <main className="flex-1 flex flex-col">
        {activePlatform === 'PORTAL' && <AppPortal onLaunchApp={setActivePlatform} />}

        {activePlatform === 'SIMULATOR' && <EcosystemSimulator />}

        {activePlatform === 'ADMIN' && <AdminWebApp />}

        {activePlatform === 'BUYER' && (
          <DeviceFrame
            appName="ManguDelivery Buyer"
            appBadge="Flutter Android/iOS"
            badgeColor="bg-amber-400"
            onInstallClick={() => setInstallModalApp(getAppInstallMeta('BUYER'))}
          >
            <BuyerApp />
          </DeviceFrame>
        )}

        {activePlatform === 'SELLER' && (
          <DeviceFrame
            appName="ManguDelivery Merchant"
            appBadge="Flutter Store Owner"
            badgeColor="bg-purple-400"
            onInstallClick={() => setInstallModalApp(getAppInstallMeta('SELLER'))}
          >
            <SellerApp />
          </DeviceFrame>
        )}

        {activePlatform === 'RIDER' && (
          <DeviceFrame
            appName="ManguDelivery Boda Partner"
            appBadge="Flutter Rider"
            badgeColor="bg-cyan-400"
            onInstallClick={() => setInstallModalApp(getAppInstallMeta('RIDER'))}
          >
            <RiderApp />
          </DeviceFrame>
        )}
      </main>

      {/* Modal for In-App Install & Phone QR Code */}
      {installModalApp && (
        <PWAInstallModal
          appName={installModalApp.name}
          appRole={installModalApp.role}
          appUrl={installModalApp.url}
          isOpen={true}
          onClose={() => setInstallModalApp(null)}
        />
      )}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
