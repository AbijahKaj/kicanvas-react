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
// React Components
// ========================================
export * from "./react";

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
  MemoryFileSystem,
} from "./services/vfs";
export { GitHubFileSystem } from "./services/github-vfs";
export { GitHub } from "./services/github";

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

// ========================================
// Programmatic API
// ========================================
export { KiCanvas } from "./KiCanvas";
