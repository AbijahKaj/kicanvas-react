/*
    Copyright (c) 2023 Alethea Katherine Flowers.
    Published under the standard MIT License.
    Full text available at: https://opensource.org/licenses/MIT
*/

import React from "react";
import { BaseComponent } from "../base/BaseComponent";

export interface FloatingToolbarProps {
    children?: React.ReactNode;
    left?: React.ReactNode;
    right?: React.ReactNode;
    location?: "top" | "bottom";
    className?: string;
    style?: React.CSSProperties;
}

const floatingToolbarStyles = `
    .kc-ui-floating-toolbar {
        z-index: 10;
        user-select: none;
        pointer-events: none;
        position: absolute;
        left: 0;
        width: 100%;
        padding: 0.5em;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-start;
    }

    .kc-ui-floating-toolbar.location-top {
        top: 0;
    }

    .kc-ui-floating-toolbar.location-bottom {
        bottom: 0;
    }

    .kc-ui-floating-toolbar > * {
        user-select: initial;
        pointer-events: initial;
    }

    .kc-ui-floating-toolbar .left-content {
        flex-grow: 999;
        display: flex;
    }

    .kc-ui-floating-toolbar .right-content {
        display: flex;
    }

    .kc-ui-floating-toolbar .kc-ui-button {
        margin-left: 0.25em;
    }
`;

/**
 * FloatingToolbar is a toolbar that presents its elements on top of another element.
 * React equivalent of kc-ui-floating-toolbar.
 */
export const FloatingToolbar: React.FC<FloatingToolbarProps> = ({
    children,
    left,
    right,
    location = "top",
    className,
    style,
    ...props
}) => {
    const classes = [
        "kc-ui-floating-toolbar",
        `location-${location}`,
        className,
    ]
        .filter(Boolean)
        .join(" ");

    return (
        <BaseComponent
            className={classes}
            style={style}
            styles={floatingToolbarStyles}
            {...props}>
            <div className="left-content">{left || children}</div>
            <div className="right-content">{right}</div>
        </BaseComponent>
    );
};
