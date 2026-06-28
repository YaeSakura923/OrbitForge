/* Copyright (C) 2025 orbitforge contributors */

import { type GeoCoordinates, GeoBox } from "@orbitforge/orbitforge-geoutils";
import { type Variogram } from "@orbitforge/orbitforge-kriging-gl";
import type * as THREE from "three";

/**
 * Render options interface
 */
export interface RenderOptions {
    width?: number;
    height?: number;
    flipY?: boolean;
}

/**
 * Ground modification result interface
 */
export interface GroundModificationResult {
    image: ImageData;
    krigingPoints: GeoCoordinates[];
    variogram: Variogram;
}

/**
 * Geometry creation result interface
 */
export interface GeometryResult {
    geometry: THREE.BufferGeometry;
    position: THREE.Vector3;
}

/**
 * Distance texture result interface
 */
export interface DistanceTextureResult {
    renderTarget: THREE.WebGLRenderTarget | null;
    distanceTexture: THREE.Texture;
}
