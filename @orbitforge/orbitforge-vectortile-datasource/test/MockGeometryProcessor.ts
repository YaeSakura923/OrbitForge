/* Copyright (C) 2025 orbitforge contributors */

import { type ValueMap } from "@orbitforge/orbitforge-datasource-protocol";
import { type Vector3 } from "three";

import {
    type IGeometryProcessor,
    type ILineGeometry,
    type IPolygonGeometry
} from "../src/IGeometryProcessor";

export class MockGeometryProcessor implements IGeometryProcessor {
    storageLevelOffset?: number | undefined;
    processPointFeature(
        layerName: string,
        tileExtents: number,
        geometry: Vector3[],
        properties: ValueMap
    ): void {}

    processLineFeature(
        layerName: string,
        tileExtents: number,
        geometry: ILineGeometry[],
        properties: ValueMap
    ): void {}

    processPolygonFeature(
        layerName: string,
        tileExtents: number,
        geometry: IPolygonGeometry[],
        properties: ValueMap
    ): void {}
}
