# @orbitforge/orbitforge-inspector

A debugging and monitoring panel for orbitforge MapView using dat.GUI.

## Overview

This package provides a comprehensive debugging and monitoring solution for orbitforge MapView instances. It displays real-time performance metrics and runtime information through an intuitive dat.GUI interface. The inspector is designed with a modular architecture to allow easy extension and customization.

## Features

### Performance Monitoring
- Real-time FPS display
- Frame rendering time statistics
- Average, minimum, and maximum FPS tracking

### Camera Information
- Current zoom level
- Tilt and heading angles
- Geographic coordinates (latitude, longitude, altitude)
- Camera near/far plane distances
- Field of view

### Rendering Statistics
- WebGL draw calls
- Triangle, line, and point counts
- Program and texture usage
- Geometry statistics
- Pixel ratio information

### Memory Usage
- JavaScript heap size monitoring
- Memory usage and limits

### Tile Management
- Rendered tile count
- Visible tile count
- Loading tile count
- Cache size and limits

### Data Source Status
- Total data source count
- Connected data sources
- Enabled data sources

### Text Rendering
- Label rendering status
- Label delay settings

### Animation State
- Animation activity
- Camera movement detection
- Throttling status

### Environment Information
- Projection type
- Theme information
- Pixel-to-world conversion ratios

### Fog Effect Control
- Enable/disable fog rendering
- Adjust fog color
- Control fog density and range

## Installation

This package is part of the orbitforge monorepo and is intended to be used within the workspace.

## Usage

### Basic Usage

```typescript
import { MapView } from "@orbitforge/orbitforge-mapview";
import { ModularMapViewMonitor } from "@orbitforge/orbitforge-inspector";

// Create your MapView instance
const mapView = new MapView({
    canvas: document.getElementById("mapCanvas") as HTMLCanvasElement,
    // ... other options
});

// Initialize the inspector
const monitor = new ModularMapViewMonitor(mapView);

// Control the panel visibility
monitor.open();   // Show the inspector panel
monitor.close();  // Hide the inspector panel
monitor.dispose(); // Clean up resources
```

### With Existing dat.GUI

```typescript
import * as dat from "dat.gui";
import { ModularMapViewMonitor } from "@orbitforge/orbitforge-inspector";

const gui = new dat.GUI();
const monitor = new ModularMapViewMonitor(mapView, gui);
```

## Modular Architecture

The inspector is built with a modular architecture that allows for easy extension and customization:

### Core Modules

1. **PerformanceModule** - Handles FPS and frame timing
2. **CameraModule** - Manages camera-related information
3. **RenderingModule** - WebGL rendering statistics
4. **MemoryModule** - Memory usage tracking
5. **TileModule** - Tile loading and caching information
6. **DataSourceModule** - Data source status tracking
7. **TextModule** - Text rendering controls
8. **AnimationModule** - Animation state monitoring
9. **EnvironmentModule** - Environmental settings
10. **FogModule** - Fog effect controls
11. **GroundModificationModule** - Ground modification kriging options

### Creating Custom Modules

To create a custom module:

```typescript
// custom-module.ts
import { MapView } from "@orbitforge/orbitforge-mapview";
type GUI = any;

export interface CustomData {
    customValue: number;
}

export class CustomModule {
    private mapView: MapView;
    
    constructor(mapView: MapView) {
        this.mapView = mapView;
    }
    
    setupFolder(gui: GUI): GUI {
        return gui.addFolder("🔧 Custom");
    }
    
    createData(): CustomData {
        return {
            customValue: 0
        };
    }
    
    updateData(data: CustomData): void {
        // Update your custom data here
        data.customValue = this.calculateCustomValue();
    }
    
    bindControls(folder: GUI, data: CustomData): void {
        folder.add(data, "customValue").name("Custom Value").listen().disable();
    }
    
    private calculateCustomValue(): number {
        // Your custom calculation logic
        return 42;
    }
}
```

Then integrate it into the main monitor class:

```typescript
// extended-inspector.ts
import { ModularMapViewMonitor } from "@orbitforge/orbitforge-inspector";
import { CustomModule, CustomData } from "./custom-module";

type GUI = any;

export class ExtendedMapViewInspector extends ModularMapViewMonitor {
    private customModule: CustomModule;
    private customData: CustomData;
    private customFolder: GUI;
    
    constructor(mapView: MapView, parentGui?: GUI) {
        super(mapView, parentGui);
        
        // Initialize custom module
        this.customModule = new CustomModule(mapView);
        this.customData = this.customModule.createData();
        this.customFolder = this.customModule.setupFolder(this.getGUI());
        this.customModule.bindControls(this.customFolder, this.customData);
        this.customFolder.close();
    }
    
    private update() {
        super.update();
        this.customModule.updateData(this.customData);
    }
}
```

## Project Structure

```
@orbitforge/orbitforge-inspector/
├── src/
│   ├── monitor/
│   │   ├── MapViewMonitor.ts          # Legacy monolithic inspector
│   │   └── ModularMapViewMonitor.ts   # Modular inspector implementation
│   ├── modules/
│   │   ├── PerformanceModule.ts
│   │   ├── CameraModule.ts
│   │   ├── RenderingModule.ts
│   │   ├── MemoryModule.ts
│   │   ├── TileModule.ts
│   │   ├── DataSourceModule.ts
│   │   ├── TextModule.ts
│   │   ├── AnimationModule.ts
│   │   ├── EnvironmentModule.ts
│   │   ├── FogModule.ts               # Fog effect data module
│   │   ├── FogGUIModule.ts            # Fog effect GUI controls
│   │   ├── PostProcessingModule.ts
│   │   └── PostProcessingGUIModule.ts
│   ├── example/
│   │   ├── inspector-example.ts
│   │   └── inspector-example.html
│   └── index.ts                       # Public API exports
├── package.json
├── tsconfig.json
└── webpack.config.ts
```

## API

### ModularMapViewMonitor

#### Constructor
```typescript
new ModularMapViewMonitor(mapView: MapView, parentGui?: GUI)
```

#### Methods
- `dispose()` - Clean up resources
- `open()` - Open the inspector panel
- `close()` - Close the inspector panel
- `getGUI(): GUI` - Get the GUI instance

#### Module Accessors
- `getPerformanceFolder(): GUI`
- `getCameraFolder(): GUI`
- `getRenderingFolder(): GUI`
- `getMemoryFolder(): GUI`
- `getTileFolder(): GUI`
- `getDataSourceFolder(): GUI`
- `getTextFolder(): GUI`
- `getAnimationFolder(): GUI`
- `getEnvironmentFolder(): GUI`
- `getPostProcessingFolder(): GUI`
- `getFogFolder(): GUI`
- `getGroundModificationFolder(): GUI`
- `getEnvironmentFolder(): GUI`
- `getFogFolder(): GUI` - Access the fog controls folder
- `getPostProcessingFolder(): GUI`

## Dependencies

- `@orbitforge/orbitforge-mapview` - The main orbitforge mapping library
- `dat.gui` - Interface for controlling parameters in JavaScript

## License

This project is licensed under the Apache 2.0 License. See the LICENSE file in the root of the orbitforge repository for details.