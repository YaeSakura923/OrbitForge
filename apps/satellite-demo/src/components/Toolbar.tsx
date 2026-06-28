import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';

interface ToolbarProps {
  satCount: number;
  trackedCount: number;
  simTime: number;
  isTracking: boolean;
  onToggleTracking: () => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
}

export default function Toolbar({ satCount, trackedCount, simTime, isTracking, onToggleTracking, onSelectAll, onDeselectAll }: ToolbarProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      gsap.fromTo(ref.current, { y: -48, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, ease: 'power2.out' });
    }
  }, []);

  const handleBtnClick = (e: React.MouseEvent) => {
    gsap.fromTo(e.currentTarget as HTMLElement, { scale: 0.9 }, { scale: 1, duration: 0.2, ease: 'back.out(2)' });
  };

  return (
    <header className="toolbar" ref={ref}>
      <div className="toolbar-brand">
        <svg viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="14" cy="14" r="10" opacity="0.5" />
          <path d="M14 4v7M14 17v7M4 14h7M17 14h7" strokeWidth="1.2" opacity="0.4" />
          <circle cx="14" cy="14" r="3" opacity="0.6" />
          <path d="M14 7l4 4-4 4-4-4 4-4z" opacity="0.7" />
        </svg>
        <span>OrbitForge</span>
      </div>

      <div className="toolbar-actions">
        <div className="toolbar-group">
          <button className={`tb-btn ${isTracking ? 'active' : ''}`} onClick={(e) => { handleBtnClick(e); onToggleTracking(); }}>
            <svg viewBox="0 0 16 16" fill="currentColor"><circle cx="8" cy="8" r="3" /><path d="M8 1v2M8 13v2M1 8h2M13 8h2" stroke="currentColor" strokeWidth="1.5" /></svg>
            {isTracking ? 'Stop' : 'Track'}
          </button>
        </div>

        <div className="toolbar-group">
          <button className="tb-btn" onClick={(e) => { handleBtnClick(e); onSelectAll(); }}>All</button>
          <button className="tb-btn" onClick={(e) => { handleBtnClick(e); onDeselectAll(); }}>None</button>
        </div>

        <div className="toolbar-group">
          <div className="fps-counter" title="Simulation Time">
            T+{simTime.toFixed(0)}s
          </div>
          <div className="fps-counter" style={{ color: '#7c4dff', background: 'rgba(124,77,255,0.1)', border: '1px solid rgba(124,77,255,0.2)' }}>
            {trackedCount}/{satCount}
          </div>
        </div>
      </div>
    </header>
  );
}
