/* Copyright (C) 2025 orbitforge contributors */

import { type TileKey } from "@orbitforge/orbitforge-geoutils";

/**
 * Defines a map tile metadata.
 */
export interface TileInfo {
    readonly tileKey: TileKey;
    readonly setupTime: number;
    readonly transferList?: ArrayBuffer[];
    readonly numBytes: number;
}
