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
import { KiCanvasSelectEvent } from "src";

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

  // Effect to listen for selection changes in the viewer
  useEffect(() => {
    if (!viewer) return;

    // Handler for when selection changes in the viewer
    const handleViewerSelection = (e: Event) => {
      const event = e as CustomEvent;
      const item = event.detail?.item;

      if (item && item.uuid) {
        setSelectedSymbol(item.uuid);
        console.log("Viewer selection changed:", item.uuid);
      } else {
        setSelectedSymbol(null);
      }
    };

    // Listen for selection changes in the viewer
    viewer.addEventListener(KiCanvasSelectEvent.type, handleViewerSelection);

    return () => {
      // Clean up
      viewer.removeEventListener(
        KiCanvasSelectEvent.type,
        handleViewerSelection,
      );
    };
  }, [viewer]);

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

  // Group symbols by type (regular, power, sheets)
  const regularSymbols = symbols.filter((symbol) => !symbol.lib_symbol.power);
  const powerSymbols = symbols.filter((symbol) => symbol.lib_symbol.power);
  const sheets =
    schematic.sheets?.length > 0
      ? Array.from(schematic.sheets).sort((a, b) => {
          const aName = a.sheetname || a.sheetfile || "";
          const bName = b.sheetname || b.sheetfile || "";
          return aName.localeCompare(bName, undefined, { numeric: true });
        })
      : [];

  const filterItem = (item: any, type: "symbol" | "sheet") => {
    if (!searchTerm) return true;

    const searchText = searchTerm.toLowerCase();
    if (type === "symbol") {
      return (
        item.reference.toLowerCase().includes(searchText) ||
        item.value.toLowerCase().includes(searchText) ||
        item.id.toLowerCase().includes(searchText) ||
        item.lib_symbol.name.toLowerCase().includes(searchText)
      );
    } else {
      return (
        (item.sheetname || "").toLowerCase().includes(searchText) ||
        (item.sheetfile || "").toLowerCase().includes(searchText)
      );
    }
  };

  // Filter symbols and sheets based on search term
  const filteredRegularSymbols = regularSymbols.filter((s) =>
    filterItem(s, "symbol"),
  );
  const filteredPowerSymbols = powerSymbols.filter((s) =>
    filterItem(s, "symbol"),
  );
  const filteredSheets = sheets.filter((s) => filterItem(s, "sheet"));

  const handleSymbolClick = (symbol: any) => {
    // Update local state
    setSelectedSymbol(symbol.uuid);

    // Tell the viewer to select this symbol
    if (viewer) {
      viewer.select(symbol.uuid);
      console.log("Selected symbol in viewer:", symbol.uuid);
    }
  };

  const handleSheetClick = (sheet: any) => {
    // Update local state
    setSelectedSymbol(sheet.uuid);

    // Tell the viewer to select this sheet
    if (viewer) {
      viewer.select(sheet.uuid);
      console.log("Selected sheet in viewer:", sheet.uuid);
    }
  };

  const renderSymbolItem = (symbol: any) => (
    <div
      key={symbol.uuid}
      onClick={() => handleSymbolClick(symbol)}
      style={{
        padding: "0.5em",
        border: "1px solid #444",
        marginBottom: "0.25em",
        borderRadius: "4px",
        cursor: "pointer",
        backgroundColor: selectedSymbol === symbol.uuid ? "#131218" : "#282634",
        color: "#f8f8f0",
      }}>
      <div style={{ fontWeight: "bold" }}>{symbol.reference}</div>
      <div style={{ fontSize: "0.9em", color: "#888" }}>
        {symbol.value} - {symbol.lib_symbol.name}
      </div>
    </div>
  );

  const renderSheetItem = (sheet: any) => (
    <div
      key={sheet.uuid}
      onClick={() => handleSheetClick(sheet)}
      style={{
        padding: "0.5em",
        border: "1px solid #444",
        marginBottom: "0.25em",
        borderRadius: "4px",
        cursor: "pointer",
        backgroundColor: selectedSymbol === sheet.uuid ? "#131218" : "#282634",
        color: "#f8f8f0",
      }}>
      <div style={{ fontWeight: "bold" }}>{sheet.sheetname || "Untitled"}</div>
      <div style={{ fontSize: "0.9em", color: "#888" }}>{sheet.sheetfile}</div>
    </div>
  );

  return (
    <Panel title="Symbols" className="symbols-panel">
      <div style={{ padding: "1em" }}>
        <div style={{ marginBottom: "1em" }}>
          <input
            type="text"
            placeholder="Search symbols and sheets..."
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
          {/* Regular symbols */}
          {filteredRegularSymbols.map(renderSymbolItem)}

          {/* Power symbols section */}
          {filteredPowerSymbols.length > 0 && (
            <>
              <div
                style={{
                  padding: "0.25em",
                  backgroundColor: "#131218",
                  color: "#888",
                  fontSize: "0.9em",
                  marginBottom: "0.5em",
                }}>
                Power symbols
              </div>
              {filteredPowerSymbols.map(renderSymbolItem)}
            </>
          )}

          {/* Sheets section */}
          {filteredSheets.length > 0 && (
            <>
              <div
                style={{
                  padding: "0.25em",
                  backgroundColor: "#131218",
                  color: "#888",
                  fontSize: "0.9em",
                  marginBottom: "0.5em",
                }}>
                Sheets
              </div>
              {filteredSheets.map(renderSheetItem)}
            </>
          )}
        </div>
      </div>
    </Panel>
  );
};

