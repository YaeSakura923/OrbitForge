export interface GeoCoordinates {
  latitude: number;
  longitude: number;
  height: number;
}

export interface SatelliteInfo {
  id: string;
  name: string;
  tleLine1: string;
  tleLine2: string;
  noradId: number;
  launchDate?: string;
  country?: string;
  purpose?: string;
}

export interface OrbitPoint {
  latitude: number;
  longitude: number;
  height: number;
  time: Date;
}

export interface SatelliteState {
  position: [number, number, number];
  velocity: [number, number, number];
  timestamp: Date;
}
