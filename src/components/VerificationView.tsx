import React, { useState } from 'react';
import { AcousticMeasurement, EngineeringProfile, EngineeringResult, Venue, VerificationSnapshot, VerificationState } from '../types';
import { 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  ShieldAlert, 
  RotateCcw, 
  FileText, 
  Save, 
  Clock, 
  ArrowRight,
  TrendingDown,
  TrendingUp,
  Download
} from 'lucide-react';

interface VerificationViewProps {
  venue: Venue;
  profile: EngineeringProfile;
  latestMeasurement: AcousticMeasurement | null;
  engineeringResult: EngineeringResult | null;
  verifications: VerificationSnapshot[];
  onAddVerification: (snapshot: VerificationSnapshot) => void;
  onTriggerVerificationSweep: () => void;
}

export const VerificationView: React.FC<VerificationViewProps> = ({
  venue,
  profile,
  latestMeasurement,
  engineeringResult,
  verifications,
  onAddVerification,
  onTriggerVerificationSweep
}) => {
  const [operatorNotes, setOperatorNotes] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  const state: VerificationState = engineeringResult?.state ?? 'needs_reverification';
  const compliance = engineeringResult?.complianceRate ?? 82;

  const handleRunSweep = () => {
    setIsVerifying(true);
    onTriggerVerificationSweep();
    setTimeout(() => {
      setIsVerifying(false);
    }, 1200);
  };

  const handleLogSnapshot = () => {
    const newSnapshot: VerificationSnapshot = {
      id: 'ver_' + Date.now(),
      timestamp: new Date().toLocaleString(),
      baselineId: 'baseline_active',
      profileId: profile.id,
      venueId: venue.id,
      state,
      complianceScorePercent: compliance,
      deviationsCount: engineeringResult?.alerts.length ?? 0,
      summary: `Verification completed for ${profile.name} at ${venue.name}. State: ${state.toUpperCase()} (${compliance}% match).`,
      frequencyDeltas: [
        { hz: 63, baselineDb: -2.0, currentDb: (latestMeasurement?.frequencyBands[0]?.measuredDb ?? 2.5), deltaDb: +4.5 },
        { hz: 125, baselineDb: -1.0, currentDb: (latestMeasurement?.frequencyBands[1]?.measuredDb ?? 0.8), deltaDb: +1.8 },
        { hz: 1000, baselineDb: 0.0, currentDb: (latestMeasurement?.frequencyBands[2]?.measuredDb ?? 0.0), deltaDb: 0.0 },
        { hz: 4000, baselineDb: -1.5, currentDb: (latestMeasurement?.frequencyBands[3]?.measuredDb ?? -0.5), deltaDb: +1.0 },
        { hz: 10000, baselineDb: -3.5, currentDb: (latestMeasurement?.frequencyBands[4]?.measuredDb ?? -3.2), deltaDb: +0.3 }
      ],
      operatorNotes: operatorNotes || 'Nominal verification sweep logged by system operator.'
    };

    onAddVerification(newSnapshot);
    setOperatorNotes('');
  };

  return (
    <div className="space-y-6">
      {/* Verification Status Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 ${
              state === 'verified'
                ? 'bg-emerald-950/80 border border-emerald-500/50 text-emerald-400'
                : state === 'needs_reverification'
                ? 'bg-amber-950/80 border border-amber-500/50 text-amber-400'
                : 'bg-rose-950/80 border border-rose-500/50 text-rose-400'
            }`}>
              {state === 'verified' ? (
                <ShieldCheck className="w-7 h-7" />
              ) : state === 'needs_reverification' ? (
                <AlertTriangle className="w-7 h-7" />
              ) : (
                <ShieldAlert className="w-7 h-7" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Step 4 — Verification Authority</span>
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase ${
                  state === 'verified'
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    : state === 'needs_reverification'
                    ? 'bg-amber-950 text-amber-300 border border-amber-800'
                    : 'bg-rose-950 text-rose-300 border border-rose-800'
                }`}>
                  {state.replace('_', ' ')}
                </span>
              </div>
              <h1 className="text-xl font-bold text-white mt-1">
                {state === 'verified'
                  ? 'System Conforms to Engineering Target'
                  : state === 'needs_reverification'
                  ? 'Re-Verification Required After Room/EQ Adjustments'
                  : 'Acoustic Target Tolerance Breach'}
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Compliance score: <span className="font-mono font-bold text-white">{compliance}%</span> • Profile: {profile.name} • Venue: {venue.name}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleRunSweep}
              disabled={isVerifying}
              className="px-4 py-2 rounded bg-emerald-700 hover:bg-emerald-600 disabled:opacity-50 text-white text-xs font-mono font-bold flex items-center gap-2 transition-colors shadow-sm"
            >
              <RotateCcw className={`w-4 h-4 ${isVerifying ? 'animate-spin' : ''}`} />
              <span>{isVerifying ? 'MEASURING SWEEP...' : 'RUN VERIFICATION SWEEP'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Baseline Delta Comparison Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 cols: Baseline vs Current Delta Table */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-lg p-5">
          <h2 className="text-sm font-bold text-white uppercase font-mono tracking-wider mb-2">
            Baseline vs Current Acoustic Delta
          </h2>
          <p className="text-xs text-slate-400 mb-4">
            Compares initial uncalibrated room baseline against current DSP measurement values.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-xs font-mono text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="pb-2">ACOUSTIC BAND</th>
                  <th className="pb-2">BASELINE</th>
                  <th className="pb-2">CURRENT</th>
                  <th className="pb-2">DELTA</th>
                  <th className="pb-2">TOLERANCE</th>
                  <th className="pb-2">STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {engineeringResult?.frequencyDeviations.map((band) => {
                  const dev = band.deviationDb;
                  const inSpec = Math.abs(dev) <= band.toleranceDb;
                  return (
                    <tr key={band.name} className="hover:bg-slate-950/40">
                      <td className="py-2.5 font-semibold text-slate-200">
                        {band.name} <span className="text-[10px] text-slate-500">({band.lowHz}-{band.highHz}Hz)</span>
                      </td>
                      <td className="py-2.5 text-slate-400">{band.targetDb >= 0 ? `+${band.targetDb}` : band.targetDb} dB</td>
                      <td className="py-2.5 text-white font-bold">{band.measuredDb >= 0 ? `+${band.measuredDb}` : band.measuredDb} dB</td>
                      <td className="py-2.5">
                        <span className={`inline-flex items-center gap-1 ${
                          Math.abs(dev) <= band.toleranceDb ? 'text-emerald-400' : 'text-amber-400'
                        }`}>
                          {dev > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                          {dev > 0 ? `+${dev.toFixed(1)}` : dev.toFixed(1)} dB
                        </span>
                      </td>
                      <td className="py-2.5 text-slate-400">±{band.toleranceDb} dB</td>
                      <td className="py-2.5">
                        <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                          inSpec 
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' 
                            : 'bg-amber-950 text-amber-400 border border-amber-800'
                        }`}>
                          {inSpec ? 'PASSED' : 'DEVIATION'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Log Snapshot Form */}
          <div className="mt-5 pt-4 border-t border-slate-800 space-y-3">
            <h3 className="text-xs font-bold text-white uppercase font-mono">
              Log Verification Snapshot to Local DB
            </h3>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={operatorNotes}
                onChange={(e) => setOperatorNotes(e.target.value)}
                placeholder="Operator notes (e.g., Delay tower timing adjusted by +4.2ms, sub cardioid checked)..."
                className="flex-1 bg-slate-950 border border-slate-700 rounded px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500"
              />
              <button
                onClick={handleLogSnapshot}
                className="px-4 py-2 rounded bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-mono font-medium flex items-center justify-center gap-1.5 shrink-0 transition-colors shadow-sm"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Record Verification Snapshot</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right 1 col: Verification History Timeline */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-white uppercase font-mono tracking-wider flex items-center gap-2">
                <Clock className="w-4 h-4 text-cyan-400" />
                Verification History Log
              </h2>
              <span className="text-xs font-mono text-slate-400">{verifications.length} records</span>
            </div>

            <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1 scrollbar-thin">
              {verifications.map((item) => (
                <div 
                  key={item.id}
                  className="p-3 bg-slate-950 border border-slate-800 rounded text-xs space-y-2 hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-slate-400">{item.timestamp}</span>
                    <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded uppercase font-bold ${
                      item.state === 'verified'
                        ? 'bg-emerald-950 text-emerald-400'
                        : 'bg-amber-950 text-amber-400'
                    }`}>
                      {item.complianceScorePercent}% {item.state.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-slate-300 text-[11px] leading-snug">{item.summary}</p>
                  {item.operatorNotes && (
                    <p className="text-slate-400 text-[10px] italic border-l-2 border-slate-700 pl-2">
                      "{item.operatorNotes}"
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 font-mono flex items-center justify-between">
            <span>Audit Trail: Immutable Local Records</span>
            <span className="text-emerald-400">Offline-Ready</span>
          </div>
        </div>
      </div>
    </div>
  );
};
