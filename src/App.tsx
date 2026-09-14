import React, { useState, useEffect, useMemo } from 'react';
import { 
  AppView, 
  UserMode, 
  Venue, 
  EngineeringProfile, 
  AcousticMeasurement, 
  MeasurementSource, 
  LiveAlert, 
  VerificationSnapshot,
  MeasurementPoint,
  EquipmentItem,
  SignalChainNode,
  ConnectionDevice
} from './types';
import { storageService } from './services/storage';
import { dspEngine } from './services/dspEngine';
import { engineeringEngine } from './services/engineeringEngine';

import { Navigation } from './components/Navigation';
import { DashboardView } from './components/DashboardView';
import { VenueMapView } from './components/VenueMapView';
import { MeasurementsView } from './components/MeasurementsView';
import { EngineeringTargetsView } from './components/EngineeringTargetsView';
import { VerificationView } from './components/VerificationView';
import { LiveListenerView } from './components/LiveListenerView';
import { EquipmentView } from './components/EquipmentView';
import { StageMonitorsView } from './components/StageMonitorsView';
import { AiAssistantView } from './components/AiAssistantView';
import { ArchitectureExplorerView } from './components/ArchitectureExplorerView';

export default function App() {
  const [currentView, setCurrentView] = useState<AppView>('dashboard');
  const [userMode, setUserMode] = useState<UserMode>('pro');

  // Persistence State
  const [venue, setVenue] = useState<Venue>(() => storageService.getActiveVenue());
  const [profiles, setProfiles] = useState<EngineeringProfile[]>(() => storageService.getProfiles());
  const [activeProfile, setActiveProfile] = useState<EngineeringProfile>(() => storageService.getActiveProfile());
  const [equipment, setEquipment] = useState<EquipmentItem[]>(() => storageService.getEquipment());
  const [signalChain, setSignalChain] = useState<SignalChainNode[]>(() => storageService.getSignalChain());
  const [connections] = useState<ConnectionDevice[]>(() => storageService.getConnections());
  const [verifications, setVerifications] = useState<VerificationSnapshot[]>(() => storageService.getVerifications());

  // DSP Measurement State
  const [isCapturing, setIsCapturing] = useState(false);
  const [activeSource, setActiveSource] = useState<MeasurementSource>('pink_noise');
  const [latestMeasurement, setLatestMeasurement] = useState<AcousticMeasurement | null>(() => storageService.getLatestMeasurement());

  // Live Alerts
  const [alerts, setAlerts] = useState<LiveAlert[]>([
    {
      id: 'alt_init_1',
      level: 'warning',
      timestamp: 'Just now',
      title: 'Boundary Build-Up Detected',
      message: 'Zone 3 (Rear Balcony) has +4.2dB low-end buildup at 125Hz.',
      acknowledged: false
    }
  ]);

  // Subscribe to real-time DSP audio engine ticks
  useEffect(() => {
    const unsubscribe = dspEngine.subscribe((meas) => {
      setLatestMeasurement(meas);
      storageService.saveMeasurement(meas);

      // Check feedback spike
      if (meas.feedbackFrequencyHz) {
        setAlerts((prev) => {
          if (prev.some(a => a.title.includes(String(meas.feedbackFrequencyHz)))) return prev;
          return [
            {
              id: 'alt_fb_' + Date.now(),
              level: 'danger',
              timestamp: new Date().toLocaleTimeString(),
              title: `Acoustic Feedback at ${meas.feedbackFrequencyHz} Hz`,
              message: `High resonant peak detected! Recommended: apply narrow notch filter.`,
              acknowledged: false
            },
            ...prev.slice(0, 15)
          ];
        });
      }
    });

    return () => unsubscribe();
  }, []);

  // Compute Engineering Evaluation result whenever measurement, profile, or venue updates
  const engineeringResult = useMemo(() => {
    if (!latestMeasurement) return null;
    return engineeringEngine.evaluate(latestMeasurement, activeProfile, venue);
  }, [latestMeasurement, activeProfile, venue]);

  // Capture toggle
  const handleToggleCapture = () => {
    if (isCapturing) {
      dspEngine.stop();
      setIsCapturing(false);
    } else {
      dspEngine.start(activeSource);
      setIsCapturing(true);
    }
  };

  const handleChangeSource = (src: MeasurementSource) => {
    setActiveSource(src);
    if (isCapturing) {
      dspEngine.setSource(src);
    }
  };

  const handleInjectFeedback = (freq: number | null) => {
    dspEngine.injectFeedback(freq);
  };

  // Point measurement commit
  const handleSaveMeasurementToPoint = (pointId: string, meas: AcousticMeasurement) => {
    const updatedPoints = venue.measurementPoints.map(pt => {
      if (pt.id === pointId) {
        return {
          ...pt,
          lastMeasurementDba: meas.splRmsDba,
          isVerified: true
        };
      }
      return pt;
    });

    const updatedVenue = {
      ...venue,
      measurementPoints: updatedPoints
    };

    setVenue(updatedVenue);
    storageService.saveVenue(updatedVenue);

    // Also record a verification snapshot
    const snap: VerificationSnapshot = {
      id: 'snap_' + Date.now(),
      timestamp: new Date().toLocaleTimeString(),
      baselineId: 'baseline_active',
      profileId: activeProfile.id,
      venueId: venue.id,
      state: 'verified',
      complianceScorePercent: engineeringResult?.complianceRate ?? 90,
      deviationsCount: engineeringResult?.alerts.length ?? 0,
      summary: `Measurement committed at point: ${pointId} (${meas.splRmsDba} dBA).`,
      frequencyDeltas: [
        { hz: 125, baselineDb: -1.0, currentDb: meas.splRmsDba - 95, deltaDb: 1.2 }
      ],
      operatorNotes: 'Field measurement point acoustic calibration verified.'
    };
    setVerifications(prev => [snap, ...prev]);
    storageService.saveVerification(snap);
  };

  // Re-verification sweep trigger
  const handleTriggerVerificationSweep = () => {
    dspEngine.setSource('sine_sweep');
    if (!isCapturing) {
      dspEngine.start('sine_sweep');
      setIsCapturing(true);
    }
  };

  // Mute toggle on signal node
  const handleToggleMuteNode = (nodeId: string) => {
    const updated = signalChain.map(n => {
      if (n.id === nodeId) {
        return { ...n, isMuted: !n.isMuted };
      }
      return n;
    });
    setSignalChain(updated);
    storageService.saveSignalChain(updated);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Header & Navigation Bar */}
      <Navigation
        currentView={currentView}
        onSelectView={setCurrentView}
        userMode={userMode}
        onToggleUserMode={() => setUserMode(userMode === 'pro' ? 'simple' : 'pro')}
        activeProfileName={activeProfile.name}
        isCapturing={isCapturing}
        onToggleCapture={handleToggleCapture}
      />

      {/* Main Container Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {currentView === 'dashboard' && (
          <DashboardView
            venue={venue}
            profile={activeProfile}
            engineeringResult={engineeringResult}
            latestMeasurement={latestMeasurement}
            userMode={userMode}
            onNavigate={setCurrentView}
          />
        )}

        {currentView === 'venue' && (
          <VenueMapView
            venue={venue}
            onUpdateVenue={(updated) => {
              setVenue(updated);
              storageService.saveVenue(updated);
            }}
            onMeasurePoint={(pt) => {
              setCurrentView('measurements');
            }}
          />
        )}

        {currentView === 'measurements' && (
          <MeasurementsView
            venue={venue}
            profile={activeProfile}
            activeSource={activeSource}
            onChangeSource={handleChangeSource}
            isCapturing={isCapturing}
            onToggleCapture={handleToggleCapture}
            latestMeasurement={latestMeasurement}
            onInjectFeedback={handleInjectFeedback}
            onSaveMeasurementToPoint={handleSaveMeasurementToPoint}
          />
        )}

        {currentView === 'targets' && (
          <EngineeringTargetsView
            profiles={profiles}
            activeProfile={activeProfile}
            onSelectProfile={(p) => {
              setActiveProfile(p);
              storageService.setActiveProfile(p);
            }}
            onUpdateProfile={(p) => {
              const updated = profiles.map(pr => pr.id === p.id ? p : pr);
              setProfiles(updated);
              setActiveProfile(p);
              storageService.saveProfiles(updated);
              storageService.setActiveProfile(p);
            }}
            venue={venue}
          />
        )}

        {currentView === 'verification' && (
          <VerificationView
            venue={venue}
            profile={activeProfile}
            latestMeasurement={latestMeasurement}
            engineeringResult={engineeringResult}
            verifications={verifications}
            onAddVerification={(snap) => {
              setVerifications([snap, ...verifications]);
              storageService.saveVerification(snap);
            }}
            onTriggerVerificationSweep={handleTriggerVerificationSweep}
          />
        )}

        {currentView === 'live_listener' && (
          <LiveListenerView
            venue={venue}
            profile={activeProfile}
            latestMeasurement={latestMeasurement}
            alerts={alerts}
            onAcknowledgeAlert={(id) => {
              setAlerts(alerts.map(a => a.id === id ? { ...a, acknowledged: true } : a));
            }}
            onClearAlerts={() => {
              setAlerts(alerts.filter(a => !a.acknowledged));
            }}
            onInjectFeedback={handleInjectFeedback}
          />
        )}

        {currentView === 'equipment' && (
          <EquipmentView
            equipment={equipment}
            signalChain={signalChain}
            connections={connections}
            onToggleMuteNode={handleToggleMuteNode}
          />
        )}

        {currentView === 'monitors' && (
          <StageMonitorsView venue={venue} />
        )}

        {currentView === 'ai_assistant' && (
          <AiAssistantView
            venue={venue}
            profile={activeProfile}
            latestMeasurement={latestMeasurement}
            engineeringResult={engineeringResult}
            userMode={userMode}
          />
        )}

        {currentView === 'architecture' && (
          <ArchitectureExplorerView />
        )}
      </main>

      {/* Footer Status Bar */}
      <footer className="bg-slate-900 border-t border-slate-800/80 px-6 py-3 text-xs font-mono text-slate-400 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-4">
          <span className="text-slate-300 font-semibold">SoundPilot v1.0.0</span>
          <span>•</span>
          <span>Measure. Understand. Adjust. Verify.</span>
        </div>
        <div className="flex items-center gap-4 text-[11px]">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            DSP Engine Online
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            Engineering Engine Active
          </span>
          <span className="text-slate-500">Offline-First LocalDB</span>
        </div>
      </footer>
    </div>
  );
}
