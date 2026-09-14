import React, { useState } from 'react';
import { EngineeringProfile, Venue } from '../types';
import { Sliders, ShieldCheck, Target, Layers, Info, Check, Plus, AlertTriangle } from 'lucide-react';

interface EngineeringTargetsViewProps {
  profiles: EngineeringProfile[];
  activeProfile: EngineeringProfile;
  onSelectProfile: (p: EngineeringProfile) => void;
  onUpdateProfile: (p: EngineeringProfile) => void;
  venue: Venue;
}

export const EngineeringTargetsView: React.FC<EngineeringTargetsViewProps> = ({
  profiles,
  activeProfile,
  onSelectProfile,
  onUpdateProfile,
  venue
}) => {
  const [editingProfile, setEditingProfile] = useState<EngineeringProfile>(activeProfile);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    onUpdateProfile(editingProfile);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              <Target className="w-5 h-5 text-cyan-400" />
              Engineering Targets & Acoustic Profiles
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Deterministic boundary specifications. No arbitrary values: every tolerance is calibrated to auditory perception thresholds.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {savedSuccess && (
              <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Saved to Local DB
              </span>
            )}
            <button
              onClick={handleSave}
              className="px-4 py-2 rounded bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-mono font-medium transition-colors shadow-sm"
            >
              Save Profile Adjustments
            </button>
          </div>
        </div>

        {/* Profile Tabs */}
        <div className="mt-4 pt-4 border-t border-slate-800 flex flex-wrap gap-2">
          {profiles.map((p) => {
            const isSelected = p.id === activeProfile.id;
            return (
              <button
                key={p.id}
                onClick={() => {
                  onSelectProfile(p);
                  setEditingProfile(p);
                }}
                className={`px-3 py-1.5 rounded text-xs font-mono transition-colors border ${
                  isSelected
                    ? 'bg-cyan-950/80 border-cyan-500/60 text-cyan-300 font-bold'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {p.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Target Parameters & Tolerances Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Tolerance Sliders and Target SPL */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-lg p-5 space-y-6">
          <div>
            <h2 className="text-sm font-bold text-white uppercase font-mono tracking-wider flex items-center gap-2">
              <Sliders className="w-4 h-4 text-cyan-400" />
              Acoustic Limits & Decay Standards
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Standard nominal targets for {editingProfile.name}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Target SPL (RMS) */}
            <div className="bg-slate-950 border border-slate-800 p-3 rounded">
              <label className="text-xs font-mono text-slate-400 block mb-1">
                Target Continuous SPL (RMS):
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="65"
                  max="108"
                  step="1"
                  value={editingProfile.targetSplDba}
                  onChange={(e) => setEditingProfile({ ...editingProfile, targetSplDba: Number(e.target.value) })}
                  className="flex-1 accent-cyan-500 cursor-pointer"
                />
                <span className="text-sm font-mono font-bold text-cyan-300 w-16 text-right">
                  {editingProfile.targetSplDba} dBA
                </span>
              </div>
              <span className="text-[10px] text-slate-500 font-mono mt-1 block">A-Weighted nominal listening level</span>
            </div>

            {/* Target Peak SPL */}
            <div className="bg-slate-950 border border-slate-800 p-3 rounded">
              <label className="text-xs font-mono text-slate-400 block mb-1">
                Max Peak SPL Limit (Crest Factor):
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="75"
                  max="125"
                  step="1"
                  value={editingProfile.targetSplPeakDbc}
                  onChange={(e) => setEditingProfile({ ...editingProfile, targetSplPeakDbc: Number(e.target.value) })}
                  className="flex-1 accent-cyan-500 cursor-pointer"
                />
                <span className="text-sm font-mono font-bold text-cyan-300 w-16 text-right">
                  {editingProfile.targetSplPeakDbc} dBC
                </span>
              </div>
              <span className="text-[10px] text-slate-500 font-mono mt-1 block">C-Weighted transient safety ceiling</span>
            </div>

            {/* Max Leq 15-min */}
            <div className="bg-slate-950 border border-slate-800 p-3 rounded">
              <label className="text-xs font-mono text-slate-400 block mb-1">
                Max Legal Leq (15-Minute Window):
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="70"
                  max="105"
                  step="1"
                  value={editingProfile.maxLeq15MinDba}
                  onChange={(e) => setEditingProfile({ ...editingProfile, maxLeq15MinDba: Number(e.target.value) })}
                  className="flex-1 accent-cyan-500 cursor-pointer"
                />
                <span className="text-sm font-mono font-bold text-amber-300 w-16 text-right">
                  {editingProfile.maxLeq15MinDba} dBA
                </span>
              </div>
              <span className="text-[10px] text-slate-500 font-mono mt-1 block">Hearing conservation & municipal limit</span>
            </div>

            {/* Target RT60 */}
            <div className="bg-slate-950 border border-slate-800 p-3 rounded">
              <label className="text-xs font-mono text-slate-400 block mb-1">
                Target Room Decay (RT60):
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="0.4"
                  max="2.5"
                  step="0.05"
                  value={editingProfile.targetRt60Sec}
                  onChange={(e) => setEditingProfile({ ...editingProfile, targetRt60Sec: Number(e.target.value) })}
                  className="flex-1 accent-cyan-500 cursor-pointer"
                />
                <span className="text-sm font-mono font-bold text-emerald-300 w-16 text-right">
                  {editingProfile.targetRt60Sec.toFixed(2)}s
                </span>
              </div>
              <span className="text-[10px] text-slate-500 font-mono mt-1 block">Room Sabine reverberant decay time</span>
            </div>
          </div>

          {/* Tolerance Bands */}
          <div className="pt-4 border-t border-slate-800">
            <h3 className="text-xs font-bold text-white uppercase font-mono mb-3">
              Frequency Tolerance Bands (Acceptable Acoustic Variance)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 bg-slate-950 rounded border border-slate-800">
                <span className="text-xs font-mono text-slate-400">Sub-Bass (20-80Hz)</span>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-slate-300 font-mono">Tolerance:</span>
                  <span className="text-sm font-mono font-bold text-cyan-400">±{editingProfile.bassToleranceDb} dB</span>
                </div>
              </div>

              <div className="p-3 bg-slate-950 rounded border border-slate-800">
                <span className="text-xs font-mono text-slate-400">Midrange (250-2kHz)</span>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-slate-300 font-mono">Tolerance:</span>
                  <span className="text-sm font-mono font-bold text-cyan-400">±{editingProfile.midToleranceDb} dB</span>
                </div>
              </div>

              <div className="p-3 bg-slate-950 rounded border border-slate-800">
                <span className="text-xs font-mono text-slate-400">High Air (6k-20kHz)</span>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-slate-300 font-mono">Tolerance:</span>
                  <span className="text-sm font-mono font-bold text-cyan-400">±{editingProfile.highToleranceDb} dB</span>
                </div>
              </div>
            </div>
          </div>

          {/* Target Frequency Curve Preview */}
          <div className="pt-4 border-t border-slate-800">
            <h3 className="text-xs font-bold text-white uppercase font-mono mb-2">
              Target Frequency Curve (Relative dB Offsets)
            </h3>
            <div className="flex flex-wrap gap-2">
              {editingProfile.targetCurve.map((point) => (
                <div key={point.hz} className="bg-slate-950 border border-slate-800 rounded px-2.5 py-1 text-center font-mono">
                  <span className="text-[10px] text-slate-400 block">{point.hz >= 1000 ? `${point.hz / 1000}k` : point.hz}Hz</span>
                  <span className={`text-xs font-bold ${point.dbOffset > 0 ? 'text-amber-400' : point.dbOffset < 0 ? 'text-cyan-400' : 'text-slate-300'}`}>
                    {point.dbOffset > 0 ? `+${point.dbOffset}` : point.dbOffset} dB
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 1 Col: System-Wide Impact Matrix */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-bold text-white uppercase font-mono tracking-wider flex items-center gap-2 mb-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              System-Wide Impact Matrix
            </h2>
            <p className="text-xs text-slate-400 mb-4">
              Acoustic coupling laws: an adjustment in one band or zone affects adjacent zones.
            </p>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-950 rounded border border-slate-800">
                <span className="font-mono text-cyan-400 font-bold block mb-1">
                  1. Boundary Coupling (Subwoofers)
                </span>
                <p className="text-slate-300 leading-relaxed">
                  Placing subwoofers within 1.5m of back or side walls adds +3dB to +6dB boundary loading, but excites quarter-wavelength cancellation notches in the center seating plane.
                </p>
              </div>

              <div className="p-3 bg-slate-950 rounded border border-slate-800">
                <span className="font-mono text-cyan-400 font-bold block mb-1">
                  2. Delay Ring Time Alignment
                </span>
                <p className="text-slate-300 leading-relaxed">
                  Delay speakers in {venue.zones[3]?.name || 'Zone Back'} require exact millisecond timing (1ms per 0.343m + 5ms Haas precedence). Too late causes distinct acoustic echoes; too early collapses front stage imaging.
                </p>
              </div>

              <div className="p-3 bg-slate-950 rounded border border-slate-800">
                <span className="font-mono text-cyan-400 font-bold block mb-1">
                  3. Stage Wedge Bleed into FOH
                </span>
                <p className="text-slate-300 leading-relaxed">
                  Loud stage monitors fire rear energy directly into the front row audience, causing comb-filtering in the 500Hz-2kHz vocal range. Cardioid stage placement preserves clarity.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-500 font-mono">
            SoundPilot Rule 40: Engineering values must have physical meaning, documentation, and validation before application.
          </div>
        </div>
      </div>
    </div>
  );
};
