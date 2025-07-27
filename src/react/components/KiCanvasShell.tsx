/*
    Copyright (c) 2023 Alethea Katherine Flowers.
    Published under the standard MIT License.
    Full text available at: https://opensource.org/licenses/MIT
*/

import React, { useState, useEffect, useCallback } from "react";
import { BaseComponent, KiCanvasProvider } from "../base/BaseComponent";
import { App } from "../ui/App";
import { Project } from "../../kicanvas/project";
import { KiCanvasSchematicApp } from "./KiCanvasSchematicApp";
import { KiCanvasBoardApp } from "./KiCanvasBoardApp";

export interface KiCanvasShellProps {
    src?: string;
    loading?: boolean;
    loaded?: boolean;
    disableInteraction?: boolean;
    onProjectLoaded?: (project: Project) => void;
    onProjectError?: (error: Error) => void;
    onReload?: () => void;
    className?: string;
    style?: React.CSSProperties;
    children?: React.ReactNode;
}

const shellStyles = `
    .kc-shell {
        height: 100vh;
        width: 100vw;
        overflow: hidden;
    }
    
    .kc-shell .overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        color: white;
        padding: 2rem;
        z-index: 1000;
    }

    .kc-shell .overlay.hidden {
        display: none;
    }

    .kc-shell .overlay h1 {
        display: flex;
        align-items: center;
        gap: 1rem;
        font-size: 3rem;
        margin-bottom: 2rem;
    }

    .kc-shell .overlay h1 img {
        width: 64px;
        height: 64px;
    }

    .kc-shell .overlay p {
        max-width: 800px;
        text-align: center;
        line-height: 1.6;
        margin-bottom: 1rem;
    }

    .kc-shell .overlay input {
        width: 100%;
        max-width: 600px;
        padding: 1rem;
        font-size: 1.2rem;
        border: 2px solid #444;
        border-radius: 8px;
        background: rgba(255, 255, 255, 0.1);
        color: white;
        margin: 2rem 0;
    }

    .kc-shell .overlay input::placeholder {
        color: rgba(255, 255, 255, 0.7);
    }

    .kc-shell .overlay .note {
        font-size: 0.9rem;
        opacity: 0.8;
        max-width: 600px;
    }

    .kc-shell .overlay .github {
        margin-top: 2rem;
    }

    .kc-shell .overlay .github img {
        width: 32px;
        height: 32px;
        opacity: 0.8;
        transition: opacity 0.3s;
    }

    .kc-shell .overlay .github img:hover {
        opacity: 1;
    }

    .kc-shell main {
        height: 100%;
        width: 100%;
    }
`;

/**
 * KiCanvasShell is the main standalone application shell.
 * React equivalent of KiCanvasShellElement with full React implementation.
 */
