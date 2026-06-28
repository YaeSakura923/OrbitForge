import * as THREE from 'three';
import { TrackedSatellite } from '../tracking/SatelliteTracker';
import { SGP4Propagator } from '../propagation/SGP4Propagator';

export interface MarkerStyle {
  color: string;
  size: number;
  pulseEnabled: boolean;
}

export class SatelliteMarker {
  private markers: Map<string, THREE.Mesh> = new Map();
  private labels: Map<string, THREE.Sprite> = new Map();
  private group: THREE.Group;

  constructor(private scene: THREE.Scene) {
    this.group = new THREE.Group();
    this.scene.add(this.group);
  }

  createMarker(sat: TrackedSatellite, style?: Partial<MarkerStyle>): void {
    const color = style?.color || '#4fc3f7';
    const size = style?.size || 1.5;

    const pos = SGP4Propagator.eciToPositionVector(sat.currentState);

    const geometry = new THREE.SphereGeometry(size, 16, 16);
    const material = new THREE.MeshBasicMaterial({
      color: new THREE.Color(color),
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(pos[0], pos[1], pos[2]);
    this.group.add(mesh);
    this.markers.set(sat.info.id, mesh);

    this.createLabel(sat, pos);
  }

  private createLabel(sat: TrackedSatellite, pos: number[]): void {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    canvas.width = 256;
    canvas.height = 64;

    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    ctx.beginPath();
    ctx.moveTo(8, 0);
    ctx.lineTo(248, 0);
    ctx.quadraticCurveTo(256, 0, 256, 8);
    ctx.lineTo(256, 56);
    ctx.quadraticCurveTo(256, 64, 248, 64);
    ctx.lineTo(8, 64);
    ctx.quadraticCurveTo(0, 64, 0, 56);
    ctx.lineTo(0, 8);
    ctx.quadraticCurveTo(0, 0, 8, 0);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(sat.info.name, 128, 28);

    ctx.fillStyle = '#4fc3f7';
    ctx.font = '11px monospace';
    ctx.fillText(`NORAD: ${sat.tle.noradId}`, 128, 50);

    const texture = new THREE.CanvasTexture(canvas);
    const spriteMaterial = new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      depthTest: false,
    });

    const sprite = new THREE.Sprite(spriteMaterial);
    sprite.position.set(pos[0], pos[1] + 10, pos[2]);
    sprite.scale.set(8, 2, 1);
    this.group.add(sprite);
    this.labels.set(sat.info.id, sprite);
  }

  updatePosition(sat: TrackedSatellite): void {
    const pos = SGP4Propagator.eciToPositionVector(sat.currentState);

    const mesh = this.markers.get(sat.info.id);
    if (mesh) {
      mesh.position.set(pos[0], pos[1], pos[2]);
    }

    const label = this.labels.get(sat.info.id);
    if (label) {
      label.position.set(pos[0], pos[1] + 10, pos[2]);
    }
  }

  removeMarker(id: string): void {
    const mesh = this.markers.get(id);
    if (mesh) {
      this.group.remove(mesh);
      mesh.geometry.dispose();
      (mesh.material as THREE.Material).dispose();
      this.markers.delete(id);
    }

    const label = this.labels.get(id);
    if (label) {
      this.group.remove(label);
      label.material.map?.dispose();
      label.material.dispose();
      this.labels.delete(id);
    }
  }

  clear(): void {
    for (const id of this.markers.keys()) {
      this.removeMarker(id);
    }
  }

  dispose(): void {
    this.clear();
    this.scene.remove(this.group);
  }
}
