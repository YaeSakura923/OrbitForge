import { TLEEntry } from '../tle/TLEParser';
import { GeoCoordinates } from '../types';

export interface ECIState {
  position: [number, number, number];
  velocity: [number, number, number];
}

export class SGP4Propagator {
  private static readonly EARTH_RADIUS = 6371.0; // km
  private static readonly MU = 398600.4418; // km^3/s^2
  private static readonly TWO_PI = 2 * Math.PI;

  static propagate(tle: TLEEntry, minutesSinceEpoch: number): ECIState {
    const n0 = tle.meanMotion * this.TWO_PI / 86400; // rad/s
    const a0 = Math.cbrt(this.MU / (n0 * n0)); // semi-major axis (km)
    const e0 = tle.eccentricity;
    const i0 = tle.inclination * Math.PI / 180;
    const raan0 = tle.raan * Math.PI / 180;
    const w0 = tle.argPerigee * Math.PI / 180;
    const M0 = tle.meanAnomaly * Math.PI / 180;

    const deltaTime = minutesSinceEpoch * 60;
    const n = n0;
    const M = M0 + n * deltaTime;

    const E = this.solveKepler(M, e0, 100);

    const cosE = Math.cos(E);
    const sinE = Math.sin(E);

    const x = a0 * (cosE - e0);
    const y = a0 * Math.sqrt(1 - e0 * e0) * sinE;

    const cosW = Math.cos(w0);
    const sinW = Math.sin(w0);
    const cosI = Math.cos(i0);
    const sinI = Math.sin(i0);
    const cosRaan = Math.cos(raan0);
    const sinRaan = Math.sin(raan0);

    const xPerifocal = x * cosW - y * sinW;
    const yPerifocal = x * sinW + y * cosW;

    const posX = xPerifocal * cosRaan - yPerifocal * cosI * sinRaan;
    const posY = xPerifocal * sinRaan + yPerifocal * cosI * cosRaan;
    const posZ = yPerifocal * sinI;

    return {
      position: [posX, posY, posZ],
      velocity: [0, 0, 0],
    };
  }

  static eciToGeodetic(eci: ECIState): GeoCoordinates {
    const [x, y, z] = eci.position;
    const lon = Math.atan2(y, x) * 180 / Math.PI;
    const lat = Math.atan2(z, Math.sqrt(x * x + y * y)) * 180 / Math.PI;
    const height = Math.sqrt(x * x + y * y + z * z) - this.EARTH_RADIUS;

    return {
      latitude: lat,
      longitude: ((lon % 360) + 540) % 360 - 180,
      height: Math.max(0, height),
    };
  }

  static eciToPositionVector(eci: ECIState): [number, number, number] {
    const geo = this.eciToGeodetic(eci);
    const r = this.EARTH_RADIUS + geo.height;
    const latRad = geo.latitude * Math.PI / 180;
    const lonRad = geo.longitude * Math.PI / 180;

    return [
      r * Math.cos(latRad) * Math.cos(lonRad),
      r * Math.cos(latRad) * Math.sin(lonRad),
      r * Math.sin(latRad),
    ];
  }

  static predictOrbit(tle: TLEEntry, numPoints: number = 360): GeoCoordinates[] {
    const points: GeoCoordinates[] = [];
    const period = this.TWO_PI / (tle.meanMotion * this.TWO_PI / 86400);
    const timeStep = (period / numPoints) / 60;

    for (let i = 0; i < numPoints; i++) {
      const state = this.propagate(tle, i * timeStep);
      const geo = this.eciToGeodetic(state);
      points.push(geo);
    }

    return points;
  }

  private static solveKepler(M: number, e: number, maxIter: number): number {
    let E = M;
    for (let i = 0; i < maxIter; i++) {
      const dE = (M - E + e * Math.sin(E)) / (1 - e * Math.cos(E));
      E += dE;
      if (Math.abs(dE) < 1e-10) break;
    }
    return E;
  }
}
