export interface SatelliteEntry {
  id: number;
  name: string;
  noradId: number;
  inclination: number;
  raan: number;
  eccentricity: number;
  period: number;
  apogee: number;
  perigee: number;
  status: 'active' | 'inactive' | 'decayed';
  launchDate?: string;
  country?: string;
  purpose?: string;
  selected?: boolean;
}

export interface ViewState {
  latitude: number;
  longitude: number;
  zoom: number;
  rotation: number;
}

export type SidebarTab = 'satellites' | 'tracking' | 'about';
