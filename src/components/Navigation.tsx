import React from 'react';
import { UserMode, Venue, EngineeringProfile, VerificationState } from '../types';
import { 
  Activity, 
  MapPin, 
  Sliders, 
  CheckCircle2, 
  AlertTriangle, 
  Layers, 
  Radio, 
  Volume2, 
  Sparkles, 
  FolderTree, 
  Mic2,
  Cpu,
  ShieldCheck,
  ShieldAlert
} from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userMode: UserMode;
  setUserMode: (mode: UserMode) => void;
  venues: Venue[];
  activeVenue: Venue;
  onSelectVenue: (venue: Venue) => void;
  profiles: EngineeringProfile[];
  activeProfile: EngineeringProfile;
  onSelectProfile: (profile: EngineeringProfile) => void;
  verificationState: VerificationState;
  isCapturing: boolean;
  onToggleCapture: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  setActiveTab,
  userMode,
  setUserMode,
  venues,
  activeVenue,
  onSelectVenue,
  profiles,
  activeProfile,
  onSelectProfile,
  verificationState,
  isCapturing,
  onToggleCapture
}) => {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Activity },
    { id: 'venue', label: 'Venue & Zones', icon: MapPin },
    { id: 'measurements', label: 'Audio & DSP', icon: Volume2 },
    { id: 'engineering', label: 'Engineering Targets', icon: Sliders },
    { id: 'verification', label: 'Verification', icon: CheckCircle2 },
    { id: 'live_listener', label: 'Live Listener', icon: Radio },
    { id: 'equipment', label: 'Signal Chain', icon: Layers },
    { id: 'stage_monitors', label: 'Stage Monitors', icon: Mic2 },
    { id: 'ai_assistant', label: 'AI Assistant', icon: Sparkles },
    { id: 'architecture', label: 'Structure & ADRs', icon: FolderTree }
  ];

  const getVerificationBadge = () => {
    switch (verificationState) {
      case 'verified':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono font-medium bg-emerald-950/80 border border-emerald-500/40 text-emerald-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>VERIFIED</span>
          </span>
        );
      case 'needs_reverification':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono font-medium bg-amber-950/80 border border-amber-500/40 text-amber-400">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            <span>RE-VERIFY NEEDED</span>
          </span>
        );
      case 'failed_target':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono font-medium bg-rose-950/80 border border-rose-500/40 text-rose-400">
            <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
            <span>TARGET BREACH</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono font-medium bg-slate-900 border border-slate-700 text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
            <span>UNVERIFIED</span>
          </span>
        );
    }
  };

  return (
    <header className="border-b border-slate-800 bg-slate-950/95 sticky top-0 z-50 backdrop-blur">
      {/* Top Utility Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 text-sm">
        {/* Brand & Motto */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-cyan-600 flex items-center justify-center font-mono font-bold text-white shadow-sm">
              SP
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold tracking-tight text-base text-white">SoundPilot</span>
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-slate-800 text-cyan-400 border border-slate-700">
                  v1.2 DSP
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium tracking-wide">
                Measure. Understand. Adjust. Verify.
              </p>
            </div>
          </div>
        </div>

        {/* Global Context Selectors */}
        <div className="flex items-center flex-wrap gap-2.5">
          {/* Venue Selector */}
          <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded px-2.5 py-1">
            <MapPin className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-xs text-slate-400 font-mono">Venue:</span>
            <select
              value={activeVenue.id}
              onChange={(e) => {
                const found = venues.find(v => v.id === e.target.value);
                if (found) onSelectVenue(found);
              }}
              className="bg-transparent text-xs text-slate-200 font-medium focus:outline-none cursor-pointer"
            >
              {venues.map(v => (
                <option key={v.id} value={v.id} className="bg-slate-900 text-slate-100">
                  {v.name}
                </option>
              ))}
            </select>
          </div>

          {/* Profile Selector */}
          <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded px-2.5 py-1">
            <Sliders className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-xs text-slate-400 font-mono">Profile:</span>
            <select
              value={activeProfile.id}
              onChange={(e) => {
                const found = profiles.find(p => p.id === e.target.value);
                if (found) onSelectProfile(found);
              }}
              className="bg-transparent text-xs text-slate-200 font-medium focus:outline-none cursor-pointer max-w-[140px] sm:max-w-none truncate"
            >
              {profiles.map(p => (
                <option key={p.id} value={p.id} className="bg-slate-900 text-slate-100">
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* Verification Badge */}
          {getVerificationBadge()}

          {/* Live Audio DSP Capture Button */}
          <button
            id="dsp-toggle-btn"
            onClick={onToggleCapture}
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded text-xs font-mono font-medium transition-colors ${
              isCapturing 
                ? 'bg-red-500/20 text-red-300 border border-red-500/50 animate-pulse' 
                : 'bg-cyan-600 text-white hover:bg-cyan-500 shadow-sm'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${isCapturing ? 'bg-red-400' : 'bg-white'}`} />
            {isCapturing ? 'DSP CAPTURE ACTIVE' : 'START DSP ENGINE'}
          </button>

          {/* Mode Switcher: Simple vs Pro */}
          <div className="flex items-center rounded border border-slate-800 bg-slate-900 p-0.5">
            <button
              onClick={() => setUserMode('simple')}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                userMode === 'simple'
                  ? 'bg-cyan-600 text-white font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Simple
            </button>
            <button
              onClick={() => setUserMode('pro')}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                userMode === 'pro'
                  ? 'bg-cyan-600 text-white font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Pro Engineer
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 overflow-x-auto scrollbar-none">
        <nav className="flex items-center space-x-1 py-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`nav-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3 py-2 text-xs font-medium rounded whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-slate-800 text-cyan-400 border-b-2 border-cyan-500 font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
