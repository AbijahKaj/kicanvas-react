/*
    Copyright (c) 2023 Alethea Katherine Flowers.
    Published under the standard MIT License.
    Full text available at: https://opensource.org/licenses/MIT
*/

import React, { useEffect, useRef, useState, useCallback } from "react";
import { BaseComponent, useKiCanvasContext } from "../base/BaseComponent";
import { ActivitySideBar } from "../ui/ActivitySideBar";
import { SplitView, View } from "../ui/SplitView";
import { KicadSch } from "../../kicad";
import { SchematicSheet } from "../../kicad/schematic";
import { SchematicViewer } from "../../viewers/schematic/viewer";
import { KiCanvasSelectEvent } from "../../viewers/base/events";
import type { ProjectPage } from "../../kicanvas/project";
import type { ActivityData } from "../ui/ActivitySideBar";

export interface KiCanvasSchematicAppProps {
    controls?: "none" | "basic" | "full";
    controlslist?: string;
    sidebarCollapsed?: boolean;
    disableInteraction?: boolean;
    onSelect?: (item?: unknown, previous?: unknown) => void;
    onViewerReady?: (viewer: SchematicViewer) => void;
    className?: string;
    style?: React.CSSProperties;
}

const schematicAppStyles = `
    .kc-schematic-app {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        background-color: #f0f0f0; /* Add background for debugging */
    }

    .kc-schematic-app.hidden {
        display: none;
    }

    .viewer-container {
        flex: 1;
        position: relative;
        overflow: hidden;
        background-color: #e0e0e0; /* Add background for debugging */
    }

    .viewer-canvas {
        width: 100%;
        height: 100%;
        display: block;
        background-color: white; /* Add background for debugging */
        border: 2px solid #ff0000; /* Add red border for debugging */
    }
`;

/**
 * React component equivalent of KCSchematicAppElement.
 * Handles setting up the schematic viewer as well as interface controls.
 */
