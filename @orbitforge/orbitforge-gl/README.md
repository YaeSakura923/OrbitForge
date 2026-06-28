# 🌍 OrbitForge

[![CI](https://img.shields.io/github/actions/workflow/status/YaeSakura923/orbitforge/ci.yaml?branch=master&style=for-the-badge&label=CI&logo=github)](https://github.com/YaeSakura923/OrbitForge/actions/workflows/ci.yaml)
[![Code Coverage](https://img.shields.io/codecov/c/github/YaeSakura923/orbitforge/master?style=for-the-badge&logo=codecov&labelColor=2c3e50)](https://codecov.io/gh/YaeSakura923/orbitforge)
[![NPM Version](https://img.shields.io/npm/v/@orbitforge/orbitforge-gl.svg?style=for-the-badge&logo=npm)](https://www.npmjs.com/package/@orbitforge/orbitforge-gl)
[![License](https://img.shields.io/npm/l/@orbitforge/orbitforge-gl.svg?style=for-the-badge)](https://github.com/YaeSakura923/OrbitForge/blob/master/LICENSE)
[![Downloads](https://img.shields.io/npm/dm/@orbitforge/orbitforge-gl.svg?style=for-the-badge&logo=npm)](https://www.npmjs.com/package/@orbitforge/orbitforge-gl)
[![Twitter](https://img.shields.io/badge/Twitter-@orbitforge-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white)](https://twitter.com/intent/tweet?text=Check%20out%20orbitforge%20-%20an%20awesome%203D%20map%20engine!)

**An open-source 3D map rendering engine built with TypeScript**

*Create high-performance, scalable 3D map visualization solutions using WebGL and Three.js*

[Quick Start](#quick-start) · [Documentation](https://YaeSakura923.github.io/OrbitForge/) · [Examples](https://YaeSakura923.github.io/OrbitForge/examples) 
<!-- · [Website](https://orbitforge.dev) -->

---

## Overview

`@orbitforge/orbitforge-gl` is the complete feature package of the orbitforge project, integrating all core modules to provide a fully functional 3D map rendering engine. The package is designed with modularity in mind, aiming to provide a high-performance, scalable, and modular 3D map rendering solution.

You can use this engine to:

- 🌍 **Develop visually appealing 3D maps** - Create immersive map experiences using WebGL technology
- 🎨 **Create highly animated and dynamic map visualizations** - Based on the popular [three.js](https://threejs.org/) library
- 🎨 **Create themeable maps with dynamic switching** - Support for multiple map styles and themes
- ⚡ **Create smooth map experiences** - Parallelize CPU-intensive tasks with Web Workers
- 🔧 **Modular map design** - Swap modules and data providers as needed

## Screenshots

<div align="center">

|  |  |  |
|:---:|:---:|:---:|
| ![3D Globe](https://raw.githubusercontent.com/YaeSakura923/OrbitForge/master/docs/static/screenshots/01-globe-view.png) | ![Terrain](https://raw.githubusercontent.com/YaeSakura923/OrbitForge/master/docs/static/screenshots/02-terrain-rendering.png) | ![Atmosphere](https://raw.githubusercontent.com/YaeSakura923/OrbitForge/master/docs/static/screenshots/08-atmosphere.png) |

|  |  |  |
|:---:|:---:|:---:|
| ![Controls](https://raw.githubusercontent.com/YaeSakura923/OrbitForge/master/docs/static/screenshots/06-interactive-controls.png) | ![Post-processing](https://raw.githubusercontent.com/YaeSakura923/OrbitForge/master/docs/static/screenshots/04-post-processing.png) | ![Animation](https://raw.githubusercontent.com/YaeSakura923/OrbitForge/master/docs/static/screenshots/09-animation.png) |

|  |  |  |
|:---:|:---:|:---:|
| ![Planar](https://raw.githubusercontent.com/YaeSakura923/OrbitForge/master/docs/static/screenshots/07-planar-map.png) | ![3D Tiles](https://raw.githubusercontent.com/YaeSakura923/OrbitForge/master/docs/static/screenshots/03-3dtiles-rendering.png) | ![Drawing](https://raw.githubusercontent.com/YaeSakura923/OrbitForge/master/docs/static/screenshots/16-drawing-controls.png) |

|  |  |  |
|:---:|:---:|:---:|
| ![New Feature 1](https://raw.githubusercontent.com/YaeSakura923/OrbitForge/master/docs/static/screenshots/Snip20250917_4.png) | ![New Feature 2](https://raw.githubusercontent.com/YaeSakura923/OrbitForge/master/docs/static/screenshots/Snip20251016_3.png) | ![New Feature 3](https://raw.githubusercontent.com/YaeSakura923/OrbitForge/master/docs/static/screenshots/Snip20251021_4.png) |

</div>

## Documentation Resources

- [Complete Documentation](https://YaeSakura923.github.io/OrbitForge) - API docs, tutorials, best practices
- [Example Collection](https://YaeSakura923.github.io/OrbitForge/examples) - Feature examples, code snippets
- [Development Guide](https://YaeSakura923.github.io/OrbitForge/docs/development/setup.html) - Environment setup, build instructions
- [Quick Start](https://YaeSakura923.github.io/OrbitForge/docs/getting-started/installation.html) - Installation, basic usage
- [Issue Reporting](https://github.com/YaeSakura923/OrbitForge/issues) - Bug reports, feature suggestions
- [Community Discussion](https://github.com/YaeSakura923/OrbitForge/discussions) - Technical exchange, usage help

## Quick Start

### System Requirements
- Node.js >= 22.15.0 (Check with: `node --version`)
- pnpm >= 9.0.0 (Check with: `pnpm --version`)

### Installation

**Using pnpm (recommended):**
```bash
pnpm add @orbitforge/orbitforge-gl
```

**Or using npm:**
```bash
npm install @orbitforge/orbitforge-gl
```

### Basic Usage

```typescript
import { 
    MapView, 
    GeoCoordinates, 
    MapControls, 
    sphereProjection,
    ArcGISWebTileDataSource 
} from "@orbitforge/orbitforge";

// Initialize map view
const mapView = new MapView({
    projection: sphereProjection,
    target: new GeoCoordinates(39.9042, 116.4074), // Beijing coordinates
    zoomLevel: 10,
    canvas: document.getElementById("mapCanvas")
});

// Create data source
const webTileDataSource = new ArcGISWebTileDataSource();

// Add data source to map
mapView.addDataSource(webTileDataSource);

// Add controls for user interaction
const mapControls = new MapControls(mapView);
```

## Core Features

- 🚀 **High-performance rendering**: Smooth 3D map rendering using WebGL and modern graphics technology
- 🔧 **Modular design**: Select and combine different functional modules as needed
- 🎨 **Extensible themes**: Support for dynamic switching and custom map themes
- 🗺️ **Multi-data source support**: Support for various map data source formats
- 🖱️ **Rich interaction features**: Complete map interaction and control functionality
- 🌍 **Multiple projection methods**: Support for spherical, planar, and ellipsoidal projections
- 🏔️ **Terrain support**: Built-in Digital Elevation Model (DEM) support

---

## License

Copyright © 2022-2025 [OrbitForge Contributors](https://github.com/YaeSakura923)

Licensed under the [Apache License, Version 2.0](https://github.com/YaeSakura923/OrbitForge/blob/main/LICENSE).