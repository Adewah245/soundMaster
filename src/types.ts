export type UserMode = 'simple' | 'pro';

export type AppView = 
  | 'dashboard'
  | 'venue'
  | 'measurements'
  | 'targets'
  | 'verification'
  | 'live_listener'
  | 'equipment'
  | 'monitors'
  | 'ai_assistant'
  | 'architecture';

export type MeasurementSource = 'microphone' | 'pink_noise' | 'sine_sweep' | 'simulated_live';

export type VerificationState = 'verified' | 'needs_reverification' | 'failed_target' | 'unverified';

export interface FrequencyBand {
  name: string;
  lowHz: number;
  highHz: number;
  measuredDb: number;
  targetDb: number;
  toleranceDb: number;
  deviationDb: number;
  status: 'nominal' | 'warning' | 'critical';
}

export interface AcousticMeasurement {
  id: string;
  timestamp: string;
  pointId: string;
  pointName: string;
  zoneId: string;
  splRmsDba: number;
  splPeakDbc: number;
  loudnessLufs: number;
  noiseFloorDba: number;
  thdPercent: number;
  isClipping: boolean;
  feedbackFrequencyHz: number | null;
  rt60Seconds: number;
  speechClarityC50Db: number;
  speechTransmissionIndexSti: number;
  spectrumBars: number[]; // 31-band 1/3rd octave or FFT bins
  frequencyBands: FrequencyBand[];
}

export interface MeasurementPoint {
  id: string;
  name: string;
  zoneId: string;
  x: number; // 0-100% of venue width
  y: number; // 0-100% of venue depth
  heightMeters: number;
  isVerified: boolean;
  lastMeasurement?: AcousticMeasurement;
}

export interface Zone {
  id: string;
  name: string;
  description: string;
  category: 'front' | 'middle' | 'back' | 'balcony' | 'vip' | 'stage';
  color: string;
  targetSplDba: number;
  currentSplDba: number;
  rt60TargetSec: number;
  currentRt60Sec: number;
  status: 'optimal' | 'warning' | 'critical';
  measurementPointIds: string[];
}

export interface SpeakerPlacement {
  id: string;
  name: string;
  type: 'main_left' | 'main_right' | 'subwoofer' | 'front_fill' | 'delay_tower' | 'stage_wedge';
  x: number;
  y: number;
  angleDeg: number;
  coverageAngleDeg: number;
  throwDistanceMeters: number;
  delayMs: number;
  gainDb: number;
  isMuted: boolean;
}

export interface Venue {
  id: string;
  name: string;
  type: 'concert_hall' | 'club' | 'amphitheater' | 'house_of_worship' | 'auditorium';
  dimensions: {
    widthMeters: number;
    lengthMeters: number;
    heightMeters: number;
    capacity: number;
  };
  zones: Zone[];
  measurementPoints: MeasurementPoint[];
  speakers: SpeakerPlacement[];
}

export interface EngineeringProfile {
  id: string;
  name: string;
  description: string;
  targetSplDba: number;
  targetSplPeakDbc: number;
  maxLeq15MinDba: number;
  targetRt60Sec: number;
  targetSti: number;
  bassToleranceDb: number;
  midToleranceDb: number;
  highToleranceDb: number;
  targetCurve: { hz: number; dbOffset: number }[]; // 20Hz - 20kHz target relative EQ curve
}

export interface EquipmentItem {
  id: string;
  name: string;
  category: 'speaker' | 'subwoofer' | 'monitor' | 'mixer' | 'amplifier' | 'crossover' | 'equalizer' | 'microphone' | 'audio_interface';
  model: string;
  manufacturer: string;
  connectionType: 'xlr' | 'speakon' | 'usb' | 'dante_ethernet' | 'wifi' | 'analog';
  status: 'online' | 'standby' | 'alert' | 'offline';
  location: string;
  gainDb: number;
  temperatureC?: number;
  impedanceOhms?: number;
}

export interface SignalChainNode {
  id: string;
  equipmentId: string;
  name: string;
  stage: 'source' | 'interface' | 'mixer' | 'dsp' | 'amplifier' | 'transducer';
  order: number;
  inputLevelDb: number;
  outputLevelDb: number;
  isMuted: boolean;
}

export interface VerificationSnapshot {
  id: string;
  timestamp: string;
  baselineId: string;
  profileId: string;
  venueId: string;
  state: VerificationState;
  complianceScorePercent: number;
  deviationsCount: number;
  summary: string;
  frequencyDeltas: { hz: number; baselineDb: number; currentDb: number; deltaDb: number }[];
  operatorNotes: string;
}

export interface EngineeringResult {
  state: VerificationState;
  complianceRate: number;
  averageSplDba: number;
  peakSplDbc: number;
  splUniformityDeltaDb: number;
  frequencyDeviations: FrequencyBand[];
  feedbackRisk: { detected: boolean; frequencyHz: number | null; confidencePercent: number };
  clippingDetected: boolean;
  systemImpactNotes: string[];
  alerts: string[];
  recommendedAdjustments: {
    component: string;
    action: string;
    parameter: string;
    value: string;
    impact: string;
    urgency: 'high' | 'medium' | 'low';
  }[];
}

export interface LiveAlert {
  id: string;
  timestamp: string;
  level: 'info' | 'warning' | 'danger';
  title: string;
  message: string;
  frequencyHz?: number;
  zoneId?: string;
  acknowledged: boolean;
}

export interface ConnectionDevice {
  id: string;
  name: string;
  protocol: 'USB Audio' | 'Dante / AES67' | 'Wi-Fi Control' | 'Bluetooth LE' | 'OSC / MIDI';
  address: string;
  latencyMs: number;
  status: 'connected' | 'connecting' | 'disconnected';
  sampleRateKhz: number;
  bufferSize: number;
}

export interface ArchitectureRecord {
  id: string;
  title: string;
  status: 'Accepted' | 'Proposed';
  context: string;
  decision: string;
  consequences: string;
}
