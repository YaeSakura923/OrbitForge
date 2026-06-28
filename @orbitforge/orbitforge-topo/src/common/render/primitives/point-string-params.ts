/* Copyright (C) 2025 orbitforge contributors */



import { type VertexIndices } from "./vertex-indices";
import { type VertexTable } from "./vertex-table";

export interface PointStringParams {
    vertices: VertexTable;
    indices: VertexIndices;
    weight: number;
}
