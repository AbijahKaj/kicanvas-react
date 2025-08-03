/*
    Copyright (c) 2025 Alethea Katherine Flowers.
    Published under the standard MIT License.
    Full text available at: https://opensource.org/licenses/MIT
*/

import React, { useState } from 'react';
// Panel component
import { Button } from './Button';

interface PanelProps {
    title?: string;
    icon?: string;
    children?: React.ReactNode;
    className?: string;
    collapsible?: boolean;
    initialCollapsed?: boolean;
}

/**
 * Panel component
 * 
 * Provides a container with optional header and collapsible content
 */
export const Panel: React.FC<PanelProps> = ({ 
    title, 
    icon, 
    children, 
    className = '',
    collapsible = false,
    initialCollapsed = false
}) => {
    const [collapsed, setCollapsed] = useState(initialCollapsed);

    // Combine class names
    const classNames = [
        'kc-panel',
        collapsed ? 'collapsed' : '',
        className
    ].filter(Boolean).join(' ');

    const panelStyles = `
        .kc-panel {
            display: flex;
            flex-direction: column;
            background: var(--panel-bg);
            color: var(--panel-fg);
            width: 100%;
            height: 100%;
            max-height: 100%;
            overflow: hidden;
        }

        .kc-panel-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0.5em;
            border-bottom: 1px solid var(--panel-border-color);
            background: var(--panel-header-bg);
            color: var(--panel-header-fg);
            font-weight: 600;
        }

        .kc-panel-header-title {
            display: flex;
            align-items: center;
            gap: 0.5em;
        }

        .kc-panel-content {
            flex: 1;
            overflow: auto;
            padding: 0.5em;
        }

        .kc-panel.collapsed .kc-panel-content {
            display: none;
        }
    `;

    const handleToggleCollapse = () => {
        setCollapsed(!collapsed);
    };

    return (
        <>
            <style>{panelStyles}</style>
            <div className={classNames}>
                {(title || collapsible) && (
                    <div className="kc-panel-header">
                        <div className="kc-panel-header-title">
                            {icon && <span className="material-symbols-outlined">{icon}</span>}
                            {title}
                        </div>
                        {collapsible && (
                            <Button 
                                onClick={handleToggleCollapse} 
                                icon={collapsed ? 'expand_more' : 'expand_less'} 
                                variant="toolbar" 
                                aria-label={collapsed ? 'Expand' : 'Collapse'}
                            />
                        )}
                    </div>
                )}
                <div className="kc-panel-content">
                    {children}
                </div>
            </div>
        </>
    );
};

Panel.displayName = 'Panel';