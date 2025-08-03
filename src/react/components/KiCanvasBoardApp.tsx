/*
    Copyright (c) 2025 Alethea Katherine Flowers.
    Published under the standard MIT License.
    Full text available at: https://opensource.org/licenses/MIT
*/

import React, { useState, useContext, useEffect } from "react";
// KiCanvasBoardApp component
import { BoardViewer } from "../../viewers/board/viewer";
import { Vec2 } from "../../base/math/vec2";
import { App } from "../ui/App";
import { ActivitySideBar } from "../ui/ActivitySideBar";
import { Panel } from "../ui/Panel";
import { Button } from "../ui/Button";
import { FloatingToolbar } from "../ui/FloatingToolbar";
import { ProjectContext } from "./KiCanvasShell";
// Import themes and Color
import { Color } from "../../base/color";
import type { BoardTheme } from "../../kicad/theme";
import type { KicadPCB } from "@kicad/board";

interface KiCanvasBoardAppProps {
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

// Define panel activities
const activities: PanelActivity[] = [
  {
    id: "info",
    title: "Information",
    icon: "info",
    component: (
      <Panel title="Information" className="info-panel">
        <p>Board Info Panel</p>
        {/* Add project information content here */}
      </Panel>
    ),
  },
  {
    id: "layers",
    title: "Layers",
    icon: "layers",
    component: (
      <Panel title="Layers" className="layers-panel">
        {/* Add layers list here */}
        <p>Layers Panel</p>
      </Panel>
    ),
  },
  {
    id: "footprints",
    title: "Footprints",
    icon: "developer_board",
    component: (
      <Panel title="Footprints" className="footprints-panel">
        {/* Add footprints list here */}
        <p>Footprints Panel</p>
      </Panel>
    ),
  },
  {
    id: "nets",
    title: "Nets",
    icon: "account_tree",
    component: (
      <Panel title="Nets" className="nets-panel">
        {/* Add nets list here */}
        <p>Nets Panel</p>
      </Panel>
    ),
  },
  {
    id: "objects",
    title: "Objects",
    icon: "category",
    component: (
      <Panel title="Objects" className="objects-panel">
        {/* Add objects list here */}
        <p>Objects Panel</p>
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

/**
 * KiCanvasBoardApp component
 *
 * The board viewer application component with UI controls
 */
export const KiCanvasBoardApp: React.FC<KiCanvasBoardAppProps> = ({
  controls = "full",
  controlslist,
  sidebarCollapsed = false,
  className = "",
}) => {
  const project = useContext(ProjectContext);

  if (!project) {
    console.error(
      "KiCanvasBoardApp must be used within a ProjectContext provider",
    );
    return null;
  }
  const [viewer, setViewer] = useState<BoardViewer | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] =
    useState<boolean>(sidebarCollapsed);

  // Create viewer ref
  const viewerRef = React.useRef<HTMLCanvasElement>(null);

  // Combine class names
  const classNames = ["kc-board-app", className].filter(Boolean).join(" ");

  const boardAppStyles = `
        .kc-board-app {
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

        .controls-none .kc-floating-toolbar {
            display: none;
        }

        .controls-basic .advanced-control {
            display: none;
        }

        .info-panel {
            padding: 0.5em;
        }

        .layers-panel, .footprints-panel, .nets-panel, 
        .objects-panel, .properties-panel {
            max-height: 100%;
            overflow: auto;
        }

        /* Add missing CSS variables for toolbar buttons */
        :root {
            --button-toolbar-bg: #282634;
            --button-toolbar-fg: #f8f8f0;
            --button-toolbar-hover-bg: #282634;
            --button-toolbar-hover-fg: #81eeff;
            --button-toolbar-disabled-bg: #131218;
            --button-toolbar-disabled-fg: #888;
            --button-toolbar-selected-bg: #131218;
            --button-toolbar-selected-fg: #f8f8f0;
        }
    `;

  // Initialize viewer
  useEffect(() => {
    if (!viewerRef.current || !project) return;

    // Create a basic board theme with required colors using Color objects
    // This is just for development - in production, use a proper theme
    const defaultTheme: BoardTheme = {
      background: Color.from_css("#131218"),
      grid: Color.from_css("#8864cb"),
      grid_axes: Color.from_css("#ae81ff"),
      anchor: Color.from_css("#f8f8f0"),
      aux_items: Color.from_css("#8be9fd"),
      b_adhes: Color.from_css("#f8f8f0"),
      b_crtyd: Color.from_css("#f92672"),
      b_fab: Color.from_css("#8be9fd"),
      b_mask: Color.from_css("#66d9ef"),
      b_paste: Color.from_css("#ae81ff"),
      b_silks: Color.from_css("#f8f8f0"),
      cmts_user: Color.from_css("#f8f8f0"),
      cursor: Color.from_css("#ff00ff"),
      dwgs_user: Color.from_css("#f8f8f0"),
      edge_cuts: Color.from_css("#f92672"),
      f_adhes: Color.from_css("#f8f8f0"),
      f_crtyd: Color.from_css("#f92672"),
      f_fab: Color.from_css("#8be9fd"),
      f_mask: Color.from_css("#66d9ef"),
      f_paste: Color.from_css("#ae81ff"),
      f_silks: Color.from_css("#f8f8f0"),
      footprint_text_invisible: Color.from_css("#f8f8f066"),
      margin: Color.from_css("#f8f8f0"),
      no_connect: Color.from_css("#f8f8f0"),
      pad_plated_hole: Color.from_css("#ae81ff"),
      pad_through_hole: Color.from_css("#f8f8f0"),
      non_plated_hole: Color.from_css("#ae81ff"),
      via_blind_buried: Color.from_css("#8be9fd"),
      via_hole: Color.from_css("#ae81ff"),
      via_micro: Color.from_css("#66d9ef"),
      via_through: Color.from_css("#f8f8f0"),
      worksheet: Color.from_css("#f8f8f0"),
      // Add copper layers which is required by the LayerSet
      copper: {
        f: Color.from_css("#f8f8f0"),
        b: Color.from_css("#f8f8f0"),
        in1: Color.from_css("#f8f8f0"),
        in2: Color.from_css("#f8f8f0"),
        in3: Color.from_css("#f8f8f0"),
        in4: Color.from_css("#f8f8f0"),
        in5: Color.from_css("#f8f8f0"),
        in6: Color.from_css("#f8f8f0"),
        in7: Color.from_css("#f8f8f0"),
        in8: Color.from_css("#f8f8f0"),
        in9: Color.from_css("#f8f8f0"),
        in10: Color.from_css("#f8f8f0"),
        in11: Color.from_css("#f8f8f0"),
        in12: Color.from_css("#f8f8f0"),
        in13: Color.from_css("#f8f8f0"),
        in14: Color.from_css("#f8f8f0"),
        in15: Color.from_css("#f8f8f0"),
        in16: Color.from_css("#f8f8f0"),
        in17: Color.from_css("#f8f8f0"),
        in18: Color.from_css("#f8f8f0"),
        in19: Color.from_css("#f8f8f0"),
        in20: Color.from_css("#f8f8f0"),
        in21: Color.from_css("#f8f8f0"),
        in22: Color.from_css("#f8f8f0"),
        in23: Color.from_css("#f8f8f0"),
        in24: Color.from_css("#f8f8f0"),
        in25: Color.from_css("#f8f8f0"),
        in26: Color.from_css("#f8f8f0"),
        in27: Color.from_css("#f8f8f0"),
        in28: Color.from_css("#f8f8f0"),
        in29: Color.from_css("#f8f8f0"),
        in30: Color.from_css("#f8f8f0"),
      },
      // Additional required properties
      drc_error: Color.from_css("#ff0000"),
      drc_warning: Color.from_css("#ffa500"),
      drc_exclusion: Color.from_css("#ff00ff"),
      ratsnest: Color.from_css("#ffffff"),
      user_1: Color.from_css("#ffffff"),
      user_2: Color.from_css("#ffffff"),
      user_3: Color.from_css("#ffffff"),
      user_4: Color.from_css("#ffffff"),
      user_5: Color.from_css("#ffffff"),
      user_6: Color.from_css("#ffffff"),
      user_7: Color.from_css("#ffffff"),
      user_8: Color.from_css("#ffffff"),
      user_9: Color.from_css("#ffffff"),
      eco1_user: Color.from_css("#ffffff"),
      eco2_user: Color.from_css("#ffffff"),
    };

    const newViewer = new BoardViewer(viewerRef.current, true, defaultTheme);

    // Set up the viewer
    (async () => {
      try {
        // Setup the viewer first
        await newViewer.setup();

        // Set the viewer to state AFTER setup is complete to ensure all painters are registered
        setViewer(newViewer);

        // Set up document if available and active page exists
        if (project.active_page && project.active_page.document) {
          // Check if this is a board page before loading
          if (project.active_page.type !== "pcb") {
            return;
          }

          // Patch the document to ensure all items have the correct constructor relationship
          const document = project.active_page.document;

          // Force painter re-creation to ensure it has the correct references
          if (newViewer.painter) {
            // Recreate the painter explicitly
            newViewer.painter = newViewer.create_painter();
            // Run an initial paint to register all painters
            newViewer.paint();
          }

          // Load the document directly
          await newViewer.load(document as KicadPCB);
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

  // Toggle layer visibility controls would go here

  return (
    <App className={classNames + ` controls-${controls}`}>
      <style>{boardAppStyles}</style>
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

KiCanvasBoardApp.displayName = "KiCanvasBoardApp";
