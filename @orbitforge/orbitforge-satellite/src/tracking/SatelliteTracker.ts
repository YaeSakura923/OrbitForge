import { TLEEntry, TLEParser } from '../tle/TLEParser';
import { SGP4Propagator, ECIState } from '../propagation/SGP4Propagator';
import { GeoCoordinates, SatelliteInfo } from '../types';

export interface TrackedSatellite {
  tle: TLEEntry;
  info: SatelliteInfo;
  currentState: ECIState;
  currentGeo: GeoCoordinates;
  orbitPath: GeoCoordinates[];
}

export class SatelliteTracker {
  private satellites: Map<string, TrackedSatellite> = new Map();
  private animationTime: number = 0;
  private readonly UPDATE_INTERVAL = 1; // seconds per update step

  loadFromTLE(tleString: string, infos?: Map<string, Partial<SatelliteInfo>>): void {
    const entries = TLEParser.parse(tleString);

    for (const entry of entries) {
      const state = SGP4Propagator.propagate(entry, 0);
      const geo = SGP4Propagator.eciToGeodetic(state);
      const orbitPath = SGP4Propagator.predictOrbit(entry, 720);

      const info: SatelliteInfo = {
        id: entry.noradId.toString(),
        name: entry.name,
        tleLine1: '',
        tleLine2: '',
        noradId: entry.noradId,
        ...(infos?.get(entry.noradId.toString()) || {}),
      };

      this.satellites.set(info.id, { tle: entry, info, currentState: state, currentGeo: geo, orbitPath });
    }
  }

  addSatellite(tle: TLEEntry, info: SatelliteInfo): void {
    const state = SGP4Propagator.propagate(tle, 0);
    const geo = SGP4Propagator.eciToGeodetic(state);
    const orbitPath = SGP4Propagator.predictOrbit(tle, 720);
    this.satellites.set(info.id, { tle, info, currentState: state, currentGeo: geo, orbitPath });
  }

  update(minutesDelta: number): void {
    this.animationTime += minutesDelta;
    for (const [, sat] of this.satellites) {
      const state = SGP4Propagator.propagate(sat.tle, this.animationTime);
      const geo = SGP4Propagator.eciToGeodetic(state);
      sat.currentState = state;
      sat.currentGeo = geo;
    }
  }

  getSatellites(): TrackedSatellite[] {
    return Array.from(this.satellites.values());
  }

  getSatellite(id: string): TrackedSatellite | undefined {
    return this.satellites.get(id);
  }

  getSatelliteCount(): number {
    return this.satellites.size;
  }
}
