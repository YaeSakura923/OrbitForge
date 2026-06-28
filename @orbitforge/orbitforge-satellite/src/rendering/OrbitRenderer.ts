import * as THREE from 'three';
import { TLEEntry } from '../tle/TLEParser';
import { SGP4Propagator } from '../propagation/SGP4Propagator';

export class OrbitRenderer {
  private group: THREE.Group;
  private orbitLines: Map<string, THREE.Line> = new Map();

  constructor(private scene: THREE.Scene) {
    this.group = new THREE.Group();
    this.scene.add(this.group);
  }

  addOrbit(tle: TLEEntry, color: string = '#4fc3f7'): void {
    const orbitPoints = SGP4Propagator.predictOrbit(tle, 360);
    const positions: number[] = [];

    for (const point of orbitPoints) {
      const r = 6371 + point.height;
      const latRad = point.latitude * Math.PI / 180;
      const lonRad = point.longitude * Math.PI / 180;

      positions.push(
        r * Math.cos(latRad) * Math.cos(lonRad),
        r * Math.cos(latRad) * Math.sin(lonRad),
        r * Math.sin(latRad),
      );
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));

    const material = new THREE.LineBasicMaterial({
      color: new THREE.Color(color),
      transparent: true,
      opacity: 0.6,
    });

    const line = new THREE.Line(geometry, material);
    this.group.add(line);
    this.orbitLines.set(tle.noradId.toString(), line);
  }

  removeOrbit(noradId: number): void {
    const line = this.orbitLines.get(noradId.toString());
    if (line) {
      this.group.remove(line);
      line.geometry.dispose();
      (line.material as THREE.Material).dispose();
      this.orbitLines.delete(noradId.toString());
    }
  }

  clear(): void {
    for (const [, line] of this.orbitLines) {
      this.group.remove(line);
      line.geometry.dispose();
      (line.material as THREE.Material).dispose();
    }
    this.orbitLines.clear();
  }

  dispose(): void {
    this.clear();
    this.scene.remove(this.group);
  }
}
