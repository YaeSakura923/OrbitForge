/* Copyright (C) 2025 orbitforge contributors */

//    Mocha discourages using arrow functions, see https://mochajs.org/#arrow-functions

import { assert, expect } from "chai";
import * as THREE from "three";

import { type BufferAttribute, type Geometry } from "../src/DecodedTile";
import { ThreeBufferUtils } from "../src/ThreeBufferUtils";

describe("ThreeBufferUtils", function () {
    function bufferElementSize(type: string) {
        switch (type) {
            case "int8":
                return 1;
            case "uint8":
                return 1;
            case "int16":
                return 2;
            case "uint16":
                return 2;
            case "int32":
                return 4;
            case "uint32":
                return 4;
            case "float":
                return 4;
        }
        throw new Error("Unknown buffer element type");
    }
    function compareBufferAttribute(
        threeBufferAttribute: THREE.BufferAttribute,
        orbitforgeBufferAttribute: BufferAttribute
    ) {
        expect(threeBufferAttribute.itemSize).to.be.equal(orbitforgeBufferAttribute.itemCount);
        const itemSize = bufferElementSize(orbitforgeBufferAttribute.type);
        expect(threeBufferAttribute.array.length).to.be.equal(
            orbitforgeBufferAttribute.buffer.byteLength / itemSize
        );
        expect(threeBufferAttribute.normalized).to.be.equal(orbitforgeBufferAttribute.normalized);
    }

    function compareBufferGeometry(
        threeBufferGeometry: THREE.BufferGeometry,
        orbitforgeBufferGeometry: Geometry
    ) {
        if (threeBufferGeometry.index === null) {
            assert(orbitforgeBufferGeometry.index === undefined);
        } else {
            assert(orbitforgeBufferGeometry.index !== undefined);
            compareBufferAttribute(threeBufferGeometry.index, orbitforgeBufferGeometry.index!);
        }
        for (const attrName in threeBufferGeometry.attributes) {
            if (!threeBufferGeometry.hasOwnProperty(attrName)) {
                continue;
            }
            const threeAttr = threeBufferGeometry.attributes[attrName];
            assert(threeAttr !== undefined);
            if (threeAttr.array === undefined) {
                // TODO: Check InterleavedBufferAttribute as well
                continue;
            }
            const threeBufferAttribute = threeAttr as THREE.BufferAttribute;
            const orbitforgeAttr = orbitforgeBufferGeometry.vertexAttributes?.find(
                (buf: BufferAttribute) => {
                    return buf.name === attrName;
                }
            );
            assert(orbitforgeAttr !== undefined);
            compareBufferAttribute(threeBufferAttribute, orbitforgeAttr!);
        }
    }
    it("convert buffer geometry w/ index buffer", function () {
        const threeBufferGeometry = new THREE.BoxGeometry();
        const techniqueIndex = 42;

        const orbitforgeBufferGeometry = ThreeBufferUtils.fromThreeBufferGeometry(
            threeBufferGeometry,
            techniqueIndex
        );

        compareBufferGeometry(threeBufferGeometry, orbitforgeBufferGeometry);
    });
    it("convert buffer geometry w/o index buffer", function () {
        const threeBufferGeometry = new THREE.BufferGeometry();
        const vertices = new Array<number>(30);
        const normals = new Array<number>(30);
        const uvs = new Array<number>(20);

        threeBufferGeometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
        threeBufferGeometry.setAttribute("normal", new THREE.Float32BufferAttribute(normals, 3));
        threeBufferGeometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));

        const techniqueIndex = 42;

        const orbitforgeBufferGeometry = ThreeBufferUtils.fromThreeBufferGeometry(
            threeBufferGeometry,
            techniqueIndex
        );

        compareBufferGeometry(threeBufferGeometry, orbitforgeBufferGeometry);
    });
});
