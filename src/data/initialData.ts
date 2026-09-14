import { Venue, EngineeringProfile, EquipmentItem, SignalChainNode, ArchitectureRecord, VerificationSnapshot } from '../types';

export const INITIAL_PROFILES: EngineeringProfile[] = [
  {
    id: 'live_concert',
    name: 'Live Concert (Rock / Pop)',
    description: 'High dynamic range with authoritative low-end impact and crystal vocal intelligibility in high SPL environments.',
    targetSplDba: 98,
    targetSplPeakDbc: 110,
    maxLeq15MinDba: 101,
    targetRt60Sec: 1.2,
    targetSti: 0.68,
    bassToleranceDb: 2.5,
    midToleranceDb: 2.0,
    highToleranceDb: 2.5,
    targetCurve: [
      { hz: 31, dbOffset: 4.5 },
      { hz: 63, dbOffset: 5.0 },
      { hz: 125, dbOffset: 3.5 },
      { hz: 250, dbOffset: 1.0 },
      { hz: 500, dbOffset: 0.0 },
      { hz: 1000, dbOffset: 0.0 },
      { hz: 2000, dbOffset: -0.5 },
      { hz: 4000, dbOffset: -1.5 },
      { hz: 8000, dbOffset: -3.0 },
      { hz: 16000, dbOffset: -5.0 }
    ]
  },
  {
    id: 'speech_corporate',
    name: 'Speech & Corporate Forum',
    description: 'Prioritizes maximum STI clarity, feedback immunity, uniform dispersion, and strictly controlled reverberant spill.',
    targetSplDba: 72,
    targetSplPeakDbc: 84,
    maxLeq15MinDba: 78,
    targetRt60Sec: 0.65,
    targetSti: 0.82,
    bassToleranceDb: 2.0,
    midToleranceDb: 1.5,
    highToleranceDb: 2.0,
    targetCurve: [
      { hz: 31, dbOffset: -6.0 },
      { hz: 63, dbOffset: -3.0 },
      { hz: 125, dbOffset: 0.0 },
      { hz: 250, dbOffset: 0.5 },
      { hz: 500, dbOffset: 1.0 },
      { hz: 1000, dbOffset: 1.5 },
      { hz: 2000, dbOffset: 2.0 },
      { hz: 4000, dbOffset: 1.5 },
      { hz: 8000, dbOffset: 0.0 },
      { hz: 16000, dbOffset: -4.0 }
    ]
  },
  {
    id: 'house_of_worship',
    name: 'House of Worship',
    description: 'Balanced vocal intelligibility during sermon with rich dynamic music reinforcement without ear fatigue.',
    targetSplDba: 85,
    targetSplPeakDbc: 96,
    maxLeq15MinDba: 88,
    targetRt60Sec: 1.4,
    targetSti: 0.74,
    bassToleranceDb: 2.5,
    midToleranceDb: 2.0,
    highToleranceDb: 2.0,
    targetCurve: [
      { hz: 31, dbOffset: 2.0 },
      { hz: 63, dbOffset: 3.0 },
      { hz: 125, dbOffset: 2.0 },
      { hz: 250, dbOffset: 0.5 },
      { hz: 500, dbOffset: 0.0 },
      { hz: 1000, dbOffset: 0.5 },
      { hz: 2000, dbOffset: 0.0 },
      { hz: 4000, dbOffset: -1.0 },
      { hz: 8000, dbOffset: -2.5 },
      { hz: 16000, dbOffset: -4.5 }
    ]
  },
  {
    id: 'electronic_club',
    name: 'Electronic / Club Night',
    description: 'Deep, tight sub-bass reinforcement with strict boundary coupling management and HF air control.',
    targetSplDba: 101,
    targetSplPeakDbc: 114,
    maxLeq15MinDba: 103,
    targetRt60Sec: 0.95,
    targetSti: 0.62,
    bassToleranceDb: 3.0,
    midToleranceDb: 2.5,
    highToleranceDb: 2.5,
    targetCurve: [
      { hz: 31, dbOffset: 6.0 },
      { hz: 63, dbOffset: 6.5 },
      { hz: 125, dbOffset: 4.0 },
      { hz: 250, dbOffset: 1.0 },
      { hz: 500, dbOffset: -0.5 },
      { hz: 1000, dbOffset: 0.0 },
      { hz: 2000, dbOffset: 0.0 },
      { hz: 4000, dbOffset: -0.5 },
      { hz: 8000, dbOffset: -1.5 },
      { hz: 16000, dbOffset: -3.0 }
    ]
  },
  {
    id: 'acoustic_jazz',
    name: 'Acoustic / Jazz Lounge',
    description: 'Natural timbre preservation, transparent transient response, and zero artificial coloration.',
    targetSplDba: 80,
    targetSplPeakDbc: 92,
    maxLeq15MinDba: 84,
    targetRt60Sec: 1.05,
    targetSti: 0.77,
    bassToleranceDb: 2.0,
    midToleranceDb: 1.5,
    highToleranceDb: 2.0,
    targetCurve: [
      { hz: 31, dbOffset: 1.0 },
      { hz: 63, dbOffset: 1.5 },
      { hz: 125, dbOffset: 1.0 },
      { hz: 250, dbOffset: 0.0 },
      { hz: 500, dbOffset: 0.0 },
      { hz: 1000, dbOffset: 0.0 },
      { hz: 2000, dbOffset: 0.0 },
      { hz: 4000, dbOffset: -0.5 },
      { hz: 8000, dbOffset: -1.5 },
      { hz: 16000, dbOffset: -3.5 }
    ]
  }
];

