/*
    Copyright (c) 2025 Alethea Katherine Flowers.
    Published under the standard MIT License.
    Full text available at: https://opensource.org/licenses/MIT
*/

import React from 'react';
// Icon component

interface IconProps {
    children?: string;
    className?: string;
    material?: boolean;
}

/**
 * Icon component
 * 
 * Displays icons from icon sets or sprite sheets
 */
export const Icon: React.FC<IconProps> = ({ children, className = '', material = false }) => {
    // Combine class names
    const classNames = [
        'kc-icon',
        material ? 'material-symbols-outlined' : '',
        className
    ].filter(Boolean).join(' ');

    const iconStyles = `
        .kc-icon {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            user-select: none;
        }

        .kc-icon.material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 48;
        }
    `;

    if (!children) {
        return null;
    }

    // For sprites (non-material icons), use a different approach
    if (!material && children.startsWith('#')) {
        // Use SVG to render icon from sprite sheet
        return (
            <>
                <style>{iconStyles}</style>
                <svg className={classNames} aria-hidden="true">
                    <use href={children} />
                </svg>
            </>
        );
    }

    // For material icons or text icons
    return (
        <>
            <style>{iconStyles}</style>
            <span className={classNames} aria-hidden="true">
                {children}
            </span>
        </>
    );
};

// Static property for sprite URL (similar to the original web component)
export let spritesUrl = '/sprites.svg';

// Function to set sprites URL
export function setSpritesUrl(url: string): void {
    spritesUrl = url;
}

Icon.displayName = 'Icon';