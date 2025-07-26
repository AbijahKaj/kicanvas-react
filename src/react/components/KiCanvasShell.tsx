/*
    Copyright (c) 2023 Alethea Katherine Flowers.
    Published under the standard MIT License.
    Full text available at: https://opensource.org/licenses/MIT
*/

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { BaseComponent, KiCanvasProvider } from '../base/BaseComponent';
import { App } from '../ui/App';
import { Project } from '../../kicanvas/project';

export interface KiCanvasShellProps {
    src?: string;
    loading?: boolean;
    loaded?: boolean;
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
 * React equivalent of KiCanvasShellElement.
 */
export const KiCanvasShell: React.FC<KiCanvasShellProps> = ({
    src,
    loading = false,
    loaded = false,
    className,
    style,
    children,
    ...props
}) => {
    const [project] = useState(() => new Project());
    const [isLoaded, setIsLoaded] = useState(loaded);
    const [linkValue, setLinkValue] = useState('');
    const schematicAppRef = useRef<HTMLElement | null>(null);
    const boardAppRef = useRef<HTMLElement | null>(null);

    useEffect(() => {
        const initializeFromURL = async () => {
            const urlParams = new URLSearchParams(window.location.search);
            const githubPaths = urlParams.getAll('github');

            if (src) {
                const { FetchFileSystem } = await import('../../kicanvas/services/vfs');
                const vfs = new FetchFileSystem([src]);
                await setupProject(vfs);
                return;
            }

            if (githubPaths.length) {
                const { GitHubFileSystem } = await import('../../kicanvas/services/github-vfs');
                const vfs = await GitHubFileSystem.fromURLs(...githubPaths);
                await setupProject(vfs);
                return;
            }

            // Set up drag and drop for files
            setupDropTarget();
        };

        initializeFromURL();
    }, [src]);

    const setupProject = async (vfs: any) => {
        setIsLoaded(false);

        try {
            await project.load?.(vfs);
            if (project.set_active_page && project.first_page) {
                project.set_active_page(project.first_page);
            }
            setIsLoaded(true);
        } catch (error) {
            console.error('Failed to load project:', error);
        }
    };

    const setupDropTarget = () => {
        // In a real implementation, this would set up file drag/drop handling
        // For now, we'll just show a placeholder
        console.log('Drop target setup - file drag/drop would be implemented here');
    };

    const handleLinkInput = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
        const link = e.target.value;
        setLinkValue(link);

        if (!link) return;

        // Check if it's a GitHub URL
        const { GitHub } = await import('../../kicanvas/services/github');
        if (!GitHub.parse_url?.(link)) {
            return;
        }

        try {
            const { GitHubFileSystem } = await import('../../kicanvas/services/github-vfs');
            const vfs = await GitHubFileSystem.fromURLs(link);
            await setupProject(vfs);

            // Update URL
            const location = new URL(window.location.href);
            location.searchParams.set('github', link);
            window.history.pushState(null, '', location);
        } catch (error) {
            console.error('Failed to load from GitHub:', error);
        }
    }, []);

    // Create app elements using web components for now
    useEffect(() => {
        if (!isLoaded || !project) return;

        // Create schematic app
        if (!schematicAppRef.current) {
            const schematicApp = document.createElement('kc-schematic-app');
            schematicApp.setAttribute('controls', 'full');
            schematicAppRef.current = schematicApp;
        }

        // Create board app
        if (!boardAppRef.current) {
            const boardApp = document.createElement('kc-board-app');
            boardApp.setAttribute('controls', 'full');
            boardAppRef.current = boardApp;
        }
    }, [isLoaded, project]);

    const contextValue = {
        project: project
    };

    const classes = [
        'kc-shell',
        className
    ].filter(Boolean).join(' ');

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
                                KiCanvas is an <strong>interactive</strong>, <strong>browser-based</strong> viewer for KiCAD schematics and boards. You can learn more from the{' '}
                                <a href="https://kicanvas.org/home" target="_blank" rel="noopener noreferrer">
                                    docs
                                </a>
                                . It's in <strong>alpha</strong> so please{' '}
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
                            <p className="note">
                                KiCanvas is{' '}
                                <a
                                    href="https://github.com/theacodes/kicanvas"
                                    target="_blank"
                                    rel="noopener noreferrer">
                                    free & open source
                                </a>{' '}
                                and supported by{' '}
                                <a href="https://github.com/theacodes/kicanvas#special-thanks">
                                    community donations
                                </a>{' '}
                                with significant support from{' '}
                                <a href="https://partsbox.com/" target="_blank" rel="noopener noreferrer">
                                    PartsBox
                                </a>
                                ,{' '}
                                <a href="https://blues.io/" target="_blank" rel="noopener noreferrer">
                                    Blues
                                </a>
                                ,{' '}
                                <a href="https://blog.mithis.net/" target="_blank" rel="noopener noreferrer">
                                    Mithro
                                </a>
                                ,{' '}
                                <a href="https://github.com/jeremysf">Jeremy Gordon</a>, &{' '}
                                <a href="https://github.com/jamesneal" target="_blank" rel="noopener noreferrer">
                                    James Neal
                                </a>
                                . KiCanvas runs entirely within your browser, so your files don't ever leave your machine.
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
                        {children}
                    </main>
                </App>
            </BaseComponent>
        </KiCanvasProvider>
    );
};