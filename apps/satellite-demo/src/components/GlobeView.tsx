import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';

interface SatelliteData {
  id: number;
  name: string;
  inclination: number;
  raan: number;
  eccentricity: number;
  period: number;
  apogee: number;
  perigee: number;
}

interface GlobeViewProps {
  satellites: SatelliteData[];
  simTime: number;
}

const EARTH_RADIUS = 10;
const SATELLITE_SCALE = 0.3;

export default function GlobeView({ satellites, simTime }: GlobeViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const animRef = useRef<number>(0);
  const orbitsRef = useRef<Map<number, THREE.Line>>(new Map());
  const markersRef = useRef<Map<number, THREE.Mesh>>(new Map());
  const satPositionsRef = useRef<Map<number, number[]>>(new Map());
  const [hoveredSat, setHoveredSat] = useState<number | null>(null);
  const [globeReady, setGlobeReady] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.set(25, 12, 25);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x0a0e17, 0);
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const ambientLight = new THREE.AmbientLight(0x404060);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffffff, 1.5);
    sunLight.position.set(50, 30, 50);
    scene.add(sunLight);

    const fillLight = new THREE.DirectionalLight(0x4fc3f7, 0.3);
    fillLight.position.set(-30, -10, -30);
    scene.add(fillLight);

    const earthGroup = new THREE.Group();

    const earthGeo = new THREE.SphereGeometry(EARTH_RADIUS, 64, 64);
    const earthMat = new THREE.MeshPhongMaterial({
      color: 0x1a3a5c,
      emissive: 0x0a1628,
      emissiveIntensity: 0.3,
      specular: 0x333355,
      shininess: 15,
    });
    const earth = new THREE.Mesh(earthGeo, earthMat);
    earthGroup.add(earth);

    const atmosGeo = new THREE.SphereGeometry(EARTH_RADIUS * 1.01, 48, 48);
    const atmosMat = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vPosition;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        varying vec3 vPosition;
        void main() {
          vec3 viewDir = normalize(-vPosition);
          float intensity = pow(0.65 - dot(vNormal, viewDir), 3.0);
          gl_FragColor = vec4(0.3, 0.6, 1.0, intensity * 0.6);
        }
      `,
      transparent: true,
      side: THREE.FrontSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const atmos = new THREE.Mesh(atmosGeo, atmosMat);
    earthGroup.add(atmos);

    // Stars
    const starCount = 4000;
    const starGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(starCount * 3);
    const starSizes = new Float32Array(starCount);
    for (let i = 0; i < starCount * 3; i += 3) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 200 + Math.random() * 300;
      starPos[i] = r * Math.sin(phi) * Math.cos(theta);
      starPos[i + 1] = r * Math.cos(phi);
      starPos[i + 2] = r * Math.sin(phi) * Math.sin(theta);
      starSizes[i / 3] = 0.5 + Math.random() * 1.5;
    }
    starGeo.setAttribute('position', new THREE.Float32BufferAttribute(starPos, 3));
    starGeo.setAttribute('size', new THREE.Float32BufferAttribute(starSizes, 1));
    const starMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.5,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    });
    const stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);

    // Grid lines
    const gridMat = new THREE.LineBasicMaterial({ color: 0x1a3a5c, transparent: true, opacity: 0.3 });
    for (let lat = -80; lat <= 80; lat += 30) {
      const pts: number[] = [];
      const r = EARTH_RADIUS * 1.002;
      for (let lng = 0; lng <= 360; lng += 2) {
        const phi = (90 - lat) * Math.PI / 180;
        const theta = lng * Math.PI / 180;
        pts.push(r * Math.sin(phi) * Math.cos(theta), r * Math.cos(phi), r * Math.sin(phi) * Math.sin(theta));
      }
      const g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
      scene.add(new THREE.Line(g, gridMat));
    }
    for (let lng = 0; lng < 360; lng += 30) {
      const pts: number[] = [];
      const r = EARTH_RADIUS * 1.002;
      for (let lat = -90; lat <= 90; lat += 2) {
        const phi = (90 - lat) * Math.PI / 180;
        const theta = lng * Math.PI / 180;
        pts.push(r * Math.sin(phi) * Math.cos(theta), r * Math.cos(phi), r * Math.sin(phi) * Math.sin(theta));
      }
      const g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
      scene.add(new THREE.Line(g, gridMat));
    }

    scene.add(earthGroup);

    let rotSpeed = 0.05;
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let isDragging = false;
    let prevMouse = { x: 0, y: 0 };
    let autoRotate = true;

    renderer.domElement.addEventListener('mousedown', (e) => {
      isDragging = true;
      prevMouse = { x: e.clientX, y: e.clientY };
      autoRotate = false;
    });

    renderer.domElement.addEventListener('mousemove', (e) => {
      if (isDragging && cameraRef.current) {
        const dx = e.clientX - prevMouse.x;
        const dy = e.clientY - prevMouse.y;
        const cam = cameraRef.current;
        const radius = cam.position.length();
        const theta = Math.atan2(cam.position.x, cam.position.z);
        const phi = Math.acos(cam.position.y / radius);
        cam.position.x = radius * Math.sin(phi) * Math.cos(theta - dx * 0.005);
        cam.position.z = radius * Math.sin(phi) * Math.sin(theta - dx * 0.005);
        cam.position.y = Math.min(radius * 0.8, Math.max(-radius * 0.8, cam.position.y + dy * 0.05));
        cam.lookAt(0, 0, 0);
        prevMouse = { x: e.clientX, y: e.clientY };
      }
    });

    renderer.domElement.addEventListener('mouseup', () => {
      isDragging = false;
      setTimeout(() => { autoRotate = true; }, 3000);
    });

    renderer.domElement.addEventListener('wheel', (e) => {
      if (cameraRef.current) {
        const dir = cameraRef.current.position.clone().normalize();
        const dist = cameraRef.current.position.length();
        const newDist = Math.max(15, Math.min(60, dist + e.deltaY * 0.02));
        cameraRef.current.position.copy(dir.multiplyScalar(newDist));
        cameraRef.current.lookAt(0, 0, 0);
      }
    });

    function animate() {
      if (!scene || !camera || !renderer) return;
      animRef.current = requestAnimationFrame(animate);
      if (autoRotate && !isDragging) {
        earthGroup.rotation.y += rotSpeed * 0.01;
      }
      renderer.render(scene, camera);
    }

    animate();
    setGlobeReady(true);

    const handleResize = () => {
      if (!container || !camera || !renderer) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Compute satellite position from orbital elements
  const computeSatPosition = useCallback((sat: SatelliteData, time: number): number[] => {
    const a = (sat.apogee + sat.perigee) / 2 / EARTH_RADIUS + EARTH_RADIUS;
    const e = sat.eccentricity;
    const i = sat.inclination * Math.PI / 180;
    const raan = sat.raan * Math.PI / 180;
    const meanMotion = 2 * Math.PI / (sat.period * 60);
    const M = meanMotion * time * 60;

    // Solve Kepler's equation
    let E = M;
    for (let j = 0; j < 20; j++) {
      E = M + e * Math.sin(E);
    }

    const x = a * (Math.cos(E) - e);
    const y = a * Math.sqrt(1 - e * e) * Math.sin(E);

    const cosRaan = Math.cos(raan), sinRaan = Math.sin(raan);
    const cosI = Math.cos(i), sinI = Math.sin(i);

    return [
      (x * cosRaan - y * cosI * sinRaan),
      (x * sinRaan + y * cosI * cosRaan),
      y * sinI,
    ];
  }, []);

  useEffect(() => {
    if (!sceneRef.current || !globeReady) return;
    const scene = sceneRef.current;

    // Clear old orbits/markers
    const oldOrbits = Array.from(orbitsRef.current.values());
    const oldMarkers = Array.from(markersRef.current.values());
    oldOrbits.forEach((l) => { scene.remove(l); l.geometry.dispose(); (l.material as THREE.Material).dispose(); });
    oldMarkers.forEach((m) => { scene.remove(m); m.geometry.dispose(); (m.material as THREE.Material).dispose(); });
    orbitsRef.current.clear();
    markersRef.current.clear();
    satPositionsRef.current.clear();

    const satIds = new Set(satellites.map((s) => s.id));

    for (const sat of satellites) {
      const orbitPts: number[] = [];
      const steps = 180;
      for (let i = 0; i <= steps; i++) {
        const t = (i / steps) * sat.period * 60;
        const pos = computeSatPosition(sat, t);
        orbitPts.push(pos[0], pos[1], pos[2]);
      }

      const orbitGeo = new THREE.BufferGeometry();
      orbitGeo.setAttribute('position', new THREE.Float32BufferAttribute(orbitPts, 3));
      const colors = new Float32Array((steps + 1) * 3);
      for (let i = 0; i <= steps; i++) {
        const p = i / steps;
        colors[i * 3] = 0.31 * (1 - p) + 0.49 * p;
        colors[i * 3 + 1] = 0.76 * (1 - p) + 0.3 * p;
        colors[i * 3 + 2] = 0.97 * (1 - p) + 1.0 * p;
      }
      orbitGeo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

      const orbitMat = new THREE.LineBasicMaterial({
        vertexColors: true,
        transparent: true,
        opacity: 0.5,
      });
      const orbitLine = new THREE.Line(orbitGeo, orbitMat);
      scene.add(orbitLine);
      orbitsRef.current.set(sat.id, orbitLine);

      // Satellite marker
      const pos = computeSatPosition(sat, simTime);
      satPositionsRef.current.set(sat.id, pos);

      const markerGeo = new THREE.SphereGeometry(SATELLITE_SCALE, 12, 12);
      const markerMat = new THREE.MeshBasicMaterial({
        color: sat.id === 25544 ? 0x4fc3f7 : 0x7c4dff,
      });
      const marker = new THREE.Mesh(markerGeo, markerMat);
      marker.position.set(pos[0], pos[1], pos[2]);
      scene.add(marker);
      markersRef.current.set(sat.id, marker);

      // Glow ring around marker
      const glowGeo = new THREE.SphereGeometry(SATELLITE_SCALE * 2, 12, 12);
      const glowMat = new THREE.MeshBasicMaterial({
        color: sat.id === 25544 ? 0x4fc3f7 : 0x7c4dff,
        transparent: true,
        opacity: 0.2,
      });
      const glow = new THREE.Mesh(glowGeo, glowMat);
      glow.position.set(pos[0], pos[1], pos[2]);
      scene.add(glow);
      markersRef.current.set(-sat.id, glow);

      // Label sprite for ISS
      if (sat.id === 25544) {
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 64;
        const ctx = canvas.getContext('2d')!;
        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        ctx.beginPath();
        ctx.moveTo(8, 0); ctx.lineTo(248, 0); ctx.lineTo(248, 64); ctx.lineTo(8, 64);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 13px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('ISS', 128, 28);
        ctx.fillStyle = '#4fc3f7';
        ctx.font = '10px monospace';
        ctx.fillText('International Space Station', 128, 50);
        const texture = new THREE.CanvasTexture(canvas);
        const spriteMat = new THREE.SpriteMaterial({ map: texture, transparent: true, depthTest: false });
        const sprite = new THREE.Sprite(spriteMat);
        sprite.position.set(pos[0], pos[1] + 4, pos[2]);
        sprite.scale.set(6, 1.5, 1);
        scene.add(sprite);
        markersRef.current.set(-999, sprite as unknown as THREE.Mesh);
      }
    }
  }, [satellites, simTime, globeReady, computeSatPosition]);

  // Update marker positions
  useEffect(() => {
    if (!globeReady) return;
    for (const sat of satellites) {
      const pos = computeSatPosition(sat, simTime);
      const marker = markersRef.current.get(sat.id);
      if (marker) marker.position.set(pos[0], pos[1], pos[2]);
      const glow = markersRef.current.get(-sat.id);
      if (glow) glow.position.set(pos[0], pos[1], pos[2]);
      satPositionsRef.current.set(sat.id, pos);
    }
  }, [simTime, satellites, globeReady, computeSatPosition]);

  return (
    <div className="viewport-container" ref={containerRef}>
      {!globeReady && (
        <div className="viewport-loading">
          <div className="spinner" />
          <p>Initializing 3D Globe...</p>
        </div>
      )}
      <div className="viewport-hint">
        <span className="hint-badge">Drag to rotate</span>
        <span className="hint-badge">Scroll to zoom</span>
      </div>
      <div className="globe-legend">
        <span className="legend-item"><span className="legend-dot" style={{ background: '#4fc3f7' }} /> Low Earth Orbit</span>
        <span className="legend-item"><span className="legend-dot" style={{ background: '#7c4dff' }} /> Medium Earth Orbit</span>
        <span className="legend-item"><span className="legend-dot" style={{ background: '#ffa726' }} /> Geostationary</span>
      </div>
    </div>
  );
}
