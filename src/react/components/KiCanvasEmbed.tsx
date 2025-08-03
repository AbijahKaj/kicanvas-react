/*
    Copyright (c) 2025 Alethea Katherine Flowers.
    Published under the standard MIT License.
    Full text available at: https://opensource.org/licenses/MIT
*/

import React, { useState, useEffect } from 'react';
// KiCanvasEmbed component
import { Project } from '../../services/project';
import { FetchFileSystem, VirtualFileSystem } from '../../services/vfs';
import { KiCanvasSchematicApp } from './KiCanvasSchematicApp';
import { KiCanvasBoardApp } from './KiCanvasBoardApp';
import { FocusOverlay } from '../ui/FocusOverlay';

// Context for sharing the project across components
// Import Project context from KiCanvasShell
import { ProjectContext } from './KiCanvasShell';

export interface KiCanvasSource {
    src: string;
}

interface KiCanvasEmbedProps {
    src?: string;
    sources?: KiCanvasSource[];
    controls?: 'none' | 'basic' | 'full';
    controlslist?: string;
    theme?: string;
    zoom?: 'objects' | 'page' | string;
    className?: string;
    customResolver?: (name: string) => URL;
}

/**
 * KiCanvasEmbed component
 * 
 * Embeddable KiCanvas viewer that loads and displays KiCAD files
 */
export const KiCanvasEmbed: React.FC<KiCanvasEmbedProps> = ({
    src,
    sources,
    controls = 'none',
    controlslist,
    theme,
    zoom,
    className = '',
    customResolver
}) => {
    const [project] = useState<Project>(() => new Project());
    // We don't use this directly in the component, but it's used in the API
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [loading, setLoading] = useState<boolean>(false);
    const [loaded, setLoaded] = useState<boolean>(false);

    // Combine class names
    const classNames = [
        'kc-kicanvas-embed',
        className
    ].filter(Boolean).join(' ');

    const embedStyles = `
        .kc-kicanvas-embed {
            margin: 0;
            display: flex;
            position: relative;
            width: 100%;
            max-height: 100%;
            aspect-ratio: 1.414;
            background-color: var(--bg);
            color: var(--fg);
            font-family: "Nunito", ui-rounded, "Hiragino Maru Gothic ProN",
                Quicksand, Comfortaa, Manjari, "Arial Rounded MT Bold", Calibri,
                source-sans-pro, sans-serif;
            contain: layout paint;
        }

        .kc-kicanvas-embed main {
            display: contents;
        }

        .kc-schematic-app,
        .kc-board-app {
            width: 100%;
            height: 100%;
            flex: 1;
        }
    `;

    // Load sources on component mount
    useEffect(() => {
        loadSources();
    }, [src, sources]);

    // Combine sources from props
    const loadSources = async () => {
        const sourceUrls: string[] = [];

        if (src) {
            sourceUrls.push(src);
        }

        if (sources && sources.length > 0) {
            for (const source of sources) {
                if (source.src) {
                    sourceUrls.push(source.src);
                }
            }
        }

        if (sourceUrls.length === 0) {
            console.warn("No valid sources specified");
            return;
        }

        const vfs = new FetchFileSystem(sourceUrls, customResolver || undefined);
        await setupProject(vfs);
    };

    // Set up project with virtual file system
    const setupProject = async (vfs: VirtualFileSystem) => {
        setLoaded(false);
        setLoading(true);

        try {
            await project.load(vfs);
            setLoaded(true);

            if (project.root_schematic_page) {
                project.set_active_page(project.root_schematic_page);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    // Check if overlay should be shown
    const showOverlay = controls !== 'none' && !controlslist?.includes('nooverlay');

    return (
        <ProjectContext.Provider value={project}>
            <style>{embedStyles}</style>
            <div className={classNames}>
                <main>
                    {loaded && project.has_schematics && (
                        <KiCanvasSchematicApp 
                            controls={controls}
                            controlslist={controlslist}
                            sidebarCollapsed={true}
                        />
                    )}
                    
                    {loaded && project.has_boards && (
                        <KiCanvasBoardApp 
                            controls={controls}
                            controlslist={controlslist}
                            sidebarCollapsed={true}
                        />
                    )}
                    
                    {showOverlay && <FocusOverlay />}
                </main>
            </div>
        </ProjectContext.Provider>
    );
};

// Using ProjectContext from KiCanvasShell

KiCanvasEmbed.displayName = 'KiCanvasEmbed';