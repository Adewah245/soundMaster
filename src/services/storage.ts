import { Venue, EngineeringProfile, EquipmentItem, SignalChainNode, VerificationSnapshot, UserMode, ConnectionDevice, AcousticMeasurement } from '../types';
import { INITIAL_VENUES, INITIAL_PROFILES, INITIAL_EQUIPMENT, INITIAL_SIGNAL_CHAIN, INITIAL_VERIFICATIONS } from '../data/initialData';

const STORAGE_KEYS = {
  VENUES: 'soundpilot_venues_v1',
  PROFILES: 'soundpilot_profiles_v1',
  EQUIPMENT: 'soundpilot_equipment_v1',
  SIGNAL_CHAIN: 'soundpilot_signal_chain_v1',
  VERIFICATIONS: 'soundpilot_verifications_v1',
  USER_MODE: 'soundpilot_user_mode_v1',
  ACTIVE_VENUE_ID: 'soundpilot_active_venue_id_v1',
  ACTIVE_PROFILE_ID: 'soundpilot_active_profile_id_v1'
};

export const INITIAL_CONNECTIONS: ConnectionDevice[] = [
  { id: 'dev_usb', name: 'Focusrite RedNet X2P (USB Audio ASIO)', protocol: 'USB Audio', address: 'bus 002 dev 004', latencyMs: 2.1, status: 'connected', sampleRateKhz: 96, bufferSize: 128 },
  { id: 'dev_dante', name: 'Dante Virtual Soundcard (AES67 / GbE)', protocol: 'Dante / AES67', address: '192.168.10.45:4321', latencyMs: 1.0, status: 'connected', sampleRateKhz: 96, bufferSize: 64 },
  { id: 'dev_osc', name: 'DiGiCo Quantum Console Control (OSC)', protocol: 'OSC / MIDI', address: '192.168.10.12:8000', latencyMs: 4.8, status: 'connected', sampleRateKhz: 48, bufferSize: 256 },
  { id: 'dev_dsp_net', name: 'Lake Controller LM44 Rack Ring', protocol: 'Wi-Fi Control', address: '192.168.10.88:1400', latencyMs: 12.0, status: 'connected', sampleRateKhz: 96, bufferSize: 512 }
];

export class LocalStorageDatabase {
  public getVenues(): Venue[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.VENUES);
      return data ? JSON.parse(data) : INITIAL_VENUES;
    } catch {
      return INITIAL_VENUES;
    }
  }

  public saveVenues(venues: Venue[]) {
    try {
      localStorage.setItem(STORAGE_KEYS.VENUES, JSON.stringify(venues));
    } catch (e) {
      console.error('Failed to save venues to local storage:', e);
    }
  }

  public getProfiles(): EngineeringProfile[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PROFILES);
      return data ? JSON.parse(data) : INITIAL_PROFILES;
    } catch {
      return INITIAL_PROFILES;
    }
  }

  public saveProfiles(profiles: EngineeringProfile[]) {
    try {
      localStorage.setItem(STORAGE_KEYS.PROFILES, JSON.stringify(profiles));
    } catch (e) {
      console.error('Failed to save profiles to local storage:', e);
    }
  }

  public getEquipment(): EquipmentItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.EQUIPMENT);
      return data ? JSON.parse(data) : INITIAL_EQUIPMENT;
    } catch {
      return INITIAL_EQUIPMENT;
    }
  }

  public saveEquipment(equipment: EquipmentItem[]) {
    try {
      localStorage.setItem(STORAGE_KEYS.EQUIPMENT, JSON.stringify(equipment));
    } catch (e) {
      console.error('Failed to save equipment:', e);
    }
  }

  public getSignalChain(): SignalChainNode[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SIGNAL_CHAIN);
      return data ? JSON.parse(data) : INITIAL_SIGNAL_CHAIN;
    } catch {
      return INITIAL_SIGNAL_CHAIN;
    }
  }

  public saveSignalChain(chain: SignalChainNode[]) {
    try {
      localStorage.setItem(STORAGE_KEYS.SIGNAL_CHAIN, JSON.stringify(chain));
    } catch (e) {
      console.error('Failed to save signal chain:', e);
    }
  }

  public getVerifications(): VerificationSnapshot[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.VERIFICATIONS);
      return data ? JSON.parse(data) : INITIAL_VERIFICATIONS;
    } catch {
      return INITIAL_VERIFICATIONS;
    }
  }

  public addVerification(snapshot: VerificationSnapshot) {
    const list = this.getVerifications();
    const updated = [snapshot, ...list];
    try {
      localStorage.setItem(STORAGE_KEYS.VERIFICATIONS, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save verification:', e);
    }
    return updated;
  }

  public getUserMode(): UserMode {
    try {
      return (localStorage.getItem(STORAGE_KEYS.USER_MODE) as UserMode) || 'pro';
    } catch {
      return 'pro';
    }
  }

  public setUserMode(mode: UserMode) {
    try {
      localStorage.setItem(STORAGE_KEYS.USER_MODE, mode);
    } catch {}
  }

  public getActiveVenueId(): string {
    return localStorage.getItem(STORAGE_KEYS.ACTIVE_VENUE_ID) || INITIAL_VENUES[0].id;
  }

  public setActiveVenueId(id: string) {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_VENUE_ID, id);
  }

  public getActiveProfileId(): string {
    return localStorage.getItem(STORAGE_KEYS.ACTIVE_PROFILE_ID) || INITIAL_PROFILES[0].id;
  }

  public setActiveProfileId(id: string) {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_PROFILE_ID, id);
  }

  public resetToDefaults() {
    try {
      localStorage.clear();
    } catch {}
  }

  public getActiveVenue(): Venue {
    const venues = this.getVenues();
    const activeId = this.getActiveVenueId();
    return venues.find(v => v.id === activeId) || venues[0] || INITIAL_VENUES[0];
  }

  public saveVenue(venue: Venue) {
    const venues = this.getVenues();
    const updated = venues.map(v => v.id === venue.id ? venue : v);
    if (!venues.some(v => v.id === venue.id)) {
      updated.push(venue);
    }
    this.saveVenues(updated);
  }

  public getActiveProfile(): EngineeringProfile {
    const profiles = this.getProfiles();
    const activeId = this.getActiveProfileId();
    return profiles.find(p => p.id === activeId) || profiles[0] || INITIAL_PROFILES[0];
  }

  public setActiveProfile(profile: EngineeringProfile) {
    this.setActiveProfileId(profile.id);
  }

  public getConnections(): ConnectionDevice[] {
    return INITIAL_CONNECTIONS;
  }

  public getLatestMeasurement(): AcousticMeasurement | null {
    try {
      const data = localStorage.getItem('soundpilot_latest_measurement_v1');
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }

  public saveMeasurement(meas: AcousticMeasurement) {
    try {
      localStorage.setItem('soundpilot_latest_measurement_v1', JSON.stringify(meas));
    } catch {}
  }

  public saveVerification(snapshot: VerificationSnapshot) {
    this.addVerification(snapshot);
  }
}

export const localDb = new LocalStorageDatabase();
export const storageService = localDb;

