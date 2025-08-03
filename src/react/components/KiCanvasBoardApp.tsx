/*
    Copyright (c) 2025 Alethea Katherine Flowers.
    Published under the standard MIT License.
    Full text available at: https://opensource.org/licenses/MIT
*/

import React, { useState, useContext, useEffect } from "react";
import { App } from "../ui/App";
import { ActivitySideBar } from "../ui/ActivitySideBar";
import { Button } from "../ui/Button";
import { FloatingToolbar } from "../ui/FloatingToolbar";
import { Panel } from "../ui/Panel";
import { ProjectContext } from "./KiCanvasShell";
import { ProjectPanel } from "./ProjectPanel";
import { BoardViewer } from "../../viewers/board/viewer";
import { Color } from "../../base/color";
import { Vec2 } from "../../base/math";
import type { BoardTheme } from "../../kicad";
import type { KicadPCB } from "../../kicad/board";

// Info Panel Component
const InfoPanel: React.FC<{ viewer: BoardViewer | null }> = ({ viewer }) => {
  if (!viewer || !viewer.board) {
    return (
      <Panel title="Information" className="info-panel">
        <p>No board loaded</p>
      </Panel>
    );
  }

  const board = viewer.board;

  const header = (name: string) => (
    <div
      className="property-header"
      style={{ fontWeight: "bold", marginTop: "1em", marginBottom: "0.5em" }}>
      {name}
    </div>
  );

  const entry = (name: string, value?: any, suffix = "") => (
    <div
      className="property-entry"
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "0.25em 0",
      }}>
      <span>{name}:</span>
      <span>
        {value}
        {suffix}
      </span>
    </div>
  );

  return (
    <Panel title="Information" className="info-panel">
      <div style={{ padding: "1em" }}>
        {header("Board properties")}
        {entry("KiCAD version", board.version)}
        {entry("Generator", board.generator)}
        {entry("General thickness", board.general?.thickness, " mm")}
        {entry("Copper layers", board.layers.length)}
        {entry("Board outline items", board.drawings.length)}
        {entry("Footprints", board.footprints.length)}
        {entry("Nets", board.nets?.length ?? 0)}
        {entry("Zones", board.zones.length)}
        {entry("Traces", board.segments.length)}
        {entry("Vias", board.vias.length)}
      </div>
    </Panel>
  );
};

