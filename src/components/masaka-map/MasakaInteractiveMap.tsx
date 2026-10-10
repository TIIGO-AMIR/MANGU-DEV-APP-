import React, { useState } from 'react';
import { Store, MapPin, Navigation, Bike, Compass, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { SellerProfile, RiderProfile, Order } from '../../types';

interface MasakaMapProps {
  sellers: SellerProfile[];
  riders: RiderProfile[];
  activeOrder?: Order | null;
  selectedSellerId?: string | null;
  onSelectSeller?: (seller: SellerProfile) => void;
  height?: string;
  showAllRiders?: boolean;
  interactive?: boolean;
  userCoords?: { x: number; y: number };
}

export const MasakaInteractiveMap: React.FC<MasakaMapProps> = ({
  sellers,
  riders,
  activeOrder,
  selectedSellerId,
  onSelectSeller,
  height = 'h-72',
  showAllRiders = true,
  interactive = true,
  userCoords,
}) => {
  const [zoom, setZoom] = useState(1);
  const [hoveredEntity, setHoveredEntity] = useState<string | null>(null);

  // If there's an active order with moving rider
  const riderPosition = activeOrder?.riderCoordinates || (riders.find(r => r.isOnline)?.coordinates) || { x: 55, y: 48 };
  const storePosition = activeOrder?.sellerCoordinates || (sellers[0]?.coordinates) || { x: 48, y: 52 };
  const destPosition = activeOrder?.deliveryAddress.coordinates || userCoords || { x: 48, y: 52 };

  return (
    <div className={`relative w-full ${height} overflow-hidden rounded-2xl border border-slate-700/60 bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950/40 shadow-inner select-none font-sans`}>
      {/* Map Header Overlay */}
      <div className="absolute top-3 left-3 z-20 flex items-center gap-2 bg-slate-900/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700/80 shadow-md">
        <Compass className="w-4 h-4 text-emerald-400 animate-spin-slow" />
        <span className="text-xs font-semibold text-slate-200 tracking-wide uppercase">Masaka City Live Grid</span>
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
      </div>

      {/* Zoom / Reset Controls */}
      {interactive && (
        <div className="absolute top-3 right-3 z-20 flex flex-col gap-1.5 bg-slate-900/85 backdrop-blur-md p-1 rounded-xl border border-slate-700/80 shadow-md">
          <button
            onClick={() => setZoom(z => Math.min(z + 0.2, 1.8))}
            className="p-1 hover:bg-slate-800 rounded-lg text-slate-300 hover:text-white transition"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setZoom(z => Math.max(z - 0.2, 0.8))}
            className="p-1 hover:bg-slate-800 rounded-lg text-slate-300 hover:text-white transition"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setZoom(1)}
            className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition"
            title="Reset Zoom"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Map Canvas SVG with Zoom Transformation */}
      <div
        className="w-full h-full transition-transform duration-300 ease-out origin-center"
        style={{ transform: `scale(${zoom})` }}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full preserve-3d" preserveAspectRatio="none">
          <defs>
            {/* Grid Pattern */}
            <pattern id="mapGrid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255, 255, 255, 0.03)" strokeWidth="0.5" />
            </pattern>

            {/* Glowing route gradient */}
            <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="50%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>

            {/* Zone Gradients */}
            <radialGradient id="nyendoZone" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(245, 158, 11, 0.15)" />
              <stop offset="100%" stopColor="rgba(245, 158, 11, 0.01)" />
            </radialGradient>
            <radialGradient id="cbdZone" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(16, 185, 129, 0.18)" />
              <stop offset="100%" stopColor="rgba(16, 185, 129, 0.01)" />
            </radialGradient>
            <radialGradient id="katweZone" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(59, 130, 246, 0.15)" />
              <stop offset="100%" stopColor="rgba(59, 130, 246, 0.01)" />
            </radialGradient>
            <radialGradient id="bwalaZone" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(168, 85, 247, 0.14)" />
              <stop offset="100%" stopColor="rgba(168, 85, 247, 0.01)" />
            </radialGradient>
          </defs>

          {/* Background Grid */}
          <rect width="100" height="100" fill="url(#mapGrid)" />

          {/* Masaka Topographic Zones / Neighborhood Clusters */}
          {/* Nyendo Zone (Top-Right) */}
          <circle cx="72" cy="32" r="16" fill="url(#nyendoZone)" stroke="rgba(245, 158, 11, 0.3)" strokeWidth="0.4" strokeDasharray="1.5,1.5" />
          <text x="72" y="22" fill="#f59e0b" fontSize="2.4" textAnchor="middle" fontWeight="bold" opacity="0.8">NYENDO HUB</text>

          {/* Masaka CBD (Center) */}
          <circle cx="48" cy="52" r="15" fill="url(#cbdZone)" stroke="rgba(16, 185, 129, 0.35)" strokeWidth="0.4" strokeDasharray="1.5,1.5" />
          <text x="48" y="44" fill="#34d399" fontSize="2.4" textAnchor="middle" fontWeight="bold" opacity="0.85">MASAKA CBD</text>

          {/* Katwe Industrial (Bottom-Left) */}
          <circle cx="40" cy="75" r="14" fill="url(#katweZone)" stroke="rgba(59, 130, 246, 0.3)" strokeWidth="0.4" strokeDasharray="1.5,1.5" />
          <text x="40" y="85" fill="#60a5fa" fontSize="2.2" textAnchor="middle" fontWeight="bold" opacity="0.8">KATWE INDUSTRIAL</text>

          {/* Bwala Hill (Top-Left) */}
          <circle cx="28" cy="35" r="13" fill="url(#bwalaZone)" stroke="rgba(168, 85, 247, 0.3)" strokeWidth="0.4" strokeDasharray="1.5,1.5" />
          <text x="28" y="27" fill="#c084fc" fontSize="2.2" textAnchor="middle" fontWeight="bold" opacity="0.8">BWALA HILL</text>

          {/* Ssaza Zone (Bottom-Right) */}
          <text x="66" y="74" fill="#94a3b8" fontSize="2.2" textAnchor="middle" opacity="0.75">SSAZA GROUNDS</text>

          {/* Major Masaka Arterial Roads */}
          {/* Kampala-Masaka-Mbarara Highway Corridor */}
          <path
            d="M 95 15 C 80 25, 65 35, 48 52 C 38 64, 25 78, 5 88"
            fill="none"
            stroke="rgba(255, 255, 255, 0.16)"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          {/* Elgin Road / Hobart Street Cross Grid */}
          <path
            d="M 28 35 Q 48 46 72 32"
            fill="none"
            stroke="rgba(255, 255, 255, 0.1)"
            strokeWidth="1.1"
          />
          <path
            d="M 48 20 L 48 85"
            fill="none"
            stroke="rgba(255, 255, 255, 0.1)"
            strokeWidth="1.1"
          />
          <path
            d="M 40 75 Q 55 70 70 72"
            fill="none"
            stroke="rgba(255, 255, 255, 0.08)"
            strokeWidth="0.9"
          />

          {/* Active Order Route Path (Seller -> Rider -> Buyer) */}
          {activeOrder && (
            <>
              {/* Route Trajectory: Store -> Destination via Rider */}
              <path
                d={`M ${storePosition.x} ${storePosition.y} Q ${riderPosition.x} ${riderPosition.y} ${destPosition.x} ${destPosition.y}`}
                fill="none"
                stroke="url(#routeGradient)"
                strokeWidth="1.5"
                strokeDasharray="2,2"
                className="animate-pulse"
              />

              {/* Rider Pulse Radar Ring */}
              <circle
                cx={riderPosition.x}
                cy={riderPosition.y}
                r="4.5"
                fill="none"
                stroke="#10b981"
                strokeWidth="0.5"
                opacity="0.8"
                className="animate-ping origin-center"
              />
            </>
          )}

          {/* Render All Verified Sellers */}
          {sellers.map((seller) => {
            const isSelected = selectedSellerId === seller.id || activeOrder?.sellerId === seller.id;
            return (
              <g
                key={seller.id}
                className="cursor-pointer transition-transform duration-200"
                onClick={() => onSelectSeller && onSelectSeller(seller)}
                onMouseEnter={() => setHoveredEntity(`seller-${seller.id}`)}
                onMouseLeave={() => setHoveredEntity(null)}
              >
                {/* Store Pin Marker */}
                <circle
                  cx={seller.coordinates.x}
                  cy={seller.coordinates.y}
                  r={isSelected ? 3.5 : 2.5}
                  fill={isSelected ? '#10b981' : '#f59e0b'}
                  stroke="#ffffff"
                  strokeWidth={isSelected ? 0.8 : 0.4}
                  className="shadow-lg"
                />
                <circle
                  cx={seller.coordinates.x}
                  cy={seller.coordinates.y}
                  r={isSelected ? 6 : 4}
                  fill="none"
                  stroke={isSelected ? '#10b981' : '#f59e0b'}
                  strokeWidth="0.3"
                  opacity={isSelected ? 0.7 : 0.3}
                />
              </g>
            );
          })}

          {/* Active Boda Boda Riders */}
          {showAllRiders &&
            riders
              .filter((r) => r.isOnline || r.id === activeOrder?.riderId)
              .map((rider) => {
                const isActiveJob = activeOrder?.riderId === rider.id;
                const pos = isActiveJob ? riderPosition : rider.coordinates;

                return (
                  <g
                    key={rider.id}
                    className="cursor-pointer"
                    onMouseEnter={() => setHoveredEntity(`rider-${rider.id}`)}
                    onMouseLeave={() => setHoveredEntity(null)}
                  >
                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      r={isActiveJob ? 3.8 : 2.4}
                      fill={isActiveJob ? '#06b6d4' : '#64748b'}
                      stroke="#ffffff"
                      strokeWidth={isActiveJob ? 0.8 : 0.4}
                    />
                    {isActiveJob && (
                      <circle
                        cx={pos.x}
                        cy={pos.y}
                        r="6"
                        fill="none"
                        stroke="#06b6d4"
                        strokeWidth="0.4"
                        className="animate-ping"
                      />
                    )}
                  </g>
                );
              })}

          {/* Active Order Delivery Dropoff Destination */}
          {activeOrder && (
            <g>
              <circle
                cx={destPosition.x}
                cy={destPosition.y}
                r="3"
                fill="#ef4444"
                stroke="#ffffff"
                strokeWidth="0.8"
              />
              <circle
                cx={destPosition.x}
                cy={destPosition.y}
                r="5.5"
                fill="none"
                stroke="#ef4444"
                strokeWidth="0.4"
                strokeDasharray="1,1"
              />
            </g>
          )}
        </svg>

        {/* Dynamic HTML Labels for Hovered / Key Elements */}
        {sellers.map((s) => (
          <div
            key={`lbl-${s.id}`}
            style={{
              left: `${s.coordinates.x}%`,
              top: `${s.coordinates.y}%`,
              transform: 'translate(-50%, -135%)',
            }}
            className={`absolute pointer-events-none transition-all duration-200 z-10 ${
              selectedSellerId === s.id || hoveredEntity === `seller-${s.id}`
                ? 'scale-105 opacity-100'
                : 'scale-90 opacity-80'
            }`}
          >
            <div className="bg-slate-900/95 border border-amber-500/50 rounded-lg px-2 py-0.5 text-[10px] font-medium text-amber-300 shadow-md flex items-center gap-1 whitespace-nowrap">
              <Store className="w-2.5 h-2.5 text-amber-400" />
              <span>{s.businessName.split(' ')[0]}</span>
            </div>
          </div>
        ))}

        {/* Active Rider Tag Overlay */}
        {activeOrder && activeOrder.riderName && (
          <div
            style={{
              left: `${riderPosition.x}%`,
              top: `${riderPosition.y}%`,
              transform: 'translate(-50%, 40%)',
            }}
            className="absolute pointer-events-none z-10 transition-all duration-300"
          >
            <div className="bg-cyan-950/95 border border-cyan-400/70 rounded-lg px-2 py-0.5 text-[10px] font-bold text-cyan-200 shadow-lg flex items-center gap-1 whitespace-nowrap animate-bounce">
              <Bike className="w-2.5 h-2.5 text-cyan-400" />
              <span>{activeOrder.riderName} ({activeOrder.riderBodaPlate})</span>
            </div>
          </div>
        )}

        {/* Dropoff Address Tag Overlay */}
        {activeOrder && (
          <div
            style={{
              left: `${destPosition.x}%`,
              top: `${destPosition.y}%`,
              transform: 'translate(-50%, -140%)',
            }}
            className="absolute pointer-events-none z-10"
          >
            <div className="bg-rose-950/95 border border-rose-500/70 rounded-lg px-2 py-0.5 text-[10px] font-bold text-rose-200 shadow-lg flex items-center gap-1 whitespace-nowrap">
              <MapPin className="w-2.5 h-2.5 text-rose-400" />
              <span>Dropoff: {activeOrder.deliveryAddress.zone}</span>
            </div>
          </div>
        )}
      </div>

      {/* Map Legend Footer */}
      <div className="absolute bottom-2 left-2 right-2 z-20 flex items-center justify-between bg-slate-950/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800 text-[11px] text-slate-300">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
            <span className="text-slate-400 text-[10px]">Merchant</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-cyan-400 inline-block" />
            <span className="text-slate-400 text-[10px]">Boda Rider</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-rose-500 inline-block" />
            <span className="text-slate-400 text-[10px]">Buyer Dropoff</span>
          </div>
        </div>

        <div className="text-[10px] text-slate-400 flex items-center gap-1">
          <Navigation className="w-3 h-3 text-emerald-400" />
          <span>Masaka Municipal Pilot</span>
        </div>
      </div>
    </div>
  );
};
