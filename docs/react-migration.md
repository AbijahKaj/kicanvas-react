# KiCanvas React Components Migration Guide

## Overview

KiCanvas now provides a complete React component library as the recommended way to embed KiCanvas functionality in your applications. The React components offer the same functionality as the web components but with better TypeScript support, improved developer experience, and React-specific optimizations.

## Quick Start

### Basic Embedding

```jsx
import React from "react";
import { KiCanvasEmbed } from "kicanvas";

function MyApp() {
    return (
        <KiCanvasEmbed
            src="path/to/your/project.kicad_pro"
            controls="full"
            style={{ width: "100%", height: "600px" }}
        />
    );
}
```

### Standalone Application

```jsx
import React from "react";
import { KiCanvasShell } from "kicanvas";

function MyKiCanvasApp() {
    return <KiCanvasShell style={{ width: "100vw", height: "100vh" }} />;
}
```

## Component Library

### Main Application Components

#### KiCanvasEmbed

The main embedding component for KiCanvas projects.

```jsx
<KiCanvasEmbed
    src="project.kicad_pro"
    controls="full"
    theme="dark"
    zoom="objects"
    onLoad={(project) => console.log("Project loaded:", project)}
/>
```

Props:

-   `src`: string - Path to the KiCAD project file
-   `sources`: KiCanvasSource[] - Additional source files
-   `controls`: 'none' | 'basic' | 'full' - Control level
-   `controlslist`: string - Custom control list
-   `theme`: string - Theme name
-   `zoom`: 'objects' | 'page' | string - Zoom level

#### KiCanvasShell

Standalone application shell with file loading interface.

```jsx
<KiCanvasShell />
```

### UI Components

#### Layout Components

```jsx
import { App, SplitView, View, ActivitySideBar } from "kicanvas";

<App>
    <SplitView direction="horizontal">
        <View shrink>
            <ActivitySideBar
                activities={[
                    {
                        name: "Explorer",
                        icon: "folder",
                        content: <div>File explorer content</div>,
                    },
                    {
                        name: "Search",
                        icon: "search",
                        content: <div>Search content</div>,
                    },
                ]}
            />
        </View>
        <View grow>
            <div>Main content area</div>
        </View>
    </SplitView>
</App>;
```

#### Basic UI Components

```jsx
import { Button, Icon, Panel, Menu, Range } from 'kicanvas';

// Buttons
<Button variant="outline" icon="add" onClick={handleClick}>
    Add Item
</Button>

// Icons
<Icon name="settings" />
<Icon name="svg:custom-icon" /> {/* SVG sprite icon */}

// Panels
<Panel>
    <PanelTitle>Settings</PanelTitle>
    <PanelBody>
        <PanelLabel>Theme</PanelLabel>
        <Range
            min={0}
            max={100}
            value={value}
            onChange={setValue}
        />
    </PanelBody>
</Panel>

// Menus
<Menu>
    <MenuItem selected>Option 1</MenuItem>
    <MenuItem>Option 2</MenuItem>
    <MenuLabel>Section</MenuLabel>
    <MenuItem>Option 3</MenuItem>
</Menu>
```

## Context System

The React components use React Context for sharing application state:

```jsx
import { KiCanvasProvider, useKiCanvasContext } from "kicanvas";

function MyComponent() {
    const { project } = useKiCanvasContext();

    return <div>Project loaded: {project ? "Yes" : "No"}</div>;
}

function App() {
    return (
        <KiCanvasProvider value={{ project: myProject }}>
            <MyComponent />
        </KiCanvasProvider>
    );
}
```

## Migration from Web Components

### Before (Web Components)

```html
<kicanvas-embed src="project.kicad_pro" controls="full"> </kicanvas-embed>
```

### After (React)

```jsx
<KiCanvasEmbed src="project.kicad_pro" controls="full" />
```

## Styling

React components maintain full CSS variable compatibility with the original design system:

```css
:root {
    --fg: #333;
    --bg: #fff;
    --button-bg: #f0f0f0;
    --button-hover-bg: #e0e0e0;
}
```

## Backward Compatibility

All existing web components remain available and functional:

```jsx
// Still works - web components
import { KiCanvasEmbedElement, KiCanvasShellElement } from "kicanvas";

// New recommended - React components
import { KiCanvasEmbed, KiCanvasShell } from "kicanvas";
```

## TypeScript Support

Full TypeScript support with comprehensive type definitions:

```tsx
import { KiCanvasEmbedProps, ButtonProps, ActivityData } from "kicanvas";

interface MyAppProps {
    embedProps: KiCanvasEmbedProps;
}

const MyApp: React.FC<MyAppProps> = ({ embedProps }) => {
    return <KiCanvasEmbed {...embedProps} />;
};
```

## Performance Benefits

-   **Tree shaking**: Only import components you use
-   **React optimizations**: Proper memoization and re-rendering optimization
-   **TypeScript**: Compile-time error checking and IntelliSense
-   **Developer experience**: Better debugging with React DevTools

## Next Steps

The React component library is now the recommended way to use KiCanvas. Web components will continue to be supported for backward compatibility, but new features will primarily target the React API.
