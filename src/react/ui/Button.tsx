/*
    Copyright (c) 2023 Alethea Katherine Flowers.
    Published under the standard MIT License.
    Full text available at: https://opensource.org/licenses/MIT
*/

import React from "react";
import { Icon } from "./Icon";

export interface ButtonProps {
    name?: string;
    icon?: string;
    variant?: "outline" | "toolbar" | "toolbar-alt" | "menu";
    disabled?: boolean;
    selected?: boolean;
    children?: React.ReactNode;
    onClick?: () => void;
}

/**
 * React equivalent of kc-ui-button web component
 */
export const Button: React.FC<ButtonProps> = ({
    name,
    icon,
    variant,
    disabled = false,
    selected = false,
    children,
    onClick,
}) => {
    // Base button styles (equivalent to the CSS in the original component)
    const baseButtonStyle: React.CSSProperties = {
        all: "unset",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "0.5em",
        border: "1px solid transparent",
        borderRadius: "0.25em",
        fontWeight: 500,
        fontSize: "1em",
        background: "var(--button-bg)",
        color: "var(--button-fg)",
        transition:
            "color var(--transition-time-short) ease, border var(--transition-time-short) ease, background var(--transition-time-short) ease",
        cursor: disabled ? "default" : "pointer",
    };

    // Apply variant-specific styles
    const getVariantStyles = (): React.CSSProperties => {
        switch (variant) {
            case "outline":
                return {
                    background: "var(--button-outline-bg)",
                    color: "var(--button-outline-fg)",
                };
            case "toolbar":
                return {
                    background: "var(--button-toolbar-bg)",
                    color: "var(--button-toolbar-fg)",
                };
            case "toolbar-alt":
                return {
                    background: "var(--button-toolbar-alt-bg)",
                    color: "var(--button-toolbar-alt-fg)",
                };
            case "menu":
                return {
                    background: "var(--button-menu-bg)",
                    color: "var(--button-menu-fg)",
                    padding: "0",
                };
            default:
                return {};
        }
    };

    const buttonStyle = {
        ...baseButtonStyle,
        ...getVariantStyles(),
    };

    // Add disabled styles
    if (disabled) {
        switch (variant) {
            case "outline":
                Object.assign(buttonStyle, {
                    background: "var(--button-outline-disabled-bg)",
                    color: "var(--button-outline-disabled-fg)",
                });
                break;
            case "toolbar":
                Object.assign(buttonStyle, {
                    background: "var(--button-toolbar-disabled-bg)",
                    color: "var(--button-toolbar-disabled-fg)",
                });
                break;
            case "toolbar-alt":
                Object.assign(buttonStyle, {
                    background: "var(--button-toolbar-alt-disabled-bg)",
                    color: "var(--button-toolbar-alt-disabled-fg)",
                });
                break;
            case "menu":
                Object.assign(buttonStyle, {
                    background: "var(--button-menu-disabled-bg)",
                    color: "var(--button-menu-disabled-fg)",
                });
                break;
            default:
                Object.assign(buttonStyle, {
                    background: "var(--button-disabled-bg)",
                    color: "var(--button-disabled-fg)",
                });
        }
    }

    // Add selected styles
    if (selected) {
        switch (variant) {
            case "outline":
                Object.assign(buttonStyle, {
                    background: "var(--button-outline-disabled-bg)",
                    color: "var(--button--outline-disabled-fg)",
                });
                break;
            case "toolbar":
                Object.assign(buttonStyle, {
                    background: "var(--button-toolbar-disabled-bg)",
                    color: "var(--button--toolbar-disabled-fg)",
                });
                break;
            case "toolbar-alt":
                Object.assign(buttonStyle, {
                    background: "var(--button-toolbar-alt-disabled-bg)",
                    color: "var(--button--toolbar-alt-disabled-fg)",
                });
                break;
            case "menu":
                Object.assign(buttonStyle, {
                    background: "var(--button-menu-disabled-bg)",
                    color: "var(--button--menu-disabled-fg)",
                });
                break;
            default:
                Object.assign(buttonStyle, {
                    background: "var(--button-selected-bg)",
                    color: "var(--button-selected-fg)",
                });
        }
    }

    const containerStyle: React.CSSProperties = {
        display: "inline-flex",
        position: "relative",
        width: "auto",
        cursor: disabled ? "default" : "pointer",
        userSelect: "none",
        alignItems: "center",
        justifyContent: "center",
        fill: "var(--button-fg)",
    };

    return (
        <div
            className={`kc-ui-button${selected ? " selected" : ""}`}
            style={containerStyle}>
            <button disabled={disabled} onClick={onClick} style={buttonStyle}>
                {icon && <Icon>{icon}</Icon>}
                {children}
            </button>
        </div>
    );
};