// Properties Panel Component
const PropertiesPanel: React.FC<{ viewer: SchematicViewer | null }> = ({
  viewer,
}) => {
  const [selectedItem, setSelectedItem] = useState<any>(null);

  // Effect to listen for selection changes in the viewer
  useEffect(() => {
    if (!viewer) return;

    // Handler for when selection changes in the viewer
    const handleViewerSelection = (e: Event) => {
      const event = e as CustomEvent;
      const item = event.detail?.item;

      if (item) {
        setSelectedItem(item);
        console.log("Properties panel - selection changed:", item);
      } else {
        setSelectedItem(null);
      }
    };

    // Listen for selection changes in the viewer
    viewer.addEventListener(KiCanvasSelectEvent.type, handleViewerSelection);

    return () => {
      // Clean up
      viewer.removeEventListener(
        KiCanvasSelectEvent.type,
        handleViewerSelection,
      );
    };
  }, [viewer]);

  if (!viewer || !viewer.schematic) {
    return (
      <Panel title="Properties" className="properties-panel">
        <p>No schematic loaded</p>
      </Panel>
    );
  }

  const renderProperties = () => {
    if (!selectedItem) {
      return (
        <div style={{ padding: "1em", color: "#888" }}>
          <p>Select an item in the schematic to view its properties.</p>
        </div>
      );
    }

    // Helper function to render property entries
    const entry = (name: string, value?: any, suffix = "") => (
      <div
        key={name}
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "0.25em 0",
        }}>
        <span>{name}:</span>
        <span>
          {value !== undefined ? value : "N/A"}
          {suffix}
        </span>
      </div>
    );

    // Determine which properties to show based on the selected item type
    const properties = [];
    const type = selectedItem.constructor.name;
    properties.push(entry("Type", type));

    // Add common properties that most items have
    if (selectedItem.uuid) {
      properties.push(entry("ID", selectedItem.uuid));
    }

    // Symbol-specific properties
    if (type === "SchematicSymbol") {
      properties.push(entry("Reference", selectedItem.reference));
      properties.push(entry("Value", selectedItem.value));
      properties.push(entry("Library Name", selectedItem.lib_symbol.name));
      properties.push(
        entry("Power Symbol", selectedItem.lib_symbol.power ? "Yes" : "No"),
      );

      if (selectedItem.unit) {
        properties.push(entry("Unit", selectedItem.unit));
      }

      if (selectedItem.position) {
        properties.push(entry("Position X", selectedItem.position.x, " mm"));
        properties.push(entry("Position Y", selectedItem.position.y, " mm"));
      }

      if (selectedItem.angle) {
        properties.push(entry("Angle", selectedItem.angle, "°"));
      }
    }

    // Sheet-specific properties
    else if (type === "SchematicSheet") {
      properties.push(entry("Sheet Name", selectedItem.sheetname));
      properties.push(entry("Sheet File", selectedItem.sheetfile));

      if (selectedItem.position) {
        properties.push(entry("Position X", selectedItem.position.x, " mm"));
        properties.push(entry("Position Y", selectedItem.position.y, " mm"));
      }

      if (selectedItem.size) {
        properties.push(entry("Width", selectedItem.size.width, " mm"));
        properties.push(entry("Height", selectedItem.size.height, " mm"));
      }
    }

    // Wire-specific properties
    else if (type === "SchematicWire" || type === "SchematicBus") {
      properties.push(entry("Start X", selectedItem.start.x, " mm"));
      properties.push(entry("Start Y", selectedItem.start.y, " mm"));
      properties.push(entry("End X", selectedItem.end.x, " mm"));
      properties.push(entry("End Y", selectedItem.end.y, " mm"));
    }

    return (
      <div style={{ padding: "1em" }}>
        <h3 style={{ marginBottom: "1em" }}>Properties</h3>
        <div style={{ fontSize: "0.9em" }}>{properties}</div>
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
      ? [
          {
            id: "project",
            title: "Project",
            icon: "folder",
            component: <ProjectPanel />,
          },
        ]
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
