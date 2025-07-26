/*
    Copyright (c) 2023 Alethea Katherine Flowers.
    Published under the standard MIT License.
    Full text available at: https://opensource.org/licenses/MIT
*/

import React, { useState, useCallback } from 'react';
import { BaseComponent } from '../base/BaseComponent';
import { Icon } from './Icon';

export interface MenuItemData {
    name: string;
    icon?: string;
    disabled?: boolean;
    children?: React.ReactNode;
    data?: any; // Additional data associated with the item
}

export interface MenuProps {
    children?: React.ReactNode;
    items?: MenuItemData[];
    variant?: 'outline' | 'dropdown';
    selected?: string | null;
    className?: string;
    style?: React.CSSProperties;
    onSelect?: (name: string, item: MenuItemData) => void;
}

export interface MenuItemProps {
    name: string;
    icon?: string;
    selected?: boolean;
    disabled?: boolean;
    children?: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
    onClick?: () => void;
}

export interface MenuLabelProps {
    children?: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
}

const menuStyles = `
    .kc-ui-menu {
        width: 100%;
        display: flex;
        flex-direction: column;
        flex-wrap: nowrap;
        background: var(--list-item-bg);
        color: var(--list-item-fg);
    }

    .kc-ui-menu.outline .kc-ui-menu-item {
        border-bottom: 1px solid var(--grid-outline);
    }

    .kc-ui-menu.dropdown {
        --list-item-padding: 0.3em 0.6em;
        --list-item-bg: var(--dropdown-bg);
        --list-item-fg: var(--dropdown-fg);
        --list-item-hover-bg: var(--dropdown-hover-bg);
        --list-item-hover-fg: var(--dropdown-hover-fg);
        --list-item-active-bg: var(--dropdown-active-bg);
        --list-item-active-fg: var(--dropdown-active-fg);
        max-height: 50vh;
        overflow-y: auto;
    }
`;

const menuItemStyles = `
    .kc-ui-menu-item {
        display: flex;
        align-items: center;
        flex-wrap: nowrap;
        padding: var(--list-item-padding, 0.2em 0.3em);
        user-select: none;
        background: transparent;
        transition:
            color var(--transition-time-short) ease,
            background-color var(--transition-time-short) ease;
        cursor: pointer;
    }

    .kc-ui-menu-item:hover {
        background: var(--list-item-hover-bg);
        color: var(--list-item-hover-fg);
    }

    .kc-ui-menu-item.selected {
        background: var(--list-item-active-bg);
        color: var(--list-item-active-fg);
    }

    .kc-ui-menu-item.disabled {
        background: var(--list-item-disabled-bg);
        color: var(--list-item-disabled-fg);
        cursor: default;
    }

    .kc-ui-menu-item .content {
        flex: 1 1 100%;
        display: block;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
    }

    .kc-ui-menu-item .content.narrow {
        max-width: 100px;
    }

    .kc-ui-menu-item .content.very-narrow {
        max-width: 50px;
    }

    .kc-ui-menu-item .icon {
        margin-right: 0.5em;
        margin-left: -0.1em;
    }
`;

const menuLabelStyles = `
    .kc-ui-menu-label {
        width: 100%;
        display: flex;
        flex-wrap: nowrap;
        padding: 0.2em 0.3em;
        background: var(--panel-subtitle-bg);
        color: var(--panel-subtitle-fg);
    }
`;

export const Menu: React.FC<MenuProps> = ({
    children,
    items = [],
    variant,
    selected,
    className,
    style,
    onSelect
}) => {
    const [currentSelected, setCurrentSelected] = useState<string | null>(selected || null);

    const handleSelect = useCallback((name: string, item: MenuItemData) => {
        setCurrentSelected(name);
        onSelect?.(name, item);
    }, [onSelect]);

    const menuClassName = `kc-ui-menu ${variant || ''} ${className || ''}`.trim();

    return (
        <BaseComponent styles={menuStyles}>
            <div className={menuClassName} style={style} role="menu">
                {items.map((item) => (
                    <MenuItem
                        key={item.name}
                        name={item.name}
                        icon={item.icon}
                        selected={currentSelected === item.name}
                        disabled={item.disabled}
                        onClick={() => !item.disabled && handleSelect(item.name, item)}
                    >
                        {item.children}
                    </MenuItem>
                ))}
                {children}
            </div>
        </BaseComponent>
    );
};

export const MenuItem: React.FC<MenuItemProps> = ({
    name,
    icon,
    selected = false,
    disabled = false,
    children,
    className,
    style,
    onClick
}) => {
    const handleClick = useCallback((e: React.MouseEvent) => {
        if (disabled) return;
        
        // Prevent clicks on buttons from triggering item selection
        if ((e.target as HTMLElement).tagName === 'BUTTON' || 
            (e.target as HTMLElement).closest('button')) {
            return;
        }
        
        e.stopPropagation();
        onClick?.();
    }, [disabled, onClick]);

    const itemClassName = `kc-ui-menu-item ${selected ? 'selected' : ''} ${disabled ? 'disabled' : ''} ${className || ''}`.trim();

    return (
        <BaseComponent styles={menuItemStyles}>
            <div 
                className={itemClassName} 
                style={style} 
                role="menuitem"
                onClick={handleClick}
            >
                {icon && <Icon className="icon">{icon}</Icon>}
                <div className="content">{children}</div>
            </div>
        </BaseComponent>
    );
};

export const MenuLabel: React.FC<MenuLabelProps> = ({ children, className, style }) => {
    return (
        <BaseComponent styles={menuLabelStyles}>
            <div className={`kc-ui-menu-label ${className || ''}`} style={style}>
                {children}
            </div>
        </BaseComponent>
    );
};