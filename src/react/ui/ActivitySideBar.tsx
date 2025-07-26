/*
    Copyright (c) 2023 Alethea Katherine Flowers.
    Published under the standard MIT License.
    Full text available at: https://opensource.org/licenses/MIT
*/

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { BaseComponent } from '../base/BaseComponent';
import { Button } from './Button';

export interface ActivityData {
    name: string;
    icon: string;
    buttonLocation?: 'top' | 'bottom';
    content: React.ReactNode;
}

export interface ActivitySideBarProps {
    activities: ActivityData[];
    collapsed?: boolean;
    onActivityChange?: (activityName: string | null) => void;
    className?: string;
    style?: React.CSSProperties;
}

const activitySideBarStyles = `
    .kc-ui-activity-side-bar {
        flex-shrink: 0;
        display: flex;
        flex-direction: row;
        height: 100%;
        overflow: hidden;
        min-width: calc(max(20%, 200px));
        max-width: calc(max(20%, 200px));
    }

    .kc-ui-activity-side-bar > div {
        display: flex;
        overflow: hidden;
        flex-direction: column;
    }

    .kc-ui-activity-side-bar .bar {
        flex-grow: 0;
        flex-shrink: 0;
        height: 100%;
        z-index: 1;
        display: flex;
        flex-direction: column;
        background: var(--activity-bar-bg);
        color: var(--activity-bar-fg);
        padding: 0.2em;
        user-select: none;
    }

    .kc-ui-activity-side-bar .start {
        flex: 1;
    }

    .kc-ui-activity-side-bar .activities {
        flex-grow: 1;
    }

    .kc-ui-activity-side-bar .kc-ui-button {
        --button-bg: transparent;
        --button-fg: var(--activity-bar-fg);
        --button-hover-bg: var(--activity-bar-active-bg);
        --button-hover-fg: var(--activity-bar-active-fg);
        --button-selected-bg: var(--activity-bar-active-bg);
        --button-selected-fg: var(--activity-bar-active-fg);
        --button-focus-outline: none;
        margin-bottom: 0.25em;
    }

    .kc-ui-activity-side-bar .kc-ui-button:last-child {
        margin-bottom: 0;
    }

    .kc-ui-activity-side-bar .activity-content {
        display: none;
        height: 100%;
    }

    .kc-ui-activity-side-bar .activity-content.active {
        display: block;
    }

    .kc-ui-activity-side-bar.collapsed {
        width: unset;
        min-width: unset;
        max-width: '';
    }

    .kc-ui-activity-side-bar.collapsed .activities {
        width: 0px;
    }
`;

/**
 * ActivitySideBar is a VSCode-style side bar with an action bar with icons
 * and a panel with various activities. React equivalent of kc-ui-activity-side-bar.
 */
export const ActivitySideBar: React.FC<ActivitySideBarProps> = ({ 
    activities, 
    collapsed = false,
    onActivityChange,
    className, 
    style, 
    ...props 
}) => {
    const [currentActivity, setCurrentActivity] = useState<string | null>(
        !collapsed && activities.length > 0 ? (activities[0]?.name.toLowerCase() || null) : null
    );
    const [isCollapsed, setIsCollapsed] = useState(collapsed);
    const activitiesContainerRef = useRef<HTMLDivElement>(null);

    // Update collapsed state when prop changes
    useEffect(() => {
        setIsCollapsed(collapsed);
        if (collapsed) {
            setCurrentActivity(null);
        } else if (!currentActivity && activities.length > 0) {
            setCurrentActivity(activities[0]?.name.toLowerCase() || null);
        }
    }, [collapsed, activities.length, currentActivity]);

    // Notify parent of activity changes
    useEffect(() => {
        if (onActivityChange) {
            onActivityChange(currentActivity);
        }
    }, [currentActivity, onActivityChange]);

    const handleActivityClick = useCallback((activityName: string) => {
        const normalizedName = activityName.toLowerCase();
        
        if (currentActivity === normalizedName) {
            // Clicking on the selected activity will deselect it
            setCurrentActivity(null);
            setIsCollapsed(true);
        } else {
            setCurrentActivity(normalizedName);
            setIsCollapsed(false);
        }
    }, [currentActivity]);

    // Separate activities by button location
    const topActivities = activities.filter(a => a.buttonLocation !== 'bottom');
    const bottomActivities = activities.filter(a => a.buttonLocation === 'bottom');

    const renderButtons = (activitiesToRender: ActivityData[]) => {
        return activitiesToRender.map((activity) => (
            <Button
                key={activity.name}
                variant="toolbar"
                icon={activity.icon}
                name={activity.name.toLowerCase()}
                selected={currentActivity === activity.name.toLowerCase()}
                onClick={() => handleActivityClick(activity.name)}
            />
        ));
    };

    const classes = [
        'kc-ui-activity-side-bar',
        isCollapsed && 'collapsed',
        className
    ].filter(Boolean).join(' ');

    const containerStyle = isCollapsed ? {
        width: 'unset',
        minWidth: 'unset',
        maxWidth: ''
    } : {};

    const activitiesStyle = isCollapsed ? { width: '0px' } : {};

    return (
        <BaseComponent
            className={classes}
            style={{ ...containerStyle, ...style }}
            styles={activitySideBarStyles}
            {...props}>
            <div className="bar">
                <div className="start">
                    {renderButtons(topActivities)}
                </div>
                <div className="end">
                    {renderButtons(bottomActivities)}
                </div>
            </div>
            <div 
                className="activities" 
                ref={activitiesContainerRef}
                style={activitiesStyle}>
                {activities.map((activity) => (
                    <div
                        key={activity.name}
                        className={`activity-content${currentActivity === activity.name.toLowerCase() ? ' active' : ''}`}>
                        {activity.content}
                    </div>
                ))}
            </div>
        </BaseComponent>
    );
};