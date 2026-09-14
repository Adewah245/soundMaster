import React, { useState } from 'react';
import { AcousticMeasurement, EngineeringProfile, MeasurementPoint, MeasurementSource, Venue } from '../types';
import { ISO_FREQUENCIES_31 } from '../services/dspEngine';
import { 
  Volume2, 
  Mic, 
  Radio, 
  Activity, 
  AlertCircle, 
  CheckCircle2, 
  AlertTriangle, 
  Sliders, 
  Save,
  Play,
  Square,
  Flame
} from 'lucide-react';

interface MeasurementsViewProps {
  venue: Venue;
  profile: EngineeringProfile;
  activeSource: MeasurementSource;
  onChangeSource: (src: MeasurementSource) => void;
  isCapturing: boolean;
  onToggleCapture: () => void;
  latestMeasurement: AcousticMeasurement | null;
  onInjectFeedback: (freq: number | null) => void;
  onSaveMeasurementToPoint: (pointId: string, measurement: AcousticMeasurement) => void;
}

export const MeasurementsView: React.FC<MeasurementsViewProps> = ({
  venue,
  profile,
  activeSource,
  onChangeSource,
  isCapturing,
  onToggleCapture,
  latestMeasurement,
  onInjectFeedback,
  onSaveMeasurementToPoint
}) => {
  const [selectedPointId, setSelectedPointId] = useState<string>(venue.measurementPoints[0]?.id || '');
  const [activeFeedbackHz, setActiveFeedbackHz] = useState<number | null>(null);

  const handleToggleFeedback = (hz: number) => {
    if (activeFeedbackHz === hz) {
      setActiveFeedbackHz(null);
      onInjectFeedback(null);
    } else {
      setActiveFeedbackHz(hz);
      onInjectFeedback(hz);
    }
  };

  const bars = latestMeasurement?.spectrumBars || ISO_FREQUENCIES_31.map(() => -10);

  return (
    <div className="space-y-6">
      {/* DSP Capture Toolbar */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleCapture}
            className={`px-4 py-2 rounded text-xs font-mono font-bold flex items-center gap-2 transition-colors shadow-sm ${
              isCapturing
                ? 'bg-red-600 hover:bg-red-500 text-white animate-pulse'
                : 'bg-cyan-600 hover:bg-cyan-500 text-white'
            }`}
          >
            {isCapturing ? <Square className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            <span>{isCapturing ? 'STOP CAPTURE' : 'RUN DSP AUDIO CAPTURE'}</span>
          </button>

          <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 rounded p-1">
            <span className="text-[11px] font-mono text-slate-400 px-2">Source:</span>
            {(['pink_noise', 'microphone', 'sine_sweep', 'simulated_live'] as MeasurementSource[]).map((src) => {
              const labels: Record<MeasurementSource, string> = {
                pink_noise: 'Pink Noise Gen',
                microphone: 'Live Mic Input',
                sine_sweep: 'Sine Sweep (20-20k)',
                simulated_live: 'Live Concert Track'
              };
              const isSelected = activeSource === src;
              return (
                <button
                  key={src}
                  onClick={() => onChangeSource(src)}
                  className={`px-2.5 py-1 rounded text-xs font-mono transition-colors ${
                    isSelected
                      ? 'bg-slate-800 text-cyan-300 font-semibold border border-cyan-500/40'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {labels[src]}
                </button>
              );
            })}
          </div>
        </div>

        {/* Feedback Injection Test Controls */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 text-amber-500" />
            Test Feedback:
          </span>
          {[2500, 4000, 6300].map((hz) => (
            <button
              key={hz}
              onClick={() => handleToggleFeedback(hz)}
              className={`px-2 py-1 rounded text-[11px] font-mono transition-colors border ${
                activeFeedbackHz === hz
                  ? 'bg-amber-600 text-white border-amber-400 font-bold animate-pulse'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              {hz >= 1000 ? `${hz / 1000}k` : hz}Hz
            </button>
          ))}
          {activeFeedbackHz && (
            <button
              onClick={() => { setActiveFeedbackHz(null); onInjectFeedback(null); }}
              className="text-[11px] text-red-400 underline font-mono ml-1"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* RTA 31-Band Spectrum Analyzer */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-5">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              Real-Time Spectrum Analyzer (1/3rd Octave RTA)
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Target Profile Curve: <span className="text-cyan-400 font-mono font-semibold">{profile.name}</span> (Overlay line shows nominal reference ±{profile.midToleranceDb} dB)
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-cyan-500" />
              <span className="text-slate-300">Measured RTA</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-4 h-0.5 bg-amber-400 border-b border-amber-400" />
              <span className="text-slate-300">Target Curve</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-red-500/80" />
              <span className="text-slate-300">Feedback Spike</span>
            </div>
          </div>
        </div>

        {/* Bar Visualizer Canvas/SVG Container */}
        <div className="w-full h-64 bg-slate-950 border border-slate-800 rounded relative p-3 flex flex-col justify-between">
          {/* Decibel Grid Lines */}
          <div className="absolute inset-x-3 inset-y-3 pointer-events-none flex flex-col justify-between opacity-30 text-[9px] font-mono text-slate-400">
            <div className="border-b border-slate-700 w-full flex justify-between"><span>+12 dB</span><span>+12 dB</span></div>
            <div className="border-b border-slate-700 w-full flex justify-between"><span>+6 dB</span><span>+6 dB</span></div>
            <div className="border-b border-cyan-500/60 w-full flex justify-between text-cyan-400 font-bold"><span>0 dB (REF)</span><span>0 dB</span></div>
            <div className="border-b border-slate-700 w-full flex justify-between"><span>-6 dB</span><span>-6 dB</span></div>
            <div className="border-b border-slate-700 w-full flex justify-between"><span>-18 dB</span><span>-18 dB</span></div>
            <div className="w-full flex justify-between"><span>-30 dB</span><span>-30 dB</span></div>
          </div>

          {/* RTA Frequency Bars */}
          <div className="relative z-10 w-full h-full flex items-end justify-between gap-[2px] pt-4 pb-6">
            {bars.map((db, idx) => {
              const freq = ISO_FREQUENCIES_31[idx];
              // Target curve offset lookup
              const targetPoint = profile.targetCurve.find(p => Math.abs(p.hz - freq) < freq * 0.3) || { dbOffset: 0 };
              const targetDb = targetPoint.dbOffset;
              const deviation = db - targetDb;
              const isFeedback = activeFeedbackHz && Math.abs(freq - activeFeedbackHz) < freq * 0.25;
              const isOutOfTolerance = Math.abs(deviation) > profile.midToleranceDb;

              // Scale dB (-30 to +15) to percentage (0 to 100%)
              const heightPct = Math.max(5, Math.min(100, ((db + 30) / 45) * 100));
              const targetHeightPct = Math.max(5, Math.min(100, ((targetDb + 30) / 45) * 100));

              return (
                <div key={freq} className="flex-1 h-full flex flex-col justify-end items-center relative group">
                  {/* Tooltip on hover */}
                  <div className="absolute -top-10 hidden group-hover:flex flex-col items-center bg-slate-900 border border-slate-700 rounded px-2 py-1 text-[10px] font-mono z-30 shadow-lg pointer-events-none whitespace-nowrap">
                    <span className="text-white font-bold">{freq >= 1000 ? `${freq / 1000}k` : freq} Hz</span>
                    <span className="text-cyan-300">{db.toFixed(1)} dB (Tgt: {targetDb} dB)</span>
                    <span className={deviation > 0 ? 'text-amber-400' : 'text-emerald-400'}>
                      Dev: {deviation > 0 ? `+${deviation.toFixed(1)}` : deviation.toFixed(1)} dB
                    </span>
                  </div>

                  {/* Target Tick Marker */}
                  <div 
                    className="absolute w-full h-[2px] bg-amber-400/90 z-20 pointer-events-none shadow-sm"
                    style={{ bottom: `${targetHeightPct}%` }}
                  />

                  {/* Spectrum Bar */}
                  <div
                    className={`w-full rounded-t-sm transition-all duration-75 ${
                      isFeedback
                        ? 'bg-rose-500 animate-bounce'
                        : isOutOfTolerance
                        ? 'bg-amber-500/80'
                        : 'bg-cyan-500'
                    }`}
                    style={{ height: `${heightPct}%` }}
                  />
                </div>
              );
            })}
          </div>

          {/* Frequency Axis Labels */}
          <div className="absolute inset-x-3 bottom-1 flex justify-between text-[9px] font-mono text-slate-500">
            <span>25Hz</span>
            <span>63Hz</span>
            <span>125Hz</span>
            <span>250Hz</span>
            <span>500Hz</span>
            <span>1kHz</span>
            <span>2kHz</span>
            <span>4kHz</span>
            <span>8kHz</span>
            <span>16kHz</span>
            <span>20kHz</span>
          </div>
        </div>
      </div>

      {/* Acoustic Meters Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* RMS SPL */}
        <div className="bg-slate-900 border border-slate-800 rounded p-3 text-center">
          <span className="text-[10px] font-mono text-slate-400 uppercase">RMS SPL (dBA)</span>
          <div className="mt-1 text-2xl font-mono font-bold text-white">
            {latestMeasurement?.splRmsDba.toFixed(1) ?? '98.2'}
          </div>
          <span className="text-[10px] font-mono text-cyan-400">Target: {profile.targetSplDba} dB</span>
        </div>

        {/* Peak SPL */}
        <div className="bg-slate-900 border border-slate-800 rounded p-3 text-center">
          <span className="text-[10px] font-mono text-slate-400 uppercase">Peak SPL (dBC)</span>
          <div className="mt-1 text-2xl font-mono font-bold text-white">
            {latestMeasurement?.splPeakDbc.toFixed(1) ?? '109.4'}
          </div>
          <span className="text-[10px] font-mono text-slate-400">Limit: {profile.targetSplPeakDbc} dB</span>
        </div>

        {/* Loudness LUFS */}
        <div className="bg-slate-900 border border-slate-800 rounded p-3 text-center">
          <span className="text-[10px] font-mono text-slate-400 uppercase">Loudness (LUFS)</span>
          <div className="mt-1 text-2xl font-mono font-bold text-cyan-400">
            {latestMeasurement?.loudnessLufs ?? '-14.1'}
          </div>
          <span className="text-[10px] font-mono text-slate-400">Integrated</span>
        </div>

        {/* RT60 */}
        <div className="bg-slate-900 border border-slate-800 rounded p-3 text-center">
          <span className="text-[10px] font-mono text-slate-400 uppercase">Decay (RT60)</span>
          <div className="mt-1 text-2xl font-mono font-bold text-white">
            {latestMeasurement?.rt60Seconds.toFixed(2) ?? '1.18'}s
          </div>
          <span className="text-[10px] font-mono text-emerald-400">Target: {profile.targetRt60Sec}s</span>
        </div>

        {/* Speech STI */}
        <div className="bg-slate-900 border border-slate-800 rounded p-3 text-center">
          <span className="text-[10px] font-mono text-slate-400 uppercase">Speech STI</span>
          <div className="mt-1 text-2xl font-mono font-bold text-emerald-400">
            {latestMeasurement?.speechTransmissionIndexSti.toFixed(2) ?? '0.74'}
          </div>
          <span className="text-[10px] font-mono text-slate-400">C50: {latestMeasurement?.speechClarityC50Db ?? '+4.2'}dB</span>
        </div>

        {/* THD / Clipping */}
        <div className="bg-slate-900 border border-slate-800 rounded p-3 text-center">
          <span className="text-[10px] font-mono text-slate-400 uppercase">Distortion / THD</span>
          <div className={`mt-1 text-2xl font-mono font-bold ${
            latestMeasurement?.isClipping ? 'text-rose-400' : 'text-slate-200'
          }`}>
            {latestMeasurement?.isClipping ? 'CLIPPING' : `${latestMeasurement?.thdPercent ?? 0.045}%`}
          </div>
          <span className="text-[10px] font-mono text-slate-400">Noise: {latestMeasurement?.noiseFloorDba ?? 38} dBA</span>
        </div>
      </div>

      {/* Save Measurement to Point Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-slate-300">Assign Current Capture to:</span>
          <select
            value={selectedPointId}
            onChange={(e) => setSelectedPointId(e.target.value)}
            className="bg-slate-950 border border-slate-700 text-xs font-mono text-slate-200 rounded px-2.5 py-1.5 focus:outline-none"
          >
            {venue.measurementPoints.map((pt) => (
              <option key={pt.id} value={pt.id}>
                {pt.name} ({venue.zones.find(z => z.id === pt.zoneId)?.name})
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={() => {
            if (latestMeasurement && selectedPointId) {
              onSaveMeasurementToPoint(selectedPointId, latestMeasurement);
            }
          }}
          disabled={!latestMeasurement}
          className="px-4 py-1.5 rounded bg-emerald-700 hover:bg-emerald-600 disabled:opacity-50 text-white text-xs font-mono font-medium flex items-center gap-1.5 transition-colors shadow-sm"
        >
          <Save className="w-3.5 h-3.5" />
          <span>Commit & Record Point Measurement</span>
        </button>
      </div>
    </div>
  );
};
