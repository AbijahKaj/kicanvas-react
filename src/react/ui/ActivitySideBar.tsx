/*
    Copyright (c) 2025 Alethea Katherine Flowers.
    Published under the standard MIT License.
    Full text available at: https://opensource.org/licenses/MIT
*/

import React, { useState, useEffect } from "react";
import { Button } from "./Button";

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
  className = "",
  collapsed = false,
  onToggleCollapse,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(collapsed);
  const [activeId, setActiveId] = useState<string | undefined>(
    initialActiveId || activities[0]?.id,
  );

  // Sync with collapsed prop changes
  useEffect(() => {
    setIsCollapsed(collapsed);
  }, [collapsed]);

  // Set initial active activity if none is set
  useEffect(() => {
    if (!activeId && activities.length > 0) {
      setActiveId(activities[0]?.id);
    }
  }, [activities, activeId]);

  // Find the active activity
  const activeActivity = activities.find(
    (activity) => activity.id === activeId,
  );

  // Combine class names
  const classNames = [
    "kc-activity-sidebar",
    isCollapsed ? "collapsed" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const activitySideBarStyles = `
        .kc-activity-sidebar {
            display: flex;
            height: 100%;
            overflow: hidden;
            min-width: calc(max(20%, 200px));
            max-width: calc(max(20%, 200px));
        }

        .kc-activity-buttons {
            display: flex;
            flex-direction: column;
            gap: 0.25em;
            padding: 0.2em;
            background-color: var(--activity-bar-bg, #282634);
            color: var(--activity-bar-fg, #f8f8f0);
            user-select: none;
            flex-grow: 0;
            flex-shrink: 0;
            z-index: 1;
        }

        .kc-activity-panel {
            flex: 1;
            overflow: auto;
            background-color: var(--panel-bg, #282634);
            border-right: 1px solid var(--panel-border-color, #444);
            display: block;
        }

        .kc-activity-sidebar.collapsed .kc-activity-panel {
            display: none;
        }

        .kc-activity-sidebar.collapsed {
            min-width: auto;
            max-width: none;
        }

        .kc-toggle-collapse {
            margin-top: auto;
        }

        /* Add missing CSS variables for toolbar buttons */
        :root {
            --button-toolbar-bg: #282634;
            --button-toolbar-fg: #f8f8f0;
            --button-toolbar-hover-bg: #282634;
            --button-toolbar-hover-fg: #81eeff;
            --button-toolbar-disabled-bg: #131218;
            --button-toolbar-disabled-fg: #888;
            --button-toolbar-selected-bg: #131218;
            --button-toolbar-selected-fg: #f8f8f0;
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
          {activities.map((activity) => (
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
            icon={isCollapsed ? "chevron_right" : "chevron_left"}
            variant="toolbar"
            onClick={handleToggleCollapse}
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          />
        </div>
        {!isCollapsed && activeActivity && (
          <div className="kc-activity-panel">{activeActivity.panel}</div>
        )}
      </div>
    </>
  );
};

ActivitySideBar.displayName = "ActivitySideBar";
