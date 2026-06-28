/* Copyright (C) 2025 orbitforge contributors */

import { type MapView } from "./MapView";

export interface ITilesRenderer {
    connectMapView(mapView: MapView): void;
    disconnectMapView(): void;

    getMaxGeometryHeight(): number;
    getMinGeometryHeight(): number;
}