export const INITIAL_VENUES: Venue[] = [
  {
    id: 'horizon_hall',
    name: 'The Horizon Performing Arts Center',
    type: 'concert_hall',
    dimensions: {
      widthMeters: 28,
      lengthMeters: 42,
      heightMeters: 12,
      capacity: 1450
    },
    zones: [
      {
        id: 'zone_stage',
        name: 'Stage Area',
        description: 'Musicians & performers acoustic zone, wedge monitor listening plane',
        category: 'stage',
        color: '#f59e0b',
        targetSplDba: 94,
        currentSplDba: 93.4,
        rt60TargetSec: 0.9,
        currentRt60Sec: 0.95,
        status: 'optimal',
        measurementPointIds: ['pt_stage_center', 'pt_stage_drums']
      },
      {
        id: 'zone_front',
        name: 'Front Pit & Downstage',
        description: 'First 10 rows directly under main array near-field coverage',
        category: 'front',
        color: '#06b6d4',
        targetSplDba: 98,
        currentSplDba: 99.1,
        rt60TargetSec: 1.15,
        currentRt60Sec: 1.18,
        status: 'optimal',
        measurementPointIds: ['pt_front_left', 'pt_front_center', 'pt_front_right']
      },
      {
        id: 'zone_mid',
        name: 'Main Orchestra & FOH',
        description: 'Center seating plane and primary front-of-house mixing position',
        category: 'middle',
        color: '#10b981',
        targetSplDba: 97,
        currentSplDba: 96.8,
        rt60TargetSec: 1.2,
        currentRt60Sec: 1.22,
        status: 'optimal',
        measurementPointIds: ['pt_foh_mix', 'pt_mid_left', 'pt_mid_right']
      },
      {
        id: 'zone_back',
        name: 'Under-Balcony / Rear',
        description: 'Rear rows shaded by balcony ceiling, dependent on rear fill time alignment',
        category: 'back',
        color: '#6366f1',
        targetSplDba: 96,
        currentSplDba: 92.8,
        rt60TargetSec: 1.25,
        currentRt60Sec: 1.34,
        status: 'warning',
        measurementPointIds: ['pt_rear_center', 'pt_rear_wall']
      },
      {
        id: 'zone_balcony',
        name: 'Upper Balcony Tier',
        description: 'Elevated seating tier requiring HF line-array beam steering',
        category: 'balcony',
        color: '#ec4899',
        targetSplDba: 96,
        currentSplDba: 95.5,
        rt60TargetSec: 1.2,
        currentRt60Sec: 1.21,
        status: 'optimal',
        measurementPointIds: ['pt_balcony_center']
      }
    ],
    measurementPoints: [
      { id: 'pt_stage_center', name: 'MP-01 Vocal Mic Center', zoneId: 'zone_stage', x: 50, y: 15, heightMeters: 1.6, isVerified: true },
      { id: 'pt_stage_drums', name: 'MP-02 Drum Riser', zoneId: 'zone_stage', x: 75, y: 8, heightMeters: 1.4, isVerified: true },
      { id: 'pt_front_left', name: 'MP-03 Front Left Pit', zoneId: 'zone_front', x: 25, y: 28, heightMeters: 1.7, isVerified: true },
      { id: 'pt_front_center', name: 'MP-04 Front Center Lip', zoneId: 'zone_front', x: 50, y: 28, heightMeters: 1.7, isVerified: true },
      { id: 'pt_front_right', name: 'MP-05 Front Right Pit', zoneId: 'zone_front', x: 75, y: 28, heightMeters: 1.7, isVerified: true },
      { id: 'pt_foh_mix', name: 'MP-06 Primary FOH Desk', zoneId: 'zone_mid', x: 50, y: 55, heightMeters: 1.75, isVerified: true },
      { id: 'pt_mid_left', name: 'MP-07 Mid Hall Left', zoneId: 'zone_mid', x: 20, y: 55, heightMeters: 1.7, isVerified: true },
      { id: 'pt_mid_right', name: 'MP-08 Mid Hall Right', zoneId: 'zone_mid', x: 80, y: 55, heightMeters: 1.7, isVerified: true },
      { id: 'pt_rear_center', name: 'MP-09 Under-Balcony Center', zoneId: 'zone_back', x: 50, y: 82, heightMeters: 1.7, isVerified: false },
      { id: 'pt_rear_wall', name: 'MP-10 Back Wall Corner', zoneId: 'zone_back', x: 18, y: 92, heightMeters: 1.7, isVerified: false },
      { id: 'pt_balcony_center', name: 'MP-11 Upper Balcony Front Row', zoneId: 'zone_balcony', x: 50, y: 72, heightMeters: 6.2, isVerified: true }
    ],
    speakers: [
      { id: 'spk_main_l', name: 'Main Array Left (8-box Line)', type: 'main_left', x: 15, y: 18, angleDeg: 12, coverageAngleDeg: 90, throwDistanceMeters: 38, delayMs: 0, gainDb: 0, isMuted: false },
      { id: 'spk_main_r', name: 'Main Array Right (8-box Line)', type: 'main_right', x: 85, y: 18, angleDeg: -12, coverageAngleDeg: 90, throwDistanceMeters: 38, delayMs: 0, gainDb: 0, isMuted: false },
      { id: 'spk_sub_center', name: 'Cardioid Sub Array (4x 218)', type: 'subwoofer', x: 50, y: 19, angleDeg: 0, coverageAngleDeg: 120, throwDistanceMeters: 30, delayMs: 2.1, gainDb: +1.5, isMuted: false },
      { id: 'spk_front_fill', name: 'Front Lip Fills (3x Coaxial)', type: 'front_fill', x: 50, y: 22, angleDeg: 0, coverageAngleDeg: 110, throwDistanceMeters: 8, delayMs: 4.8, gainDb: -4.0, isMuted: false },
      { id: 'spk_delay_rear', name: 'Under-Balcony Delay Ring', type: 'delay_tower', x: 50, y: 68, angleDeg: 0, coverageAngleDeg: 100, throwDistanceMeters: 16, delayMs: 46.5, gainDb: -2.0, isMuted: false },
      { id: 'spk_wedge_lead', name: 'Lead Vocal Wedge', type: 'stage_wedge', x: 50, y: 16, angleDeg: 180, coverageAngleDeg: 60, throwDistanceMeters: 3, delayMs: 0, gainDb: 0, isMuted: false }
    ]
  },
  {
    id: 'subterranean_club',
    name: 'Subterranean Live Vault',
    type: 'club',
    dimensions: {
      widthMeters: 16,
      lengthMeters: 26,
      heightMeters: 4.5,
      capacity: 450
    },
    zones: [
      { id: 'sc_stage', name: 'Low Stage', description: 'Compact performance deck', category: 'stage', color: '#f59e0b', targetSplDba: 96, currentSplDba: 97.2, rt60TargetSec: 0.7, currentRt60Sec: 0.72, status: 'optimal', measurementPointIds: ['sc_pt1'] },
      { id: 'sc_pit', name: 'Dance Floor', description: 'Central high SPL audience zone', category: 'front', color: '#06b6d4', targetSplDba: 102, currentSplDba: 101.5, rt60TargetSec: 0.85, currentRt60Sec: 0.88, status: 'optimal', measurementPointIds: ['sc_pt2', 'sc_pt3'] },
      { id: 'sc_bar', name: 'Bar & Lounge', description: 'Speech friendly perimeter', category: 'back', color: '#6366f1', targetSplDba: 90, currentSplDba: 93.1, rt60TargetSec: 0.8, currentRt60Sec: 0.85, status: 'warning', measurementPointIds: ['sc_pt4'] }
    ],
    measurementPoints: [
      { id: 'sc_pt1', name: 'MP-01 Stage Center', zoneId: 'sc_stage', x: 50, y: 15, heightMeters: 1.5, isVerified: true },
      { id: 'sc_pt2', name: 'MP-02 Center Dance Floor', zoneId: 'sc_pit', x: 50, y: 45, heightMeters: 1.7, isVerified: true },
      { id: 'sc_pt3', name: 'MP-03 Front Stage Left', zoneId: 'sc_pit', x: 20, y: 35, heightMeters: 1.7, isVerified: true },
      { id: 'sc_pt4', name: 'MP-04 Main Bar Order Point', zoneId: 'sc_bar', x: 80, y: 80, heightMeters: 1.6, isVerified: false }
    ],
    speakers: [
      { id: 'sc_spk_l', name: 'Point Source Top Left', type: 'main_left', x: 15, y: 20, angleDeg: 15, coverageAngleDeg: 80, throwDistanceMeters: 18, delayMs: 0, gainDb: 0, isMuted: false },
      { id: 'sc_spk_r', name: 'Point Source Top Right', type: 'main_right', x: 85, y: 20, angleDeg: -15, coverageAngleDeg: 80, throwDistanceMeters: 18, delayMs: 0, gainDb: 0, isMuted: false },
      { id: 'sc_spk_sub', name: 'End-Fire Dual 18" Sub', type: 'subwoofer', x: 50, y: 22, angleDeg: 0, coverageAngleDeg: 120, throwDistanceMeters: 18, delayMs: 0, gainDb: +2.0, isMuted: false }
    ]
  }
];

