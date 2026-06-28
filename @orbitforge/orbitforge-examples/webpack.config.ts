/* Copyright (C) 2025 orbitforge contributors */

import CopyWebpackPlugin from "copy-webpack-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";
import * as path from "path";
import type { Configuration } from "webpack";
import { merge } from "webpack-merge";
import { createRequire } from "module";
import { fileURLToPath } from "url";

import { 
    createBaseConfig, 
    createDecoderConfig, 
    createAssetsConfig,
    FlywaveWebpackConfig
} from "@orbitforge/orbitforge-webpack-utils/scripts/WebpackConfig";

const require = createRequire(import.meta.url);

const webpack = require("webpack");
const glob = require("glob");

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const exampleFilter = process.env["FILTER_EXAMPLE"];

const orbitforgeMapThemePath = path.dirname(
    require.resolve("@orbitforge/orbitforge-map-theme/package.json")
);
const orbitforgeFontResourcesPath = path.dirname(
    require.resolve("@here/harp-fontcatalog/package.json")
);
const threePath = `${path.dirname(require.resolve("three"))}/three.cjs`;
const threeDracoPath = `${path.dirname(require.resolve("three"))}/../examples/jsm/libs`;

const themeList = {
    default: "resources/tilezen_base.json",
    berlinDay: "resources/tilezen_base.json",
    berlinReducedDay: "resources/berlin_tilezen_day_reduced.json",
    berlinReducedNight: "resources/berlin_tilezen_night_reduced.json",
    berlinStreets: "resources/berlin_tilezen_effects_streets.json",
    berlinOutlines: "resources/berlin_tilezen_effects_outlines.json"
};

interface CacheConfig {
    type: "filesystem";
    buildDependencies: {
        config: string[];
    };
    name: string;
}

function getCacheConfig(name: string): CacheConfig | false {
    // Use a separate cache for each configuration, otherwise cache writing fails.
    return process.env.NO_HARD_SOURCE_CACHE
        ? false
        : {
            type: "filesystem",
            buildDependencies: {
                config: [__filename]
            },
            name: "orbitforge-examples_" + name
        };
}

// 定义orbitforge-webpack-utils配置
const orbitforgeConfig: FlywaveWebpackConfig = {
    tsConfigPath: path.join(__dirname, "tsconfig.json"),
    projectRoot: path.resolve(__dirname, '../../'),
    enableTsconfigPaths: true,
    themePath: orbitforgeMapThemePath,
    fontResourcesPath: orbitforgeFontResourcesPath,
    threeDracoPath: threeDracoPath
};

