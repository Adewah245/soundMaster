import React, { useState } from 'react';
import { Venue } from '../types';
import { Mic2, Volume2, Flame, ShieldCheck, Sliders, ArrowRight } from 'lucide-react';

interface StageMonitorsViewProps {
  venue: Venue;
}

export const StageMonitorsView: React.FC<StageMonitorsViewProps> = ({ venue }) => {
  const [leadWedgeGain, setLeadWedgeGain] = useState(0);
  const [drumRiserGain, setDrumRiserGain] = useState(+2.0);
  const [activeNotch, setActiveNotch] = useState(2500);

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              <Mic2 className="w-5 h-5 text-cyan-400" />
              Stage Monitors & Foldback Verification
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Gain-Before-Feedback (GBF) optimization, wedge dispersion null alignment, and stage bleed attenuation.
            </p>
          </div>
          <span className="text-xs font-mono px-2.5 py-1 rounded bg-slate-800 text-cyan-300 border border-slate-700">
            Stage Area: {venue.zones.find(z => z.category === 'stage')?.name || 'Stage Zone'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Lead Vocal Wedge Control */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-white uppercase font-mono">
                Aux 01: Lead Vocal Wedge (L-Acoustics X15)
              </h2>
              <p className="text-xs text-slate-400">Positioned at 180° cardioid microphone rejection null.</p>
            </div>
            <span className="text-xs font-mono font-bold text-cyan-400">{leadWedgeGain >= 0 ? `+${leadWedgeGain}` : leadWedgeGain} dB</span>
          </div>

          <div className="bg-slate-950 p-4 rounded border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs font-mono text-slate-300">
              <span>Wedge Output Level</span>
              <input
                type="range"
                min="-12"
                max="6"
                step="0.5"
                value={leadWedgeGain}
                onChange={(e) => setLeadWedgeGain(Number(e.target.value))}
                className="w-48 accent-cyan-500 cursor-pointer"
              />
            </div>

            <div className="pt-2 border-t border-slate-800 flex justify-between text-xs font-mono text-slate-400">
              <span>Gain-Before-Feedback Margin:</span>
              <span className="text-emerald-400 font-bold">+7.5 dB (Safe)</span>
            </div>
          </div>

          {/* Notch Filters */}
          <div>
            <span className="text-xs font-mono text-slate-300 block mb-2 font-semibold">
              Feedback Ring-Out Notch Filters (PEQ)
            </span>
            <div className="grid grid-cols-3 gap-2 text-xs font-mono">
              {[2500, 4000, 6300].map((hz) => (
                <div
                  key={hz}
                  onClick={() => setActiveNotch(hz)}
                  className={`p-2 rounded border cursor-pointer text-center transition-colors ${
                    activeNotch === hz
                      ? 'bg-cyan-950 border-cyan-500 text-cyan-300 font-bold'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  <div>{hz} Hz</div>
                  <div className="text-[10px] text-slate-500">-4.5 dB (Q=6.0)</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Drum Sub / Riser Foldback */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-white uppercase font-mono">
                Aux 02: Drum Riser Sub + Top
              </h2>
              <p className="text-xs text-slate-400">Low-end tactile monitoring with high-pass rumble filter.</p>
            </div>
            <span className="text-xs font-mono font-bold text-cyan-400">+{drumRiserGain} dB</span>
          </div>

          <div className="bg-slate-950 p-4 rounded border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs font-mono text-slate-300">
              <span>Riser Output Level</span>
              <input
                type="range"
                min="-12"
                max="6"
                step="0.5"
                value={drumRiserGain}
                onChange={(e) => setDrumRiserGain(Number(e.target.value))}
                className="w-48 accent-cyan-500 cursor-pointer"
              />
            </div>

            <div className="pt-2 border-t border-slate-800 flex justify-between text-xs font-mono text-slate-400">
              <span>Stage Bleed into FOH:</span>
              <span className="text-amber-400 font-bold">-18 dB attenuation (Acceptable)</span>
            </div>
          </div>

          <div className="p-3 bg-slate-950 rounded border border-slate-800 text-xs text-slate-300 space-y-1">
            <span className="text-cyan-400 font-mono font-bold">Polar Null Alignment Tip:</span>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Cardioid vocal microphones have maximum rejection at 180° directly behind the capsule. Ensure wedges fire into this null rather than from the 90° sides to prevent vocal feedback.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
