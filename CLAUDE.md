# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

KiCanvas is an **interactive**, **browser-based** viewer for [KiCAD](https://kicad.org) schematics and boards. It's a TypeScript library that can be embedded in websites using its API. KiCanvas is currently being ported from Web Components to React.

## Development Commands

```bash
# Install dependencies
npm install

# Development server - serves the project with auto-reload
npm run dev

# Build the project
npm run build

# Clean build artifacts
npm run clean

# Lint the code
npm run lint              # Run all linting checks
npm run lint:eslint       # ESLint only
npm run lint:types        # TypeScript type checking only
npm run lint:prettier     # Prettier formatting check only
npm run format            # Format code with Prettier

# Run tests
npm run test              # Run tests once
npm run test:watch        # Run tests in watch mode
npm run test:coverage     # Run tests with coverage reporting

# Build assets
npm run build:assets      # Build all assets
npm run build:font        # Build font assets
npm run build:sprites     # Build sprite assets
```

## Code Architecture

### Directory Structure

- `src/` - Source code
  - `base/` - Generic utilities (math, DOM, web components, etc.)
  - `kicad/` - KiCAD file parsers and data models
  - `graphics/` - Rendering engine (Canvas2D and WebGL)
  - `viewers/` - Document viewers (schematic, board, etc.)
  - `kc-ui/` - Generic UI components
  - `kicanvas/` - KiCanvas application and components
  - `services/` - File systems and services
  - `react/` - React components (migration in progress)
- `debug/` - Development and debug files
- `test/` - Test files
- `scripts/` - Build and development scripts
- `docs/` - Documentation

### Core Architecture

1. **File System Abstraction**: `VirtualFileSystem` provides a unified interface for accessing KiCAD files from different sources (local, GitHub, drag-and-drop).

2. **KiCAD Parsing**: KiCanvas uses custom parsers to read and interpret KiCAD files, converting them into structured objects.

3. **Rendering Engine**: KiCanvas uses both Canvas2D and WebGL rendering, with a WebGL-based renderer for better performance.

4. **Viewer System**: Viewers (`SchematicViewer`, `BoardViewer`) handle the visualization of KiCAD documents, managing layers and painting geometry.

5. **UI Components**: KiCanvas has a set of custom UI components built using Web Components, with a migration to React in progress.

6. **Project Management**: The `Project` class manages the overall project, including loading files, handling settings, and coordinating between different components.

### Key Concepts

1. **Parsers**: Convert KiCAD's s-expression format files into JavaScript objects
2. **Viewers**: Handle rendering and interaction with schematics and boards
3. **Painters**: Create WebGL geometry from KiCAD objects
4. **Layers**: Organize visual elements into layers that can be toggled
5. **Virtual File Systems**: Provide unified access to files from various sources

## Testing

KiCanvas uses the `@web/test-runner` for browser-based testing. Test files are located in the `test/` directory, and tests are written using the Mocha framework and Chai assertions.

## Build System

KiCanvas uses esbuild for fast bundling and compilation. The build process includes:
1. Compiling TypeScript
2. Bundling modules
3. Building assets (fonts, sprites)
4. Generating TypeScript type definitions