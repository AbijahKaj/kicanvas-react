/*
    Copyright (c) 2023 Alethea Katherine Flowers.
    Published under the standard MIT License.
    Full text available at: https://opensource.org/licenses/MIT
*/

import React from 'react';
import { BaseComponent } from '../base/BaseComponent';

export interface ViewProps {
    children?: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
    grow?: boolean;
    shrink?: boolean;
    fixed?: boolean;
}

export interface SplitViewProps {
    children?: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
    direction: 'horizontal' | 'vertical';
    grow?: boolean;
    shrink?: boolean;
    fixed?: boolean;
}

const splitViewStyles = `
    .kc-ui-view {
        flex-grow: 1;
        display: flex;
        overflow: hidden;
        flex-direction: column;
        position: relative;
    }

    .kc-ui-view.grow {
        flex-basis: unset;
        flex-grow: 999;
    }

    .kc-ui-view.shrink {
        flex-grow: 0;
        flex-shrink: 1;
        width: unset;
    }

    .kc-ui-view.fixed {
        flex-grow: 0;
        flex-shrink: 0;
    }

    .kc-ui-split-view {
        display: flex;
        height: 100%;
        overflow: hidden;
    }

    .kc-ui-split-view.horizontal {
        flex-direction: column;
        max-height: 100%;
    }

    .kc-ui-split-view.vertical {
        flex-direction: row;
        max-width: 100%;
    }

    .kc-ui-split-view.grow {
        flex-basis: unset;
        flex-grow: 999;
    }

    .kc-ui-split-view.shrink {
        flex-grow: 0;
        flex-shrink: 1;
        width: unset;
    }

    .kc-ui-split-view.fixed {
        flex-grow: 0;
        flex-shrink: 0;
    }
`;

/**
 * View component for layout. React equivalent of kc-ui-view.
 */
export const View: React.FC<ViewProps> = ({ 
    children, 
    className, 
    style, 
    grow, 
    shrink, 
    fixed, 
    ...props 
}) => {
    const classes = [
        'kc-ui-view',
        grow && 'grow',
        shrink && 'shrink', 
        fixed && 'fixed',
        className
    ].filter(Boolean).join(' ');

    return (
        <BaseComponent
            className={classes}
            style={style}
            styles={splitViewStyles}
            {...props}>
            {children}
        </BaseComponent>
    );
};

/**
 * SplitView component for split layouts. React equivalent of kc-ui-split-view.
 */
export const SplitView: React.FC<SplitViewProps> = ({ 
    children, 
    className, 
    style, 
    direction,
    grow, 
    shrink, 
    fixed, 
    ...props 
}) => {
    const classes = [
        'kc-ui-split-view',
        direction,
        grow && 'grow',
        shrink && 'shrink', 
        fixed && 'fixed',
        className
    ].filter(Boolean).join(' ');

    return (
        <BaseComponent
            className={classes}
            style={style}
            styles={splitViewStyles}
            {...props}>
            {children}
        </BaseComponent>
    );
};