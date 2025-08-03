/*
    Copyright (c) 2025 Alethea Katherine Flowers.
    Published under the standard MIT License.
    Full text available at: https://opensource.org/licenses/MIT
*/

import React, { useState, useEffect, useContext } from "react";
import { App } from "../ui/App";
import { ActivitySideBar } from "../ui/ActivitySideBar";
import { Button } from "../ui/Button";
import { FloatingToolbar } from "../ui/FloatingToolbar";
import { Panel } from "../ui/Panel";
import { ProjectContext } from "./KiCanvasShell";
import { ProjectPanel } from "./ProjectPanel";
import { SchematicViewer } from "../../viewers/schematic/viewer";
import { Color } from "../../base/color";
import { Vec2 } from "../../base/math";
import type { SchematicTheme } from "../../kicad";

// Info Panel Component
const InfoPanel: React.FC<{ viewer: SchematicViewer | null }> = ({
  viewer,
}) => {
  if (!viewer || !viewer.schematic) {
    return (
      <Panel title="Information" className="info-panel">
        <p>No schematic loaded</p>
      </Panel>
    );
  }

  const schematic = viewer.schematic;
  const ds = viewer.drawing_sheet;

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

  const comments = Object.entries(schematic.title_block?.comment || {}).map(
    ([k, v]) => entry(`Comment ${k}`, v),
  );

  return (
    <Panel title="Information" className="info-panel">
      <div style={{ padding: "1em" }}>
        {header("Page properties")}
        {entry("Size", ds.paper?.size)}
        {entry("Width", ds.width, " mm")}
        {entry("Height", ds.height, " mm")}

        {header("Schematic properties")}
        {entry("KiCAD version", schematic.version)}
        {entry("Generator", schematic.generator)}
        {entry("Title", schematic.title_block?.title)}
        {entry("Date", schematic.title_block?.date)}
        {entry("Revision", schematic.title_block?.rev)}
        {entry("Company", schematic.title_block?.company)}
        {comments}
        {entry("Symbols", schematic.symbols.size)}
        {entry("Unique symbols", schematic.lib_symbols?.symbols.length ?? 0)}
        {entry("Wires", schematic.wires.length)}
        {entry("Buses", schematic.buses.length)}
        {entry("Junctions", schematic.junctions.length)}
        {entry("Net labels", schematic.net_labels.length)}
        {entry("Global labels", schematic.global_labels.length)}
        {entry("Hierarchical labels", schematic.hierarchical_labels.length)}
        {entry("No connects", schematic.no_connects.length)}
      </div>
    </Panel>
  );
};

// Symbols Panel Component
const SymbolsPanel: React.FC<{ viewer: SchematicViewer | null }> = ({
  viewer,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSymbol, setSelectedSymbol] = useState<string | null>(null);

  if (!viewer || !viewer.schematic) {
    return (
      <Panel title="Symbols" className="symbols-panel">
        <p>No schematic loaded</p>
      </Panel>
    );
  }

  const schematic = viewer.schematic;
  const symbols = Array.from(schematic.symbols.values()).sort((a, b) => {
    // Sort by reference (numeric strings)
    const aRef = a.reference;
    const bRef = b.reference;
    return aRef.localeCompare(bRef, undefined, { numeric: true });
  });

  const filteredSymbols = symbols.filter((symbol) => {
    const searchText = searchTerm.toLowerCase();
    return (
      symbol.reference.toLowerCase().includes(searchText) ||
      symbol.value.toLowerCase().includes(searchText) ||
      symbol.id.toLowerCase().includes(searchText) ||
      symbol.lib_symbol.name.toLowerCase().includes(searchText)
    );
  });

  const handleSymbolClick = (symbol: any) => {
    setSelectedSymbol(symbol.uuid);
    // TODO: Implement symbol selection in viewer
    console.log("Selected symbol:", symbol);
  };

  return (
    <Panel title="Symbols" className="symbols-panel">
      <div style={{ padding: "1em" }}>
        <div style={{ marginBottom: "1em" }}>
          <input
            type="text"
            placeholder="Search symbols..."
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
          {filteredSymbols.map((symbol) => (
            <div
              key={symbol.uuid}
              onClick={() => handleSymbolClick(symbol)}
              style={{
                padding: "0.5em",
                border: "1px solid #444",
                marginBottom: "0.25em",
                borderRadius: "4px",
                cursor: "pointer",
                backgroundColor:
                  selectedSymbol === symbol.uuid ? "#131218" : "#282634",
                color: "#f8f8f0",
              }}>
              <div style={{ fontWeight: "bold" }}>{symbol.reference}</div>
              <div style={{ fontSize: "0.9em", color: "#888" }}>
                {symbol.value} - {symbol.lib_symbol.name}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Panel>
  );
};

// Properties Panel Component
const PropertiesPanel: React.FC<{ viewer: SchematicViewer | null }> = ({
  viewer,
}) => {
  const [_selectedItem, _setSelectedItem] = useState<any>(null);

  if (!viewer || !viewer.schematic) {
    return (
      <Panel title="Properties" className="properties-panel">
        <p>No schematic loaded</p>
      </Panel>
    );
  }

  // TODO: Connect to viewer selection events
  // For now, show a placeholder
  const renderProperties = () => {
    if (!_selectedItem) {
      return (
        <div style={{ padding: "1em", color: "#888" }}>
          <p>Select an item in the schematic to view its properties.</p>
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
      id: "symbols",
      title: "Symbols",
      icon: "category",
      component: <SymbolsPanel viewer={viewer} />,
    },
    {
      id: "properties",
      title: "Properties",
      icon: "tune",
      component: <PropertiesPanel viewer={viewer} />,
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
