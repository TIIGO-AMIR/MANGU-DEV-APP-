import React, { useState } from 'react';
import { Wifi, BatteryMedium, Signal, Maximize2, Minimize2 } from 'lucide-react';

interface DeviceFrameProps {
  children: React.ReactNode;
  appName: string;
  appBadge?: string;
  badgeColor?: string;
  onInstallClick?: () => void;
}

export const DeviceFrame: React.FC<DeviceFrameProps> = ({
  children,
  appName,
  appBadge,
  badgeColor = 'bg-emerald-500',
  onInstallClick,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center py-4 px-2 sm:px-4">
      {/* Phone Header Bar (Controls) */}
      <div className="w-full max-w-sm mb-3 flex items-center justify-between px-2 text-xs text-slate-400 gap-2">
        <div className="flex items-center gap-2 truncate">
          <span className={`w-2.5 h-2.5 rounded-full ${badgeColor} animate-pulse shrink-0`} />
          <span className="font-semibold text-slate-200 truncate">{appName}</span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {onInstallClick && (
            <button
              onClick={onInstallClick}
              className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 bg-emerald-950/60 hover:bg-emerald-900/60 px-2.5 py-1 rounded-lg border border-emerald-500/40 text-[11px] font-bold transition shadow-sm"
              title="Install this app independently on your device"
            >
              <span>📲 Install</span>
            </button>
          )}

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1 hover:text-white bg-slate-800/80 hover:bg-slate-700 px-2 py-1 rounded-lg border border-slate-700/60 transition text-[11px]"
            title={isExpanded ? 'Fit to Mobile Chassis' : 'Expand Width'}
          >
            {isExpanded ? (
              <>
                <Minimize2 className="w-3 h-3" />
                <span>Fit</span>
              </>
            ) : (
              <>
                <Maximize2 className="w-3 h-3" />
                <span>Expand</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Chassis Body */}
      <div
        className={`relative transition-all duration-300 shadow-2xl overflow-hidden ${
          isExpanded
            ? 'w-full max-w-3xl rounded-2xl border-4 border-slate-800 bg-slate-950'
            : 'w-full max-w-[400px] h-[780px] rounded-[42px] border-[10px] border-slate-900 bg-slate-950 ring-1 ring-slate-800 shadow-emerald-950/20'
        } flex flex-col`}
      >
        {/* Status Bar */}
        <div className="h-10 bg-slate-950 px-6 flex items-center justify-between text-[11px] text-slate-400 font-medium shrink-0 select-none z-30">
          <span>9:41</span>
          {/* Dynamic Island / Notch */}
          <div className="w-24 h-4 bg-slate-900 rounded-full flex items-center justify-center gap-1.5 border border-slate-800">
            <div className="w-2 h-2 rounded-full bg-slate-950" />
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/80" />
          </div>
          <div className="flex items-center gap-1.5">
            <Signal className="w-3.5 h-3.5" />
            <Wifi className="w-3.5 h-3.5" />
            <BatteryMedium className="w-4 h-4" />
          </div>
        </div>

        {/* App Viewport Container */}
        <div className="flex-1 overflow-y-auto relative flex flex-col bg-slate-950 text-slate-100">
          {children}
        </div>

        {/* Home Indicator Bar */}
        <div className="h-5 bg-slate-950 flex items-center justify-center shrink-0 z-30">
          <div className="w-32 h-1 bg-slate-700/80 rounded-full" />
        </div>
      </div>
    </div>
  );
};
