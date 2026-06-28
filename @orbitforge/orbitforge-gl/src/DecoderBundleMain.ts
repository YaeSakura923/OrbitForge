/* Copyright (C) 2025 orbitforge contributors */

/**
 * Web Worker script for decoding map data.
 *
 * This script runs in a Web Worker context and initializes the following services:
 * - VectorTileDecoderService: Handles vector tile decoding
 * - GeoJsonTilerService: Processes GeoJSON data
 * - TerrainTileDecoderService: Decodes terrain data
 *
 * The worker automatically starts all required services when loaded.
 *
 * @packageDocumentation
 */

import * as THREE from "three"
(self as any).THREE = THREE;

import { TerrainTileDecoderService } from "@orbitforge/orbitforge-terrain-datasource";
import {
    GeoJsonTilerService,
    VectorTileDecoderService
} from "@orbitforge/orbitforge-vectortile-datasource/index-worker";

if (!(self as any).THREE) {
    // eslint-disable-next-line no-console
    console.warn(
        "orbitforge-decoders.js: It looks like 'Three.js' is not loaded. This script requires 'THREE' " +
            "object to be defined. See https://github.com/YaeSakura923/OrbitForge."
    );
}

// Start all decoder services
VectorTileDecoderService.start();
GeoJsonTilerService.start();
TerrainTileDecoderService.start();