export const INITIAL_EQUIPMENT: EquipmentItem[] = [
  {
    id: 'eq_mic_ref',
    name: 'Earthworks M30 Measurement Mic',
    category: 'microphone',
    model: 'M30 High-Precision Omnidirectional (3Hz - 30kHz, ±1dB)',
    manufacturer: 'Earthworks Audio',
    connectionType: 'xlr',
    status: 'online',
    location: 'FOH Measurement Rig',
    gainDb: +24.0
  },
  {
    id: 'eq_iface',
    name: 'Focusrite RedNet Dante / USB Interface',
    category: 'audio_interface',
    model: 'RedNet X2P 2x2 Dante Interface (24-bit/96kHz)',
    manufacturer: 'Focusrite Pro',
    connectionType: 'usb',
    status: 'online',
    location: 'FOH Rack 01',
    gainDb: 0.0
  },
  {
    id: 'eq_desk',
    name: 'DiGiCo Quantum 338 Console',
    category: 'mixer',
    model: 'Quantum 338 128-channel Engine',
    manufacturer: 'DiGiCo',
    connectionType: 'dante_ethernet',
    status: 'online',
    location: 'FOH Mix Position',
    gainDb: 0.0
  },
  {
    id: 'eq_dsp',
    name: 'Lake LM44 System Controller',
    category: 'crossover',
    model: 'LM44 4-in / 4-out FIR / IIR Loudspeaker Processor',
    manufacturer: 'Lab.gruppen',
    connectionType: 'dante_ethernet',
    status: 'online',
    location: 'Stage Left Amp Rack',
    gainDb: 0.0,
    temperatureC: 38.5
  },
  {
    id: 'eq_amp_main',
    name: 'Powersoft X8 Touring Amplifier',
    category: 'amplifier',
    model: 'X8 Dante 8-channel 48,000W DSP Amp',
    manufacturer: 'Powersoft',
    connectionType: 'speakon',
    status: 'online',
    location: 'Stage Left Amp Rack',
    gainDb: +26.0,
    temperatureC: 44.1,
    impedanceOhms: 3.9
  },
  {
    id: 'eq_array_l',
    name: 'd&b audiotechnik KSL Line Array (L)',
    category: 'speaker',
    model: 'KSL8 / KSL12 Cardioid Line Array Elements',
    manufacturer: 'd&b audiotechnik',
    connectionType: 'speakon',
    status: 'online',
    location: 'Flown House Left',
    gainDb: 0.0
  },
  {
    id: 'eq_array_r',
    name: 'd&b audiotechnik KSL Line Array (R)',
    category: 'speaker',
    model: 'KSL8 / KSL12 Cardioid Line Array Elements',
    manufacturer: 'd&b audiotechnik',
    connectionType: 'speakon',
    status: 'online',
    location: 'Flown House Right',
    gainDb: 0.0
  },
  {
    id: 'eq_sub_array',
    name: 'd&b SL-SUB Cardioid Subwoofers',
    category: 'subwoofer',
    model: 'SL-SUB 3x 21" Neodymium Cardioid Sub Array',
    manufacturer: 'd&b audiotechnik',
    connectionType: 'speakon',
    status: 'online',
    location: 'Ground Stage Center',
    gainDb: +1.5
  },
  {
    id: 'eq_wedge_vocal',
    name: 'L-Acoustics X15 HiQ Stage Wedge',
    category: 'monitor',
    model: 'X15 HiQ Active 2-way Coaxial Enclosure',
    manufacturer: 'L-Acoustics',
    connectionType: 'speakon',
    status: 'online',
    location: 'Stage Center Lip',
    gainDb: 0.0
  }
];

