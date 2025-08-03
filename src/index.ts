/*
    Copyright (c) 2022 Alethea Katherine Flowers.
    Published under the standard MIT License.
    Full text available at: https://opensource.org/licenses/MIT
*/

// Side effects - Register livereload only (removed web component registrations)
import "./base/livereload";

// ========================================
// React Core (Re-export for convenience)
// ========================================
export {
  default as React,
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
  createContext,
  useContext,
  forwardRef,
} from "react";
export { createRoot } from "react-dom/client";

// ========================================
// Main React Components API (Primary API)
// ========================================
export {
  KiCanvasEmbed,
  KiCanvasShell,
  KiCanvasSchematicApp,
  KiCanvasBoardApp,
  KiCanvasSource,
  App,
  Button,
  Icon,
  Panel,
  Menu,
  ActivitySideBar,
  SplitView,
  View,
  Range,
  TextFilterInput,
  FloatingToolbar,
  FocusOverlay,
} from "./react";

// Export React component prop types
export type {
  KiCanvasEmbedProps,
  KiCanvasShellProps,
  KiCanvasSchematicAppProps,
  KiCanvasBoardAppProps,
  ActivitySideBarProps,
  ButtonProps,
  IconProps,
  PanelProps,
  MenuProps,
  AppProps,
  SplitViewProps,
  ViewProps,
  RangeProps,
  TextFilterInputProps,
  FloatingToolbarProps,
  FocusOverlayProps,
} from "./react";

// ========================================
// Core KiCad File Parsers & Types
// ========================================
export * from "./kicad";

// ========================================
// Graphics & Rendering
// ========================================
export * from "./graphics";
export * from "./viewers/base/viewer";
export * from "./viewers/board/viewer";
export * from "./viewers/schematic/viewer";

// ========================================
// File System & Services
// ========================================
export {
  VirtualFileSystem,
  FetchFileSystem,
  DragDropFileSystem,
} from "./kicanvas/services/vfs";
export { GitHubFileSystem } from "./kicanvas/services/github-vfs";
export { GitHub } from "./kicanvas/services/github";

// ========================================
// Project Management
// ========================================
export { Project } from "./kicanvas/project";
export { Preferences } from "./kicanvas/preferences";

// ========================================
// Math & Utilities
// ========================================
export { Angle } from "./base/math/angle";
export { Arc as MathArc } from "./base/math/arc";
export { BBox } from "./base/math/bbox";
export { Camera2 } from "./base/math/camera2";
export { Matrix3 } from "./base/math/matrix3";
export { Vec2 } from "./base/math/vec2";
export { Color } from "./base/color";
export { Logger } from "./base/log";

// ========================================
// React Context and Utilities
// ========================================
export {
  BaseComponent,
  KiCanvasProvider,
  useKiCanvasContext,
} from "./react/base/BaseComponent";

// ========================================
// Events
// ========================================
export * from "./viewers/base/events";

// ========================================
// Re-export commonly used types for convenience
// ========================================
export type { IDisposable } from "./base/disposable";
export type { Theme, BoardTheme, SchematicTheme } from "./kicad/theme";

// ========================================
// Re-export KiCanvas Elements
// ========================================
export { KiCanvasShellElement } from "./kicanvas/elements/kicanvas-shell";
export { KiCanvasEmbedElement } from "./kicanvas/elements/kicanvas-embed";
