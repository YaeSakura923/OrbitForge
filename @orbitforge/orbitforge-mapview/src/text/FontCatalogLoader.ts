/* Copyright (C) 2025 orbitforge contributors */

import { type FontCatalogConfig } from "@orbitforge/orbitforge-datasource-protocol";
import { FontCatalog } from "@orbitforge/orbitforge-text-canvas";
import { LoggerManager } from "@orbitforge/orbitforge-utils";

const logger = LoggerManager.instance.create("FontCatalogLoader");

type FontCatalogCallback = (name: string, catalog: FontCatalog) => void;

export async function loadFontCatalog(
    fontCatalogConfig: FontCatalogConfig,
    onSuccess: FontCatalogCallback,
    onError?: (error: Error) => void
): Promise<void> {
    return await FontCatalog.load(fontCatalogConfig.url, 1024)
        .then<void>(onSuccess.bind(undefined, fontCatalogConfig.name))
        .catch((error: Error) => {
            logger.error("Failed to load FontCatalog: ", fontCatalogConfig.name, error);
            if (onError) {
                onError(error);
            }
        });
}