// 使用orbitforge-webpack-utils创建基础配置
const commonConfig: Configuration = merge(createBaseConfig(orbitforgeConfig), {
    resolve: {
        alias: {
            "@orbitforge/orbitforge": path.resolve(__dirname, "../orbitforge/src/index.ts")
        },
    }, 
    output: {
        path: path.join(process.cwd(), "dist/examples"),
        filename: "[name].bundle.js", 
        libraryTarget: "module"
    },
    experiments: {
        outputModule: true
    },
    plugins: [
        new webpack.DefinePlugin({
            THEMES: JSON.stringify(themeList),
            FLYWAVE_BASE_URL: JSON.stringify("./"),
            CESIUM_ION_TOKEN: JSON.stringify(process.env.CESIUM_ION_TOKEN || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJlOTFkYWMzNC1mYjI1LTRlYTYtYTc2ZS04NWI1MTU2OTVlMDYiLCJpZCI6Mzg2NzksImlhdCI6MTY0MTE5NTAyNn0.4xsIJgYTK81yhRu67GG0x2FMit6zpYFCWsvWSwiFVV4'),
        })
    ]
});

const decoderConfig = merge(createDecoderConfig({
    ...orbitforgeConfig,
    decoderEntry: "./decoder/decoder.ts"
}), {
    target: "webworker",
    resolve: {
        alias: {
            three: threePath,
            "@orbitforge/orbitforge": path.resolve(__dirname, "../orbitforge/src")
        },
    },
    output: {
        filename: "orbitforge-decoders.js"
    },
    experiments: {
        outputModule: false
    }
});


const webpackEntries = glob
    .sync(path.join(__dirname, "./src/*.{ts,tsx}"))
    .reduce((result: Record<string, string>, entry: string) => {
        const name = path.basename(entry).replace(/.tsx?$/, "");
        if (name.startsWith("common")) {
            return result;
        }
        result[name] = entry;
        return result;
    }, {});

// 添加对新示例文件夹结构的支持
const exampleFolders = glob
    .sync(path.join(__dirname, "./src/*/index.ts"))
    .reduce((result: Record<string, string>, entry: string) => {
        const folderName = path.basename(path.dirname(entry));
        result[folderName] = entry;
        return result;
    }, {});

// 合并两种入口方式
Object.assign(webpackEntries, exampleFolders);

const htmlEntries = glob
    .sync(path.join(__dirname, "./src/*.html"))
    .reduce((result: Record<string, string>, entry: string) => {
        result[path.basename(entry).replace(/.html$/, "")] = entry;
        return result;
    }, {});

function filterExamples(pattern: string) {
    function filterEntries(entries: Record<string, string>) {
        Object.keys(entries).forEach(entryName => {
            if (!entryName.includes(pattern)) {
                delete entries[entryName];
            }
        });
    }
    filterEntries(webpackEntries);
    filterEntries(htmlEntries);
}

// Usage example:
//    FILTER_EXAMPLE=shadows yarn start
//
if (exampleFilter) {
    filterExamples(exampleFilter);
}

const browserConfig = merge(commonConfig, {
    //@ts-ignore
    devServer: {
        port: 8080,
        headers: { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Credentials": "true" }
    },
    entry: webpackEntries,
    output: {
        filename: "[name]_bundle.js",
        libraryTarget: "module"
    },
    externals: ["three"],
    optimization: {
        splitChunks: {
            chunks: "all",
            minSize: 1000,
            name: false // 使用 webpack 自动生成的名称，避免冲突
        }
    },
    cache: getCacheConfig("browser")
});

const exampleBrowserConfig = merge(commonConfig, {
    entry: {
        "example-browser": "./example-browser.ts"
    },
    output: {
        libraryTarget: "module"
    },
    cache: getCacheConfig("example_browser")
});
 
browserConfig.plugins!.push(
    ...Object.keys(browserConfig.entry as Record<string, string>).map(
        chunk =>
            new HtmlWebpackPlugin({
                title: "orbitforge",
                template: "template/example.html",
                chunks: [chunk],
                filename: `${chunk}.html`,
                scriptLoading: "module"
            })
    )
);

const allEntries = Object.assign({}, webpackEntries, htmlEntries);

/**
 * Generate example definitions for 'index.html' in following form:
 *
 * {
 *     [examplePage: string]: string // maps example page to example source
 * }
 */
const exampleDefs = Object.keys(allEntries).reduce(function (
    r: Record<string, string>,
    entry: string
) {
    r[entry + ".html"] = path.relative(__dirname, allEntries[entry]);
    return r;
},
    {});

interface CopyPattern {
    from: string;
    to?: string;
    toType?: "dir" | "file" | "template";
    transform?: (content: Buffer) => string | Buffer;
    globOptions?: {
        dot?: boolean;
        ignore?: string[];
    };
}

const srcFiles: CopyPattern[] = [
    ...glob.sync(path.join(__dirname, "src", "*.{ts,tsx,html}")).map(from => {
        return { from, to: "src/[name].[ext]" };
    }),
    ...glob.sync(path.join(__dirname, "src", "*/*/index.ts")).map(from => {
        const folderName = path.basename(path.dirname(from));
        return { from, to: `src/${folderName}/[name].[ext]` };
    }),
    ...glob.sync(path.join(__dirname, "src", "*/*/config.json")).map(from => {
        const folderName = path.basename(path.dirname(from));
        return { from, to: `src/${folderName}/[name].[ext]` };
    }),
    ...glob.sync(path.join(__dirname, "src", "*/*/assets/**/*")).map(from => {
        const folderName = path.basename(path.dirname(path.dirname(from)));
        const relativePath = path.relative(path.join(__dirname, "src", folderName, "assets"), from);
        return { from, to: `src/${folderName}/assets/${relativePath}` };
    })
];

const htmlFiles: CopyPattern[] = glob.sync(path.join(__dirname, "src/*.html")).map(from => {
    return {
        from,
        to: "[name].[ext]"
    };
});

// 添加额外的资源到配置中
const additionalAssets: Array<{ from: string; to: string; toType?: "dir" | "file" | "template" }> = [
    { from: path.join(__dirname, "resources"), to: "", toType: "dir" },
    { from: path.join(orbitforgeMapThemePath, "resources"), to: "resources", toType: "dir" },
    { from: path.join(orbitforgeMapThemePath, "resources"), to: "resources", toType: "dir" },
    { from: threeDracoPath, to: "resources/libs", toType: "dir" },
    {
        from: path.join(orbitforgeFontResourcesPath, "resources"),
        to: "resources/fonts",
        toType: "dir"
    },
    {
        from: __dirname + "/example-definitions.js.in",
        to: "example-definitions.js",
        toType: "file"
    },
    ...srcFiles.filter(asset => asset.to).map(asset => ({ from: asset.from, to: asset.to!, toType: asset.toType })),
    ...htmlFiles.filter(asset => asset.to).map(asset => ({ from: asset.from, to: asset.to!, toType: asset.toType })),
    { from: path.join(__dirname, "index.html"), to: "index.html" },
    { from: path.join(__dirname, "codebrowser.html"), to: "codebrowser.html" }
];

// 更新orbitforgeConfig中的additionalAssets
orbitforgeConfig.additionalAssets = additionalAssets;

// 为transform函数处理特殊内容
const assets = createAssetsConfig(orbitforgeConfig).map(asset => {
    if (asset.to === "example-definitions.js") {
        return {
            ...asset,
            transform: (content: Buffer) => {
                return content.toString().replace("{{EXAMPLES}}", JSON.stringify(exampleDefs, null, 4));
            }
        };
    }
    return asset;
});

browserConfig.plugins!.push(new CopyWebpackPlugin({ patterns: assets }));

const configs: Configuration[] = [
    decoderConfig,
    browserConfig,
    exampleBrowserConfig
];

export default configs;