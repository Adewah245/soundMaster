import React from 'react';
import { AcousticMeasurement, EngineeringProfile, EngineeringResult, UserMode, Venue, VerificationState } from '../types';
import { 
  Activity, 
  ShieldCheck, 
  ShieldAlert, 
  AlertTriangle, 
  TrendingUp, 
  Volume2, 
  Clock, 
  Layers, 
  ArrowRight,
  Sparkles,
  Play,
  RotateCcw
} from 'lucide-react';

interface DashboardViewProps {
  venue: Venue;
  profile: EngineeringProfile;
  latestMeasurement: AcousticMeasurement | null;
  engineeringResult: EngineeringResult | null;
  userMode: UserMode;
  onNavigate: (tab: string) => void;
  onTriggerVerification: () => void;
  isCapturing: boolean;
  onToggleCapture: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  venue,
  profile,
  latestMeasurement,
  engineeringResult,
  userMode,
  onNavigate,
  onTriggerVerification,
  isCapturing,
  onToggleCapture
}) => {
  const compliance = engineeringResult?.complianceRate ?? 91;
  const currentSpl = latestMeasurement?.splRmsDba ?? profile.targetSplDba;
  const splDelta = Math.round((currentSpl - profile.targetSplDba) * 10) / 10;
  const isPro = userMode === 'pro';

  return (
    <div className="space-y-6">
      {/* SoundPilot Core Workflow Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 sm:p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-semibold">SoundPilot Methodology</span>
              <span className="text-xs text-slate-500">•</span>
              <span className="text-xs text-slate-400 font-mono">Offline-First Acoustic Engine</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Measure. Understand. Adjust. Verify.
            </h1>
            <p className="text-sm text-slate-400 mt-0.5">
              {isPro 
                ? `Calibrated target profile: ${profile.name} (Nominal ${profile.targetSplDba} dBA ±${profile.midToleranceDb} dB). System-wide verification active across ${venue.zones.length} venue zones.` 
                : `Currently tuning ${venue.name} for ${profile.name}. Keep your sound balanced and free of distortion.`}
            </p>
          </div>

          {/* 4 Architectural Step Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs font-mono">
            <div className="px-3 py-2 rounded bg-slate-950 border border-cyan-500/30 text-cyan-300">
              <div className="text-[10px] text-slate-500">STEP 1</div>
              <div className="font-bold">1. MEASURE</div>
            </div>
            <div className="px-3 py-2 rounded bg-slate-950 border border-slate-800 text-slate-300">
              <div className="text-[10px] text-slate-500">STEP 2</div>
              <div className="font-bold">2. UNDERSTAND</div>
            </div>
            <div className="px-3 py-2 rounded bg-slate-950 border border-slate-800 text-slate-300">
              <div className="text-[10px] text-slate-500">STEP 3</div>
              <div className="font-bold">3. ADJUST</div>
            </div>
            <div className="px-3 py-2 rounded bg-slate-950 border border-emerald-500/40 text-emerald-300">
              <div className="text-[10px] text-slate-500">STEP 4</div>
              <div className="font-bold">4. VERIFY</div>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Metric Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Compliance Score */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>TARGET COMPLIANCE</span>
            <Activity className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className={`text-3xl font-mono font-bold ${
              compliance >= 90 ? 'text-emerald-400' : compliance >= 75 ? 'text-amber-400' : 'text-rose-400'
            }`}>
              {compliance}%
            </span>
            <span className="text-xs text-slate-400">
              {compliance >= 90 ? 'Nominal' : compliance >= 75 ? 'Acceptable' : 'Tolerance Breach'}
            </span>
          </div>
          <div className="mt-3 w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${
                compliance >= 90 ? 'bg-emerald-500' : compliance >= 75 ? 'bg-amber-500' : 'bg-rose-500'
              }`}
              style={{ width: `${compliance}%` }}
            />
          </div>
        </div>

        {/* Live SPL dBA */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>MEASURED SPL (RMS)</span>
            <Volume2 className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-mono font-bold text-white">
              {currentSpl.toFixed(1)}
            </span>
            <span className="text-xs font-mono text-slate-400">dBA</span>
            <span className={`text-xs font-mono ml-auto ${
              Math.abs(splDelta) <= 2 ? 'text-emerald-400' : 'text-amber-400'
            }`}>
              {splDelta >= 0 ? `+${splDelta}` : splDelta} dB vs target
            </span>
          </div>
          <div className="mt-2 flex justify-between text-[11px] text-slate-400 font-mono">
            <span>Target: {profile.targetSplDba} dBA</span>
            <span>Peak: {latestMeasurement?.splPeakDbc ?? profile.targetSplPeakDbc} dBC</span>
          </div>
        </div>

        {/* Reverberation RT60 */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>REVERBERATION (RT60)</span>
            <Clock className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-mono font-bold text-white">
              {(latestMeasurement?.rt60Seconds ?? profile.targetRt60Sec).toFixed(2)}
            </span>
            <span className="text-xs font-mono text-slate-400">sec</span>
          </div>
          <div className="mt-2 flex justify-between text-[11px] text-slate-400 font-mono">
            <span>Target: {profile.targetRt60Sec}s</span>
            <span className="text-emerald-400">Well Damped</span>
          </div>
        </div>

        {/* Speech Clarity STI */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>SPEECH CLARITY (STI)</span>
            <TrendingUp className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-mono font-bold text-emerald-400">
              {(latestMeasurement?.speechTransmissionIndexSti ?? profile.targetSti).toFixed(2)}
            </span>
            <span className="text-xs text-slate-400">
              {latestMeasurement && latestMeasurement.speechTransmissionIndexSti >= 0.75 ? 'Excellent' : 'Good'}
            </span>
          </div>
          <div className="mt-2 flex justify-between text-[11px] text-slate-400 font-mono">
            <span>C50 Clarity: {latestMeasurement?.speechClarityC50Db ?? '+4.2'} dB</span>
            <span>Req: &gt;{profile.targetSti}</span>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Zones & Engineering Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Venue Zones Status */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-lg p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-400" />
                Venue Acoustic Zones
              </h2>
              <p className="text-xs text-slate-400">
                Front-to-back SPL distribution and decay across {venue.name}
              </p>
            </div>
            <button
              onClick={() => onNavigate('venue')}
              className="text-xs font-medium text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
            >
              Interactive Map <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {venue.zones.map((zone) => {
              const delta = Math.round((zone.currentSplDba - zone.targetSplDba) * 10) / 10;
              return (
                <div 
                  key={zone.id}
                  className="bg-slate-950 border border-slate-800/80 rounded p-3.5 flex flex-col justify-between hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span 
                          className="w-2.5 h-2.5 rounded-full" 
                          style={{ backgroundColor: zone.color }} 
                        />
                        <span className="font-semibold text-sm text-slate-100">{zone.name}</span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-1">{zone.description}</p>
                    </div>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase font-semibold ${
                      zone.status === 'optimal' 
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' 
                        : 'bg-amber-950 text-amber-400 border border-amber-800'
                    }`}>
                      {zone.status}
                    </span>
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-mono">
                    <div>
                      <span className="text-slate-400">Measured: </span>
                      <span className="text-white font-bold">{zone.currentSplDba} dBA</span>
                    </div>
                    <div>
                      <span className="text-slate-400">Target: </span>
                      <span className="text-slate-300">{zone.targetSplDba} dBA</span>
                    </div>
                    <div className={Math.abs(delta) <= 1.5 ? 'text-emerald-400' : 'text-amber-400'}>
                      {delta >= 0 ? `+${delta}` : delta} dB
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Action Footer */}
          <div className="mt-5 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <div className="text-xs text-slate-400">
              Active Measurement Points: <span className="text-white font-semibold font-mono">{venue.measurementPoints.length}</span> across venue
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={onTriggerVerification}
                className="px-3 py-1.5 rounded bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-mono font-medium flex items-center gap-1.5 transition-colors shadow-sm"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                Run Verification Sweep
              </button>
              <button
                onClick={() => onNavigate('measurements')}
                className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono font-medium flex items-center gap-1.5 transition-colors"
              >
                <Volume2 className="w-3.5 h-3.5" />
                Live Spectrum
              </button>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Engineering Engine Alerts & System Impact */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                Engineering Decision Engine
              </h2>
              <span className="text-[10px] font-mono uppercase bg-slate-800 px-1.5 py-0.5 rounded text-cyan-400">
                Rule Layer
              </span>
            </div>
            <p className="text-xs text-slate-400 mb-3">
              Evaluates DSP data against {profile.name} physical bounds.
            </p>

            {/* Alert List */}
            <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1 scrollbar-thin">
              {engineeringResult && engineeringResult.alerts.length > 0 ? (
                engineeringResult.alerts.map((alert, idx) => (
                  <div 
                    key={idx}
                    className="p-2.5 rounded bg-slate-950 border border-slate-800 text-xs text-slate-300 flex items-start gap-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                    <div>
                      <p className="text-slate-200 leading-snug">{alert}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 rounded bg-slate-950 border border-emerald-900/40 text-xs text-emerald-400 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>All frequency bands and SPL targets conform to nominal engineering tolerances.</span>
                </div>
              )}
            </div>
          </div>

          {/* Quick AI Consultant Link */}
          <div className="mt-4 pt-3 border-t border-slate-800">
            <button
              onClick={() => onNavigate('ai_assistant')}
              className="w-full py-2 px-3 rounded bg-slate-800 hover:bg-slate-750 text-cyan-300 text-xs font-medium flex items-center justify-center gap-2 transition-colors border border-slate-700"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Consult SoundPilot AI for Actionable Advice</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
