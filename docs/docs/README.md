# 🌍 Flywave.gl

[![CI](https://img.shields.io/github/actions/workflow/status/flywave/OrbitForge/ci.yaml?branch=master&style=for-the-badge&label=CI&logo=github)](https://github.com/flywave/OrbitForge/actions/workflows/ci.yaml)
[![Code Coverage](https://img.shields.io/codecov/c/github/flywave/OrbitForge/master?style=for-the-badge&logo=codecov&labelColor=2c3e50)](https://codecov.io/gh/flywave/OrbitForge)
[![Twitter](https://img.shields.io/badge/Twitter-@OrbitForge-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white)](https://twitter.com/intent/tweet?text=Check%20out%20OrbitForge%20-%20an%20awesome%203D%20map%20engine!)

**An open-source 3D map rendering engine built with TypeScript**

*Create high-performance, scalable 3D map visualization solutions using WebGL and Three.js*

[Quick Start](#quick-start) · [Documentation](https://flywave.github.io/OrbitForge/) · [Examples](https://flywave.github.io/OrbitForge/examples) 
<!-- · [Website](https://orbitforge.dev) -->

---

## Overview

`OrbitForge` is an open-source 3D map rendering engine built with TypeScript. This project adopts a modular monorepo architecture, aiming to provide a high-performance, scalable, and modular 3D map rendering solution.

You can use this engine to:

- 🌍 **Develop visually appealing 3D maps** - Create immersive map experiences using WebGL technology
- 🎨 **Create highly animated and dynamic map visualizations** - Based on the popular [three.js](https://threejs.org/) library
- 🎨 **Create themeable maps with dynamic switching** - Support for multiple map styles and themes
- ⚡ **Create smooth map experiences** - Parallelize CPU-intensive tasks with Web Workers
- 🔧 **Modular map design** - Swap modules and data providers as needed

## Screenshots

<div align="center">

|  |  |  |
| :----------------------------------------------------------: | :----------------------------------------------------------: | :----------------------------------------------------------: |
| <img src="https://raw.githubusercontent.com/flywave/OrbitForge/master/docs/static/screenshots/01-globe-view.png" alt="Globe View" width="200" /> | <img src="https://raw.githubusercontent.com/flywave/OrbitForge/master/docs/static/screenshots/02-terrain-rendering.png" alt="Terrain Rendering" width="200" /> | <img src="https://raw.githubusercontent.com/flywave/OrbitForge/master/docs/static/screenshots/03-3dtiles-rendering.png" alt="3D Tiles Rendering" width="200" /> |
|  |  |  |
| <img src="https://raw.githubusercontent.com/flywave/OrbitForge/master/docs/static/screenshots/04-post-processing.png" alt="Post Processing" width="200" /> | <img src="https://raw.githubusercontent.com/flywave/OrbitForge/master/docs/static/screenshots/06-interactive-controls.png" alt="Interactive Controls" width="200" /> | <img src="https://raw.githubusercontent.com/flywave/OrbitForge/master/docs/static/screenshots/07-planar-map.png" alt="Planar Map" width="200" /> |
|  |  |  |
| <img src="https://raw.githubusercontent.com/flywave/OrbitForge/master/docs/static/screenshots/08-atmosphere.png" alt="Atmosphere Effect" width="200" /> | <img src="https://raw.githubusercontent.com/flywave/OrbitForge/master/docs/static/screenshots/09-animation.png" alt="Animation System" width="200" /> | <img src="https://raw.githubusercontent.com/flywave/OrbitForge/master/docs/static/screenshots/11-lighting.png" alt="Lighting System" width="200" /> |
|  |  |  |
| <img src="https://raw.githubusercontent.com/flywave/OrbitForge/master/docs/static/screenshots/Snip20250917_4.png" alt="New Feature 1" width="200" /> | <img src="https://raw.githubusercontent.com/flywave/OrbitForge/master/docs/static/screenshots/Snip20251016_3.png" alt="New Feature 2" width="200" /> | <img src="https://raw.githubusercontent.com/flywave/OrbitForge/master/docs/static/screenshots/Snip20251021_4.png" alt="New Feature 3" width="200" /> |

</div>

## Documentation

- [Complete Documentation](https://flywave.github.io/OrbitForge) - API docs, tutorials, best practices
- [Example Collection](https://flywave.github.io/OrbitForge/examples) - Feature examples, code snippets
- [Development Guide](./development/setup.md) - Environment setup, build instructions
- [Quick Start](./getting-started/installation.md) - Installation, basic usage
- [Issue Reporting](https://github.com/flywave/OrbitForge/issues) - Bug reports, feature suggestions
- [Community Discussion](https://github.com/flywave/OrbitForge/discussions) - Technical exchange, usage help

## Quick Start

### System Requirements
- Node.js >= 22.15.0 (Check with: `node --version`)
- pnpm >= 9.0.0 (Check with: `pnpm --version`)

### Installation

**Using pnpm (recommended):**
```bash
pnpm add @orbitforge/OrbitForge
```

**Or using npm:**
```bash
npm install @orbitforge/OrbitForge
```

### Basic Usage

```typescript
import { MapView, GeoCoordinates, sphereProjection } from "@orbitforge/orbitforge-gl";

const mapView = new MapView({
  projection: sphereProjection,
  target: new GeoCoordinates(36, 118),
  zoomLevel: 6,
  canvas: document.getElementById("mapCanvas") as HTMLCanvasElement
});
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

Copyright © 2022-2025 [Flywave Project Authors](https://github.com/flywave)

Licensed under the [Apache License, Version 2.0](https://github.com/flywave/OrbitForge/blob/main/LICENSE).