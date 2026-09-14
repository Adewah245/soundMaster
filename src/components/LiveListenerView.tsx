import React, { useState } from 'react';
import { AcousticMeasurement, EngineeringProfile, LiveAlert, Venue } from '../types';
import { 
  Radio, 
  Flame, 
  AlertTriangle, 
  ShieldCheck, 
  Volume2, 
  Check, 
  Bell, 
  Clock, 
  Sliders,
  TrendingUp,
  Activity
} from 'lucide-react';

interface LiveListenerViewProps {
  venue: Venue;
  profile: EngineeringProfile;
  latestMeasurement: AcousticMeasurement | null;
  alerts: LiveAlert[];
  onAcknowledgeAlert: (id: string) => void;
  onClearAlerts: () => void;
  onInjectFeedback: (freq: number | null) => void;
}

export const LiveListenerView: React.FC<LiveListenerViewProps> = ({
  venue,
  profile,
  latestMeasurement,
  alerts,
  onAcknowledgeAlert,
  onClearAlerts,
  onInjectFeedback
}) => {
  const currentSpl = latestMeasurement?.splRmsDba ?? 96.5;
  const leq15 = Math.round((currentSpl - 1.2) * 10) / 10;
  const maxLeq = profile.maxLeq15MinDba;
  const leqMargin = Math.round((maxLeq - leq15) * 10) / 10;
  const feedbackHz = latestMeasurement?.feedbackFrequencyHz;

  return (
    <div className="space-y-6">
      {/* Top Monitor Status */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-950/80 border border-red-500/50 flex items-center justify-center text-red-400">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-semibold">Live Listener Daemon</span>
                <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  ACTIVE MONITORING
                </span>
              </div>
              <h1 className="text-xl font-bold text-white mt-0.5">
                Continuous Show & Rehearsal Sentinel
              </h1>
              <p className="text-xs text-slate-400">
                Passive acoustic guard tracking sound pressure compliance, resonant feedback spikes, and room absorption shifts.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClearAlerts}
              className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono transition-colors"
            >
              Clear Acknowledged
            </button>
          </div>
        </div>
      </div>

      {/* Real-Time Sentry KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Leq 15-Minute SPL Meter */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>RUNNING LEQ (15-MIN)</span>
            <Clock className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className={`text-3xl font-mono font-bold ${
              leqMargin <= 1.0 ? 'text-rose-400' : leqMargin <= 3.0 ? 'text-amber-400' : 'text-emerald-400'
            }`}>
              {leq15.toFixed(1)}
            </span>
            <span className="text-xs font-mono text-slate-400">dBA</span>
            <span className="text-xs font-mono text-slate-400 ml-auto">Limit: {maxLeq} dBA</span>
          </div>

          {/* Meter Bar */}
          <div className="mt-3 w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-300 ${
                leq15 >= maxLeq ? 'bg-rose-500' : leq15 >= maxLeq - 2 ? 'bg-amber-500' : 'bg-emerald-500'
              }`}
              style={{ width: `${Math.min(100, (leq15 / 110) * 100)}%` }}
            />
          </div>
          <div className="mt-2 text-[11px] font-mono flex justify-between text-slate-400">
            <span>Safety Margin: {leqMargin >= 0 ? `+${leqMargin} dB` : `${leqMargin} dB BREACH`}</span>
            <span>{leqMargin > 0 ? 'Compliant' : 'Violation'}</span>
          </div>
        </div>

        {/* Feedback Sentry */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>FEEDBACK DETECTOR</span>
            <Flame className={`w-4 h-4 ${feedbackHz ? 'text-rose-500 animate-bounce' : 'text-slate-500'}`} />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className={`text-3xl font-mono font-bold ${feedbackHz ? 'text-rose-400' : 'text-emerald-400'}`}>
              {feedbackHz ? `${feedbackHz} Hz` : 'CLEAR'}
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-400 font-mono">
            {feedbackHz 
              ? `Spike detected! Recommend -4.5dB narrow notch (Q=6.0) at ${feedbackHz}Hz.` 
              : 'No acoustic ringing or feedback frequency detected.'}
          </p>
        </div>

        {/* Ambient Noise / Room Absorption */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>AMBIENT NOISE FLOOR</span>
            <Activity className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-mono font-bold text-white">
              {latestMeasurement?.noiseFloorDba ?? 38.4}
            </span>
            <span className="text-xs font-mono text-slate-400">dBA</span>
          </div>
          <p className="mt-2 text-xs text-slate-400 font-mono">
            Empty hall baseline: 36.2 dBA. Audience presence adds ~14-22 dBA ambient background.
          </p>
        </div>
      </div>

      {/* Live Alert Log */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-cyan-400" />
            <h2 className="text-sm font-bold text-white uppercase font-mono tracking-wider">
              Real-Time Alert Event Stream
            </h2>
          </div>
          <span className="text-xs font-mono text-slate-400">{alerts.length} events logged</span>
        </div>

        <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1 scrollbar-thin">
          {alerts.length > 0 ? (
            alerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-3 rounded border text-xs font-mono flex items-center justify-between gap-3 transition-colors ${
                  alert.acknowledged
                    ? 'bg-slate-950/40 border-slate-800 opacity-60'
                    : alert.level === 'danger'
                    ? 'bg-rose-950/40 border-rose-800 text-rose-200'
                    : 'bg-amber-950/40 border-amber-800 text-amber-200'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <span className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                    alert.level === 'danger' ? 'bg-rose-400' : 'bg-amber-400'
                  }`} />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">{alert.title}</span>
                      <span className="text-[10px] text-slate-500">{alert.timestamp}</span>
                    </div>
                    <p className="text-slate-300 mt-0.5 text-[11px]">{alert.message}</p>
                  </div>
                </div>

                {!alert.acknowledged && (
                  <button
                    onClick={() => onAcknowledgeAlert(alert.id)}
                    className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-mono shrink-0 transition-colors"
                  >
                    Acknowledge
                  </button>
                )}
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-slate-500 font-mono text-xs border border-dashed border-slate-800 rounded">
              No active alerts. Live audio is within nominal tolerances.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
