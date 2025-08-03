/*
    Copyright (c) 2025 Alethea Katherine Flowers.
    Published under the standard MIT License.
    Full text available at: https://opensource.org/licenses/MIT
*/

import { Component, createContext } from 'react';
import type { ReactNode } from 'react';
import type { IDisposable } from '../../base/disposable';

interface BaseProps {
    className?: string;
    children?: ReactNode;
}

/**
 * Base component for all KiCanvas React components
 * Provides common functionality and styling
 */
export class BaseComponent<P = {}, S = {}> extends Component<P & BaseProps, S> implements IDisposable {
    static contextProviders: Record<string, React.Context<any> | undefined> = {};
    private disposables: IDisposable[] = [];

    /**
     * Create a context provider for a specific key
     */
    static provideContext<T>(key: string, defaultValue: T): React.Context<T> | undefined {
        if (!this.contextProviders[key]) {
            this.contextProviders[key] = createContext<T>(defaultValue);
        }
        return this.contextProviders[key];
    }

    /**
     * Get a context for a specific key
     */
    static getContext<T>(key: string): React.Context<T> | undefined {
        return this.contextProviders[key];
    }

    /**
     * Add disposable objects to be cleaned up when component unmounts
     */
    protected registerDisposable(...disposables: IDisposable[]): void {
        this.disposables.push(...disposables);
    }

    /**
     * Clean up registered disposable objects
     */
    dispose(): void {
        for (const disposable of this.disposables) {
            disposable.dispose();
        }
        this.disposables = [];
    }

    override componentWillUnmount() {
        this.dispose();
    }
}

/**
 * Common CSS for all KiCanvas components
 */
export const commonStyles = `
    * {
        box-sizing: border-box;
    }

    [hidden] {
        display: none !important;
    }

    /* Scrollbar styling */
    ::-webkit-scrollbar {
        position: absolute;
        width: 6px;
        height: 6px;
        margin-left: -6px;
        background: var(--scrollbar-bg);
    }

    ::-webkit-scrollbar-thumb {
        position: absolute;
        background: var(--scrollbar-fg);
    }

    ::-webkit-scrollbar-thumb:hover {
        background: var(--scrollbar-hover-fg);
    }

    ::-webkit-scrollbar-thumb:active {
        background: var(--scrollbar-active-fg);
    }

    .invert-scrollbar::-webkit-scrollbar {
        position: absolute;
        width: 6px;
        height: 6px;
        margin-left: -6px;
        background: var(--scrollbar-fg);
    }

    .invert-scrollbar::-webkit-scrollbar-thumb {
        position: absolute;
        background: var(--scrollbar-bg);
    }

    .invert-scrollbar::-webkit-scrollbar-thumb:hover {
        background: var(--scrollbar-hover-bg);
    }

    .invert-scrollbar::-webkit-scrollbar-thumb:active {
        background: var(--scrollbar-active-bg);
    }
`;