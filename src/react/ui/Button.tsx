/*
    Copyright (c) 2025 Alethea Katherine Flowers.
    Published under the standard MIT License.
    Full text available at: https://opensource.org/licenses/MIT
*/

import { forwardRef } from 'react';
import type { ButtonHTMLAttributes } from 'react';
// Button component
import { Icon } from './Icon';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    icon?: string;
    variant?: 'outline' | 'toolbar' | 'toolbar-alt' | 'menu';
    selected?: boolean;
}

/**
 * Button component
 * 
 * Supports different variants and icon display
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ children, icon, variant, className = '', selected, ...props }, ref) => {
        // Combine class names including variant and selected state
        const classNames = [
            'kc-button',
            variant || '',
            selected ? 'selected' : '',
            className
        ].filter(Boolean).join(' ');

        const buttonStyles = `
            .kc-button {
                all: unset;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                padding: 0.5em;
                border: 1px solid transparent;
                border-radius: 0.25em;
                font-weight: medium;
                font-size: 1em;
                background: var(--button-bg);
                color: var(--button-fg);
                cursor: pointer;
                transition:
                    color var(--transition-time-short) ease,
                    border var(--transition-time-short) ease,
                    background var(--transition-time-short) ease;
            }

            .kc-button:hover {
                background: var(--button-hover-bg);
                color: var(--button-hover-fg);
            }

            .kc-button:disabled {
                background: var(--button-disabled-bg);
                color: var(--button-disabled-fg);
                cursor: default;
            }

            .kc-button:focus {
                outline: var(--button-focus-outline);
            }

            .kc-button.selected {
                background: var(--button-selected-bg);
                color: var(--button-selected-fg);
            }

            /* Button variants */
            .kc-button.outline {
                background: var(--button-outline-bg);
                color: var(--button-outline-fg);
            }

            .kc-button.outline:hover {
                background: var(--button-outline-hover-bg);
                color: var(--button-outline-hover-fg);
            }

            .kc-button.outline:disabled {
                background: var(--button-outline-disabled-bg);
                color: var(--button-outline-disabled-fg);
            }

            .kc-button.outline.selected {
                background: var(--button-outline-selected-bg);
                color: var(--button-outline-selected-fg);
            }

            .kc-button.toolbar {
                background: var(--button-toolbar-bg);
                color: var(--button-toolbar-fg);
            }

            .kc-button.toolbar:hover {
                background: var(--button-toolbar-hover-bg);
                color: var(--button-toolbar-hover-fg);
            }

            .kc-button.toolbar:disabled {
                background: var(--button-toolbar-disabled-bg);
                color: var(--button-toolbar-disabled-fg);
            }

            .kc-button.toolbar.selected {
                background: var(--button-toolbar-selected-bg);
                color: var(--button-toolbar-selected-fg);
            }

            .kc-button.toolbar-alt {
                background: var(--button-toolbar-alt-bg);
                color: var(--button-toolbar-alt-fg);
            }

            .kc-button.toolbar-alt:hover {
                background: var(--button-toolbar-alt-hover-bg);
                color: var(--button-toolbar-alt-hover-fg);
            }

            .kc-button.toolbar-alt:disabled {
                background: var(--button-toolbar-alt-disabled-bg);
                color: var(--button-toolbar-alt-disabled-fg);
            }

            .kc-button.toolbar-alt.selected {
                background: var(--button-toolbar-alt-selected-bg);
                color: var(--button-toolbar-alt-selected-fg);
            }

            .kc-button.menu {
                background: var(--button-menu-bg);
                color: var(--button-menu-fg);
                padding: 0;
            }

            .kc-button.menu:hover {
                background: var(--button-menu-hover-bg);
                color: var(--button-menu-hover-fg);
                outline: none;
            }

            .kc-button.menu:focus {
                outline: none;
            }

            .kc-button.menu:disabled {
                background: var(--button-menu-disabled-bg);
                color: var(--button-menu-disabled-fg);
            }

            .kc-button.menu.selected {
                background: var(--button-menu-selected-bg);
                color: var(--button-menu-selected-fg);
                outline: none;
            }
        `;

        return (
            <>
                <style>{buttonStyles}</style>
                <button 
                    ref={ref}
                    className={classNames} 
                    {...props}
                >
                    {icon && <Icon material={!icon.startsWith('#')}>{icon}</Icon>}
                    {children}
                </button>
            </>
        );
    }
);

Button.displayName = 'Button';