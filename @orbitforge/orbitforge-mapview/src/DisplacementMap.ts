/* Copyright (C) 2025 orbitforge contributors */

import { type GeoBox, type TileKey } from "@orbitforge/orbitforge-geoutils";
import type * as THREE from "three";

export interface DisplacementMap {
    xCountVertices: number;
    yCountVertices: number;
    buffer: Float32Array;
}

export interface TileDisplacementMap {
    tileKey: TileKey;
    texture: THREE.DataTexture;
    displacementMap: DisplacementMap;
    geoBox: GeoBox;
    uvMatrix?: THREE.Matrix3;
}