export const INITIAL_SIGNAL_CHAIN: SignalChainNode[] = [
  { id: 'node_1', equipmentId: 'eq_mic_ref', name: 'Ref Mic Capture', stage: 'source', order: 1, inputLevelDb: -42, outputLevelDb: -18, isMuted: false },
  { id: 'node_2', equipmentId: 'eq_iface', name: 'A/D Converter (96k)', stage: 'interface', order: 2, inputLevelDb: -18, outputLevelDb: -18, isMuted: false },
  { id: 'node_3', equipmentId: 'eq_desk', name: 'FOH Matrix Output', stage: 'mixer', order: 3, inputLevelDb: -18, outputLevelDb: -4, isMuted: false },
  { id: 'node_4', equipmentId: 'eq_dsp', name: 'Lake FIR EQ / Delay', stage: 'dsp', order: 4, inputLevelDb: -4, outputLevelDb: -4, isMuted: false },
  { id: 'node_5', equipmentId: 'eq_amp_main', name: 'Powersoft X8 Stages', stage: 'amplifier', order: 5, inputLevelDb: -4, outputLevelDb: +24, isMuted: false },
  { id: 'node_6', equipmentId: 'eq_array_l', name: 'Main Left PA', stage: 'transducer', order: 6, inputLevelDb: +24, outputLevelDb: 98, isMuted: false }
];

