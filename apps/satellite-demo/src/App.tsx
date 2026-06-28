import React, { useState, useCallback, useEffect, useRef } from 'react';
import gsap from 'gsap';
import GlobeView from './components/GlobeView';
import SatellitePanel from './components/SatellitePanel';
import Toolbar from './components/Toolbar';
import StatusBar from './components/StatusBar';
import type { SatelliteEntry, SidebarTab } from './types';

export default function App() {
  const appRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<SidebarTab>('satellites');
  const [satellites, setSatellites] = useState<SatelliteEntry[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [satCount, setSatCount] = useState(0);
  const [simTime, setSimTime] = useState(0);
  const [isTracking, setIsTracking] = useState(false);

  useEffect(() => {
    if (appRef.current) {
      gsap.fromTo(appRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3 });
    }
  }, []);

  useEffect(() => {
    const demo: SatelliteEntry[] = [
      { id: 25544, noradId: 25544, name: 'ISS (ZARYA)', inclination: 51.64, raan: 142.0, eccentricity: 0.0001, period: 92.68, apogee: 422, perigee: 418, status: 'active', country: 'International', purpose: 'Space Station', selected: true },
      { id: 33591, noradId: 33591, name: 'NOAA 19', inclination: 99.19, raan: 46.4, eccentricity: 0.0014, period: 102.0, apogee: 870, perigee: 850, status: 'active', country: 'USA', purpose: 'Weather' },
      { id: 44713, noradId: 44713, name: 'STARLINK-1007', inclination: 53.05, raan: 342.1, eccentricity: 0.0002, period: 95.6, apogee: 550, perigee: 548, status: 'active', country: 'USA', purpose: 'Communications' },
      { id: 24876, noradId: 24876, name: 'GPS BIIR-2', inclination: 55.48, raan: 162.9, eccentricity: 0.008, period: 718.0, apogee: 20200, perigee: 20100, status: 'active', country: 'USA', purpose: 'Navigation' },
      { id: 38052, noradId: 38052, name: 'GLOBALSTAR M088', inclination: 52.0, raan: 45.7, eccentricity: 0.0002, period: 100.8, apogee: 1414, perigee: 1410, status: 'active', country: 'USA', purpose: 'Communications' },
    ];
    setSatellites(demo);
    setSatCount(demo.length);
    setSelectedIds(new Set([25544]));
  }, []);

  useEffect(() => {
    if (!isTracking) return;
    const interval = setInterval(() => {
      setSimTime((t) => t + 0.5);
    }, 1000);
    return () => clearInterval(interval);
  }, [isTracking]);

  const handleSelectSatellite = useCallback((id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const handleSelectAll = useCallback(() => {
    setSelectedIds(new Set(satellites.map((s) => s.id)));
  }, [satellites]);

  const handleDeselectAll = useCallback(() => {
    setSelectedIds(new Set());
  }, []);

  const trackedSats = satellites.filter((s) => selectedIds.has(s.id));

  return (
    <div className="app-layout" ref={appRef}>
      <Toolbar
        satCount={satCount}
        trackedCount={trackedSats.length}
        simTime={simTime}
        isTracking={isTracking}
        onToggleTracking={() => setIsTracking((v) => !v)}
        onSelectAll={handleSelectAll}
        onDeselectAll={handleDeselectAll}
      />

      <div className="sidebar">
        <nav className="sidebar-tabs">
          {(['satellites', 'tracking', 'about'] as SidebarTab[]).map((tab) => {
            const icons: Record<SidebarTab, React.ReactNode> = {
              satellites: <svg viewBox="0 0 16 16" fill="currentColor"><circle cx="8" cy="8" r="3" /><path d="M8 1v3M8 12v3M1 8h3M12 8h3" stroke="currentColor" strokeWidth="1.5" opacity="0.5" /></svg>,
              tracking: <svg viewBox="0 0 16 16" fill="currentColor"><path d="M8 3a5 5 0 100 10A5 5 0 008 3zm0 8.5a3.5 3.5 0 110-7 3.5 3.5 0 010 7z"/><circle cx="8" cy="8" r="1.5"/></svg>,
              about: <svg viewBox="0 0 16 16" fill="currentColor"><circle cx="8" cy="8" r="6" fill="none" stroke="currentColor" strokeWidth="1.2"/><path d="M8 7.5v4M8 5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
            };
            return (
              <button key={tab} className={`sidebar-tab ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>
                {icons[tab]}
                <span>{tab === 'satellites' ? 'Satellites' : tab === 'tracking' ? 'Tracking' : 'About'}</span>
              </button>
            );
          })}
        </nav>

        <div className="sidebar-content">
          <SatellitePanel
            satellites={satellites}
            selectedIds={selectedIds}
            onSelect={handleSelectSatellite}
            activeTab={activeTab}
            simTime={simTime}
            isTracking={isTracking}
          />
        </div>
      </div>

      <GlobeView
        satellites={trackedSats}
        simTime={simTime}
      />

      <StatusBar simTime={simTime} satCount={satCount} trackedCount={trackedSats.length} />
    </div>
  );
}
