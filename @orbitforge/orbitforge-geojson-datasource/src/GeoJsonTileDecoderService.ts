/* Copyright (C) 2025 orbitforge contributors */

import { LoggerManager } from "@orbitforge/orbitforge-utils";

const logger = LoggerManager.instance.create("WorkerService", { enabled: false });

/**
 * @deprecated GeoJsonTileDecoderService Use
 *             {@link @orbitforge/orbitforge-vectortile-datasource#VectorTileDecoderService} instead.
 */
export class GeoJsonTileDecoderService {
    /**
     * @deprecated GeoJsonTileDecoderService Use
     *             {@link @orbitforge/orbitforge-vectortile-datasource#VectorTileDecoderService} instead.
     */
    start() {
        logger.warn(
            "GeoJsonTileDecoderService class is deprecated, please use VectorTileDecoderService"
        );
    }
}
