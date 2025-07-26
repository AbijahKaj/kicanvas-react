/*
    Copyright (c) 2023 Alethea Katherine Flowers.
    Published under the standard MIT License.
    Full text available at: https://opensource.org/licenses/MIT
*/

import React, { useState, useEffect, useRef } from 'react';
import { BaseComponent, KiCanvasProvider } from '../base/BaseComponent';
import { FocusOverlay } from '../ui/FocusOverlay';
import { Project } from '../../kicanvas/project';

export interface KiCanvasSource {
    src: string;
}

export interface KiCanvasEmbedProps {
    src?: string;
    sources?: KiCanvasSource[];
    loading?: boolean;
    loaded?: boolean;
    controls?: 'none' | 'basic' | 'full';
    controlslist?: string;
    theme?: string;
    zoom?: 'objects' | 'page' | string;
    customResolver?: (name: string) => URL;
    className?: string;
    style?: React.CSSProperties;
    children?: React.ReactNode;
}

const embedStyles = `
    .kc-embed {
        margin: 0;
        display: flex;
        position: relative;
        width: 100%;
        max-height: 100%;
        aspect-ratio: 1.414;
        background-color: aqua;
        color: var(--fg);
        font-family: "Nunito", ui-rounded, "Hiragino Maru Gothic ProN",
            Quicksand, Comfortaa, Manjari, "Arial Rounded MT Bold",
            Calibri, source-sans-pro, sans-serif;
        contain: layout paint;
    }

    .kc-embed main {
        display: contents;
    }

    .kc-embed kc-board-app,
    .kc-embed kc-schematic-app {
        width: 100%;
        height: 100%;
        flex: 1;
    }
`;

/**
 * KiCanvasEmbed is the main embedding component for KiCanvas.
 * React equivalent of KiCanvasEmbedElement.
 */
export const KiCanvasEmbed: React.FC<KiCanvasEmbedProps> = ({
    src,
    sources = [],
    loading = false,
    loaded = false,
    controls = 'basic',
    controlslist,
    theme,
    zoom,
    customResolver,
    className,
    style,
    children,
    ...props
}) => {
    const [project] = useState(() => new Project());
    const [isLoading, setIsLoading] = useState(loading);
    const [isLoaded, setIsLoaded] = useState(loaded);
    const schematicAppRef = useRef<HTMLElement | null>(null);
    const boardAppRef = useRef<HTMLElement | null>(null);

    useEffect(() => {
        const loadProject = async () => {
            const allSources = [];
            
            if (src) {
                allSources.push(src);
            }
            
            sources.forEach(source => {
                if (source.src) {
                    allSources.push(source.src);
                }
            });

            if (allSources.length === 0) {
                console.warn("No valid sources specified");
                return;
            }

            try {
                setIsLoading(true);
                setIsLoaded(false);

                // Import VFS dynamically
                const { FetchFileSystem } = await import('../../kicanvas/services/vfs');
                const vfs = new FetchFileSystem(allSources, customResolver);
                
                await project.load?.(vfs);
                
                setIsLoaded(true);
                
                // Set active page
                if (project.set_active_page && project.root_schematic_page) {
                    project.set_active_page(project.root_schematic_page);
                }
            } catch (error) {
                console.error('Failed to load project:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadProject();
    }, [src, sources, customResolver, project]);

    // Create app elements using web components for now
    // These would be replaced with React components in a later phase
    useEffect(() => {
        if (!isLoaded || !project) return;

        // Create schematic app if project has schematics
        if (project.has_schematics && !schematicAppRef.current) {
            const schematicApp = document.createElement('kc-schematic-app');
            schematicApp.setAttribute('sidebarcollapsed', '');
            if (controls) schematicApp.setAttribute('controls', controls);
            if (controlslist) schematicApp.setAttribute('controlslist', controlslist);
            schematicAppRef.current = schematicApp;
        }

        // Create board app if project has boards
        if (project.has_boards && !boardAppRef.current) {
            const boardApp = document.createElement('kc-board-app');
            boardApp.setAttribute('sidebarcollapsed', '');
            if (controls) boardApp.setAttribute('controls', controls);
            if (controlslist) boardApp.setAttribute('controlslist', controlslist);
            boardAppRef.current = boardApp;
        }
    }, [isLoaded, project, controls, controlslist]);

    const contextValue = {
        project: project
    };

    const showFocusOverlay = controls !== 'none' && !controlslist?.includes('nooverlay');

    const classes = [
        'kc-embed',
        className
    ].filter(Boolean).join(' ');

    if (!isLoaded) {
        return (
            <BaseComponent
                className={classes}
                style={style}
                styles={embedStyles}
                {...props}>
                {isLoading && <div>Loading...</div>}
                {children}
            </BaseComponent>
        );
    }

    return (
        <KiCanvasProvider value={contextValue}>
            <BaseComponent
                className={classes}
                style={style}
                styles={embedStyles}
                {...props}>
                <main>
                    {/* Web component integration - will be replaced with React components later */}
                    <div 
                        ref={el => {
                            if (el && schematicAppRef.current && !el.contains(schematicAppRef.current)) {
                                el.appendChild(schematicAppRef.current);
                            }
                        }}
                    />
                    <div 
                        ref={el => {
                            if (el && boardAppRef.current && !el.contains(boardAppRef.current)) {
                                el.appendChild(boardAppRef.current);
                            }
                        }}
                    />
                    {showFocusOverlay && <FocusOverlay />}
                </main>
                {children}
            </BaseComponent>
        </KiCanvasProvider>
    );
};

/**
 * KiCanvasSource component for specifying additional sources.
 * React equivalent of KiCanvasSourceElement.
 */
export interface KiCanvasSourceProps {
    src: string;
}

export const KiCanvasSource: React.FC<KiCanvasSourceProps> = ({ src }) => {
    // This component is not rendered but provides source information
    // It would be used by parent components to collect sources
    return null;
};