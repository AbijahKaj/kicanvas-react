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
    }

    .kc-schematic-app.hidden {
        display: none;
    }

    .viewer-container {
        flex: 1;
        position: relative;
        overflow: hidden;
    }

    .viewer-canvas {
        width: 100%;
        height: 100%;
        display: block;
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
    const [isHidden, setIsHidden] = useState(true);

    // Initialize viewer when canvas is ready
    useEffect(() => {
        if (!canvasRef.current || !project) return;

        const canvas = canvasRef.current;

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

        viewerRef.current = viewer;
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
            viewer.removeEventListener(KiCanvasSelectEvent.type, handleSelect);
            viewer.dispose?.();
        };
    }, [project, disableInteraction, onSelect, onViewerReady]);

    // Handle project page changes
    useEffect(() => {
        if (!project) return;

        const handleProjectChange = () => {
            const page = project.active_page;
            if (page && canLoad(page)) {
                loadPage(page);
            } else {
                setIsHidden(true);
            }
        };

        // Load initial page if available - look for any schematic page
        const allPages = Array.from(project.pages()) as ProjectPage[];
        const schematicPage = allPages.find((page) => canLoad(page));
        if (schematicPage) {
            loadPage(schematicPage);
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
        if (!viewerRef.current || !canLoad(page)) return;

        // For now, just show the app without waiting for viewer load
        // This is a temporary fix to get the UI showing
        setIsHidden(false);

        try {
            await viewerRef.current.load(page.document as KicadSch);
            // Already showing, no need to setIsHidden(false) again
        } catch (error) {
            console.error("Failed to load schematic page:", error);
            // Don't hide on error, let user see the UI
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
