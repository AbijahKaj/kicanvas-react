/*
    Copyright (c) 2023 Alethea Katherine Flowers.
    Published under the standard MIT License.
    Full text available at: https://opensource.org/licenses/MIT
*/

import React, { useState, useEffect, useCallback } from "react";
import { BaseComponent, KiCanvasProvider } from "../base/BaseComponent";
import { FocusOverlay } from "../ui/FocusOverlay";
import { Project } from "../../kicanvas/project";
import { KiCanvasSchematicApp } from "./KiCanvasSchematicApp";
import { KiCanvasBoardApp } from "./KiCanvasBoardApp";

export interface KiCanvasSource {
  src: string;
}

export interface KiCanvasEmbedProps {
  src?: string;
  sources?: KiCanvasSource[];
  loading?: boolean;
  loaded?: boolean;
  controls?: "none" | "basic" | "full";
  controlslist?: string;
  theme?: string;
  zoom?: "objects" | "page" | string;
  customResolver?: (name: string) => URL;
  disableInteraction?: boolean;
  sidebarCollapsed?: boolean;
  onProjectLoaded?: (project: Project) => void;
  onProjectError?: (error: Error) => void;
  onReload?: () => void;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

const embedStyles = `
    .kc-embed {
        margin: 0;
        display: flex;
        position: relative;
        width: 100%;
        max-height: 100%;
        aspect-ratio: 1.414;
        background-color: aqua;
        color: var(--fg);
        font-family: "Nunito", ui-rounded, "Hiragino Maru Gothic ProN",
            Quicksand, Comfortaa, Manjari, "Arial Rounded MT Bold",
            Calibri, source-sans-pro, sans-serif;
        contain: layout paint;
    }

    .kc-embed main {
        display: contents;
    }

    .kc-embed kc-board-app,
    .kc-embed kc-schematic-app {
        width: 100%;
        height: 100%;
        flex: 1;
    }
`;

/**
 * KiCanvasEmbed is the main embedding component for KiCanvas.
 * React equivalent of KiCanvasEmbedElement with full React implementation.
 */
export const KiCanvasEmbed: React.FC<KiCanvasEmbedProps> = ({
  src,
  sources = [],
  loading = false,
  loaded = false,
  controls = "basic",
  controlslist = "",
  theme,
  zoom,
  customResolver,
  disableInteraction = false,
  sidebarCollapsed = false,
  onProjectLoaded,
  onProjectError,
  onReload,
  className,
  style,
  children,
  ...props
}) => {
  const [project] = useState(() => new Project());
  const [isLoading, setIsLoading] = useState(loading);
  const [isLoaded, setIsLoaded] = useState(loaded);
  const [loadError, setLoadError] = useState<Error | null>(null);

  const loadProject = useCallback(async () => {
    const allSources = [];

    if (src) {
      allSources.push(src);
    }

    sources.forEach((source) => {
      if (source.src) {
        allSources.push(source.src);
      }
    });

    if (allSources.length === 0) {
      console.warn("No valid sources specified");
      return;
    }

    try {
      setIsLoading(true);
      setIsLoaded(false);
      setLoadError(null);

      // Import VFS dynamically
      const { FetchFileSystem } = await import("../../kicanvas/services/vfs");
      const vfs = new FetchFileSystem(allSources, customResolver);

      await project.load?.(vfs);

      console.log("Project loaded successfully");
      console.log("Project has_schematics:", project.has_schematics);
      console.log("Project has_boards:", project.has_boards);
      console.log("Project root_schematic_page:", project.root_schematic_page);

      setIsLoaded(true);
      onProjectLoaded?.(project);

      // Set active page
      if (project.set_active_page && project.root_schematic_page) {
        console.log("Setting active page to:", project.root_schematic_page);
        project.set_active_page(project.root_schematic_page);
      } else {
        console.log(
          "Cannot set active page - missing set_active_page or root_schematic_page",
        );
      }
    } catch (error) {
      const err = error as Error;
      console.error("Failed to load project:", err);
      setLoadError(err);
      onProjectError?.(err);
    } finally {
      setIsLoading(false);
    }
  }, [src, sources, customResolver, project, onProjectLoaded, onProjectError]);

  useEffect(() => {
    loadProject();
  }, [loadProject]);

  // Expose reload functionality
  useEffect(() => {
    if (onReload) {
      // In a real implementation, you might want to attach this to a ref or context
      // For now, we'll call it when the component updates with a signal to reload
    }
  }, [onReload]);

  const handleReload = useCallback(() => {
    loadProject();
  }, [loadProject]);

  const contextValue = {
    project: project,
    reload: handleReload,
  };

  const showFocusOverlay =
    controls !== "none" && !controlslist?.includes("nooverlay");

  const classes = ["kc-embed", className].filter(Boolean).join(" ");

  if (!isLoaded) {
    return (
      <BaseComponent
        className={classes}
        style={style}
        styles={embedStyles}
        {...props}>
        {isLoading && <div>Loading...</div>}
        {loadError && <div>Error loading project: {loadError.message}</div>}
        {children}
      </BaseComponent>
    );
  }

  return (
    <KiCanvasProvider value={contextValue}>
      <BaseComponent
        className={classes}
        style={style}
        styles={embedStyles}
        {...props}>
        <main>
          {/* React components only - no web components */}
          {project.has_schematics && (
            <>
              {console.log("Rendering KiCanvasSchematicApp")}
              <KiCanvasSchematicApp
                controls={controls}
                controlslist={controlslist}
                sidebarCollapsed={sidebarCollapsed}
                disableInteraction={disableInteraction}
              />
            </>
          )}
          {project.has_boards && (
            <>
              {console.log("Rendering KiCanvasBoardApp")}
              <KiCanvasBoardApp
                controls={controls}
                controlslist={controlslist}
                sidebarCollapsed={sidebarCollapsed}
                disableInteraction={disableInteraction}
              />
            </>
          )}
          {!project.has_schematics && !project.has_boards && (
            <div>No schematics or boards found in project</div>
          )}
          {showFocusOverlay && <FocusOverlay />}
        </main>
        {children}
      </BaseComponent>
    </KiCanvasProvider>
  );
};

/**
 * KiCanvasSource component for specifying additional sources.
 * React equivalent of KiCanvasSourceElement.
 */
export interface KiCanvasSourceProps {
  src: string;
}

export const KiCanvasSource: React.FC<KiCanvasSourceProps> = ({ src }) => {
  // This component is not rendered but provides source information
  // It would be used by parent components to collect sources
  return null;
};
