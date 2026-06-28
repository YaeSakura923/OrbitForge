import React from 'react';

interface StatusBarProps {
  simTime: number;
  satCount: number;
  trackedCount: number;
}

export default function StatusBar({ simTime, satCount, trackedCount }: StatusBarProps) {
  const hours = Math.floor(simTime / 3600);
  const mins = Math.floor((simTime % 3600) / 60);
  const secs = Math.floor(simTime % 60);

  return (
    <div className="status-bar">
      <div className="status-left">
        <span className="status-item">
          <span className="status-dot" />
          OrbitForge v0.1
        </span>
      </div>
      <div className="status-right">
        <span className="status-item">{trackedCount}/{satCount} satellites tracked</span>
        <span className="status-divider" />
        <span className="status-item">Sim: T+{String(hours).padStart(2, '0')}:{String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}</span>
        <span className="status-divider" />
        <span className="status-item">
          <span className="status-indicator" style={{ background: trackedCount > 0 ? '#66bb6a' : '#6a6a8e' }} />
          {trackedCount > 0 ? 'Tracking' : 'Idle'}
        </span>
      </div>
    </div>
  );
}
