/*
    Copyright (c) 2025 Alethea Katherine Flowers.
    Published under the standard MIT License.
    Full text available at: https://opensource.org/licenses/MIT
*/

import React, { useState, useContext, useEffect } from "react";
// KiCanvasSchematicApp component
import { SchematicViewer } from "../../viewers/schematic/viewer";
import { Vec2 } from "../../base/math/vec2";
import { App } from "../ui/App";
import { ActivitySideBar } from "../ui/ActivitySideBar";
import { Panel } from "../ui/Panel";
import { Button } from "../ui/Button";
import { FloatingToolbar } from "../ui/FloatingToolbar";
import { ProjectContext } from "./KiCanvasShell";
// Import themes and Color
import { Color } from "../../base/color";
import type { SchematicTheme } from "../../kicad/theme";

interface KiCanvasSchematicAppProps {
  controls?: "none" | "basic" | "full";
  controlslist?: string;
  sidebarCollapsed?: boolean;
  className?: string;
}

// Interface for a panel activity
interface PanelActivity {
  id: string;
  title: string;
  icon: string;
  component: React.ReactNode;
}

/**
 * KiCanvasSchematicApp component
 *
 * The schematic viewer application component with UI controls
 */
export const KiCanvasSchematicApp: React.FC<KiCanvasSchematicAppProps> = ({
  controls = "full",
  controlslist,
  sidebarCollapsed = false,
  className = "",
}) => {
  const project = useContext(ProjectContext);

  if (!project) {
    console.error(
      "KiCanvasSchematicApp must be used within a ProjectContext provider",
    );
    return null;
  }
  const [viewer, setViewer] = useState<SchematicViewer | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] =
    useState<boolean>(sidebarCollapsed);

  // Create viewer ref
  const viewerRef = React.useRef<HTMLCanvasElement>(null);

  // Combine class names
  const classNames = ["kc-schematic-app", className].filter(Boolean).join(" ");

  const schematicAppStyles = `
        .kc-schematic-app {
            display: flex;
            width: 100%;
            height: 100%;
            position: relative;
        }

        .kc-viewer-container {
            flex: 1;
            overflow: hidden;
            position: relative;
        }

        .kc-viewer-container canvas {
            width: 100%;
            height: 100%;
            display: block;
            background-color: #131218; /* Default background color */
            touch-action: none;
        }

        .controls-none .kc-floating-toolbar {
            display: none;
        }

        .controls-basic .advanced-control {
            display: none;
        }

        .info-panel {
            padding: 0.5em;
        }

        .symbols-panel, .properties-panel {
            max-height: 100%;
            overflow: auto;
        }
    `;

  // Initialize viewer
  useEffect(() => {
    if (!viewerRef.current || !project) return;

    // Create a theme with proper Color objects
    // This is just for development - in production, use a proper theme
    const defaultTheme: SchematicTheme = {
      background: Color.from_css("#131218"),
      note: Color.from_css("#f8f8f0"),
      wire: Color.from_css("#f8f8f0"),
      bus: Color.from_css("#ae81ff"),
      junction: Color.from_css("#f8f8f0"),
      pin: Color.from_css("#f8f8f0"),
      pin_name: Color.from_css("#f8f8f0"),
      pin_number: Color.from_css("#f8f8f0"),
      component_body: Color.from_css("#282634"),
      component_outline: Color.from_css("#f8f8f0"),
      no_connect: Color.from_css("#f8f8f0"),
      label_global: Color.from_css("#8be9fd"),
      label_hier: Color.from_css("#ae81ff"),
      anchor: Color.from_css("#f8f8f0"),
      value: Color.from_css("#f8f8f0"),
      reference: Color.from_css("#f8f8f0"),
      shadow: Color.from_css("rgba(0, 0, 0, 0.5)"),
      brightened: Color.from_css("#f8f8f0"),
      sheet: Color.from_css("#f8f8f0"),
      sheet_filename: Color.from_css("#f8f8f0"),
      sheet_name: Color.from_css("#f8f8f0"),
      sheet_background: Color.from_css("#282634"),
      sheet_fields: Color.from_css("#f8f8f0"),
      fields: Color.from_css("#f8f8f0"),
      grid: Color.from_css("#8864cb"),
      cursor: Color.from_css("#ff00ff"),
      hidden: Color.from_css("#f8f8f066"),
      worksheet: Color.from_css("#f8f8f0"),
      aux_items: Color.from_css("#8be9fd"),
      erc_warning: Color.from_css("#ff5555"),
      bus_junction: Color.from_css("#f8f8f0"),
      erc_error: Color.from_css("#ff5555"),
      label_local: Color.from_css("#f8f8f0"),
      sheet_label: Color.from_css("#f8f8f0"),
      grid_axes: Color.from_css("#f8f8f0"),
    };

    const newViewer = new SchematicViewer(
      viewerRef.current,
      true,
      defaultTheme,
    );

    // Set up the viewer
    (async () => {
      try {
        // Setup the viewer first
        await newViewer.setup();

        // Set the viewer to state AFTER setup is complete
        setViewer(newViewer);

        // Set up document if available and active page exists
        if (project.active_page && project.active_page.document) {
          // Check if this is a schematic page before loading
          if (project.active_page.type !== "schematic") {
            return;
          }

          // Force painter re-creation to ensure it has the correct references
          if (newViewer.painter) {
            // Recreate the painter explicitly
            newViewer.painter = newViewer.create_painter();
            // Run an initial paint to register all painters
            newViewer.paint();
          }

          // Make sure the document has the proper update_hierarchical_data method
          const doc = project.active_page.document;
          if (doc && !("update_hierarchical_data" in doc)) {
            // Copy the update_hierarchical_data method from the KicadSch prototype
            Object.setPrototypeOf(
              doc,
              Object.getPrototypeOf(
                project.root_schematic_page?.document || {},
              ),
            );
          }

          // Load the project page instead of just the document
          await newViewer.load(project.active_page);
        }
      } catch (error) {
        console.error("Error setting up viewer:", error);
      }
    })();

    // Clean up
    return () => {
      newViewer.dispose();
    };
  }, [project, viewerRef]);

  // Define panel activities
  const activities: PanelActivity[] = [
    {
      id: "info",
      title: "Information",
      icon: "info",
      component: (
        <Panel title="Information" className="info-panel">
          <p>Schematic Info Panel</p>
          {/* Add project information content here */}
        </Panel>
      ),
    },
    {
      id: "symbols",
      title: "Symbols",
      icon: "category",
      component: (
        <Panel title="Symbols" className="symbols-panel">
          {/* Add symbols list here */}
          <p>Symbols Panel</p>
        </Panel>
      ),
    },
    {
      id: "properties",
      title: "Properties",
      icon: "tune",
      component: (
        <Panel title="Properties" className="properties-panel">
          {/* Add properties content here */}
          <p>Properties Panel</p>
        </Panel>
      ),
    },
  ];

  // Handle zoom controls
  const handleZoomIn = () => {
    if (viewer && viewer.viewport) {
      viewer.viewport.camera.zoom *= 1.2;
      viewer.draw();
    }
  };

  const handleZoomOut = () => {
    if (viewer && viewer.viewport) {
      viewer.viewport.camera.zoom *= 0.8;
      viewer.draw();
    }
  };

  const handleZoomFit = () => {
    if (viewer) {
      viewer.zoom_to_page();
      viewer.draw();
    }
  };

  const handleZoomReset = () => {
    if (viewer && viewer.viewport) {
      viewer.viewport.camera.zoom = 1.0;
      viewer.viewport.camera.center = new Vec2(0, 0);
      viewer.draw();
    }
  };

  return (
    <App className={classNames + ` controls-${controls}`}>
      <style>{schematicAppStyles}</style>
      <ActivitySideBar
        activities={activities.map((a) => ({
          id: a.id,
          title: a.title,
          icon: a.icon,
          panel: a.component,
        }))}
        collapsed={isSidebarCollapsed}
        onToggleCollapse={setIsSidebarCollapsed}
      />

      <div className="kc-viewer-container">
        <canvas
          ref={viewerRef}
          style={{ width: "100%", height: "100%", touchAction: "none" }}
        />

        {controls !== "none" && (
          <FloatingToolbar position="bottom" align="center">
            <Button
              icon="zoom_in"
              variant="toolbar"
              onClick={handleZoomIn}
              title="Zoom In"
            />
            <Button
              icon="zoom_out"
              variant="toolbar"
              onClick={handleZoomOut}
              title="Zoom Out"
            />
            <Button
              icon="fit_screen"
              variant="toolbar"
              onClick={handleZoomFit}
              title="Zoom to Fit"
            />
            <Button
              icon="restart_alt"
              variant="toolbar"
              onClick={handleZoomReset}
              title="Reset Zoom"
              className="advanced-control"
            />
          </FloatingToolbar>
        )}
      </div>
    </App>
  );
};

KiCanvasSchematicApp.displayName = "KiCanvasSchematicApp";