export const INITIAL_ADRS: ArchitectureRecord[] = [
  {
    id: 'ADR-0001',
    title: 'Why Go is the main application layer',
    status: 'Accepted',
    context: 'SoundPilot requires deterministic concurrency, low memory footprint, rock-solid networking, and single-binary deployment on embedded sound racks and laptops without runtime bloat.',
    decision: 'Use Go as the primary application orchestration, domain, configuration, storage, and networking server.',
    consequences: 'Fast execution, robust Goroutines for continuous monitoring and OSC/Dante polling, zero garbage collection pauses during live concerts.'
  },
  {
    id: 'ADR-0002',
    title: 'Why Python handles DSP',
    status: 'Accepted',
    context: 'Scientific acoustic computations (FFT, Hilbert transform, cepstral pitch detection, C50 impulse integration, fractional-octave RTA) have rich, battle-tested numerical ecosystems (NumPy, SciPy).',
    decision: 'Isolate raw signal processing and audio feature extraction in the Python DSP engine.',
    consequences: 'Clean separation: Python answers "What did we measure?" while Go answers "What does this mean in this venue context?".'
  },
  {
    id: 'ADR-0003',
    title: 'Why SoundPilot is offline-first',
    status: 'Accepted',
    context: 'Concert halls, underground clubs, stadiums, and festival fields frequently have zero cellular reception or blocked internet firewalls.',
    decision: 'All measurement capture, engineering rules evaluation, target curves, and verification must operate 100% offline without external servers.',
    consequences: 'Sound engineers can tune systems in concrete bunkers or remote outdoor stages with guaranteed reliability.'
  },
  {
    id: 'ADR-0004',
    title: 'Why AI does not control measurement decisions',
    status: 'Accepted',
    context: 'Acoustic measurement is hard physics (phase cancellation, standing waves, comb filtering). Generative models can hallucinate decibel levels or dangerous amplifier gains that could destroy drivers or damage hearing.',
    decision: 'Strict boundary rule: Measurements come strictly from DSP. Conformance is evaluated strictly by the rule-based Engineering Engine. AI is solely an optional translator for explanations.',
    consequences: 'Absolute safety, acoustic truth, reproducible scientific verification, and transparent engineering audit trails.'
  }
];

