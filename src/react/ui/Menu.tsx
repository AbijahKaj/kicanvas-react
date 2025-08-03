/*
    Copyright (c) 2025 Alethea Katherine Flowers.
    Published under the standard MIT License.
    Full text available at: https://opensource.org/licenses/MIT
*/

import React, { useState, useRef, useEffect } from 'react';
// Menu component

export interface MenuItem {
    id: string;
    label: string;
    icon?: string;
    disabled?: boolean;
    action?: () => void;
    // For submenus
    children?: MenuItem[];
}

interface MenuProps {
    items: MenuItem[];
    className?: string;
    horizontal?: boolean;
}

/**
 * Menu component
 * 
 * Renders a menu with clickable items and optional submenus
 */
export const Menu: React.FC<MenuProps> = ({
    items,
    className = '',
    horizontal = false
}) => {
    const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    // Combine class names
    const classNames = [
        'kc-menu',
        horizontal ? 'horizontal' : 'vertical',
        className
    ].filter(Boolean).join(' ');

    const menuStyles = `
        .kc-menu {
            display: flex;
            flex-direction: column;
            background-color: var(--menu-bg);
            border: 1px solid var(--menu-border-color);
            border-radius: 4px;
            overflow: hidden;
            min-width: 180px;
            z-index: 100;
        }

        .kc-menu.horizontal {
            flex-direction: row;
        }

        .kc-menu-item {
            display: flex;
            align-items: center;
            padding: 0.5em 1em;
            color: var(--menu-fg);
            cursor: pointer;
            user-select: none;
            position: relative;
            border: none;
            background: none;
            font-family: inherit;
            font-size: inherit;
            width: 100%;
            text-align: left;
            gap: 0.5em;
        }

        .kc-menu.horizontal .kc-menu-item {
            padding: 0.5em;
        }

        .kc-menu-item:hover {
            background-color: var(--menu-hover-bg);
            color: var(--menu-hover-fg);
        }

        .kc-menu-item[disabled] {
            opacity: 0.5;
            cursor: default;
            pointer-events: none;
        }

        .kc-menu-item-icon {
            flex-shrink: 0;
        }

        .kc-menu-item-label {
            flex-grow: 1;
        }

        .kc-menu-item-arrow {
            margin-left: auto;
        }

        .kc-submenu-container {
            position: relative;
        }

        .kc-submenu {
            position: absolute;
            top: 0;
            left: 100%;
            margin-top: -1px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
        }

        .kc-menu.horizontal .kc-submenu {
            top: 100%;
            left: 0;
            margin-top: 0;
        }
    `;

    // Close submenu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setActiveSubmenu(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Handle item click
    const handleItemClick = (item: MenuItem) => {
        if (item.disabled) return;

        if (item.children && item.children.length > 0) {
            setActiveSubmenu(activeSubmenu === item.id ? null : item.id);
        } else if (item.action) {
            item.action();
            setActiveSubmenu(null);
        }
    };

    // Render menu items recursively
    const renderMenuItems = (menuItems: MenuItem[], isSubmenu = false) => {
        return menuItems.map((item) => {
            const hasSubmenu = item.children && item.children.length > 0;
            const isActive = activeSubmenu === item.id;

            return (
                <div key={item.id} className="kc-submenu-container">
                    <button
                        className="kc-menu-item"
                        disabled={item.disabled}
                        onClick={() => handleItemClick(item)}
                    >
                        {item.icon && <span className="kc-menu-item-icon material-symbols-outlined">{item.icon}</span>}
                        <span className="kc-menu-item-label">{item.label}</span>
                        {hasSubmenu && (
                            <span className="kc-menu-item-arrow material-symbols-outlined">
                                {horizontal ? 'expand_more' : 'chevron_right'}
                            </span>
                        )}
                    </button>
                    {hasSubmenu && isActive && (
                        <div className="kc-submenu">
                            <Menu items={item.children || []} />
                        </div>
                    )}
                </div>
            );
        });
    };

    return (
        <>
            <style>{menuStyles}</style>
            <div ref={menuRef} className={classNames}>
                {renderMenuItems(items)}
            </div>
        </>
    );
};

Menu.displayName = 'Menu';