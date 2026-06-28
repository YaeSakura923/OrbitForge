/* Copyright (C) 2025 orbitforge contributors */

import { mapAssetsUriResolver, mapBundleMain } from "./BundleMain";

if (!(window as any).THREE) {
    // eslint-disable-next-line no-console
    console.warn(
        "orbitforge.js: It looks like 'three.js' is not loaded. This script requires 'THREE' object to " +
        "be defined. See https://github.com/YaeSakura923/OrbitForge/@orbitforge/orbitforge-mapview."
    );
}

import { MapView as RawMapView, MapViewOptions } from "@orbitforge/orbitforge-mapview";

export * from "@orbitforge/orbitforge-mapview";
export * from "@orbitforge/orbitforge-mapview-decoder";
export * from "@orbitforge/orbitforge-terrain-datasource";
export * from "@orbitforge/orbitforge-map-controls";
export * from "@orbitforge/orbitforge-3dtile-datasource";
export * from "@orbitforge/orbitforge-datasource-protocol";
export * from "@orbitforge/orbitforge-draw-controls";
export * from "@orbitforge/orbitforge-webtile-datasource";
export * from "@orbitforge/orbitforge-geoutils";
export * from "@orbitforge/orbitforge-features-datasource";
export * from "@orbitforge/orbitforge-geojson-datasource";
export * from "@orbitforge/orbitforge-utils";
export * from "@orbitforge/orbitforge-vectortile-datasource";
export * from "@orbitforge/orbitforge-inspector";
export * from "@orbitforge/orbitforge-gltf";
export * from "@orbitforge/orbitforge-transfer-manager";
export * from "@orbitforge/orbitforge-geometry";
export {
    FontCatalog,
    TextCanvas,
    ContextualArabicConverter,
    TextRenderStyle,
    TextLayoutStyle,
    FontStyle,
    FontUnit,
    FontVariant,
    VerticalAlignment,
    HorizontalAlignment
} from "@orbitforge/orbitforge-text-canvas";

export class MapView extends RawMapView {
    constructor(options: Omit<MapViewOptions, "uriResolver">) {
        super({
            ...options,
            uriResolver: mapAssetsUriResolver
        });
    }
}
mapBundleMain();
