/*
    Copyright (c) 2023 Alethea Katherine Flowers.
    Published under the standard MIT License.
    Full text available at: https://opensource.org/licenses/MIT
*/

export { BaseComponent, KiCanvasProvider, useKiCanvasContext } from './base/BaseComponent';

// UI Components
export { Button } from './ui/Button';
export { Icon } from './ui/Icon';
export { Panel, PanelTitle, PanelBody, PanelLabel } from './ui/Panel';
export { Range } from './ui/Range';
export { TextFilterInput } from './ui/TextFilterInput';
export { Menu, MenuItem, MenuLabel } from './ui/Menu';

// Layout Components
export { App } from './ui/App';
export { View, SplitView } from './ui/SplitView';
export { FocusOverlay } from './ui/FocusOverlay';
export { ActivitySideBar } from './ui/ActivitySideBar';
export { FloatingToolbar } from './ui/FloatingToolbar';

// Main Application Components
export { KiCanvasEmbed, KiCanvasSource } from './components/KiCanvasEmbed';
export { KiCanvasShell } from './components/KiCanvasShell';
export { KiCanvasSchematicApp } from './components/KiCanvasSchematicApp';
export { KiCanvasBoardApp } from './components/KiCanvasBoardApp';

// Type exports
export type { ButtonProps } from './ui/Button';
export type { IconProps } from './ui/Icon';
export type { PanelProps, PanelTitleProps, PanelBodyProps, PanelLabelProps } from './ui/Panel';
export type { RangeProps } from './ui/Range';
export type { TextFilterInputProps } from './ui/TextFilterInput';
export type { MenuProps, MenuItemProps, MenuLabelProps, MenuItemData } from './ui/Menu';
export type { AppProps } from './ui/App';
export type { ViewProps, SplitViewProps } from './ui/SplitView';
export type { FocusOverlayProps } from './ui/FocusOverlay';
export type { ActivitySideBarProps, ActivityData } from './ui/ActivitySideBar';
export type { FloatingToolbarProps } from './ui/FloatingToolbar';
export type { KiCanvasEmbedProps, KiCanvasSource as KiCanvasSourceType } from './components/KiCanvasEmbed';
export type { KiCanvasShellProps } from './components/KiCanvasShell';
export type { KiCanvasSchematicAppProps } from './components/KiCanvasSchematicApp';
export type { KiCanvasBoardAppProps } from './components/KiCanvasBoardApp';