export const KiCanvasShell: React.FC<KiCanvasShellProps> = ({
    src,
    loading = false,
    loaded = false,
    disableInteraction = false,
    onProjectLoaded,
    onProjectError,
    onReload,
    className,
    style,
    children,
    ...props
}) => {
    const [project] = useState(() => new Project());
    const [isLoaded, setIsLoaded] = useState(loaded);
    const [linkValue, setLinkValue] = useState("");
    const [loadError, setLoadError] = useState<Error | null>(null);
    const [, forceUpdate] = useState({}); // Used to force re-renders when project state changes

    const setupProject = useCallback(
        async (vfs: any) => {
            setIsLoaded(false);
            setLoadError(null);

            try {
                await project.load?.(vfs);
                if (project.set_active_page && project.first_page) {
                    project.set_active_page(project.first_page);
                }
                setIsLoaded(true);
                forceUpdate({}); // Force re-render after project loads
                onProjectLoaded?.(project);
            } catch (error) {
                const err = error as Error;
                console.error("Failed to load project:", err);
                setLoadError(err);
                onProjectError?.(err);
            }
        },
        [project, onProjectLoaded, onProjectError],
    );

    const handleReload = useCallback(() => {
        if (src) {
            // Reload from src
            (async () => {
                const { FetchFileSystem } = await import(
                    "../../kicanvas/services/vfs"
                );
                const vfs = new FetchFileSystem([src]);
                await setupProject(vfs);
            })();
        } else {
            // Reload from URL params - simplified version
            window.location.reload();
        }
    }, [src, setupProject]);

    useEffect(() => {
        let cleanupDropTarget: (() => void) | undefined;

        const initialize = async () => {
            const urlParams = new URLSearchParams(window.location.search);
            const githubPaths = urlParams.getAll("github");

            if (src) {
                const { FetchFileSystem } = await import(
                    "../../kicanvas/services/vfs"
                );
                const vfs = new FetchFileSystem([src]);
                await setupProject(vfs);
                return;
            }

            if (githubPaths.length) {
                const { GitHubFileSystem } = await import(
                    "../../kicanvas/services/github-vfs"
                );
                const vfs = await GitHubFileSystem.fromURLs(...githubPaths);
                await setupProject(vfs);
                return;
            }

            // Set up drag and drop for files
            cleanupDropTarget = setupDropTarget();
        };

        initialize();

        return () => {
            cleanupDropTarget?.();
        };
    }, [src, setupProject]);

    // Listen for project events to trigger re-renders when project state changes
    useEffect(() => {
        const handleProjectLoad = () => {
            forceUpdate({}); // Force re-render when project loads
        };

        const handleProjectChange = () => {
            forceUpdate({}); // Force re-render when project changes
        };

        project.addEventListener?.("load", handleProjectLoad);
        project.addEventListener?.("change", handleProjectChange);

        return () => {
            project.removeEventListener?.("load", handleProjectLoad);
            project.removeEventListener?.("change", handleProjectChange);
        };
    }, [project]);

    const setupDropTarget = () => {
        // Set up drag and drop functionality for the document body
        const handleDragOver = (e: DragEvent) => {
            e.preventDefault();
            e.stopPropagation();
        };

        const handleDrop = async (e: DragEvent) => {
            e.preventDefault();
            e.stopPropagation();

            const files = e.dataTransfer?.files;
            if (!files || files.length === 0) return;

            try {
                const { DragDropFileSystem } = await import(
                    "../../kicanvas/services/vfs"
                );
                const vfs = new DragDropFileSystem(files);
                await setupProject(vfs);
            } catch (error) {
                console.error("Failed to load dropped files:", error);
                setLoadError(error as Error);
            }
        };

        // Add event listeners
        document.addEventListener("dragover", handleDragOver);
        document.addEventListener("drop", handleDrop);

        // Return cleanup function
        return () => {
            document.removeEventListener("dragover", handleDragOver);
            document.removeEventListener("drop", handleDrop);
        };
    };

    const handleLinkInput = useCallback(
        async (e: React.ChangeEvent<HTMLInputElement>) => {
            const link = e.target.value;
            setLinkValue(link);

            if (!link) return;

            // Check if it's a GitHub URL
            const { GitHub } = await import("../../kicanvas/services/github");
            if (!GitHub.parse_url?.(link)) {
                return;
            }

            try {
                const { GitHubFileSystem } = await import(
                    "../../kicanvas/services/github-vfs"
                );
                const vfs = await GitHubFileSystem.fromURLs(link);
                await setupProject(vfs);

                // Update URL
                const location = new URL(window.location.href);
                location.searchParams.set("github", link);
                window.history.pushState(null, "", location);
            } catch (error) {
                console.error("Failed to load from GitHub:", error);
            }
        },
        [setupProject],
    );

    const contextValue = {
        project: project,
        reload: handleReload,
    };

    const classes = ["kc-shell", className].filter(Boolean).join(" ");

    const showOverlay = !isLoaded;

    return (
        <KiCanvasProvider value={contextValue}>
            <BaseComponent
                className={classes}
                style={style}
                styles={shellStyles}
                {...props}>
                <App>
                    {showOverlay && (
                        <section className="overlay">
                            <h1>
                                <img src="images/kicanvas.png" alt="KiCanvas" />
                                KiCanvas
                            </h1>
                            <p>
                                KiCanvas is an <strong>interactive</strong>,{" "}
                                <strong>browser-based</strong> viewer for KiCAD
                                schematics and boards. You can learn more from
                                the{" "}
                                <a
                                    href="https://kicanvas.org/home"
                                    target="_blank"
                                    rel="noopener noreferrer">
                                    docs
                                </a>
                                . It's in <strong>alpha</strong> so please{" "}
                                <a
                                    href="https://github.com/theacodes/kicanvas/issues/new/choose"
                                    target="_blank"
                                    rel="noopener noreferrer">
                                    report any bugs
                                </a>
                                !
                            </p>
                            <input
                                type="text"
                                placeholder="Paste a GitHub link..."
                                value={linkValue}
                                onChange={handleLinkInput}
                                autoFocus
                            />
                            <p>or drag & drop your KiCAD files</p>
                            {loadError && (
                                <p style={{ color: "red" }}>
                                    Error: {loadError.message}
                                </p>
                            )}
                            <p className="note">
                                KiCanvas is{" "}
                                <a
                                    href="https://github.com/theacodes/kicanvas"
                                    target="_blank"
                                    rel="noopener noreferrer">
                                    free & open source
                                </a>{" "}
                                and supported by{" "}
                                <a href="https://github.com/theacodes/kicanvas#special-thanks">
                                    community donations
                                </a>{" "}
                                with significant support from{" "}
                                <a
                                    href="https://partsbox.com/"
                                    target="_blank"
                                    rel="noopener noreferrer">
                                    PartsBox
                                </a>
                                ,{" "}
                                <a
                                    href="https://blues.io/"
                                    target="_blank"
                                    rel="noopener noreferrer">
                                    Blues
                                </a>
                                ,{" "}
                                <a
                                    href="https://blog.mithis.net/"
                                    target="_blank"
                                    rel="noopener noreferrer">
                                    Mithro
                                </a>
                                ,{" "}
                                <a href="https://github.com/jeremysf">
                                    Jeremy Gordon
                                </a>
                                , &{" "}
                                <a
                                    href="https://github.com/jamesneal"
                                    target="_blank"
                                    rel="noopener noreferrer">
                                    James Neal
                                </a>
                                . KiCanvas runs entirely within your browser, so
                                your files don't ever leave your machine.
                            </p>
                            <p className="github">
                                <a
                                    href="https://github.com/theacodes/kicanvas"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    title="Visit on GitHub">
                                    <img
                                        src="images/github-mark-white.svg"
                                        alt="GitHub"
                                    />
                                </a>
                            </p>
                        </section>
                    )}
                    <main>
                        {/* React components only - no web components */}
                        {isLoaded && project.has_schematics && (
                            <KiCanvasSchematicApp
                                controls="full"
                                disableInteraction={disableInteraction}
                            />
                        )}
                        {isLoaded && project.has_boards && (
                            <KiCanvasBoardApp
                                controls="full"
                                disableInteraction={disableInteraction}
                            />
                        )}
                        {children}
                    </main>
                </App>
            </BaseComponent>
        </KiCanvasProvider>
    );
};