export const INITIAL_VERIFICATIONS: VerificationSnapshot[] = [
  {
    id: 'ver_001',
    timestamp: '2026-09-14 06:45:10',
    baselineId: 'base_pre_rig',
    profileId: 'live_concert',
    venueId: 'horizon_hall',
    state: 'verified',
    complianceScorePercent: 94,
    deviationsCount: 1,
    summary: 'Main Array Left & Right time-aligned to Subs. Sub-to-Mains crossover at 82Hz verified with 0.4ms delay offset.',
    frequencyDeltas: [
      { hz: 63, baselineDb: -4.2, currentDb: +0.2, deltaDb: +4.4 },
      { hz: 125, baselineDb: -2.1, currentDb: +0.1, deltaDb: +2.2 },
      { hz: 250, baselineDb: +0.3, currentDb: 0.0, deltaDb: -0.3 },
      { hz: 1000, baselineDb: +0.1, currentDb: 0.0, deltaDb: -0.1 },
      { hz: 4000, baselineDb: -1.8, currentDb: -0.2, deltaDb: +1.6 },
      { hz: 8000, baselineDb: -3.5, currentDb: -0.5, deltaDb: +3.0 }
    ],
    operatorNotes: 'Clean coverage achieved across Front Pit and FOH position. Rear balcony air absorption compensated with +1.5dB shelf above 8kHz on upper line array modules.'
  },
  {
    id: 'ver_002',
    timestamp: '2026-09-14 07:05:22',
    baselineId: 'base_post_curtain',
    profileId: 'live_concert',
    venueId: 'horizon_hall',
    state: 'needs_reverification',
    complianceScorePercent: 81,
    deviationsCount: 3,
    summary: 'Acoustic drapes deployed on Stage Left. Re-verification required due to 250Hz boundary reflection shift.',
    frequencyDeltas: [
      { hz: 63, baselineDb: +0.2, currentDb: +0.4, deltaDb: +0.2 },
      { hz: 125, baselineDb: +0.1, currentDb: -1.8, deltaDb: -1.9 },
      { hz: 250, baselineDb: 0.0, currentDb: -3.4, deltaDb: -3.4 },
      { hz: 1000, baselineDb: 0.0, currentDb: +0.2, deltaDb: +0.2 },
      { hz: 4000, baselineDb: -0.2, currentDb: +2.8, deltaDb: +3.0 },
      { hz: 8000, baselineDb: -0.5, currentDb: -0.8, deltaDb: -0.3 }
    ],
    operatorNotes: 'Zone Back (Under-Balcony) experiencing 4dB dip at 3.2kHz due to delay ring timing drift. Re-align delay tower.'
  }
];
