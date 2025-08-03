/*
    Copyright (c) 2025 Alethea Katherine Flowers.
    Published under the standard MIT License.
    Full text available at: https://opensource.org/licenses/MIT
*/

import React, { useState, useContext, useEffect } from 'react';
// KiCanvasBoardApp component
import { BoardViewer } from '../../viewers/board/viewer';
import { Vec2 } from '../../base/math/vec2';
import { App } from '../ui/App';
import { ActivitySideBar } from '../ui/ActivitySideBar';
import { Panel } from '../ui/Panel';
import { Button } from '../ui/Button';
import { FloatingToolbar } from '../ui/FloatingToolbar';
import { ProjectContext } from './KiCanvasShell';
import { Project } from '../../services/project';

interface KiCanvasBoardAppProps {
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
 * KiCanvasBoardApp component
 * 
 * The board viewer application component with UI controls
 */
export const KiCanvasBoardApp: React.FC<KiCanvasBoardAppProps> = ({
    controls = 'full',
    controlslist,
    sidebarCollapsed = false,
    className = ''
}) => {
    const project = useContext(ProjectContext);
    
    if (!project) {
        console.error('KiCanvasBoardApp must be used within a ProjectContext provider');
        return null;
    }
    const [viewer, setViewer] = useState<BoardViewer | null>(null);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(sidebarCollapsed);
    
    // Create viewer ref
    const viewerRef = React.useRef<HTMLCanvasElement>(null);

    // Combine class names
    const classNames = [
        'kc-board-app',
        className
    ].filter(Boolean).join(' ');

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
    `;

    // Initialize viewer
    useEffect(() => {
        if (!viewerRef.current || !project) return;

        // Interactive is true, using default theme
        const newViewer = new BoardViewer(viewerRef.current, true, {});
        setViewer(newViewer);

        // Set up viewer
        // Set up document if available
        if (project.document) {
            newViewer.document = project.document;
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
                    <p>Board Info Panel</p>
                    {/* Add project information content here */}
                </Panel>
            )
        },
        {
            id: 'layers',
            title: 'Layers',
            icon: 'layers',
            component: (
                <Panel title="Layers" className="layers-panel">
                    {/* Add layers list here */}
                    <p>Layers Panel</p>
                </Panel>
            )
        },
        {
            id: 'footprints',
            title: 'Footprints',
            icon: 'developer_board',
            component: (
                <Panel title="Footprints" className="footprints-panel">
                    {/* Add footprints list here */}
                    <p>Footprints Panel</p>
                </Panel>
            )
        },
        {
            id: 'nets',
            title: 'Nets',
            icon: 'account_tree',
            component: (
                <Panel title="Nets" className="nets-panel">
                    {/* Add nets list here */}
                    <p>Nets Panel</p>
                </Panel>
            )
        },
        {
            id: 'objects',
            title: 'Objects',
            icon: 'category',
            component: (
                <Panel title="Objects" className="objects-panel">
                    {/* Add objects list here */}
                    <p>Objects Panel</p>
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

    // Toggle layer visibility controls would go here

    return (
        <App className={classNames + ` controls-${controls}`}>
            <style>{boardAppStyles}</style>
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

KiCanvasBoardApp.displayName = 'KiCanvasBoardApp';