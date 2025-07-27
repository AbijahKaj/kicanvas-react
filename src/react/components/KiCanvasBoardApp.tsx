/*
    Copyright (c) 2023 Alethea Katherine Flowers.
    Published under the standard MIT License.
    Full text available at: https://opensource.org/licenses/MIT
*/

import React, { useEffect, useRef, useState, useCallback } from "react";
import { BaseComponent, useKiCanvasContext } from "../base/BaseComponent";
import { ActivitySideBar } from "../ui/ActivitySideBar";
import { SplitView, View } from "../ui/SplitView";
import { KicadPCB } from "../../kicad";
import { BoardViewer } from "../../viewers/board/viewer";
import { KiCanvasSelectEvent } from "../../viewers/base/events";
import type { ProjectPage } from "../../kicanvas/project";
import type { ActivityData } from "../ui/ActivitySideBar";

export interface KiCanvasBoardAppProps {
    controls?: "none" | "basic" | "full";
    controlslist?: string;
    sidebarCollapsed?: boolean;
    disableInteraction?: boolean;
    onSelect?: (item?: unknown, previous?: unknown) => void;
    onViewerReady?: (viewer: BoardViewer) => void;
    className?: string;
    style?: React.CSSProperties;
}

const boardAppStyles = `
    .kc-board-app {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
    }

    .kc-board-app.hidden {
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
 * React component equivalent of KCBoardAppElement.
 * Handles setting up the board viewer as well as interface controls.
 */
export const KiCanvasBoardApp: React.FC<KiCanvasBoardAppProps> = ({
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
    const viewerRef = useRef<BoardViewer | null>(null);
    const [isHidden, setIsHidden] = useState(true);

    // Initialize viewer when canvas is ready
    useEffect(() => {
        if (!canvasRef.current || !project) return;

        const canvas = canvasRef.current;

        // Get theme from project/context - using a basic theme for now
        const theme = project.preferences?.theme?.board || {
            // Basic board theme structure - this should be expanded
            anchor: "#ff0000",
            aux_items: "#ffffff",
            b_adhes: "#ff00ff",
            b_crtyd: "#ffff00",
            b_fab: "#808080",
            b_mask: "#800080",
            b_paste: "#808080",
            b_silks: "#ffffff",
            background: "#000000",
            cursor: "#ffffff",
            drc_error: "#ff0000",
            drc_exclusion: "#ffff00",
            drc_warning: "#ffff00",
            f_adhes: "#ff00ff",
            f_crtyd: "#ffff00",
            f_fab: "#808080",
            f_mask: "#800080",
            f_paste: "#808080",
            f_silks: "#ffffff",
            footprint_text_back: "#000000",
            footprint_text_front: "#ffffff",
            footprint_text_invisible: "#808080",
            grid: "#808080",
            grid_axes: "#000000",
            hole: "#000000",
            net_names: "#ffffff",
            no_connect: "#0000ff",
            non_plated_hole: "#ffff00",
            override_item_colors: false,
            pad_back: "#008000",
            pad_front: "#800000",
            pad_plated_hole: "#ffff00",
            pad_through_hole: "#808080",
            plated_hole: "#ffff00",
            ratsnest: "#ffffff",
            through_via: "#808080",
            track_front: "#800000",
            track_back: "#008000",
            user_1: "#ff0000",
            user_2: "#00ff00",
            user_3: "#0000ff",
            user_4: "#ffff00",
            user_5: "#ff00ff",
            user_6: "#00ffff",
            user_7: "#ffffff",
            user_8: "#808080",
            user_9: "#ff8000",
            via_blind_buried: "#808080",
            via_hole: "#808080",
            via_micro: "#808080",
            via_through: "#808080",
            worksheet: "#800080",
        };

        const viewer = new BoardViewer(canvas, !disableInteraction, theme);

        viewerRef.current = viewer;
        onViewerReady?.(viewer);

        // Setup viewer selection handling
        const handleSelect = (event: Event) => {
            const selectEvent = event as CustomEvent<{
                item?: unknown;
                previous?: unknown;
            }>;
            const { item, previous } = selectEvent.detail;

            // Selecting the same item twice should show the properties panel - callback to parent handles this
            if (item && item === previous) {
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

        // Load initial page if available - look for any board page
        const allPages = Array.from(project.pages()) as ProjectPage[];
        const boardPage = allPages.find((page) => canLoad(page));
        if (boardPage) {
            loadPage(boardPage);
        }

        // Listen for project changes
        project.addEventListener?.("change", handleProjectChange);

        return () => {
            project.removeEventListener?.("change", handleProjectChange);
        };
    }, [project]);

    const canLoad = (page: ProjectPage): boolean => {
        return page.document instanceof KicadPCB;
    };

    const loadPage = useCallback(async (page: ProjectPage) => {
        if (!viewerRef.current || !canLoad(page)) return;

        try {
            await viewerRef.current.load(page.document as KicadPCB);
            // Only show the app once the viewer has successfully loaded
            setIsHidden(false);
        } catch (error) {
            console.error("Failed to load board page:", error);
            // Keep app hidden on error
            setIsHidden(true);
        }
    }, []);

    const activities: ActivityData[] = [
        {
            name: "Layers",
            icon: "layers",
            content: <div>Layers panel placeholder</div>,
        },
        {
            name: "Objects",
            icon: "category",
            content: <div>Objects panel placeholder</div>,
        },
        {
            name: "Footprints",
            icon: "memory",
            content: <div>Footprints panel placeholder</div>,
        },
        {
            name: "Nets",
            icon: "hub",
            content: <div>Nets panel placeholder</div>,
        },
        {
            name: "Properties",
            icon: "list",
            content: <div>Properties panel placeholder</div>,
        },
        {
            name: "Board info",
            icon: "info",
            content: <div>Board info panel placeholder</div>,
        },
    ];

    const classes = ["kc-board-app", isHidden && "hidden", className]
        .filter(Boolean)
        .join(" ");

    const showControls = controls !== "none";
    const showSidebar = showControls && !controlslist.includes("nosidebar");

    return (
        <BaseComponent
            className={classes}
            style={style}
            styles={boardAppStyles}
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
