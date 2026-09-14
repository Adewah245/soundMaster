import React, { useState } from 'react';
import { Venue, Zone, MeasurementPoint, SpeakerPlacement } from '../types';
import { 
  MapPin, 
  Volume2, 
  Layers, 
  Plus, 
  Eye, 
  EyeOff, 
  Compass, 
  CheckCircle2, 
  AlertCircle,
  Sliders
} from 'lucide-react';

interface VenueMapViewProps {
  venue: Venue;
  onUpdateVenue: (updated: Venue) => void;
  onMeasurePoint: (point: MeasurementPoint) => void;
}

export const VenueMapView: React.FC<VenueMapViewProps> = ({
  venue,
  onUpdateVenue,
  onMeasurePoint
}) => {
  const [selectedPoint, setSelectedPoint] = useState<MeasurementPoint | null>(null);
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null);
  const [showSpeakerCones, setShowSpeakerCones] = useState(true);
  const [isAddingPoint, setIsAddingPoint] = useState(false);

  const handleSvgClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!isAddingPoint) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);

    const newPoint: MeasurementPoint = {
      id: 'pt_' + Date.now(),
      name: `MP-${venue.measurementPoints.length + 1} Custom`,
      zoneId: venue.zones[1]?.id || venue.zones[0].id,
      x,
      y,
      heightMeters: 1.7,
      isVerified: false
    };

    const updatedVenue = {
      ...venue,
      measurementPoints: [...venue.measurementPoints, newPoint]
    };
    onUpdateVenue(updatedVenue);
    setIsAddingPoint(false);
    setSelectedPoint(newPoint);
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              <Compass className="w-5 h-5 text-cyan-400" />
              {venue.name} — Acoustic Topology
            </h1>
            <span className="text-xs font-mono uppercase bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
              {venue.type.replace('_', ' ')}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            Dimensions: {venue.dimensions.widthMeters}m (W) × {venue.dimensions.lengthMeters}m (L) × {venue.dimensions.heightMeters}m (H) • Capacity: {venue.dimensions.capacity} seats
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowSpeakerCones(!showSpeakerCones)}
            className={`px-3 py-1.5 rounded text-xs font-mono font-medium flex items-center gap-1.5 border transition-colors ${
              showSpeakerCones
                ? 'bg-cyan-950/60 border-cyan-500/50 text-cyan-300'
                : 'bg-slate-800 border-slate-700 text-slate-400'
            }`}
          >
            {showSpeakerCones ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            <span>Coverage Dispersion Cones</span>
          </button>

          <button
            onClick={() => setIsAddingPoint(!isAddingPoint)}
            className={`px-3 py-1.5 rounded text-xs font-mono font-medium flex items-center gap-1.5 transition-colors ${
              isAddingPoint 
                ? 'bg-amber-600 text-white animate-pulse' 
                : 'bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{isAddingPoint ? 'Click Map to Drop Point' : 'Add Measurement Point'}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: SVG Map and Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left 3 cols: 2D Venue Top-Down Map */}
        <div className="lg:col-span-3 bg-slate-900 border border-slate-800 rounded-lg p-4 flex flex-col items-center">
          <div className="w-full flex items-center justify-between text-xs font-mono text-slate-400 mb-2 px-1">
            <span>STAGE END (FRONT)</span>
            <span>TOP-DOWN ACOUSTIC PLANE (2D)</span>
            <span>BACK OF HALL</span>
          </div>

          <div className="w-full aspect-[16/10] bg-slate-950 border border-slate-800 rounded relative overflow-hidden select-none">
            <svg
              className="w-full h-full cursor-crosshair"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              onClick={handleSvgClick}
            >
              <defs>
                {/* Acoustic Grid Pattern */}
                <pattern id="venueGrid" width="5" height="5" patternUnits="userSpaceOnUse">
                  <path d="M 5 0 L 0 0 0 5" fill="none" stroke="#1e293b" strokeWidth="0.2" />
                </pattern>
                {/* Coverage gradient */}
                <linearGradient id="speakerConeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.02" />
                </linearGradient>
                <linearGradient id="subConeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.03" />
                </linearGradient>
              </defs>

              <rect width="100" height="100" fill="url(#venueGrid)" />

              {/* Stage Physical Structure */}
              <rect
                x="15"
                y="5"
                width="70"
                height="15"
                rx="1"
                fill="#1e293b"
                stroke="#334155"
                strokeWidth="0.6"
              />
              <text x="50" y="14" fill="#94a3b8" fontSize="2.8" fontWeight="bold" textAnchor="middle" letterSpacing="0.2">
                PERFORMANCE STAGE
              </text>

              {/* Venue Zones Floor Areas */}
              {/* Front Pit Zone */}
              <rect
                x="10"
                y="22"
                width="80"
                height="20"
                fill="#06b6d4"
                fillOpacity="0.06"
                stroke="#06b6d4"
                strokeWidth="0.3"
                strokeDasharray="1,1"
              />
              <text x="14" y="26" fill="#06b6d4" fontSize="2" fontWeight="600">ZONE: FRONT PIT</text>

              {/* Mid Hall / FOH Zone */}
              <rect
                x="10"
                y="44"
                width="80"
                height="26"
                fill="#10b981"
                fillOpacity="0.05"
                stroke="#10b981"
                strokeWidth="0.3"
                strokeDasharray="1,1"
              />
              <text x="14" y="48" fill="#10b981" fontSize="2" fontWeight="600">ZONE: MAIN ORCHESTRA & FOH</text>

              {/* Rear / Under-Balcony Zone */}
              <rect
                x="10"
                y="72"
                width="80"
                height="24"
                fill="#6366f1"
                fillOpacity="0.05"
                stroke="#6366f1"
                strokeWidth="0.3"
                strokeDasharray="1,1"
              />
              <text x="14" y="76" fill="#6366f1" fontSize="2" fontWeight="600">ZONE: REAR / UNDER-BALCONY</text>

              {/* FOH Mixing Desk marker */}
              <rect x="46" y="54" width="8" height="4" rx="0.5" fill="#334155" stroke="#64748b" strokeWidth="0.4" />
              <text x="50" y="56.8" fill="#cbd5e1" fontSize="1.6" textAnchor="middle" fontWeight="bold">FOH MIX</text>

              {/* Speaker Coverage Cones (if enabled) */}
              {showSpeakerCones && venue.speakers.map((spk) => {
                const isSub = spk.type === 'subwoofer';
                const gradId = isSub ? 'url(#subConeGrad)' : 'url(#speakerConeGrad)';
                const strokeColor = isSub ? '#f59e0b' : '#06b6d4';
                
                // Approximate 2D projection triangle for coverage
                const angleRad = (spk.angleDeg * Math.PI) / 180;
                const halfCovRad = ((spk.coverageAngleDeg / 2) * Math.PI) / 180;
                const dist = spk.throwDistanceMeters * 1.6; // scale to view

                const leftX = spk.x + Math.sin(angleRad - halfCovRad) * dist;
                const leftY = spk.y + Math.cos(angleRad - halfCovRad) * dist;
                const rightX = spk.x + Math.sin(angleRad + halfCovRad) * dist;
                const rightY = spk.y + Math.cos(angleRad + halfCovRad) * dist;

                return (
                  <g key={spk.id} opacity={spk.isMuted ? 0.2 : 0.85}>
                    <polygon
                      points={`${spk.x},${spk.y} ${leftX},${leftY} ${rightX},${rightY}`}
                      fill={gradId}
                      stroke={strokeColor}
                      strokeWidth="0.2"
                      strokeDasharray="0.6,0.6"
                    />
                    {/* Speaker Box */}
                    <circle cx={spk.x} cy={spk.y} r="1.4" fill={strokeColor} stroke="#ffffff" strokeWidth="0.3" />
                    <text x={spk.x} y={spk.y - 2.2} fill="#e2e8f0" fontSize="1.8" fontWeight="bold" textAnchor="middle">
                      {spk.name.split(' ')[0]}
                    </text>
                  </g>
                );
              })}

              {/* Measurement Points */}
              {venue.measurementPoints.map((pt) => {
                const isSelected = selectedPoint?.id === pt.id;
                return (
                  <g
                    key={pt.id}
                    className="cursor-pointer transition-transform hover:scale-110"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedPoint(pt);
                      const z = venue.zones.find(zn => zn.id === pt.zoneId);
                      if (z) setSelectedZone(z);
                    }}
                  >
                    {/* Pulsing ring for selected point */}
                    {isSelected && (
                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        r="3.2"
                        fill="none"
                        stroke="#06b6d4"
                        strokeWidth="0.5"
                        strokeDasharray="1,1"
                      />
                    )}
                    {/* Point Pin */}
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r="1.8"
                      fill={pt.isVerified ? '#10b981' : '#f59e0b'}
                      stroke="#0f172a"
                      strokeWidth="0.4"
                    />
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r="0.7"
                      fill="#ffffff"
                    />
                    <text
                      x={pt.x}
                      y={pt.y + 3.4}
                      fill="#e2e8f0"
                      fontSize="1.7"
                      fontWeight="bold"
                      textAnchor="middle"
                      className="select-none"
                    >
                      {pt.name.split(' ')[0]}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Map Legend */}
          <div className="w-full mt-3 pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between text-xs font-mono text-slate-400 gap-3">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                Verified Point
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                Needs Measurement
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-500" />
                Speaker Array
              </span>
            </div>
            <span className="text-slate-400">
              Total Points: <strong className="text-white">{venue.measurementPoints.length}</strong>
            </span>
          </div>
        </div>

        {/* Right 1 col: Selected Point / Zone Inspection Panel */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-white flex items-center gap-2 font-mono">
                <MapPin className="w-4 h-4 text-cyan-400" />
                Acoustic Inspector
              </h2>
              {selectedPoint?.isVerified ? (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                  VERIFIED
                </span>
              ) : (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950 text-amber-400 border border-amber-800">
                  PENDING
                </span>
              )}
            </div>

            {selectedPoint ? (
              <div className="space-y-3">
                <div className="p-3 bg-slate-950 rounded border border-slate-800">
                  <span className="text-[10px] font-mono text-slate-400 uppercase">Selected Measurement Point</span>
                  <h3 className="text-base font-bold text-white">{selectedPoint.name}</h3>
                  <div className="mt-2 grid grid-cols-2 gap-2 text-xs font-mono text-slate-300">
                    <div>X: {selectedPoint.x}% of Width</div>
                    <div>Y: {selectedPoint.y}% of Length</div>
                    <div>Ear Height: {selectedPoint.heightMeters}m</div>
                    <div>Zone: {venue.zones.find(z => z.id === selectedPoint.zoneId)?.name || 'Default'}</div>
                  </div>
                </div>

                {/* Point Actions */}
                <button
                  onClick={() => onMeasurePoint(selectedPoint)}
                  className="w-full py-2 px-3 rounded bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-mono font-medium flex items-center justify-center gap-2 transition-colors shadow-sm"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  Capture Audio at this Point
                </button>

                {/* Associated Zone Details */}
                {selectedZone && (
                  <div className="p-3 bg-slate-950 rounded border border-slate-800 space-y-2">
                    <span className="text-[10px] font-mono text-slate-400 uppercase">Zone Acoustic Target</span>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-200">{selectedZone.name}</span>
                      <span className="text-xs font-mono text-cyan-400 font-bold">{selectedZone.currentSplDba} dBA</span>
                    </div>
                    <div className="text-[11px] text-slate-400 space-y-1 font-mono">
                      <div className="flex justify-between">
                        <span>Target SPL:</span>
                        <span className="text-slate-200">{selectedZone.targetSplDba} dBA</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Target RT60:</span>
                        <span className="text-slate-200">{selectedZone.rt60TargetSec}s</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Current RT60:</span>
                        <span className="text-slate-200">{selectedZone.currentRt60Sec}s</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-6 text-center text-slate-400 text-xs border border-dashed border-slate-800 rounded">
                Click any measurement point on the map to inspect acoustic data or drop new measurement pins.
              </div>
            )}
          </div>

          {/* Speakers in this venue */}
          <div className="mt-4 pt-3 border-t border-slate-800">
            <span className="text-[10px] font-mono text-slate-400 uppercase block mb-2">
              Loudspeaker Transducers ({venue.speakers.length})
            </span>
            <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1 scrollbar-thin text-xs font-mono">
              {venue.speakers.map(spk => (
                <div key={spk.id} className="flex items-center justify-between p-1.5 bg-slate-950 rounded border border-slate-800">
                  <span className="text-slate-300 truncate max-w-[120px]">{spk.name}</span>
                  <span className="text-slate-400 text-[10px]">{spk.delayMs}ms / {spk.gainDb >= 0 ? `+${spk.gainDb}` : spk.gainDb}dB</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
