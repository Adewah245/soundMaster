import { AcousticMeasurement, MeasurementSource, FrequencyBand } from '../types';

export const ISO_FREQUENCIES_31 = [
  25, 31.5, 40, 50, 63, 80, 100, 125, 160, 200,
  250, 315, 400, 500, 630, 800, 1000, 1250, 1600, 2000,
  2500, 3150, 4000, 5000, 6300, 8000, 10000, 12500, 16000, 20000
];

export class DspEngine {
  private audioCtx: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private micStream: MediaStream | null = null;
  private sourceNode: AudioNode | null = null;
  private testOscillator: OscillatorNode | null = null;
  private testNoiseNode: AudioBufferSourceNode | null = null;
  private gainNode: GainNode | null = null;
  private activeSource: MeasurementSource = 'pink_noise';
  private isCapturing = false;
  private animFrameId: number | null = null;
  private listeners: ((measurement: AcousticMeasurement) => void)[] = [];

  // Simulated internal values for realistic smooth acoustic behavior
  private simulatedRms = 94.2;
  private simulatedPeak = 106.5;
  private simulatedRt60 = 1.18;
  private simulatedSti = 0.72;
  private currentFeedbackHz: number | null = null;

  constructor() {}

  public getStatus() {
    return {
      isCapturing: this.isCapturing,
      source: this.activeSource,
      sampleRate: this.audioCtx ? this.audioCtx.sampleRate : 48000
    };
  }

  public subscribe(cb: (measurement: AcousticMeasurement) => void) {
    this.listeners.push(cb);
    return () => {
      this.listeners = this.listeners.filter(l => l !== cb);
    };
  }

  private notify(measurement: AcousticMeasurement) {
    for (const listener of this.listeners) {
      listener(measurement);
    }
  }

  public async setSource(source: MeasurementSource) {
    const wasCapturing = this.isCapturing;
    if (wasCapturing) {
      await this.stop();
    }
    this.activeSource = source;
    if (wasCapturing) {
      await this.start();
    }
  }

  public async start(source?: MeasurementSource): Promise<boolean> {
    if (source) {
      this.activeSource = source;
    }
    if (this.isCapturing) return true;

    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!this.audioCtx || this.audioCtx.state === 'closed') {
        this.audioCtx = new AudioContextClass();
      }

      if (this.audioCtx.state === 'suspended') {
        await this.audioCtx.resume();
      }

      this.analyser = this.audioCtx.createAnalyser();
      this.analyser.fftSize = 2048;
      this.analyser.smoothingTimeConstant = 0.85;

      this.gainNode = this.audioCtx.createGain();
      this.gainNode.gain.value = 0.8;

      if (this.activeSource === 'microphone') {
        try {
          this.micStream = await navigator.mediaDevices.getUserMedia({
            audio: {
              echoCancellation: false,
              noiseSuppression: false,
              autoGainControl: false
            }
          });
          this.sourceNode = this.audioCtx.createMediaStreamSource(this.micStream);
          this.sourceNode.connect(this.analyser);
          // Mic should not route to speakers to avoid real acoustic feedback loops through computer
        } catch (micErr) {
          console.warn('Microphone permission denied or unavailable. Falling back to calibrated Pink Noise generator.', micErr);
          this.activeSource = 'pink_noise';
          this.startPinkNoise();
        }
      } else if (this.activeSource === 'pink_noise') {
        this.startPinkNoise();
      } else if (this.activeSource === 'sine_sweep') {
        this.startSineSweep();
      } else {
        // Simulated live
        this.startSimulatedLive();
      }

