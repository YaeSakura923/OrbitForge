import { TLEEntry } from '../tle/TLEParser';
import { SGP4Propagator } from '../propagation/SGP4Propagator';
import { GeoCoordinates } from '../types';

export interface GroundTrackPoint {
  lat: number;
  lng: number;
}

export class GroundTrack {
  static compute(tle: TLEEntry, numPoints: number = 360, startMinute: number = 0): GroundTrackPoint[] {
    const orbitGeo = SGP4Propagator.predictOrbit(tle, numPoints);

    const track: GroundTrackPoint[] = orbitGeo.map((g) => ({
      lat: g.latitude,
      lng: g.longitude,
    }));

    return track;
  }

  static computeGroundTrackLines(tle: TLEEntry, revolutions: number = 3): GroundTrackPoint[][] {
    const tracks: GroundTrackPoint[][] = [];
    const pointsPerRev = 360;

    for (let rev = 0; rev < revolutions; rev++) {
      const track: GroundTrackPoint[] = [];
      for (let i = 0; i < pointsPerRev; i++) {
        const minutes = rev * 90 + (i / pointsPerRev) * 90;
        const state = SGP4Propagator.propagate(tle, minutes);
        const geo = SGP4Propagator.eciToGeodetic(state);
        track.push({ lat: geo.latitude, lng: geo.longitude });
      }
      tracks.push(track);
    }

    return tracks;
  }
}
