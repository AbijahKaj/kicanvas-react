/*
    Copyright (c) 2023 Alethea Katherine Flowers.
    Published under the standard MIT License.
    Full text available at: https://opensource.org/licenses/MIT
*/

import React from 'react';
import { BaseComponent } from '../base/BaseComponent';

export interface PanelProps {
    children?: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
}

export interface PanelTitleProps {
    title?: string;
    children?: React.ReactNode;
    actions?: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
}

export interface PanelBodyProps {
    children?: React.ReactNode;
    padded?: boolean;
    className?: string;
    style?: React.CSSProperties;
}

export interface PanelLabelProps {
    children?: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
}

const panelStyles = `
    .kc-ui-panel {
        width: 100%;
        height: 100%;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        background: var(--panel-bg);
        color: var(--panel-fg);
        --bg: var(--panel-bg);
    }

    .kc-ui-panel:last-child {
        flex-grow: 1;
    }
`;

const panelTitleStyles = `
    .kc-ui-panel-title {
        flex: 0;
        width: 100%;
        text-align: left;
        padding: 0.2em 0.8em 0.2em 0.4em;
        display: flex;
        align-items: center;
        background: var(--panel-title-bg);
        color: var(--panel-title-fg);
        border-top: var(--panel-title-border);
        user-select: none;
    }

    .kc-ui-panel-title .title {
        flex: 1;
    }

    .kc-ui-panel-title .actions {
        flex: 0 1;
        display: flex;
        flex-direction: row;
        /* cheeky hack to work around scrollbar causing placement to be off. */
        padding-right: 6px;
    }
`;

const panelBodyStyles = `
    .kc-ui-panel-body {
        width: 100%;
        min-height: 0;
        overflow-y: auto;
        overflow-x: hidden;
        flex: 1 0;
        font-weight: 300;
        font-size: 1em;
    }

    .kc-ui-panel-body.padded {
        padding: 0.1em 0.8em 0.1em 0.4em;
    }
`;

const panelLabelStyles = `
    .kc-ui-panel-label {
        width: 100%;
        display: flex;
        flex-wrap: nowrap;
        padding: 0.2em 0.3em;
        background: var(--panel-subtitle-bg);
        color: var(--panel-subtitle-fg);
    }
`;

export const Panel: React.FC<PanelProps> = ({ children, className, style }) => {
    return (
        <BaseComponent styles={panelStyles}>
            <div className={`kc-ui-panel ${className || ''}`} style={style}>
                {children}
            </div>
        </BaseComponent>
    );
};

export const PanelTitle: React.FC<PanelTitleProps> = ({ 
    title, 
    children, 
    actions, 
    className, 
    style 
}) => {
    return (
        <BaseComponent styles={panelTitleStyles}>
            <div className={`kc-ui-panel-title ${className || ''}`} style={style}>
                <div className="title">{title || children}</div>
                <div className="actions">{actions}</div>
            </div>
        </BaseComponent>
    );
};

export const PanelBody: React.FC<PanelBodyProps> = ({ 
    children, 
    padded = false, 
    className, 
    style 
}) => {
    return (
        <BaseComponent styles={panelBodyStyles}>
            <div 
                className={`kc-ui-panel-body ${padded ? 'padded' : ''} ${className || ''}`} 
                style={style}
            >
                {children}
            </div>
        </BaseComponent>
    );
};

export const PanelLabel: React.FC<PanelLabelProps> = ({ children, className, style }) => {
    return (
        <BaseComponent styles={panelLabelStyles}>
            <div className={`kc-ui-panel-label ${className || ''}`} style={style}>
                {children}
            </div>
        </BaseComponent>
    );
};