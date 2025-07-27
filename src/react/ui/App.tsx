/*
    Copyright (c) 2023 Alethea Katherine Flowers.
    Published under the standard MIT License.
    Full text available at: https://opensource.org/licenses/MIT
*/

import React from "react";
import { BaseComponent } from "../base/BaseComponent";

export interface AppProps {
    children?: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
}

/**
 * App is the parent container for all UI elements.
 * React equivalent of kc-ui-app.
 */
export const App: React.FC<AppProps> = ({
    children,
    className,
    style,
    ...props
}) => {
    return (
        <BaseComponent
            className={`kc-ui-app${className ? ` ${className}` : ""}`}
            style={style}
            {...props}>
            {children}
        </BaseComponent>
    );
};
