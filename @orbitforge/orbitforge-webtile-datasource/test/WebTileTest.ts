/* Copyright (C) 2025 orbitforge contributors */

import { GeometryKind } from "@orbitforge/orbitforge-datasource-protocol";
import { mercatorProjection, TileKey } from "@orbitforge/orbitforge-geoutils";
import { type CopyrightInfo, type MapView, type Tile } from "@orbitforge/orbitforge-mapview";
import { LoggerManager } from "@orbitforge/orbitforge-utils";
import { expect } from "chai";
import * as sinon from "sinon";
import * as THREE from "three";

import { WebTileDataProvider, WebTileDataSource } from "../src/index";

describe("WebTileDataSource", function () {
    class FakeWebTileProvider extends WebTileDataProvider {
        getTexture = sinon.spy((tile: Tile) => {
            return Promise.resolve([{}, []] as unknown as [THREE.Texture, CopyrightInfo[]]);
        })
    };
    const fakeWebTileProvider = new FakeWebTileProvider({});
    const fakeMapView = {
        projection: mercatorProjection
    } as MapView;

    it("#createWebTileDataSource has default values", async function () {
        const webTileDataSource = new WebTileDataSource({
            dataProvider: fakeWebTileProvider
        });

        expect(webTileDataSource.maxDataLevel).to.equal(20);
        expect(webTileDataSource.minDataLevel).to.equal(1);
        expect(webTileDataSource.maxDisplayLevel).to.equal(20);
        expect(webTileDataSource.minDisplayLevel).to.equal(1);
        expect(webTileDataSource.resolution).to.equal(
            WebTileDataSource.resolutionValue.resolution512
        );
    });

    it("#createWebTileDataSource with 256px resolution", async function () {
        const webTileDataSource = new WebTileDataSource({
            dataProvider: fakeWebTileProvider,
            resolution: WebTileDataSource.resolutionValue.resolution256
        });
        expect(webTileDataSource.resolution).to.equal(
            WebTileDataSource.resolutionValue.resolution256
        );
    });

    it("#gets Texture for requested Tile", async function () {
        const webTileDataSource = new WebTileDataSource({
            dataProvider: fakeWebTileProvider
        });
        sinon.stub(webTileDataSource, "mapView").get(() => {
            return fakeMapView;
        });

        const tileKey = TileKey.fromRowColumnLevel(0, 0, 0);
        const tile = webTileDataSource.getTile(tileKey);
        await tile.load();
        expect(fakeWebTileProvider.getTexture.calledOnceWith(tile));
        expect(tile.hasGeometry).to.be.true;
    });

    it("# creates Tile with geometry for resolve with undefined", async function () {
        class UndefinedProvider extends WebTileDataProvider {
            getTexture = sinon.spy((tile: Tile) => {
                return Promise.resolve(undefined);
            })
        };

        const undefinedProvider = new UndefinedProvider({});

        const webTileDataSource = new WebTileDataSource({
            dataProvider: undefinedProvider
        });
        sinon.stub(webTileDataSource, "mapView").get(() => {
            return fakeMapView;
        });

        const tileKey = TileKey.fromRowColumnLevel(0, 0, 0);
        const tile = webTileDataSource.getTile(tileKey);
        await tile.load();
        expect(fakeWebTileProvider.getTexture.calledOnceWith(tile));
        expect(tile.hasGeometry).to.be.true;
    });

    it("# disposed tile for rejected Promise", async function () {
        const logger = LoggerManager.instance.getLogger("BaseTileLoader");
        let loggerWasEnabled = false;

        if (logger) {
            loggerWasEnabled = logger.enabled;
            logger.enabled = false;
        }

        class NoTextureProvider extends WebTileDataProvider {
            getTexture = sinon.spy((tile: Tile) => {
                return Promise.reject();
            })
        };

        const noTextureProvider = new NoTextureProvider({});

        const webTileDataSource = new WebTileDataSource({
            dataProvider: noTextureProvider
        });
        sinon.stub(webTileDataSource, "mapView").get(() => {
            return fakeMapView;
        });

        const tileKey = TileKey.fromRowColumnLevel(0, 0, 0);
        const tile = webTileDataSource.getTile(tileKey);
        await tile.load();
        expect(fakeWebTileProvider.getTexture.calledOnceWith(tile));
        expect(tile.disposed).to.be.true;

        LoggerManager.instance.enable("BaseTileLoader", loggerWasEnabled);
    });

    it("#createWebTileDataSource with renderingOptions opacity", async function () {
        const webTileDataSource = new WebTileDataSource({
            dataProvider: fakeWebTileProvider,
            renderingOptions: { opacity: 0.5 }
        });
        sinon.stub(webTileDataSource, "mapView").get(() => {
            return fakeMapView;
        });

        const tileKey = TileKey.fromRowColumnLevel(0, 0, 0);
        const tile = webTileDataSource.getTile(tileKey);
        await tile.load();
        expect(fakeWebTileProvider.getTexture.calledOnceWith(tile));
        expect(tile.objects).to.have.lengthOf(1);
        const obj = tile.objects[0];
        expect(obj).to.be.instanceOf(THREE.Mesh);
        expect(obj.userData).to.haveOwnProperty("kind");
        expect(obj.userData.kind).contains(GeometryKind.Background);
    });
});
