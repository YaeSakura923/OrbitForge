# Installation

This guide will help you install OrbitForge and its related dependencies.

## System Requirements

- Node.js: >=22.15.0
- pnpm: >=9.0.0 (recommended) or npm

## Installation Methods

### Using pnpm (Recommended)

```bash
pnpm add @orbitforge/OrbitForge
```

### Using npm

```bash
npm install @orbitforge/OrbitForge
```

## Usage in Browser

To use OrbitForge in a browser environment, include the library in your HTML:

```html
<!DOCTYPE html>
<html>
<head>
    <title>OrbitForge Example</title>
</head>
<body>
    <canvas id="mapCanvas"></canvas>
    <script src="node_modules/@orbitforge/OrbitForge/dist/OrbitForge.min.js"></script>
    <script>
        const mapView = new orbitforge.MapView({
            canvas: document.getElementById('mapCanvas')
        });
    </script>
</body>
</html>
```

## Module Import

For modern JavaScript/TypeScript projects, you can import modules directly:

```javascript
import { MapView } from '@orbitforge/OrbitForge';

const mapView = new MapView({
    canvas: document.getElementById('mapCanvas')
});
```

## Verification

To verify that the installation was successful:

```bash
# Check installed version
npm list @orbitforge/OrbitForge

```

## Troubleshooting

If you encounter any issues during installation:

1. Make sure your Node.js version meets the requirements
2. Clear npm/pnpm cache:
   ```bash
   npm cache clean --force
   # or
   pnpm store prune
   ```
3. Delete `node_modules` and reinstall:
   ```bash
   rm -rf node_modules
   pnpm install
   ```

For more detailed troubleshooting, please refer to our [documentation](../README.md) or [community support](https://github.com/YaeSakura923/OrbitForge/issues).