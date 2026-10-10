import React, { useState } from 'react';
import {
  Smartphone,
  Download,
  ExternalLink,
  QrCode,
  Store,
  Bike,
  ShoppingBag,
  LayoutDashboard,
  Code2,
  Copy,
  Check,
  ShieldCheck,
  Zap,
  Info,
  Layers,
} from 'lucide-react';
import { PWAInstallModal } from '../common/PWAInstallModal';

interface AppPortalProps {
  onLaunchApp: (appName: 'BUYER' | 'SELLER' | 'RIDER' | 'ADMIN' | 'SIMULATOR') => void;
}

export const AppPortal: React.FC<AppPortalProps> = ({ onLaunchApp }) => {
  const [activeTab, setActiveTab] = useState<'install_portal' | 'flutter_guide'>('install_portal');
  const [selectedAppForInstall, setSelectedAppForInstall] = useState<{
    name: string;
    role: 'BUYER' | 'SELLER' | 'RIDER' | 'ADMIN' | 'HUB';
    url: string;
  } | null>(null);

  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Compute current origin / base URL
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';

  const apps = [
    {
      id: 'buyer',
      role: 'BUYER' as const,
      name: 'ManguDelivery - Buyer App',
      subtitle: 'Customer Marketplace & Order Tracking',
      target: 'Masaka residents, families, and businesses',
      color: 'from-amber-500 to-orange-600',
      badgeColor: 'bg-amber-500/20 text-amber-300 border border-amber-500/40',
      borderColor: 'hover:border-amber-500/60',
      icon: ShoppingBag,
      iconBg: 'bg-amber-500/20 text-amber-400',
      url: `${baseUrl}/?app=buyer&standalone=true`,
      features: [
        'Browse Masaka food, groceries, butchery & pharmacy',
        'Checkout with MTN MoMo, Airtel Money, or Cash',
        'Live Boda GPS map tracking across Masaka',
        '4-Digit Secure Delivery PIN handoff confirmation',
      ],
      packageId: 'com.mangudelivery.buyer',
    },
    {
      id: 'seller',
      role: 'SELLER' as const,
      name: 'ManguDelivery - Seller App',
      subtitle: 'Merchant Store & Order Management',
      target: 'Masaka shops, restaurants, butchers & pharmacies',
      color: 'from-purple-500 to-indigo-600',
      badgeColor: 'bg-purple-500/20 text-purple-300 border border-purple-500/40',
      borderColor: 'hover:border-purple-500/60',
      icon: Store,
      iconBg: 'bg-purple-500/20 text-purple-400',
      url: `${baseUrl}/?app=seller&standalone=true`,
      features: [
        'Admin verification & trading permit review',
        'Product catalog & inventory toggle in real time',
        'Incoming order audio alerts & kitchen prep status',
        'Auto-dispatch closest Boda rider when package is ready',
        '95% net sales wallet with instant MoMo withdrawal',
      ],
      packageId: 'com.mangudelivery.seller',
    },
    {
      id: 'rider',
      role: 'RIDER' as const,
      name: 'ManguDelivery - Rider App',
      subtitle: 'Independent Boda-Boda Delivery Partner',
      target: 'Verified boda riders in Masaka City',
      color: 'from-cyan-500 to-blue-600',
      badgeColor: 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40',
      borderColor: 'hover:border-cyan-500/60',
      icon: Bike,
      iconBg: 'bg-cyan-500/20 text-cyan-400',
      url: `${baseUrl}/?app=rider&standalone=true`,
      features: [
        'Driving licence & motorcycle plate verification',
        'Duty Online / Offline toggle with stage indicator',
        'Masaka dispatch radar with upfront Boda fares',
        'Turn-by-turn navigation to merchant & buyer dropoff',
        'Buyer PIN verification (unlocks completed payout)',
      ],
      packageId: 'com.mangudelivery.rider',
    },
  ];

  const handleCopyCode = (codeText: string, key: string) => {
    navigator.clipboard.writeText(codeText);
    setCopiedCode(key);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="flex-1 bg-slate-950 text-slate-100 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-950/80 via-slate-900 to-cyan-950/60 border border-emerald-500/40 rounded-3xl p-6 sm:p-8 space-y-4 shadow-2xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-3 py-0.5 rounded-full uppercase tracking-wider">
              Separate App Distributions
            </span>
            <span className="text-xs text-slate-400">• Independent Platforms</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Install Rider, Seller & Buyer Apps Separately
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Per the ManguDelivery architecture, buyers, merchants, and boda riders use separate,
            dedicated mobile applications. You can install each app individually on Android or iPhone
            (as standalone PWAs) or launch each app in its own dedicated window.
          </p>

          {/* Tab Switcher */}
          <div className="pt-2 flex items-center gap-3">
            <button
              onClick={() => setActiveTab('install_portal')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                activeTab === 'install_portal'
                  ? 'bg-emerald-600 text-white shadow-lg'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Smartphone className="w-4 h-4" />
              <span>Independent App Cards (Install / Launch)</span>
            </button>

            <button
              onClick={() => setActiveTab('flutter_guide')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                activeTab === 'flutter_guide'
                  ? 'bg-emerald-600 text-white shadow-lg'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Code2 className="w-4 h-4" />
              <span>Flutter Source & APK Architecture Guide</span>
            </button>
          </div>
        </div>

        {/* Ambient watermark */}
        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none translate-x-10 translate-y-10">
          <Smartphone className="w-96 h-96 text-emerald-400" />
        </div>
      </div>

      {/* VIEW 1: INDEPENDENT APPS INSTALL CARDS */}
      {activeTab === 'install_portal' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {apps.map((app) => {
              const IconComponent = app.icon;
              return (
                <div
                  key={app.id}
                  className={`bg-slate-900/90 border border-slate-800 ${app.borderColor} rounded-3xl p-5 sm:p-6 flex flex-col justify-between transition-all duration-200 shadow-xl space-y-4`}
                >
                  <div className="space-y-3">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className={`w-12 h-12 rounded-2xl ${app.iconBg} flex items-center justify-center font-bold shadow-md`}>
                        <IconComponent className="w-6 h-6" />
                      </div>
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${app.badgeColor}`}>
                        Separate App
                      </span>
                    </div>

                    <div>
                      <h3 className="text-base sm:text-lg font-black text-white">{app.name}</h3>
                      <p className="text-xs font-semibold text-slate-300">{app.subtitle}</p>
                      <p className="text-[11px] text-slate-500 mt-1">For: {app.target}</p>
                    </div>

                    {/* Features list */}
                    <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Included Features:
                      </span>
                      {app.features.map((feat, idx) => (
                        <div key={idx} className="flex items-start gap-1.5 text-[11px] text-slate-300">
                          <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-2 pt-4 border-t border-slate-800">
                    <button
                      onClick={() =>
                        setSelectedAppForInstall({
                          name: app.name,
                          role: app.role,
                          url: app.url,
                        })
                      }
                      className="w-full bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 transition shadow"
                    >
                      <QrCode className="w-4 h-4 text-emerald-400" />
                      <span>Install on Phone / Scan QR</span>
                    </button>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => onLaunchApp(app.role)}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 rounded-xl text-xs transition text-center shadow"
                      >
                        Launch in View
                      </button>

                      <a
                        href={app.url}
                        target="_blank"
                        rel="noreferrer"
                        className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold py-2 rounded-xl text-xs transition flex items-center justify-center gap-1"
                      >
                        <span>Open Solo</span>
                        <ExternalLink className="w-3 h-3 text-slate-400" />
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Admin Web Card below */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold shrink-0">
                <LayoutDashboard className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-extrabold text-sm text-white">
                    ManguDelivery Admin Web (React)
                  </h4>
                  <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full font-mono">
                    Control Plane
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Platform operations: Approves sellers and riders, monitors live orders, regulates 5% commissions and settlements.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => onLaunchApp('ADMIN')}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2 rounded-xl text-xs transition"
              >
                Launch Admin Control Plane
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: FLUTTER MULTI-APP SOURCE & APK BUILD GUIDE */}
      {activeTab === 'flutter_guide' && (
        <div className="space-y-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-black text-white">
                  Flutter Multi-App Architecture & Independent APKs
                </h3>
                <p className="text-xs text-slate-400">
                  Per documentation Section 1 & 23: The backend is Java Spring Boot with a shared PostgreSQL database, and the client applications are three distinct Flutter apps for Android and iOS.
                </p>
              </div>
              <span className="font-mono text-xs text-cyan-400 bg-cyan-950/60 border border-cyan-500/40 px-3 py-1 rounded-xl">
                Flutter 3.x / Dart
              </span>
            </div>

            {/* Architecture diagram */}
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 font-mono text-xs text-slate-300 space-y-2">
              <div className="text-emerald-400 font-bold">// Production Repository Structure (Separate Mobile Apps)</div>
              <div>mangu-delivery-ecosystem/</div>
              <div>├── <span className="text-amber-400 font-bold">mangu_buyer_app/</span>        <span className="text-slate-500">// Flutter App 1: Buyer (Search, Cart, MoMo, PIN)</span></div>
              <div>├── <span className="text-purple-400 font-bold">mangu_seller_app/</span>       <span className="text-slate-500">// Flutter App 2: Seller (Store, Menu, Kitchen, Orders)</span></div>
              <div>├── <span className="text-cyan-400 font-bold">mangu_rider_app/</span>        <span className="text-slate-500">// Flutter App 3: Rider (Boda partner, Dispatch, PIN verify)</span></div>
              <div>├── <span className="text-emerald-400 font-bold">mangu_admin_web/</span>        <span className="text-slate-500">// React Control Plane (Approvals, Settlements)</span></div>
              <div>└── <span className="text-rose-400 font-bold">mangu_backend_spring/</span>    <span className="text-slate-500">// Java 21 + Spring Boot + PostgreSQL</span></div>
            </div>

            {/* Independent APK Build Commands */}
            <div className="space-y-3 pt-2">
              <h4 className="font-bold text-sm text-slate-200">
                1. How to Build Independent Android APKs (.apk):
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* Buyer APK */}
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-amber-300">Buyer App APK</span>
                    <button
                      onClick={() => handleCopyCode('cd mangu_buyer_app && flutter build apk --release', 'buyer_cmd')}
                      className="text-[10px] text-slate-400 hover:text-white flex items-center gap-1"
                    >
                      {copiedCode === 'buyer_cmd' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>Copy</span>
                    </button>
                  </div>
                  <pre className="p-2 bg-slate-900 rounded font-mono text-[11px] text-slate-300 overflow-x-auto">
                    cd mangu_buyer_app{'\n'}flutter build apk --release
                  </pre>
                  <p className="text-[10px] text-slate-500">
                    Outputs: <code className="text-slate-400">app-release.apk</code> (Buyer only)
                  </p>
                </div>

                {/* Seller APK */}
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-purple-300">Seller App APK</span>
                    <button
                      onClick={() => handleCopyCode('cd mangu_seller_app && flutter build apk --release', 'seller_cmd')}
                      className="text-[10px] text-slate-400 hover:text-white flex items-center gap-1"
                    >
                      {copiedCode === 'seller_cmd' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>Copy</span>
                    </button>
                  </div>
                  <pre className="p-2 bg-slate-900 rounded font-mono text-[11px] text-slate-300 overflow-x-auto">
                    cd mangu_seller_app{'\n'}flutter build apk --release
                  </pre>
                  <p className="text-[10px] text-slate-500">
                    Outputs: <code className="text-slate-400">app-release.apk</code> (Merchant only)
                  </p>
                </div>

                {/* Rider APK */}
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-cyan-300">Rider App APK</span>
                    <button
                      onClick={() => handleCopyCode('cd mangu_rider_app && flutter build apk --release', 'rider_cmd')}
                      className="text-[10px] text-slate-400 hover:text-white flex items-center gap-1"
                    >
                      {copiedCode === 'rider_cmd' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>Copy</span>
                    </button>
                  </div>
                  <pre className="p-2 bg-slate-900 rounded font-mono text-[11px] text-slate-300 overflow-x-auto">
                    cd mangu_rider_app{'\n'}flutter build apk --release
                  </pre>
                  <p className="text-[10px] text-slate-500">
                    Outputs: <code className="text-slate-400">app-release.apk</code> (Boda Rider only)
                  </p>
                </div>
              </div>
            </div>

            {/* Shared Backend Contract */}
            <div className="space-y-2 pt-2">
              <h4 className="font-bold text-sm text-slate-200">
                2. Shared Java Backend Endpoints (Spring Boot REST):
              </h4>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 font-mono text-[11px] text-slate-300 space-y-1">
                <div><span className="text-emerald-400 font-bold">POST</span> /api/v1/auth/register-rider   <span className="text-slate-500">// Rider submits licence & boda plate</span></div>
                <div><span className="text-emerald-400 font-bold">POST</span> /api/v1/auth/register-seller  <span className="text-slate-500">// Seller submits trading permit</span></div>
                <div><span className="text-emerald-400 font-bold">POST</span> /api/v1/orders/checkout       <span className="text-slate-500">// Buyer orders with MTN MoMo / Airtel</span></div>
                <div><span className="text-cyan-400 font-bold">PUT</span>  /api/v1/orders/{'{id}'}/verify-pin  <span className="text-slate-500">// Rider inputs 4-digit PIN to finalize</span></div>
                <div><span className="text-amber-400 font-bold">POST</span> /api/v1/admin/approvals         <span className="text-slate-500">// Admin reviews & approves</span></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PWA Install Modal */}
      {selectedAppForInstall && (
        <PWAInstallModal
          appName={selectedAppForInstall.name}
          appRole={selectedAppForInstall.role}
          appUrl={selectedAppForInstall.url}
          isOpen={true}
          onClose={() => setSelectedAppForInstall(null)}
        />
      )}
    </div>
  );
};