// Layers Panel Component
const LayersPanel: React.FC<{ viewer: BoardViewer | null }> = ({ viewer }) => {
  const [searchTerm, setSearchTerm] = useState("");

  if (!viewer || !viewer.board) {
    return (
      <Panel title="Layers" className="layers-panel">
        <p>No board loaded</p>
      </Panel>
    );
  }

  const layers = [
    { name: "F.Cu", description: "Front Copper" },
    { name: "B.Cu", description: "Back Copper" },
    { name: "F.SilkS", description: "Front Silkscreen" },
    { name: "B.SilkS", description: "Back Silkscreen" },
    { name: "F.Paste", description: "Front Paste" },
    { name: "B.Paste", description: "Back Paste" },
    { name: "F.Mask", description: "Front Mask" },
    { name: "B.Mask", description: "Back Mask" },
    { name: "Edge.Cuts", description: "Board Outline" },
    { name: "Margin", description: "Margin" },
    { name: "F.CrtYd", description: "Front Courtyard" },
    { name: "B.CrtYd", description: "Back Courtyard" },
    { name: "F.Fab", description: "Front Fabrication" },
    { name: "B.Fab", description: "Back Fabrication" },
  ];

  const filteredLayers = layers.filter((layer) => {
    const searchText = searchTerm.toLowerCase();
    return (
      layer.name.toLowerCase().includes(searchText) ||
      layer.description.toLowerCase().includes(searchText)
    );
  });

  return (
    <Panel title="Layers" className="layers-panel">
      <div style={{ padding: "1em" }}>
        <div style={{ marginBottom: "1em" }}>
          <input
            type="text"
            placeholder="Search layers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: "100%",
              padding: "0.5em",
              border: "1px solid #444",
              borderRadius: "4px",
              backgroundColor: "#282634",
              color: "#f8f8f0",
            }}
          />
        </div>
        <div style={{ maxHeight: "400px", overflow: "auto" }}>
          {filteredLayers.map((layer) => (
            <div
              key={layer.name}
              style={{
                padding: "0.5em",
                border: "1px solid #444",
                marginBottom: "0.25em",
                borderRadius: "4px",
                backgroundColor: "#282634",
                color: "#f8f8f0",
              }}>
              <div style={{ fontWeight: "bold" }}>{layer.name}</div>
              <div style={{ fontSize: "0.9em", color: "#888" }}>
                {layer.description}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Panel>
  );
};

// Footprints Panel Component
const FootprintsPanel: React.FC<{ viewer: BoardViewer | null }> = ({
  viewer,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  if (!viewer || !viewer.board) {
    return (
      <Panel title="Footprints" className="footprints-panel">
        <p>No board loaded</p>
      </Panel>
    );
  }

  const board = viewer.board;
  const footprints = board.footprints || [];

  const filteredFootprints = footprints.filter((footprint) => {
    const searchText = searchTerm.toLowerCase();
    return (
      footprint.reference?.toLowerCase().includes(searchText) ||
      footprint.value?.toLowerCase().includes(searchText) ||
      footprint.library_link?.toLowerCase().includes(searchText)
    );
  });

  return (
    <Panel title="Footprints" className="footprints-panel">
      <div style={{ padding: "1em" }}>
        <div style={{ marginBottom: "1em" }}>
          <input
            type="text"
            placeholder="Search footprints..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: "100%",
              padding: "0.5em",
              border: "1px solid #444",
              borderRadius: "4px",
              backgroundColor: "#282634",
              color: "#f8f8f0",
            }}
          />
        </div>
        <div style={{ maxHeight: "400px", overflow: "auto" }}>
          {filteredFootprints.map((footprint) => (
            <div
              key={footprint.uuid}
              style={{
                padding: "0.5em",
                border: "1px solid #444",
                marginBottom: "0.25em",
                borderRadius: "4px",
                backgroundColor: "#282634",
                color: "#f8f8f0",
              }}>
              <div style={{ fontWeight: "bold" }}>{footprint.reference}</div>
              <div style={{ fontSize: "0.9em", color: "#888" }}>
                {footprint.value} - {footprint.library_link}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Panel>
  );
};

// Nets Panel Component
const NetsPanel: React.FC<{ viewer: BoardViewer | null }> = ({ viewer }) => {
  const [searchTerm, setSearchTerm] = useState("");

  if (!viewer || !viewer.board) {
    return (
      <Panel title="Nets" className="nets-panel">
        <p>No board loaded</p>
      </Panel>
    );
  }

  const board = viewer.board;
  const nets = board.nets || [];

  const filteredNets = nets.filter((net) => {
    const searchText = searchTerm.toLowerCase();
    return net.name.toLowerCase().includes(searchText);
  });

  return (
    <Panel title="Nets" className="nets-panel">
      <div style={{ padding: "1em" }}>
        <div style={{ marginBottom: "1em" }}>
          <input
            type="text"
            placeholder="Search nets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: "100%",
              padding: "0.5em",
              border: "1px solid #444",
              borderRadius: "4px",
              backgroundColor: "#282634",
              color: "#f8f8f0",
            }}
          />
        </div>
        <div style={{ maxHeight: "400px", overflow: "auto" }}>
          {filteredNets.map((net) => (
            <div
              key={net.number}
              style={{
                padding: "0.5em",
                border: "1px solid #444",
                marginBottom: "0.25em",
                borderRadius: "4px",
                backgroundColor: "#282634",
                color: "#f8f8f0",
              }}>
              <div style={{ fontWeight: "bold" }}>{net.name}</div>
              <div style={{ fontSize: "0.9em", color: "#888" }}>
                Number: {net.number}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Panel>
  );
};

// Objects Panel Component
const ObjectsPanel: React.FC<{ viewer: BoardViewer | null }> = ({ viewer }) => {
  if (!viewer || !viewer.board) {
    return (
      <Panel title="Objects" className="objects-panel">
        <p>No board loaded</p>
      </Panel>
    );
  }

  const board = viewer.board;

  const entry = (name: string, count: number) => (
    <div
      className="property-entry"
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "0.25em 0",
      }}>
      <span>{name}:</span>
      <span>{count}</span>
    </div>
  );

  return (
    <Panel title="Objects" className="objects-panel">
      <div style={{ padding: "1em" }}>
        <h3 style={{ marginBottom: "1em" }}>Board Objects</h3>
        {entry("Footprints", board.footprints.length)}
        {entry("Segments", board.segments.length)}
        {entry("Vias", board.vias.length)}
        {entry("Zones", board.zones.length)}
        {entry("Drawings", board.drawings.length)}
        {entry("Groups", board.groups.length)}
      </div>
    </Panel>
  );
};

// Properties Panel Component
const PropertiesPanel: React.FC<{ viewer: BoardViewer | null }> = ({
  viewer,
}) => {
  const [_selectedItem, _setSelectedItem] = useState<any>(null);

  if (!viewer || !viewer.board) {
    return (
      <Panel title="Properties" className="properties-panel">
        <p>No board loaded</p>
      </Panel>
    );
  }

  // TODO: Connect to viewer selection events
  // For now, show a placeholder
  const renderProperties = () => {
    if (!_selectedItem) {
      return (
        <div style={{ padding: "1em", color: "#888" }}>
          <p>Select an item in the board to view its properties.</p>
        </div>
      );
    }

    return (
      <div style={{ padding: "1em" }}>
        <h3 style={{ marginBottom: "1em" }}>Properties</h3>
        <div style={{ fontSize: "0.9em" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "0.25em 0",
            }}>
            <span>Type:</span>
            <span>{_selectedItem.constructor.name}</span>
          </div>
          {/* Add more properties based on item type */}
        </div>
      </div>
    );
  };

  return (
    <Panel title="Properties" className="properties-panel">
      {renderProperties()}
    </Panel>
  );
};

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

  // Define panel activities
  const activities: PanelActivity[] = [
    // Add project panel if there's more than one page
    ...(Array.from(project.pages()).length > 1 
      ? [{
          id: "project",
          title: "Project",
          icon: "folder",
          component: <ProjectPanel />,
        }] 
      : []),
    {
      id: "info",
      title: "Information",
      icon: "info",
      component: <InfoPanel viewer={viewer} />,
    },
    {
      id: "layers",
      title: "Layers",
      icon: "layers",
      component: <LayersPanel viewer={viewer} />,
    },
    {
      id: "footprints",
      title: "Footprints",
      icon: "developer_board",
      component: <FootprintsPanel viewer={viewer} />,
    },
    {
      id: "nets",
      title: "Nets",
      icon: "account_tree",
      component: <NetsPanel viewer={viewer} />,
    },
    {
      id: "objects",
      title: "Objects",
      icon: "category",
      component: <ObjectsPanel viewer={viewer} />,
    },
    {
      id: "properties",
      title: "Properties",
      icon: "tune",
      component: <PropertiesPanel viewer={viewer} />,
    },
  ];

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
