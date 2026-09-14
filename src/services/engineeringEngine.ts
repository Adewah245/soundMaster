import { AcousticMeasurement, EngineeringProfile, EngineeringResult, Venue, VerificationState } from '../types';

export class EngineeringEngine {
  /**
   * SoundPilot Core Engineering Rule:
   * "DSP answers: What did we measure?"
   * "Engineering Engine answers: Is this within the defined engineering target?"
   */
  public evaluate(
    measurement: AcousticMeasurement,
    profile: EngineeringProfile,
    venue: Venue
  ): EngineeringResult {
    const alerts: string[] = [];
    const systemImpactNotes: string[] = [];
    const recommendedAdjustments: EngineeringResult['recommendedAdjustments'] = [];

    // 1. SPL Target Tolerance Check
    const splDelta = measurement.splRmsDba - profile.targetSplDba;
    if (Math.abs(splDelta) > 3.0) {
      alerts.push(
        splDelta > 0
          ? `Overall SPL (${measurement.splRmsDba} dBA) exceeds target profile (${profile.targetSplDba} dBA) by +${splDelta.toFixed(1)} dB.`
          : `Overall SPL (${measurement.splRmsDba} dBA) is below target profile (${profile.targetSplDba} dBA) by ${Math.abs(splDelta).toFixed(1)} dB.`
      );
      recommendedAdjustments.push({
        component: 'Master FOH VCA / Matrix',
        action: splDelta > 0 ? 'Trim Output Level' : 'Boost Output Level',
        parameter: 'Master Gain',
        value: `${splDelta > 0 ? '-' : '+'}${Math.min(4, Math.abs(splDelta)).toFixed(1)} dB`,
        impact: `Aligns total acoustic energy with ${profile.name} target SPL window.`,
        urgency: Math.abs(splDelta) > 5 ? 'high' : 'medium'
      });
    }

    // 2. Feedback Risk Assessment
    let feedbackDetected = false;
    let feedbackConfidence = 0;
    if (measurement.feedbackFrequencyHz) {
      feedbackDetected = true;
      feedbackConfidence = 96;
      alerts.push(`Resonant acoustic feedback spike detected at ${measurement.feedbackFrequencyHz} Hz.`);
      recommendedAdjustments.push({
        component: 'DSP Parametric / Graphic Notch Filter',
        action: 'Apply Narrow Notch',
        parameter: `Notch @ ${measurement.feedbackFrequencyHz} Hz`,
        value: '-4.5 dB (Q = 6.0)',
        impact: 'Eliminates loop resonance before ring-out escalation.',
        urgency: 'high'
      });
      systemImpactNotes.push(`Feedback at ${measurement.feedbackFrequencyHz}Hz affects Stage Wedge coverage near Lead Vocal mic.`);
    }

    // 3. Clipping Assessment
    if (measurement.isClipping) {
      alerts.push('Preamplifier or DSP A/D converter clipping detected. Headroom exceeded.');
      recommendedAdjustments.push({
        component: 'Input Audio Interface / Preamps',
        action: 'Reduce Analog Gain',
        parameter: 'Mic Pre Gain',
        value: '-6.0 dB',
        impact: 'Restores +12dB clean crest factor headroom.',
        urgency: 'high'
      });
    }

    // 4. Frequency Tolerance Bands
    let outOfSpecBandCount = 0;
    for (const band of measurement.frequencyBands) {
      const dev = Math.abs(band.deviationDb);
      if (dev > band.toleranceDb) {
        outOfSpecBandCount++;
        const direction = band.deviationDb > 0 ? 'excess' : 'deficit';
        alerts.push(`${band.name} (${band.lowHz}-${band.highHz}Hz) has ${direction} of ${Math.abs(band.deviationDb).toFixed(1)} dB (tolerance: ±${band.toleranceDb} dB).`);

        if (band.name === 'Low / Mud' && band.deviationDb > 0) {
          systemImpactNotes.push('Low-mid energy accumulation near 160-250Hz causes vocal masking and boundary coupling.');
          recommendedAdjustments.push({
            component: 'System DSP PEQ',
            action: 'Parametric Low-Mid Cut',
            parameter: 'Freq: 220Hz, Q: 1.8',
            value: `-${Math.min(3.5, band.deviationDb).toFixed(1)} dB`,
            impact: 'Clears boundary reflection mud in mid and back zones.',
            urgency: 'medium'
          });
        } else if (band.name === 'Air / Brilliance' && band.deviationDb < -2.0) {
          systemImpactNotes.push('High frequency air loss observed in rear audience plane due to air absorption (humidity/distance).');
          recommendedAdjustments.push({
            component: 'Line Array Top Modules / Delay EQ',
            action: 'High Shelf Boost',
            parameter: 'Freq: 10kHz High Shelf',
            value: `+${Math.min(3.0, Math.abs(band.deviationDb)).toFixed(1)} dB`,
            impact: 'Restores high-frequency air to rear balcony listener rows.',
            urgency: 'low'
          });
        }
      }
    }

    // 5. Speech Clarity & RT60 Analysis
    if (measurement.speechTransmissionIndexSti < profile.targetSti - 0.05) {
      alerts.push(`Speech Transmission Index (STI = ${measurement.speechTransmissionIndexSti.toFixed(2)}) is below standard (${profile.targetSti.toFixed(2)}).`);
      systemImpactNotes.push('Elevated room reverberation or early boundary reflections are reducing speech intelligibility.');
    }

    // 6. Zone Uniformity Check
    const zoneSpls = venue.zones.map(z => z.currentSplDba);
    const maxZoneSpl = Math.max(...zoneSpls);
    const minZoneSpl = Math.min(...zoneSpls);
    const splUniformityDelta = Math.round((maxZoneSpl - minZoneSpl) * 10) / 10;

    if (splUniformityDelta > 6.0) {
      alerts.push(`High SPL variance across venue zones (Front/Rear spread: ${splUniformityDelta} dB). Front-to-back coverage target is <4.0 dB.`);
      recommendedAdjustments.push({
        component: 'Under-Balcony Delay Ring Amplifiers',
        action: 'Increase Delay Speaker Trim',
        parameter: 'Zone Back Gain',
        value: '+2.5 dB',
        impact: 'Smooths front-to-rear audience sound pressure gradient.',
        urgency: 'medium'
      });
    }

    // Verification State computation
    let state: VerificationState = 'verified';
    const complianceRate = Math.max(45, Math.round(100 - (outOfSpecBandCount * 10) - (feedbackDetected ? 20 : 0) - (Math.abs(splDelta) > 3 ? 12 : 0) - (measurement.isClipping ? 15 : 0)));

    if (feedbackDetected || measurement.isClipping || complianceRate < 70) {
      state = 'failed_target';
    } else if (complianceRate < 88 || outOfSpecBandCount > 1) {
      state = 'needs_reverification';
    } else {
      state = 'verified';
    }

    return {
      state,
      complianceRate,
      averageSplDba: measurement.splRmsDba,
      peakSplDbc: measurement.splPeakDbc,
      splUniformityDeltaDb: splUniformityDelta,
      frequencyDeviations: measurement.frequencyBands,
      feedbackRisk: {
        detected: feedbackDetected,
        frequencyHz: measurement.feedbackFrequencyHz,
        confidencePercent: feedbackConfidence
      },
      clippingDetected: measurement.isClipping,
      systemImpactNotes,
      alerts,
      recommendedAdjustments
    };
  }
}

export const engineeringEngine = new EngineeringEngine();
