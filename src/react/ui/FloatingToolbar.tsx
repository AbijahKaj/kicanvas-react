/*
    Copyright (c) 2025 Alethea Katherine Flowers.
    Published under the standard MIT License.
    Full text available at: https://opensource.org/licenses/MIT
*/

import React from 'react';
import type { ReactNode } from 'react';

interface FloatingToolbarProps {
    position?: 'top' | 'bottom';
    align?: 'left' | 'center' | 'right';
    className?: string;
    children?: ReactNode;
}

/**
 * FloatingToolbar component
 * 
 * A positioned toolbar that floats over content
 */
export const FloatingToolbar: React.FC<FloatingToolbarProps> = ({
    position = 'bottom',
    align = 'center',
    className = '',
    children
}) => {
    // Combine class names
    const classNames = [
        'kc-floating-toolbar',
        `position-${position}`,
        `align-${align}`,
        className
    ].filter(Boolean).join(' ');

    const floatingToolbarStyles = `
        .kc-floating-toolbar {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5em;
            position: absolute;
            padding: 0.5em;
            background-color: var(--toolbar-bg);
            border-radius: 4px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
            z-index: 50;
            transition: 
                opacity var(--transition-time-short) ease,
                transform var(--transition-time-short) ease;
        }

        .kc-floating-toolbar.position-top {
            top: 1em;
        }

        .kc-floating-toolbar.position-bottom {
            bottom: 1em;
        }

        .kc-floating-toolbar.align-left {
            left: 1em;
            transform: translateX(0);
        }

        .kc-floating-toolbar.align-center {
            left: 50%;
            transform: translateX(-50%);
        }

        .kc-floating-toolbar.align-right {
            right: 1em;
            transform: translateX(0);
        }

        /* Special styling for button groups */
        .kc-floating-toolbar .button-group {
            display: flex;
            border-radius: 4px;
            overflow: hidden;
        }

        .kc-floating-toolbar .button-group > * {
            margin: 0;
            border-radius: 0;
        }

        .kc-floating-toolbar .button-group > *:first-child {
            border-top-left-radius: 4px;
            border-bottom-left-radius: 4px;
        }

        .kc-floating-toolbar .button-group > *:last-child {
            border-top-right-radius: 4px;
            border-bottom-right-radius: 4px;
        }

        .kc-floating-toolbar .separator {
            width: 1px;
            background-color: var(--toolbar-separator-color);
            align-self: stretch;
            margin: 0 0.25em;
        }
    `;

    return (
        <>
            <style>{floatingToolbarStyles}</style>
            <div className={classNames}>
                {children}
            </div>
        </>
    );
};

// Helper components for toolbar organization
export const ButtonGroup: React.FC<{ children?: ReactNode }> = ({ children }) => {
    return <div className="button-group">{children}</div>;
};

export const Separator: React.FC = () => {
    return <div className="separator"></div>;
};

FloatingToolbar.displayName = 'FloatingToolbar';