import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import {
  Download,
  Share2,
  Smartphone,
  ExternalLink,
  Copy,
  Check,
  X,
  PlusSquare,
  QrCode,
  ShieldCheck,
} from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';

interface PWAInstallModalProps {
  appName: string;
  appRole: 'BUYER' | 'SELLER' | 'RIDER' | 'ADMIN' | 'HUB';
  appUrl: string;
  isOpen: boolean;
  onClose: () => void;
}

export const PWAInstallModal: React.FC<PWAInstallModalProps> = ({
  appName,
  appRole,
  appUrl,
  isOpen,
  onClose,
}) => {
  const { isInstallable, triggerInstall, isIOS } = usePWAInstall();
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'scan' | 'instructions'>('scan');

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(appUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getThemeColor = () => {
    switch (appRole) {
      case 'BUYER':
        return {
          bg: 'bg-amber-600',
          border: 'border-amber-500/40',
          text: 'text-amber-400',
          badge: 'bg-amber-500/20 text-amber-300',
        };
      case 'SELLER':
        return {
          bg: 'bg-purple-600',
          border: 'border-purple-500/40',
          text: 'text-purple-400',
          badge: 'bg-purple-500/20 text-purple-300',
        };
      case 'RIDER':
        return {
          bg: 'bg-cyan-600',
          border: 'border-cyan-500/40',
          text: 'text-cyan-400',
          badge: 'bg-cyan-500/20 text-cyan-300',
        };
      default:
        return {
          bg: 'bg-emerald-600',
          border: 'border-emerald-500/40',
          text: 'text-emerald-400',
          badge: 'bg-emerald-500/20 text-emerald-300',
        };
    }
  };

  const theme = getThemeColor();

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl ${theme.badge} flex items-center justify-center font-black text-sm`}>
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-white">
                Install {appName}
              </h3>
              <p className="text-[11px] text-slate-400">
                Install this app separately on Android, iPhone, or Desktop
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="px-5 pt-3 pb-1 flex gap-2 border-b border-slate-800/60 bg-slate-950/30">
          <button
            onClick={() => setActiveTab('scan')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              activeTab === 'scan'
                ? 'bg-slate-800 text-white border border-slate-700 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>Scan with Phone</span>
          </button>
          <button
            onClick={() => setActiveTab('instructions')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              activeTab === 'instructions'
                ? 'bg-slate-800 text-white border border-slate-700 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Install Instructions</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs flex-1">
          {/* Direct Install Button if Browser Supports it */}
          {isInstallable && (
            <button
              onClick={triggerInstall}
              className={`w-full py-3 rounded-2xl ${theme.bg} hover:opacity-90 text-white font-extrabold text-xs shadow-lg transition flex items-center justify-center gap-2`}
            >
              <Download className="w-4 h-4" />
              <span>Click to Install {appName} Directly</span>
            </button>
          )}

          {activeTab === 'scan' ? (
            <div className="space-y-4 text-center">
              <div className="bg-white p-4 rounded-2xl w-fit mx-auto shadow-inner border-4 border-slate-800">
                <QRCodeSVG
                  value={appUrl}
                  size={190}
                  level="H"
                  includeMargin={false}
                />
              </div>

              <div className="space-y-1">
                <p className="font-bold text-slate-200 text-xs">
                  Scan this QR code with your phone camera
                </p>
                <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
                  It opens the dedicated <strong className="text-white">{appName}</strong> directly on your mobile device as an independent standalone app!
                </p>
              </div>

              {/* Copy URL Box */}
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between gap-2">
                <span className="font-mono text-[10px] text-slate-400 truncate max-w-[240px]">
                  {appUrl}
                </span>
                <button
                  onClick={handleCopy}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-[11px] font-semibold flex items-center gap-1 transition shrink-0"
                >
                  {copied ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>

              <a
                href={appUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-slate-300 hover:text-white underline underline-offset-4 font-semibold"
              >
                <span>Launch in new standalone browser window</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          ) : (
            <div className="space-y-3.5">
              {/* Android Guide */}
              <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 font-bold text-slate-200 text-xs">
                  <span className="w-5 h-5 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[11px]">
                    🤖
                  </span>
                  <span>How to install on Android (Chrome / Brave / Edge)</span>
                </div>
                <ol className="list-decimal list-inside space-y-1 text-[11px] text-slate-300 pl-1 leading-relaxed">
                  <li>Open this app link in Chrome on your phone.</li>
                  <li>Tap the <strong>three dots menu (⋮)</strong> in the top-right corner.</li>
                  <li>Tap <strong>"Install App"</strong> or <strong>"Add to Home screen"</strong>.</li>
                  <li>The app icon will appear on your phone home screen just like an APK!</li>
                </ol>
              </div>

              {/* iOS Guide */}
              <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 font-bold text-slate-200 text-xs">
                  <span className="w-5 h-5 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center text-[11px]">
                    🍏
                  </span>
                  <span>How to install on iPhone & iPad (Safari)</span>
                </div>
                <ol className="list-decimal list-inside space-y-1 text-[11px] text-slate-300 pl-1 leading-relaxed">
                  <li>Open this app link in <strong>Safari</strong> on your iPhone.</li>
                  <li>Tap the <strong>Share</strong> button (box with an arrow pointing up at the bottom).</li>
                  <li>Scroll down and tap <strong>"Add to Home Screen"</strong> (<PlusSquare className="w-3.5 h-3.5 inline mx-0.5 text-slate-400" />).</li>
                  <li>Tap <strong>Add</strong> in the top-right corner. You're done!</li>
                </ol>
              </div>

              {/* Windows / Mac Desktop */}
              <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 font-bold text-slate-200 text-xs">
                  <span className="w-5 h-5 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-[11px]">
                    💻
                  </span>
                  <span>How to install on Windows / Mac / Chromebook</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  In Chrome or Edge, click the <strong>Install App icon</strong> in the address bar (next to the star bookmark icon) to install as a standalone desktop window.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between text-[11px] text-slate-400">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Standalone PWA Technology</span>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
