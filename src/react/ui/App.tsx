/*
    Copyright (c) 2025 Alethea Katherine Flowers.
    Published under the standard MIT License.
    Full text available at: https://opensource.org/licenses/MIT
*/

import React, { useEffect } from 'react';
import { commonStyles } from '../base/BaseComponent';

interface AppProps {
    children: React.ReactNode;
    className?: string;
    theme?: string;
}

/**
 * App component
 * 
 * Root container for the application providing theme support
 */
export const App: React.FC<AppProps> = ({ children, className = '', theme = 'default' }) => {
    // Combine class names
    const classNames = [
        'kc-app',
        `theme-${theme}`,
        className
    ].filter(Boolean).join(' ');

    // Apply document-level attributes when mounted
    useEffect(() => {
        const htmlElement = document.documentElement;
        htmlElement.classList.add(`theme-${theme}`);
        
        return () => {
            htmlElement.classList.remove(`theme-${theme}`);
        };
    }, [theme]);

    const appStyles = `
        ${commonStyles}
        
        .kc-app {
            display: flex;
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            margin: 0;
            padding: 0;
            overflow: hidden;
            background-color: var(--bg);
            color: var(--fg);
            font-family: "Nunito", ui-rounded, "Hiragino Maru Gothic ProN",
                Quicksand, Comfortaa, Manjari, "Arial Rounded MT Bold", Calibri,
                source-sans-pro, sans-serif;
        }
    `;

    return (
        <>
            <style>{appStyles}</style>
            <div className={classNames}>
                {children}
            </div>
        </>
    );
};

App.displayName = 'App';