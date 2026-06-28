import React from 'react';
import gsap from 'gsap';
import type { SatelliteEntry } from '../types';

interface SatellitePanelProps {
  satellites: SatelliteEntry[];
  selectedIds: Set<number>;
  onSelect: (id: number) => void;
  activeTab: string;
  simTime: number;
  isTracking: boolean;
}

const purposeColors: Record<string, string> = {
  'Space Station': '#4fc3f7',
  Weather: '#66bb6a',
  Communications: '#ffa726',
  Navigation: '#7c4dff',
};

export default function SatellitePanel({ satellites, selectedIds, onSelect, activeTab, simTime, isTracking }: SatellitePanelProps) {
  if (activeTab === 'about') {
    return (
      <div className="panel-section about-panel">
        <h3 className="panel-title">OrbitForge Satellite Tracker</h3>
        <p style={{ fontSize: 12, lineHeight: 1.7, color: 'var(--text-secondary)', marginBottom: 16 }}>
          A real-time 3D satellite tracking and visualization dashboard.
          Track satellites in low, medium, and geostationary Earth orbits
          with interactive globe controls.
        </p>

        <h3 className="panel-title" style={{ marginTop: 16 }}>Controls</h3>
        <div className="control-group">
          <div className="control-label">Drag globe <span className="control-value">Rotate view</span></div>
          <div className="control-label">Scroll <span className="control-value">Zoom in/out</span></div>
          <div className="control-label">Select <span className="control-value">Toggle satellite tracking</span></div>
        </div>

        <h3 className="panel-title" style={{ marginTop: 16 }}>Technology</h3>
        <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.8 }}>
          <div>• Three.js WebGL rendering</div>
          <div>• Keplerian orbit propagation</div>
          <div>• Real-time position simulation</div>
          <div>• GSAP-powered animations</div>
        </div>
      </div>
    );
  }

  if (activeTab === 'tracking') {
    const tracked = satellites.filter((s) => selectedIds.has(s.id));
    return (
      <div className="panel-section">
        <h3 className="panel-title">Tracking Status</h3>
        <div className="wasm-comparison" style={{ marginBottom: 12 }}>
          <div className="wasm-card" style={{ background: 'rgba(79,195,247,0.06)', borderColor: 'rgba(79,195,247,0.25)' }}>
            <div className="label">Tracked</div>
            <div className="time" style={{ color: '#4fc3f7', fontSize: 24 }}>{tracked.length}</div>
          </div>
          <div className="wasm-card" style={{ background: 'rgba(124,77,255,0.06)', borderColor: 'rgba(124,77,255,0.25)' }}>
            <div className="label">Sim Time</div>
            <div className="time" style={{ color: '#7c4dff', fontSize: 16 }}>{simTime.toFixed(1)}s</div>
          </div>
        </div>

        <h3 className="panel-title" style={{ marginTop: 12 }}>Tracked Satellites</h3>
        {tracked.length === 0 ? (
          <p style={{ fontSize: 12, color: 'var(--text-muted)', fontStyle: 'italic' }}>
            No satellites selected. Go to Satellites tab to select satellites.
          </p>
        ) : (
          <div className="file-list">
            {tracked.map((sat) => (
              <div key={sat.id} className="file-item active" style={{ cursor: 'default' }}>
                <span className="name">
                  <span className="track-color-dot" style={{ background: purposeColors[sat.purpose || ''] || '#4fc3f7' }} />
                  {sat.name}
                </span>
                <span className="size">{sat.apogee}km</span>
              </div>
            ))}
          </div>
        )}

        {isTracking && (
          <div className="lod-indicator" style={{ marginTop: 12 }}>
            <svg viewBox="0 0 16 16" fill="#4fc3f7" width="14" style={{ animation: 'pulse 1.5s ease-in-out infinite' }}>
              <circle cx="8" cy="8" r="3" />
            </svg>
            <span>Live tracking active</span>
            <div className="lod-bar">
              <div className="lod-bar-fill" style={{ width: `${((simTime % 90) / 90) * 100}%` }} />
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      <div className="panel-section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <h3 className="panel-title" style={{ margin: 0 }}>Satellite Catalog</h3>
          <span className="control-value">{satellites.length} total</span>
        </div>
        <div className="control-group">
          <input
            type="text"
            className="timeline-input"
            placeholder="Search satellites..."
            style={{ width: '100%' }}
          />
        </div>
      </div>

      <div className="panel-section">
        <div className="file-list">
          {satellites.map((sat) => {
            const isSelected = selectedIds.has(sat.id);
            return (
              <div
                key={sat.id}
                className={`file-item ${isSelected ? 'active' : ''}`}
                onClick={() => onSelect(sat.id)}
              >
                <span className="name">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => {}}
                    style={{ width: 16, height: 16, accentColor: '#4fc3f7' }}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <span className="track-color-dot" style={{ background: purposeColors[sat.purpose || ''] || '#4fc3f7' }} />
                  {sat.name}
                </span>
                <span className="size">{sat.status === 'active' ? '🟢' : '⚪'}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