export const KiCanvasSchematicApp: React.FC<KiCanvasSchematicAppProps> = ({
    controls = "basic",
    controlslist = "",
    sidebarCollapsed = false,
    disableInteraction = false,
    onSelect,
    onViewerReady,
    className,
    style,
    ...props
}) => {
    const { project } = useKiCanvasContext();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const viewerRef = useRef<SchematicViewer | null>(null);
    const [isHidden, setIsHidden] = useState(false); // Changed from true to false for debugging

    // Initialize viewer when canvas is ready
    useEffect(() => {
        console.log(
            "Initializing viewer - canvas ref:",
            canvasRef.current,
            "project:",
            project,
        );
        if (!canvasRef.current || !project) {
            console.log("Cannot initialize viewer - missing canvas or project");
            return;
        }

        const canvas = canvasRef.current;
        console.log("Canvas element:", canvas);

        // Get theme from project/context - using a basic theme for now
        const theme = project.preferences?.theme?.schematic || {
            // Basic schematic theme structure - this should be expanded
            anchor: "#ff0000",
            aux_items: "#ffffff",
            brightened: "#ffffff",
            bus: "#0000ff",
            bus_junction: "#0000ff",
            component_body: "#ffffff",
            component_outline: "#ffffff",
            cursor: "#ffffff",
            erc_error: "#ff0000",
            erc_warning: "#ffff00",
            fields: "#000000",
            grid: "#808080",
            grid_axes: "#000000",
            hidden: "#808080",
            junction: "#000000",
            label_global: "#ff0000",
            label_hier: "#ff0000",
            label_local: "#000000",
            no_connect: "#0000ff",
            note: "#000000",
            override_item_colors: false,
            pin: "#ff0000",
            pin_name: "#000000",
            pin_number: "#000000",
            reference: "#000000",
            shadow: "#808080",
            sheet: "#ffffff",
            sheet_background: "#ffffff",
            sheet_filename: "#000000",
            sheet_label: "#000000",
            sheet_name: "#000000",
            value: "#000000",
            wire: "#008000",
            worksheet: "#800080",
        };

        const viewer = new SchematicViewer(canvas, !disableInteraction, theme);
        console.log("Created SchematicViewer:", viewer);

        viewerRef.current = viewer;
        console.log("Set viewer ref:", viewerRef.current);
        onViewerReady?.(viewer);

        // Setup viewer selection handling
        const handleSelect = (event: Event) => {
            const selectEvent = event as CustomEvent<{
                item?: unknown;
                previous?: unknown;
            }>;
            const { item, previous } = selectEvent.detail;

            // Handle double-selecting/double-clicking on items
            if (item && item === previous) {
                // If it's a sheet instance, switch over to the new sheet
                if (item instanceof SchematicSheet) {
                    project.set_active_page?.(
                        `${item.sheetfile}:${item.path}/${item.uuid}`,
                    );
                    return;
                }

                // Otherwise, show properties panel - callback to parent or ActivitySideBar handles this
                // onActivityChange?.('properties'); // Would need to be passed to this function
            }

            onSelect?.(item, previous);
        };

        viewer.addEventListener(KiCanvasSelectEvent.type, handleSelect);

        return () => {
            console.log("Cleaning up viewer");
            viewer.removeEventListener(KiCanvasSelectEvent.type, handleSelect);
            viewer.dispose?.();
        };
    }, [project, disableInteraction, onSelect, onViewerReady]);

    // Handle project page changes
    useEffect(() => {
        if (!project) {
            console.log("No project available");
            return;
        }

        console.log("Project loaded:", project);
        console.log("Has schematics:", project.has_schematics);
        console.log("Has boards:", project.has_boards);
        console.log("Root schematic page:", project.root_schematic_page);
        console.log("Active page:", project.active_page);

        const handleProjectChange = () => {
            const page = project.active_page;
            console.log("Project changed, active page:", page);
            if (page && canLoad(page)) {
                loadPage(page);
            } else {
                console.log("No valid page to load, hiding app");
                setIsHidden(true);
            }
        };

        // Load initial page if available - look for any schematic page
        const allPages = Array.from(project.pages()) as ProjectPage[];
        console.log("All pages:", allPages);

        const schematicPage = allPages.find((page) => canLoad(page));
        console.log("Found schematic page:", schematicPage);

        if (schematicPage) {
            loadPage(schematicPage);
        } else {
            console.log("No schematic page found");
        }

        // Listen for project changes
        project.addEventListener?.("change", handleProjectChange);

        return () => {
            project.removeEventListener?.("change", handleProjectChange);
        };
    }, [project]);

    const canLoad = (page: ProjectPage): boolean => {
        return page.document instanceof KicadSch;
    };

    const loadPage = useCallback(async (page: ProjectPage) => {
        console.log("Loading page:", page);
        console.log("Viewer ref:", viewerRef.current);
        console.log("Can load:", canLoad(page));

        if (!viewerRef.current || !canLoad(page)) {
            console.log("Cannot load page - missing viewer or invalid page");
            return;
        }

        try {
            console.log("Calling viewer.load with:", page.document);
            await viewerRef.current.load(page.document as KicadSch);
            console.log("Viewer loaded successfully");
            // Only show the app once the viewer has successfully loaded
            setIsHidden(false);
        } catch (error) {
            console.error("Failed to load schematic page:", error);
            // Keep app hidden on error
            setIsHidden(true);
        }
    }, []);

    const activities: ActivityData[] = [
        {
            name: "Symbols",
            icon: "interests",
            content: <div>Symbols panel placeholder</div>,
        },
        {
            name: "Properties",
            icon: "list",
            content: <div>Properties panel placeholder</div>,
        },
        {
            name: "Info",
            icon: "info",
            content: <div>Info panel placeholder</div>,
        },
    ];

    const classes = ["kc-schematic-app", isHidden && "hidden", className]
        .filter(Boolean)
        .join(" ");

    const showControls = controls !== "none";
    const showSidebar = showControls && !controlslist.includes("nosidebar");

    return (
        <BaseComponent
            className={classes}
            style={style}
            styles={schematicAppStyles}
            {...props}>
            <SplitView direction="horizontal">
                <View>
                    <div className="viewer-container">
                        <canvas ref={canvasRef} className="viewer-canvas" />
                    </div>
                </View>
                {showSidebar && (
                    <View>
                        <ActivitySideBar
                            activities={activities}
                            collapsed={sidebarCollapsed}
                        />
                    </View>
                )}
            </SplitView>
        </BaseComponent>
    );
};