      this.isCapturing = true;
      this.loop();
      return true;
    } catch (err) {
      console.error('Failed to start DSP capture:', err);
      // Fallback to synthetic loop
      this.isCapturing = true;
      this.loopSyntheticOnly();
      return true;
    }
  }

  private startPinkNoise() {
    if (!this.audioCtx || !this.analyser || !this.gainNode) return;
    const bufferSize = this.audioCtx.sampleRate * 2;
    const buffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.06;
      b6 = white * 0.115926;
    }

    const noiseSource = this.audioCtx.createBufferSource();
    noiseSource.buffer = buffer;
    noiseSource.loop = true;
    noiseSource.connect(this.analyser);
    noiseSource.start();
    this.testNoiseNode = noiseSource;
  }

  private startSineSweep() {
    if (!this.audioCtx || !this.analyser) return;
    const osc = this.audioCtx.createOscillator();
    osc.type = 'sine';
    const now = this.audioCtx.currentTime;
    osc.frequency.setValueAtTime(20, now);
    osc.frequency.exponentialRampToValueAtTime(20000, now + 4.0);
    osc.connect(this.analyser);
    osc.start();
    this.testOscillator = osc;
  }

  private startSimulatedLive() {
    this.startPinkNoise();
  }

  public async stop() {
    this.isCapturing = false;
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }

    if (this.testOscillator) {
      try { this.testOscillator.stop(); } catch {}
      this.testOscillator.disconnect();
      this.testOscillator = null;
    }
    if (this.testNoiseNode) {
      try { this.testNoiseNode.stop(); } catch {}
      this.testNoiseNode.disconnect();
      this.testNoiseNode = null;
    }
    if (this.sourceNode) {
      this.sourceNode.disconnect();
      this.sourceNode = null;
    }
    if (this.micStream) {
      this.micStream.getTracks().forEach(t => t.stop());
      this.micStream = null;
    }
  }

  public injectFeedback(frequencyHz: number | null) {
    this.currentFeedbackHz = frequencyHz;
  }

  private loop = () => {
    if (!this.isCapturing) return;

    let bars: number[] = [];
    let rmsDb = this.simulatedRms;
    let peakDb = this.simulatedPeak;
    let isClipping = false;

    if (this.analyser) {
      const bufferLength = this.analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      this.analyser.getByteFrequencyData(dataArray);

      // Downsample / map FFT bins into standard 30 ISO 1/3-octave bands
      bars = ISO_FREQUENCIES_31.map((centerFreq, idx) => {
        const binIndex = Math.min(
          bufferLength - 1,
          Math.max(1, Math.round((centerFreq / 24000) * bufferLength))
        );
        const rawByte = dataArray[binIndex] || 0;
        let db = (rawByte / 255) * 60 - 50; // -50 to +10 dB

        // If simulated feedback is triggered at this band, add prominent resonant spike
        if (this.currentFeedbackHz && Math.abs(centerFreq - this.currentFeedbackHz) < centerFreq * 0.2) {
          db += 14.5;
        }
        return Math.round(db * 10) / 10;
      });

      // Compute RMS from time domain
      const timeData = new Uint8Array(this.analyser.fftSize);
      this.analyser.getByteTimeDomainData(timeData);
      let sumSquares = 0;
      let maxSample = 0;

      for (let i = 0; i < timeData.length; i++) {
        const normalized = (timeData[i] - 128) / 128;
        sumSquares += normalized * normalized;
        const absVal = Math.abs(normalized);
        if (absVal > maxSample) maxSample = absVal;
      }

      const calculatedRms = Math.sqrt(sumSquares / timeData.length);
      const measuredSpl = 20 * Math.log10(Math.max(calculatedRms, 0.0001)) + 104; // Calibrated offset
      rmsDb = Math.round(measuredSpl * 10) / 10;
      peakDb = Math.round((rmsDb + 12 + maxSample * 4) * 10) / 10;
      isClipping = maxSample >= 0.98;
    } else {
      bars = ISO_FREQUENCIES_31.map((_, i) => -5 + Math.sin(i * 0.5) * 3);
    }

    // Acoustic feature extraction
    const measurement: AcousticMeasurement = {
      id: 'meas_' + Date.now(),
      timestamp: new Date().toLocaleTimeString(),
      pointId: 'pt_foh_mix',
      pointName: 'FOH Mix Station',
      zoneId: 'zone_mid',
      splRmsDba: rmsDb,
      splPeakDbc: peakDb,
      loudnessLufs: Math.round((rmsDb - 110) * 10) / 10,
      noiseFloorDba: 38.4,
      thdPercent: isClipping ? 3.2 : 0.045,
      isClipping,
      feedbackFrequencyHz: this.currentFeedbackHz,
      rt60Seconds: this.simulatedRt60,
      speechClarityC50Db: Math.round((4.2 + (this.simulatedRt60 < 1.0 ? 2.1 : -0.8)) * 10) / 10,
      speechTransmissionIndexSti: this.simulatedSti,
      spectrumBars: bars,
      frequencyBands: this.calculateFrequencyBands(bars)
    };

    this.notify(measurement);
    this.animFrameId = requestAnimationFrame(this.loop);
  };

  private loopSyntheticOnly = () => {
    if (!this.isCapturing) return;

    const bars = ISO_FREQUENCIES_31.map((freq, idx) => {
      let base = -2 + Math.sin(idx * 0.4 + Date.now() * 0.002) * 2;
      if (this.currentFeedbackHz && Math.abs(freq - this.currentFeedbackHz) < freq * 0.25) {
        base += 12.0;
      }
      return Math.round(base * 10) / 10;
    });

    const measurement: AcousticMeasurement = {
      id: 'meas_' + Date.now(),
      timestamp: new Date().toLocaleTimeString(),
      pointId: 'pt_foh_mix',
      pointName: 'FOH Mix Station',
      zoneId: 'zone_mid',
      splRmsDba: 96.8,
      splPeakDbc: 108.2,
      loudnessLufs: -14.2,
      noiseFloorDba: 37.9,
      thdPercent: 0.05,
      isClipping: false,
      feedbackFrequencyHz: this.currentFeedbackHz,
      rt60Seconds: 1.18,
      speechClarityC50Db: 4.6,
      speechTransmissionIndexSti: 0.73,
      spectrumBars: bars,
      frequencyBands: this.calculateFrequencyBands(bars)
    };

    this.notify(measurement);
    setTimeout(() => {
      if (this.isCapturing) this.loopSyntheticOnly();
    }, 100);
  };

  private calculateFrequencyBands(bars: number[]): FrequencyBand[] {
    // 5 standard audio engineering acoustic bands: Sub, Low, Mid, High-Mid, High
    const subBars = bars.slice(0, 5); // 25 - 63 Hz
    const lowBars = bars.slice(5, 11); // 80 - 250 Hz
    const midBars = bars.slice(11, 18); // 315 - 1.6kHz
    const hiMidBars = bars.slice(18, 24); // 2kHz - 6.3kHz
    const hiBars = bars.slice(24); // 8kHz - 20kHz

    const avg = (arr: number[]) => arr.reduce((a, b) => a + b, 0) / (arr.length || 1);

    const bands: FrequencyBand[] = [
      {
        name: 'Sub Bass',
        lowHz: 20,
        highHz: 80,
        measuredDb: Math.round(avg(subBars) * 10) / 10,
        targetDb: +3.0,
        toleranceDb: 2.5,
        deviationDb: Math.round((avg(subBars) - 3.0) * 10) / 10,
        status: Math.abs(avg(subBars) - 3.0) > 3.0 ? 'warning' : 'nominal'
      },
      {
        name: 'Low / Mud',
        lowHz: 80,
        highHz: 250,
        measuredDb: Math.round(avg(lowBars) * 10) / 10,
        targetDb: +1.0,
        toleranceDb: 2.0,
        deviationDb: Math.round((avg(lowBars) - 1.0) * 10) / 10,
        status: Math.abs(avg(lowBars) - 1.0) > 2.5 ? 'warning' : 'nominal'
      },
      {
        name: 'Midrange',
        lowHz: 250,
        highHz: 2000,
        measuredDb: Math.round(avg(midBars) * 10) / 10,
        targetDb: 0.0,
        toleranceDb: 1.5,
        deviationDb: Math.round(avg(midBars) * 10) / 10,
        status: Math.abs(avg(midBars)) > 2.0 ? 'warning' : 'nominal'
      },
      {
        name: 'Presence / High-Mid',
        lowHz: 2000,
        highHz: 6000,
        measuredDb: Math.round(avg(hiMidBars) * 10) / 10,
        targetDb: -0.5,
        toleranceDb: 2.0,
        deviationDb: Math.round((avg(hiMidBars) - (-0.5)) * 10) / 10,
        status: Math.abs(avg(hiMidBars) - (-0.5)) > 2.5 ? 'warning' : 'nominal'
      },
      {
        name: 'Air / Brilliance',
        lowHz: 6000,
        highHz: 20000,
        measuredDb: Math.round(avg(hiBars) * 10) / 10,
        targetDb: -3.0,
        toleranceDb: 2.5,
        deviationDb: Math.round((avg(hiBars) - (-3.0)) * 10) / 10,
        status: Math.abs(avg(hiBars) - (-3.0)) > 3.0 ? 'warning' : 'nominal'
      }
    ];

    return bands;
  }
}

export const dspEngine = new DspEngine();
