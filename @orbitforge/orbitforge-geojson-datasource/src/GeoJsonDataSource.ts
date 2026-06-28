/* Copyright (C) 2025 orbitforge contributors */

import {
    type OmvWithCustomDataProvider,
    type OmvWithRestClientParams,
    VectorTileDataSource
} from "@orbitforge/orbitforge-vectortile-datasource";

/**
 * `GeoJsonDataSource` is used for the visualization of geometric objects provided in the GeoJSON
 * format. To be able to render GeoJSON data, a `GeoJsonDataSource` instance must be added to the
 * {@link @orbitforge/orbitforge-mapview#MapView} instance.
 *
 * @example
 * ```typescript
 *    const geoJsonDataProvider = new GeoJsonDataProvider(
 *        "italy",
 *        new URL("resources/italy.json", window.location.href)
 *    );
 *    const geoJsonDataSource = new GeoJsonDataSource({
 *        dataProvider: geoJsonDataProvider,
 *        styleSetName: "geojson"
 *    });
 *    mapView.addDataSource(geoJsonDataSource);
 *   ```
 */
export class GeoJsonDataSource extends VectorTileDataSource {
    /**
     * Default constructor.
     *
     * @param params - Data source configuration's parameters.
     */
    constructor(params: OmvWithRestClientParams | OmvWithCustomDataProvider) {
        super({ styleSetName: "geojson", ...params });
    }
}
