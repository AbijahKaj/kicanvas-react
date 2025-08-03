/*
    Copyright (c) 2025 Alethea Katherine Flowers.
    Published under the standard MIT License.
    Full text available at: https://opensource.org/licenses/MIT
*/

import React, { useState } from 'react';
import { Button } from './Button';

interface Activity {
    id: string;
    title: string;
    icon: string;
    panel: React.ReactNode;
}

interface ActivitySideBarProps {
    activities: Activity[];
    initialActiveId?: string;
    className?: string;
    collapsed?: boolean;
    onToggleCollapse?: (collapsed: boolean) => void;
}

/**
 * ActivitySideBar component
 * 
 * A sidebar with activity buttons that show associated panels
 */
export const ActivitySideBar: React.FC<ActivitySideBarProps> = ({
    activities,
    initialActiveId,
    className = '',
    collapsed = false,
    onToggleCollapse
}) => {
    const [isCollapsed, setIsCollapsed] = useState(collapsed);
    const [activeId, setActiveId] = useState<string | undefined>(initialActiveId);

    // Find the active activity
    const activeActivity = activities.find(activity => activity.id === activeId);

    // Combine class names
    const classNames = [
        'kc-activity-sidebar',
        isCollapsed ? 'collapsed' : '',
        className
    ].filter(Boolean).join(' ');

    const activitySideBarStyles = `
        .kc-activity-sidebar {
            display: flex;
            height: 100%;
            overflow: hidden;
        }

        .kc-activity-buttons {
            display: flex;
            flex-direction: column;
            gap: 0.5em;
            padding: 0.5em;
            background-color: var(--sidebar-bg);
            border-right: 1px solid var(--sidebar-border-color);
        }

        .kc-activity-panel {
            flex: 1;
            overflow: auto;
            background-color: var(--panel-bg);
            border-right: 1px solid var(--panel-border-color);
        }

        .kc-activity-sidebar.collapsed .kc-activity-panel {
            display: none;
        }

        .kc-toggle-collapse {
            margin-top: auto;
        }
    `;

    // Handle activity button click
    const handleActivityClick = (id: string) => {
        if (id === activeId && !isCollapsed) {
            setIsCollapsed(true);
            if (onToggleCollapse) {
                onToggleCollapse(true);
            }
        } else {
            setActiveId(id);
            setIsCollapsed(false);
            if (onToggleCollapse) {
                onToggleCollapse(false);
            }
        }
    };

    // Handle collapse toggle
    const handleToggleCollapse = () => {
        const newCollapsed = !isCollapsed;
        setIsCollapsed(newCollapsed);
        if (onToggleCollapse) {
            onToggleCollapse(newCollapsed);
        }
    };

    return (
        <>
            <style>{activitySideBarStyles}</style>
            <div className={classNames}>
                <div className="kc-activity-buttons">
                    {activities.map(activity => (
                        <Button
                            key={activity.id}
                            icon={activity.icon}
                            variant="toolbar"
                            selected={activity.id === activeId && !isCollapsed}
                            onClick={() => handleActivityClick(activity.id)}
                            title={activity.title}
                            aria-label={activity.title}
                        />
                    ))}
                    <Button
                        className="kc-toggle-collapse"
                        icon={isCollapsed ? 'chevron_right' : 'chevron_left'}
                        variant="toolbar"
                        onClick={handleToggleCollapse}
                        title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                        aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                    />
                </div>
                {!isCollapsed && activeActivity && (
                    <div className="kc-activity-panel">
                        {activeActivity.panel}
                    </div>
                )}
            </div>
        </>
    );
};

ActivitySideBar.displayName = 'ActivitySideBar';