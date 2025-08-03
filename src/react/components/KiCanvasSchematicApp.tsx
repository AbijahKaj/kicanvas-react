/*
    Copyright (c) 2025 Alethea Katherine Flowers.
    Published under the standard MIT License.
    Full text available at: https://opensource.org/licenses/MIT
*/

import React, { useState, useContext, useEffect } from 'react';
// KiCanvasSchematicApp component
import { SchematicViewer } from '../../viewers/schematic/viewer';
import { Vec2 } from '../../base/math/vec2';
import { App } from '../ui/App';
import { ActivitySideBar } from '../ui/ActivitySideBar';
import { Panel } from '../ui/Panel';
import { Button } from '../ui/Button';
import { FloatingToolbar } from '../ui/FloatingToolbar';
import { ProjectContext } from './KiCanvasShell';
// Import themes and Color
// No need for Color with empty theme approach
// import { Color } from '../../base/color';
import type { SchematicTheme } from '../../kicad/theme';

interface KiCanvasSchematicAppProps {
    controls?: 'none' | 'basic' | 'full';
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
    controls = 'full',
    controlslist,
    sidebarCollapsed = false,
    className = ''
}) => {
    const project = useContext(ProjectContext);
    
    if (!project) {
        console.error('KiCanvasSchematicApp must be used within a ProjectContext provider');
        return null;
    }
    const [viewer, setViewer] = useState<SchematicViewer | null>(null);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(sidebarCollapsed);

    // Create viewer ref
    const viewerRef = React.useRef<HTMLCanvasElement>(null);

    // Combine class names
    const classNames = [
        'kc-schematic-app',
        className
    ].filter(Boolean).join(' ');

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

        // Use empty object and cast to SchematicTheme
        // This is just for development - in production, use a proper theme
        const defaultTheme = {} as SchematicTheme;
        const newViewer = new SchematicViewer(viewerRef.current, true, defaultTheme);
        setViewer(newViewer);

        // Set up viewer
        // Set up document if available and active page exists
        if (project.active_page && project.active_page.document) {
            // Cast to appropriate type
            newViewer.document = project.active_page.document as any;
        }

        // Clean up
        return () => {
            newViewer.dispose();
        };
    }, [project, viewerRef]);

    // Define panel activities
    const activities: PanelActivity[] = [
        {
            id: 'info',
            title: 'Information',
            icon: 'info',
            component: (
                <Panel title="Information" className="info-panel">
                    <p>Schematic Info Panel</p>
                    {/* Add project information content here */}
                </Panel>
            )
        },
        {
            id: 'symbols',
            title: 'Symbols',
            icon: 'category',
            component: (
                <Panel title="Symbols" className="symbols-panel">
                    {/* Add symbols list here */}
                    <p>Symbols Panel</p>
                </Panel>
            )
        },
        {
            id: 'properties',
            title: 'Properties',
            icon: 'tune',
            component: (
                <Panel title="Properties" className="properties-panel">
                    {/* Add properties content here */}
                    <p>Properties Panel</p>
                </Panel>
            )
        }
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
                activities={activities.map(a => ({
                    id: a.id,
                    title: a.title,
                    icon: a.icon,
                    panel: a.component
                }))}
                collapsed={isSidebarCollapsed}
                onToggleCollapse={setIsSidebarCollapsed}
            />
            
            <div className="kc-viewer-container">
                <canvas ref={viewerRef} style={{ width: '100%', height: '100%' }} />
                
                {controls !== 'none' && (
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

KiCanvasSchematicApp.displayName = 'KiCanvasSchematicApp';