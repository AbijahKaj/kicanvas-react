/*
    Copyright (c) 2023 Alethea Katherine Flowers.
    Published under the standard MIT License.
    Full text available at: https://opensource.org/licenses/MIT
*/

import React, { useEffect, useRef, useState } from "react";
import { BaseComponent } from "../base/BaseComponent";

export interface FocusOverlayProps {
    children?: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
}

const focusOverlayStyles = `
    .kc-ui-focus-overlay {
        z-index: 10;
        user-select: none;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        pointer-events: initial;
        background: transparent;
        contain: paint;
    }

    .kc-ui-focus-overlay.has-focus {
        z-index: -10;
        pointer-events: none;
    }

    .kc-ui-focus-overlay .bg {
        background: var(--focus-overlay-bg);
        opacity: 0;
        transition: opacity var(--transition-time-short);
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
    }

    .kc-ui-focus-overlay:hover .bg {
        opacity: var(--focus-overlay-opacity);
    }

    .kc-ui-focus-overlay.has-focus .bg {
        opacity: 0;
    }

    .kc-ui-focus-overlay .fg {
        position: absolute;
        font-size: 1.5rem;
        color: var(--focus-overlay-fg);
        text-shadow: rgba(0, 0, 0, 0.5) 0px 0px 15px;
        opacity: 0;
        pointer-events: none;
    }

    .kc-ui-focus-overlay:hover .fg {
        opacity: 1;
    }

    .kc-ui-focus-overlay.has-focus .fg {
        opacity: 0;
    }
`;

/**
 * FocusOverlay shows an overlay over its siblings until the user clicks within.
 * React equivalent of kc-ui-focus-overlay.
 */
export const FocusOverlay: React.FC<FocusOverlayProps> = ({
    children,
    className,
    style,
    ...props
}) => {
    const [hasFocus, setHasFocus] = useState(false);
    const overlayRef = useRef<HTMLDivElement>(null);
    const parentRef = useRef<HTMLElement | null>(null);

    useEffect(() => {
        const overlayElement = overlayRef.current;
        if (!overlayElement) return;

        // Get parent element for click detection
        parentRef.current = overlayElement.parentElement;

        const handleClick = (e: MouseEvent) => {
            if (e.composedPath().includes(overlayElement)) {
                setHasFocus(true);
            }
        };

        const handleDocumentClick = (e: MouseEvent) => {
            if (parentRef.current) {
                const outside = !e.composedPath().includes(parentRef.current);
                if (outside) {
                    setHasFocus(false);
                }
            }
        };

        // Set up intersection observer to reset focus when not visible
        const intersectionObserver = new IntersectionObserver((entries) => {
            for (const entry of entries) {
                if (!entry.isIntersecting) {
                    setHasFocus(false);
                }
            }
        });

        intersectionObserver.observe(overlayElement);
        overlayElement.addEventListener("click", handleClick);
        document.addEventListener("click", handleDocumentClick);

        return () => {
            intersectionObserver.disconnect();
            overlayElement.removeEventListener("click", handleClick);
            document.removeEventListener("click", handleDocumentClick);
        };
    }, []);

    const classes = ["kc-ui-focus-overlay", hasFocus && "has-focus", className]
        .filter(Boolean)
        .join(" ");

    return (
        <BaseComponent
            ref={overlayRef}
            className={classes}
            style={style}
            styles={focusOverlayStyles}
            {...props}>
            <div className="bg"></div>
            <div className="fg">Click or tap to interact</div>
            {children}
        </BaseComponent>
    );
};
