/*
    Copyright (c) 2025 Alethea Katherine Flowers.
    Published under the standard MIT License.
    Full text available at: https://opensource.org/licenses/MIT
*/

import React, { useContext, useState, useEffect } from 'react';
import { Panel } from '../ui/Panel';
import { Button } from '../ui/Button';
import { ProjectContext } from './KiCanvasShell';
import type { ProjectPage } from '../../services/project';

interface ProjectPanelProps {
    className?: string;
}

/**
 * ProjectPanel component
 * 
 * Displays project pages and allows switching between them
 */
export const ProjectPanel: React.FC<ProjectPanelProps> = ({
    className = ''
}) => {
    const project = useContext(ProjectContext);
    const [pages, setPages] = useState<ProjectPage[]>([]);
    const [selectedPage, setSelectedPage] = useState<string | null>(null);

    // Combine class names
    const classNames = [
        'kc-project-panel',
        className
    ].filter(Boolean).join(' ');

    // Load project pages
    useEffect(() => {
        if (!project) return;

        // Get array of project pages
        const pageArray: ProjectPage[] = [];
        for (const page of project.pages()) {
            pageArray.push(page);
        }
        setPages(pageArray);

        // Set selected page to active page
        if (project.active_page) {
            setSelectedPage(project.active_page.project_path);
        }

        // Listen for project changes
        const handleProjectChange = () => {
            if (project.active_page) {
                setSelectedPage(project.active_page.project_path);
            }
        };

        // Add event listener
        project.addEventListener('change', handleProjectChange);

        // Clean up
        return () => {
            project.removeEventListener('change', handleProjectChange);
        };
    }, [project]);

    // Handle page selection
    const handlePageSelect = (page: ProjectPage) => {
        // First update our local state
        setSelectedPage(page.project_path);
        
        // Then update the project's active page
        // This will trigger the KiCanvasShell to update the visible viewer
        if (project) {
            console.log(`Switching to page: ${page.project_path} (type: ${page.type})`);
            
            // Force a new event dispatch even if selecting the same page
            if (project.active_page?.project_path === page.project_path) {
                // If it's the same page, we need to force a change event
                const event = new CustomEvent("change", { detail: project });
                setTimeout(() => {
                    project.dispatchEvent(event);
                }, 0);
            } else {
                // Different page, normal set_active_page will trigger change event
                project.set_active_page(page.project_path);
            }
        }
    };

    // Handle download
    const handleDownload = (e: React.MouseEvent, page: ProjectPage) => {
        e.stopPropagation(); // Prevent page selection
        project?.download(page.project_path);
    };

    const panelStyles = `
        /* Global styles for all components */
        :root {
            --dropdown-hover-bg: #444;
            --dropdown-bg: #282634;
        }

        .kc-project-panel {
            padding: 0;
        }

        .page-list {
            max-height: 400px;
            overflow: auto;
        }

        .page-item {
            display: flex;
            align-items: center;
            padding: 0.5em;
            cursor: pointer;
            border-bottom: 1px solid #444;
        }

        .page-item:hover {
            background-color: rgba(255,255,255,0.05);
        }

        .page-item.selected {
            background-color: var(--dropdown-bg);
        }

        .page-item .icon {
            margin-right: 0.5em;
            color: #f8f8f0;
            width: 24px;
            text-align: center;
        }

        .page-item .number {
            background: var(--dropdown-hover-bg);
            border-radius: 0.5em;
            font-size: 0.8em;
            padding: 0 0.3em;
            margin-right: 0.5em;
        }

        .page-item:hover .number {
            background: var(--dropdown-bg);
        }

        .page-item.selected:hover .number {
            background: var(--dropdown-hover-bg);
        }

        .page-item .name {
            flex: 1;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .page-item .filename {
            color: #aaa;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            text-align: right;
            margin-left: 1em;
            max-width: 100px;
        }
    `;

    return (
        <Panel title="Project" className={classNames}>
            <style>{panelStyles}</style>
            <div className="page-list">
                {pages.map(page => (
                    <div 
                        key={page.project_path}
                        className={`page-item ${selectedPage === page.project_path ? 'selected' : ''}`}
                        onClick={() => handlePageSelect(page)}
                    >
                        <span className="icon">
                            {page.type === 'schematic' ? 
                                <span className="material-symbols-outlined">description</span> : 
                                <span className="material-symbols-outlined">developer_board</span>
                            }
                        </span>
                        {page.page && <span className="number">{page.page}</span>}
                        <span className="name">{page.name || page.filename}</span>
                        {page.name && page.name !== page.filename && (
                            <span className="filename">{page.filename}</span>
                        )}
                        <Button 
                            icon="download"
                            variant="menu"
                            onClick={(e) => handleDownload(e, page)}
                            title="Download"
                        />
                    </div>
                ))}
            </div>
        </Panel>
    );
};

ProjectPanel.displayName = 'ProjectPanel';