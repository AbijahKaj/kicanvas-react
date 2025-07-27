/*
    Copyright (c) 2023 Alethea Katherine Flowers.
    Published under the standard MIT License.
    Full text available at: https://opensource.org/licenses/MIT
*/

import React, { createContext, useContext } from "react";
import type { ReactNode } from "react";

// Context for providing shared services/data (like the project)
export interface KiCanvasContextType {
    project?: any; // Project instance
    reload?: () => void; // Function to reload the project
    [key: string]: any;
}

const KiCanvasContext = createContext<KiCanvasContextType>({});

export const useKiCanvasContext = () => useContext(KiCanvasContext);

export interface KiCanvasProviderProps {
    children: ReactNode;
    value: KiCanvasContextType;
}

export const KiCanvasProvider: React.FC<KiCanvasProviderProps> = ({
    children,
    value,
}) => {
    return (
        <KiCanvasContext.Provider value={value}>
            {children}
        </KiCanvasContext.Provider>
    );
};

// Common styles that were previously in KCUIElement
const commonStyles = `
    .kc-ui {
        box-sizing: border-box;
    }

    .kc-ui *,
    .kc-ui *::before,
    .kc-ui *::after {
        box-sizing: inherit;
    }

    .kc-ui [hidden] {
        display: none !important;
    }

    .kc-ui {
        scrollbar-width: thin;
        scrollbar-color: #ae81ff #282634;
    }

    .kc-ui ::-webkit-scrollbar {
        position: absolute;
        width: 6px;
        height: 6px;
        margin-left: -6px;
        background: var(--scrollbar-bg);
    }

    .kc-ui ::-webkit-scrollbar-thumb {
        position: absolute;
        background: var(--scrollbar-fg);
    }

    .kc-ui ::-webkit-scrollbar-thumb:hover {
        background: var(--scrollbar-hover-fg);
    }

    .kc-ui ::-webkit-scrollbar-thumb:active {
        background: var(--scrollbar-active-fg);
    }
`;

// Inject common styles into document head (similar to what web components did)
if (
    typeof document !== "undefined" &&
    !document.getElementById("kc-ui-common-styles")
) {
    const style = document.createElement("style");
    style.id = "kc-ui-common-styles";
    style.textContent = commonStyles;
    document.head.appendChild(style);
}

export interface BaseComponentProps {
    children?: ReactNode;
    className?: string;
    style?: React.CSSProperties;
    styles?: string; // Component-specific CSS styles
}

/**
 * Base component that provides common functionality equivalent to KCUIElement
 */
export const BaseComponent = React.forwardRef<
    HTMLDivElement,
    BaseComponentProps
>(({ children, className = "", style = {}, styles, ...props }, ref) => {
    const combinedClassName = `kc-ui ${className}`.trim();

    // Inject component-specific styles if provided
    React.useEffect(() => {
        if (!styles) return;

        const styleId = `kc-component-styles-${Math.random()
            .toString(36)
            .substr(2, 9)}`;
        const styleElement = document.createElement("style");
        styleElement.id = styleId;
        styleElement.textContent = styles;
        document.head.appendChild(styleElement);

        // Cleanup function to remove styles when component unmounts
        return () => {
            const existingStyle = document.getElementById(styleId);
            if (existingStyle) {
                existingStyle.remove();
            }
        };
    }, [styles]);

    return (
        <div className={combinedClassName} style={style} ref={ref} {...props}>
            {children}
        </div>
    );
});
