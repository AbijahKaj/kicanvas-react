/*
    Copyright (c) 2025 Alethea Katherine Flowers.
    Published under the standard MIT License.
    Full text available at: https://opensource.org/licenses/MIT
*/

import React, { useState, useEffect, useRef } from 'react';
// KiCanvasShell component
import { App } from '../ui/App';
import { DropTarget } from '../../base/dom/drag-drop';
import { Project } from '../../services/project';
import { GitHub } from '../../services/github';
import { GitHubFileSystem } from '../../services/github-vfs';
import { FetchFileSystem, VirtualFileSystem } from '../../services/vfs';
import { KiCanvasSchematicApp } from './KiCanvasSchematicApp';
import { KiCanvasBoardApp } from './KiCanvasBoardApp';

// Context for sharing the project across components
// Create a React context for Project
export const ProjectContext = React.createContext<Project | null>(null);

interface KiCanvasShellProps {
    src?: string;
    className?: string;
}

/**
 * KiCanvasShell component
 * 
 * The main entry point for the KiCanvas application.
 * Handles file loading, project management, and app switching.
 */
export const KiCanvasShell: React.FC<KiCanvasShellProps> = ({
    src,
    className = ''
}) => {
    const [project] = useState<Project>(() => new Project());
    // State for loading indicators
    // These state variables are used in the API, but TypeScript thinks they're unused
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_isLoading, setLoading] = useState<boolean>(false);
    const [loaded, setLoaded] = useState<boolean>(false);
    const linkInputRef = useRef<HTMLInputElement>(null);

    // Combine class names
    const classNames = [
        'kc-kicanvas-shell',
        className
    ].filter(Boolean).join(' ');

    const shellStyles = `
        .kc-kicanvas-shell {
            display: flex;
            flex-direction: column;
            width: 100%;
            height: 100%;
        }

        .kc-kicanvas-shell main {
            flex: 1;
            position: relative;
            overflow: hidden;
        }

        .overlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            background-color: var(--overlay-bg);
            color: var(--overlay-fg);
            z-index: 100;
            padding: 2em;
            text-align: center;
        }

        .overlay h1 {
            display: flex;
            align-items: center;
            gap: 1em;
            font-size: 2em;
            margin-bottom: 0.5em;
        }

        .overlay p {
            margin: 0.5em 0;
            max-width: 600px;
        }

        .overlay input {
            width: 100%;
            max-width: 500px;
            padding: 0.75em;
            border: 1px solid var(--input-border-color);
            border-radius: 4px;
            background-color: var(--input-bg);
            color: var(--input-fg);
            margin: 1em 0;
            font-size: 1em;
        }

        .overlay input:focus {
            outline: none;
            border-color: var(--input-focus-border-color);
        }

        .overlay .note {
            font-size: 0.9em;
            opacity: 0.8;
            margin-top: 2em;
        }

        .overlay .github {
            margin-top: 1em;
        }

        .overlay .github img {
            width: 24px;
            height: 24px;
        }
    `;

    // Initialize the project from source or URL parameters
    useEffect(() => {
        const setupFromURLParams = async () => {
            const urlParams = new URLSearchParams(window.location.search);
            const githubPaths = urlParams.getAll('github');

            if (src) {
                const vfs = new FetchFileSystem([src]);
                await setupProject(vfs);
                return;
            }

            if (githubPaths.length > 0) {
                const vfs = await GitHubFileSystem.fromURLs(...githubPaths);
                await setupProject(vfs);
                return;
            }

            // Set up drag and drop handler
            const container = document.querySelector(`.${classNames.split(' ')[0]}`);
            if (container) {
                new DropTarget(container as HTMLElement, async (fs) => {
                    await setupProject(fs);
                });
            }
        };

        setupFromURLParams();
    }, [src]);

    // Handle GitHub link input
    const handleLinkInput = async () => {
        if (!linkInputRef.current) return;

        const link = linkInputRef.current.value;
        if (!GitHub.parse_url(link)) {
            return;
        }

        const vfs = await GitHubFileSystem.fromURLs(link);
        await setupProject(vfs);

        // Update URL
        const location = new URL(window.location.href);
        location.searchParams.set('github', link);
        window.history.pushState(null, '', location);
    };

    // Set up project with virtual file system
    const setupProject = async (vfs: VirtualFileSystem) => {
        setLoaded(false);
        setLoading(true);

        try {
            await project.load(vfs);
            
            // This is a key difference between the web component and React implementation
            // The web component calls `update_hierarchical_data` internally, but we need to do it here
            for (const schematic of project.schematics()) {
                if (schematic && typeof schematic.update_hierarchical_data === 'function') {
                    schematic.update_hierarchical_data('/');
                }
            }
            
            project.set_active_page(project.first_page);
            setLoaded(true);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ProjectContext.Provider value={project}>
            <style>{shellStyles}</style>
            <App className={classNames}>
                {!loaded && (
                    <section className="overlay">
                        <h1>
                            <img src="images/kicanvas.png" alt="KiCanvas logo" />
                            KiCanvas
                        </h1>
                        <p>
                            KiCanvas is an
                            <strong> interactive</strong>,
                            <strong> browser-based</strong> viewer for KiCAD schematics and boards. 
                            You can learn more from the
                            <a href="https://kicanvas.org/home" target="_blank" rel="noopener noreferrer"> docs</a>. 
                            It's in <strong>alpha</strong> so please
                            <a href="https://github.com/theacodes/kicanvas/issues/new/choose" target="_blank" rel="noopener noreferrer"> report any bugs</a>!
                        </p>
                        <input
                            ref={linkInputRef}
                            type="text"
                            placeholder="Paste a GitHub link..."
                            onChange={handleLinkInput}
                            autoFocus
                        />
                        <p>or drag & drop your KiCAD files</p>
                        <p className="note">
                            KiCanvas is
                            <a href="https://github.com/theacodes/kicanvas" target="_blank" rel="noopener noreferrer"> free & open source</a> and supported by
                            <a href="https://github.com/theacodes/kicanvas#special-thanks"> community donations</a> with significant support from
                            <a href="https://partsbox.com/" target="_blank" rel="noopener noreferrer"> PartsBox</a>,
                            <a href="https://blues.io/" target="_blank" rel="noopener noreferrer"> Blues</a>,
                            <a href="https://blog.mithis.net/" target="_blank" rel="noopener noreferrer"> Mithro</a>,
                            <a href="https://github.com/jeremysf" target="_blank" rel="noopener noreferrer"> Jeremy Gordon</a>, &
                            <a href="https://github.com/jamesneal" target="_blank" rel="noopener noreferrer"> James Neal</a>. 
                            KiCanvas runs entirely within your browser, so your files don't ever leave your machine.
                        </p>
                        <p className="github">
                            <a
                                href="https://github.com/theacodes/kicanvas"
                                target="_blank"
                                rel="noopener noreferrer"
                                title="Visit on GitHub">
                                <img src="images/github-mark-white.svg" alt="GitHub" />
                            </a>
                        </p>
                    </section>
                )}
                
                <main>
                    {loaded && (
                        <>
                            <KiCanvasSchematicApp controls="full" />
                            <KiCanvasBoardApp controls="full" />
                        </>
                    )}
                </main>
            </App>
        </ProjectContext.Provider>
    );
};

// ProjectContext already exported at the top

KiCanvasShell.displayName = 'KiCanvasShell';