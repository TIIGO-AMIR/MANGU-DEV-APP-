import React, { useState } from 'react';
import {
  Bike,
  Navigation,
  CheckCircle,
  Phone,
  Power,
  MapPin,
  Clock,
  KeyRound,
  AlertCircle,
  ShieldCheck,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MasakaInteractiveMap } from '../masaka-map/MasakaInteractiveMap';
import { RiderProfile, Order } from '../../types';

export const RiderApp: React.FC = () => {
  const {
    riders,
    sellers,
    orders,
    currentRiderId,
    setCurrentRiderId,
    toggleRiderOnline,
    riderAcceptJob,
    riderPickupPackage,
    riderVerifyDeliveryPin,
    submitRiderApplication,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'jobs' | 'active_delivery' | 'earnings' | 'profile'>('jobs');
  const [pinInput, setPinInput] = useState('');
  const [pinVerificationResult, setPinVerificationResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  // New Rider Registration Modal
  const [showRiderAppModal, setShowRiderAppModal] = useState(false);
  const [riderFullName, setRiderFullName] = useState('');
  const [riderPhone, setRiderPhone] = useState('+256 7');
  const [riderBodaPlate, setRiderBodaPlate] = useState('UEX ');
  const [riderModel, setRiderModel] = useState('Bajaj Boxer 150');
  const [riderLicense, setRiderLicense] = useState('DL-UG-2026-');
  const [riderZone, setRiderZone] = useState('Nyendo Stage');

  const currentRider: RiderProfile | undefined =
    riders.find((r) => r.id === currentRiderId) || riders[0];

  // Active delivery job assigned to this rider
  const activeAssignedJob: Order | undefined = orders.find(
    (o) =>
      o.riderId === currentRider?.id &&
      ['RIDER_ASSIGNED', 'PICKED_UP', 'ON_THE_WAY'].includes(o.orderStatus)
  );

  // Available unassigned jobs in Masaka
  const availableJobs: Order[] = orders.filter(
    (o) => o.orderStatus === 'READY_FOR_PICKUP' || (o.orderStatus === 'PAID' && !o.riderId)
  );

  const handleVerifyPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeAssignedJob) return;

    const result = riderVerifyDeliveryPin(activeAssignedJob.id, pinInput);
    setPinVerificationResult(result);

    if (result.success) {
      setPinInput('');
      setTimeout(() => {
        setPinVerificationResult(null);
        setActiveTab('earnings');
      }, 2000);
    }
  };

  const handleRegisterRider = (e: React.FormEvent) => {
    e.preventDefault();
    submitRiderApplication({
      fullName: riderFullName,
      phone: riderPhone,
      bodaRegistrationNo: riderBodaPlate,
      bodaModel: riderModel,
      drivingLicenseNo: riderLicense,
      locationZone: riderZone,
    });
    setShowRiderAppModal(false);
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-950 font-sans text-slate-100 select-none pb-14">
      {/* Rider Header Bar */}
      <div className="bg-slate-900 border-b border-slate-800 px-4 py-3 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 font-bold">
            <Bike className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white truncate max-w-[140px]">
                {currentRider?.fullName || 'Rider'}
              </span>
              <span className="font-mono text-[9px] bg-amber-500/10 border border-amber-500/30 text-amber-300 px-1.5 py-0.2 rounded font-bold">
                {currentRider?.bodaRegistrationNo}
              </span>
            </div>
            <p className="text-[10px] text-slate-400">{currentRider?.locationZone}</p>
          </div>
        </div>

        {/* Switch Rider partner selector */}
        <select
          value={currentRiderId}
          onChange={(e) => setCurrentRiderId(e.target.value)}
          className="bg-slate-950 border border-slate-700 text-[10px] text-slate-300 rounded-lg px-2 py-1 max-w-[120px] truncate"
        >
          {riders.map((r) => (
            <option key={r.id} value={r.id}>
              {r.fullName} ({r.bodaRegistrationNo})
            </option>
          ))}
        </select>
      </div>

      {/* Online / Offline Status Toggle Bar */}
      {currentRider?.status === 'APPROVED' && (
        <div
          className={`px-4 py-2.5 border-b flex items-center justify-between transition-colors ${
            currentRider.isOnline
              ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
              : 'bg-slate-900/60 border-slate-800 text-slate-400'
          }`}
        >
          <div className="flex items-center gap-2 text-xs font-bold">
            <span
              className={`w-2 h-2 rounded-full ${
                currentRider.isOnline ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'
              }`}
            />
            <span>
              {currentRider.isOnline
                ? 'ONLINE • Ready to receive Masaka jobs'
                : 'OFFLINE • Boda parked'}
            </span>
          </div>

          <button
            onClick={() => toggleRiderOnline(currentRider.id)}
            className={`flex items-center gap-1 text-[11px] font-bold px-3 py-1 rounded-full transition ${
              currentRider.isOnline
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30 hover:bg-rose-500/30'
                : 'bg-emerald-500 text-slate-950 hover:bg-emerald-400'
            }`}
          >
            <Power className="w-3 h-3" />
            <span>{currentRider.isOnline ? 'Go Offline' : 'Go Online'}</span>
          </button>
        </div>
      )}

      {/* If current rider is PENDING APPROVAL - Section 4.2 */}
      {currentRider?.status === 'PENDING_APPROVAL' && (
        <div className="p-4 m-4 bg-cyan-950/40 border border-cyan-500/40 rounded-2xl space-y-3">
          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5 animate-spin-slow" />
            <div>
              <h3 className="font-bold text-xs text-cyan-200">
                Boda Partner Application Pending
              </h3>
              <p className="text-[11px] text-slate-300 mt-1">
                Your driving license ({currentRider.drivingLicenseNo}) and motorcycle logbook for {currentRider.bodaRegistrationNo} are undergoing compliance review by the Admin.
              </p>
            </div>
          </div>
          <p className="text-[10px] text-emerald-400 font-medium">
            💡 Tip: Switch to Admin Web view to approve this Boda Rider instantly!
          </p>
        </div>
      )}

      {/* Quick Access to Active Job Banner (if exists) */}
      {activeAssignedJob && activeTab !== 'active_delivery' && (
        <div
          onClick={() => setActiveTab('active_delivery')}
          className="mx-4 mt-3 bg-gradient-to-r from-cyan-950 to-slate-900 border border-cyan-500/50 rounded-2xl p-3 flex items-center justify-between cursor-pointer shadow-lg animate-pulse"
        >
          <div className="flex items-center gap-2.5">
            <Navigation className="w-5 h-5 text-cyan-400" />
            <div>
              <div className="text-xs font-bold text-white">
                Active Job #{activeAssignedJob.orderNumber}
              </div>
              <div className="text-[10px] text-cyan-300">
                Status: {activeAssignedJob.orderStatus} • Tap for GPS navigation
              </div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-cyan-400" />
        </div>
      )}

      {/* TAB 1: AVAILABLE JOBS RADAR */}
      {activeTab === 'jobs' && (
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Quick Metrics */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
              <span className="text-[10px] text-slate-400">Today's Earnings</span>
              <div className="text-sm font-black text-emerald-400 mt-0.5">
                UGX {currentRider?.walletBalance.toLocaleString()}
              </div>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
              <span className="text-[10px] text-slate-400">Completed Trips</span>
              <div className="text-sm font-black text-white mt-0.5">
                {currentRider?.completedDeliveries} boda trips
              </div>
            </div>
          </div>

          {/* Dispatch Job Queue */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-slate-200">
              <span className="flex items-center gap-1.5 text-cyan-400">
                <Navigation className="w-4 h-4" />
                <span>Masaka Dispatch Radar</span>
              </span>
              <span className="text-[11px] text-slate-400">{availableJobs.length} available</span>
            </div>

            {!currentRider?.isOnline ? (
              <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl text-center space-y-2">
                <Power className="w-8 h-8 text-slate-600 mx-auto" />
                <h4 className="font-bold text-xs text-slate-300">You are currently offline</h4>
                <p className="text-[11px] text-slate-500">
                  Switch to Online at the top to receive incoming delivery requests in Masaka.
                </p>
                <button
                  onClick={() => toggleRiderOnline(currentRider?.id)}
                  className="bg-emerald-600 text-white font-bold text-xs px-4 py-2 rounded-xl mt-2"
                >
                  Turn Online Now
                </button>
              </div>
            ) : availableJobs.length === 0 ? (
              <div className="p-6 bg-slate-900/40 border border-dashed border-slate-800 rounded-2xl text-center text-xs text-slate-400 space-y-2">
                <Clock className="w-6 h-6 text-slate-600 mx-auto animate-spin" />
                <p>Scanning Masaka City for orders ready for pickup...</p>
                <p className="text-[10px] text-slate-500">
                  (Tip: Use Buyer app or Admin fast-track to trigger an order!)
                </p>
              </div>
            ) : (
              availableJobs.map((job) => (
                <div
                  key={job.id}
                  className="p-3.5 bg-slate-900 border border-cyan-500/40 rounded-2xl space-y-3 shadow-lg"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-mono font-bold text-xs text-white">
                        Order #{job.orderNumber}
                      </span>
                      <div className="text-xs font-semibold text-amber-300 mt-0.5">
                        {job.sellerName}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-black text-emerald-400 block">
                        UGX {job.deliveryFeeUgx.toLocaleString()}
                      </span>
                      <span className="text-[10px] text-slate-400">Boda Payout</span>
                    </div>
                  </div>

                  <div className="p-2.5 bg-slate-950 rounded-xl space-y-1.5 text-xs">
                    <div className="flex items-center gap-2 text-slate-300">
                      <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
                      <span className="truncate">Pickup: {job.sellerZone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-300">
                      <span className="w-2 h-2 rounded-full bg-rose-400 shrink-0" />
                      <span className="truncate">Dropoff: {job.deliveryAddress.zone}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      riderAcceptJob(job.id, currentRider?.id);
                      setActiveTab('active_delivery');
                    }}
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-xl text-xs transition shadow-lg flex items-center justify-center gap-2"
                  >
                    <Bike className="w-4 h-4" />
                    <span>Accept Delivery Job</span>
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 2: ACTIVE DELIVERY (GPS & DELIVERY PIN CONFIRMATION) */}
      {activeTab === 'active_delivery' && (
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {!activeAssignedJob ? (
            <div className="p-8 text-center text-xs text-slate-500 space-y-3">
              <Bike className="w-10 h-10 text-slate-700 mx-auto" />
              <p>No active delivery job currently in progress.</p>
              <button
                onClick={() => setActiveTab('jobs')}
                className="bg-emerald-600 text-white font-bold text-xs px-4 py-2 rounded-xl"
              >
                View Available Jobs
              </button>
            </div>
          ) : (
            <>
              {/* Order Status Ribbon */}
              <div className="p-3 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block font-mono">ACTIVE JOB</span>
                  <span className="font-mono font-bold text-white text-sm">
                    {activeAssignedJob.orderNumber}
                  </span>
                </div>
                <span className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {activeAssignedJob.orderStatus}
                </span>
              </div>

              {/* Masaka Live Route Map */}
              <div>
                <div className="flex items-center justify-between text-xs font-bold text-slate-300 mb-1">
                  <span>GPS Turn-by-Turn Route</span>
                  <span className="text-[10px] text-cyan-400 font-mono">Boda: {currentRider?.bodaRegistrationNo}</span>
                </div>
                <MasakaInteractiveMap
                  sellers={sellers}
                  riders={riders}
                  activeOrder={activeAssignedJob}
                  height="h-56"
                />
              </div>

              {/* Navigation Action Card based on state */}
              {activeAssignedJob.orderStatus === 'RIDER_ASSIGNED' && (
                <div className="p-4 bg-slate-900 border border-amber-500/40 rounded-2xl space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                    <MapPin className="w-4 h-4 text-amber-400" />
                    <span>Step 1: Ride to Merchant for Pickup</span>
                  </div>
                  <div className="text-xs text-slate-300 space-y-1 bg-slate-950 p-2.5 rounded-xl">
                    <div className="font-semibold text-white">{activeAssignedJob.sellerName}</div>
                    <div className="text-slate-400">{activeAssignedJob.sellerZone}</div>
                  </div>

                  <button
                    onClick={() => riderPickupPackage(activeAssignedJob.id)}
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl text-xs transition shadow-lg flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Confirm Package Picked Up</span>
                  </button>
                </div>
              )}

              {/* STEP 2: En Route & Enter Buyer PIN */}
              {['PICKED_UP', 'ON_THE_WAY'].includes(activeAssignedJob.orderStatus) && (
                <div className="p-4 bg-slate-900 border border-cyan-500/40 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-bold text-cyan-300">
                      <Bike className="w-4 h-4 text-cyan-400 animate-pulse" />
                      <span>Step 2: Deliver to Buyer & Enter PIN</span>
                    </div>
                    <a
                      href={`tel:${activeAssignedJob.buyerPhone}`}
                      className="p-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition"
                      title="Call Buyer"
                    >
                      <Phone className="w-3.5 h-3.5" />
                    </a>
                  </div>

                  <div className="text-xs text-slate-300 space-y-1 bg-slate-950 p-2.5 rounded-xl">
                    <div className="font-semibold text-white">{activeAssignedJob.buyerName}</div>
                    <div className="text-slate-400">
                      {activeAssignedJob.deliveryAddress.zone} • {activeAssignedJob.deliveryAddress.street}
                    </div>
                    <div className="text-[11px] text-amber-300">
                      Landmark: {activeAssignedJob.deliveryAddress.landmark}
                    </div>
                  </div>

                  {/* Critical 4-Digit Security PIN Verification Form - Section 12 & 13 */}
                  <form onSubmit={handleVerifyPin} className="space-y-3 pt-2">
                    <div>
                      <label className="text-xs font-bold text-emerald-300 flex items-center gap-1.5 mb-1">
                        <KeyRound className="w-3.5 h-3.5" />
                        <span>Enter Buyer's 4-Digit Delivery PIN</span>
                      </label>
                      <p className="text-[10px] text-slate-400 mb-2">
                        Per Section 13: The buyer holds this PIN on their phone to prevent false delivery claims.
                      </p>

                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          maxLength={4}
                          required
                          value={pinInput}
                          onChange={(e) => setPinInput(e.target.value)}
                          placeholder="e.g. 4928"
                          className="flex-1 bg-slate-950 border border-emerald-500/60 rounded-xl p-3 text-center font-mono font-black text-lg text-emerald-400 tracking-widest focus:outline-none focus:border-emerald-400"
                        />
                        <button
                          type="submit"
                          className="bg-emerald-600 hover:bg-emerald-500 text-white font-black px-4 py-3 rounded-xl text-xs transition"
                        >
                          Verify & Complete
                        </button>
                      </div>
                    </div>

                    {pinVerificationResult && (
                      <div
                        className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                          pinVerificationResult.success
                            ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/40'
                            : 'bg-rose-950/60 text-rose-300 border border-rose-500/40'
                        }`}
                      >
                        {pinVerificationResult.success ? (
                          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                        )}
                        <span>{pinVerificationResult.message}</span>
                      </div>
                    )}
                  </form>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* TAB 3: EARNINGS & WALLET */}
      {activeTab === 'earnings' && (
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="p-4 bg-gradient-to-br from-cyan-950/50 via-slate-900 to-emerald-950/40 border border-cyan-500/30 rounded-2xl space-y-3">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Boda Partner Balance
            </span>
            <div className="text-2xl font-black text-emerald-400">
              UGX {currentRider?.walletBalance.toLocaleString()}
            </div>
            <p className="text-[10px] text-slate-400">
              Delivery fees instantly credited upon correct 4-digit PIN verification.
            </p>

            <button
              onClick={() => alert(`Withdrawal request of UGX ${currentRider?.walletBalance.toLocaleString()} queued for MTN MoMo payout.`)}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-xl text-xs transition"
            >
              Withdraw to MTN MoMo
            </button>
          </div>

          <div className="space-y-2">
            <h3 className="font-bold text-xs text-slate-300">Delivery History</h3>
            {orders
              .filter((o) => o.riderId === currentRider?.id && o.orderStatus === 'COMPLETED')
              .map((ord) => (
                <div
                  key={ord.id}
                  className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-mono font-bold text-slate-200">{ord.orderNumber}</span>
                    <div className="text-[10px] text-slate-400">
                      {ord.sellerZone} → {ord.deliveryAddress.zone}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-emerald-400">
                      + UGX {ord.deliveryFeeUgx.toLocaleString()}
                    </span>
                    <div className="text-[10px] text-slate-500">PIN verified</div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* TAB 4: RIDER PROFILE */}
      {activeTab === 'profile' && (
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-2 text-xs">
            <h3 className="font-bold text-white text-sm">{currentRider?.fullName}</h3>
            <div className="pt-2 border-t border-slate-800 space-y-1 text-[11px] text-slate-300 font-mono">
              <div>Boda Plate: {currentRider?.bodaRegistrationNo}</div>
              <div>Model: {currentRider?.bodaModel}</div>
              <div>Driving Licence: {currentRider?.drivingLicenseNo}</div>
              <div>National ID: {currentRider?.nationalId}</div>
              <div>Stage: {currentRider?.locationZone}</div>
            </div>
          </div>

          <button
            onClick={() => setShowRiderAppModal(true)}
            className="w-full p-3 bg-slate-900 border border-slate-700 hover:border-cyan-500 rounded-xl text-xs font-semibold text-slate-200 transition text-center"
          >
            + Register New Boda Partner
          </button>
        </div>
      )}

      {/* RIDER APPLICATION MODAL */}
      {showRiderAppModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-sm w-full p-5 space-y-3">
            <h3 className="font-bold text-sm text-white">Boda Rider Partner Registration</h3>
            <p className="text-[10px] text-slate-400">
              Submit details for Admin approval (Section 4.2).
            </p>

            <form onSubmit={handleRegisterRider} className="space-y-2.5 text-xs">
              <div>
                <label className="text-slate-400 block mb-0.5">Full Name</label>
                <input
                  type="text"
                  required
                  value={riderFullName}
                  onChange={(e) => setRiderFullName(e.target.value)}
                  placeholder="e.g. Sula Mukasa"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-0.5">Boda Plate Number</label>
                <input
                  type="text"
                  required
                  value={riderBodaPlate}
                  onChange={(e) => setRiderBodaPlate(e.target.value)}
                  placeholder="e.g. UFC 882B"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white font-mono"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-0.5">Driving Licence No</label>
                <input
                  type="text"
                  required
                  value={riderLicense}
                  onChange={(e) => setRiderLicense(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white font-mono"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-0.5">Masaka Boda Stage</label>
                <select
                  value={riderZone}
                  onChange={(e) => setRiderZone(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white"
                >
                  <option value="Nyendo Stage">Nyendo Stage</option>
                  <option value="Masaka CBD - Elgin Rd">Masaka CBD - Elgin Rd</option>
                  <option value="Katwe Stage">Katwe Stage</option>
                  <option value="Ssaza Stage">Ssaza Stage</option>
                  <option value="Bwala Hill Stage">Bwala Hill Stage</option>
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowRiderAppModal(false)}
                  className="w-1/2 py-2 text-slate-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2 rounded-lg"
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
          onClick={() => setActiveTab('jobs')}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-medium transition ${
            activeTab === 'jobs' ? 'text-cyan-400' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Navigation className="w-4 h-4" />
          <span>Jobs</span>
        </button>

        <button
          onClick={() => setActiveTab('active_delivery')}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-medium transition relative ${
            activeTab === 'active_delivery' ? 'text-cyan-400' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Bike className="w-4 h-4" />
          <span>Navigate</span>
          {activeAssignedJob && (
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 absolute top-0 right-3 animate-ping" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('earnings')}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-medium transition ${
            activeTab === 'earnings' ? 'text-cyan-400' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Earnings</span>
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-medium transition ${
            activeTab === 'profile' ? 'text-cyan-400' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Profile</span>
        </button>
      </div>
    </div>
  );
};
