/*
    Copyright (c) 2025 Alethea Katherine Flowers.
    Published under the standard MIT License.
    Full text available at: https://opensource.org/licenses/MIT
*/

import React, { useState, useEffect } from 'react';

interface FocusOverlayProps {
    className?: string;
    initialActive?: boolean;
}

/**
 * FocusOverlay component
 * 
 * Provides an interactive overlay that activates on mouse hover
 */
export const FocusOverlay: React.FC<FocusOverlayProps> = ({
    className = '',
    initialActive = false
}) => {
    const [isActive, setIsActive] = useState(initialActive);
    const [isVisible, setIsVisible] = useState(false);

    // Combine class names
    const classNames = [
        'kc-focus-overlay',
        isActive ? 'active' : '',
        isVisible ? 'visible' : '',
        className
    ].filter(Boolean).join(' ');

    const focusOverlayStyles = `
        .kc-focus-overlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: var(--focus-overlay-bg);
            opacity: 0;
            pointer-events: none;
            transition: opacity var(--transition-time) ease;
            z-index: 10;
        }

        .kc-focus-overlay.visible {
            pointer-events: auto;
        }

        .kc-focus-overlay.active {
            opacity: var(--focus-overlay-opacity);
        }
    `;

    // Set up mouse tracking for activation
    useEffect(() => {
        let timeout: number;

        const handleMouseEnter = () => {
            setIsVisible(true);
            // Short delay before activation for smoother interaction
            timeout = window.setTimeout(() => {
                setIsActive(true);
            }, 100);
        };

        const handleMouseLeave = () => {
            clearTimeout(timeout);
            setIsActive(false);
            // Keep the overlay visible for a moment after deactivation
            timeout = window.setTimeout(() => {
                setIsVisible(false);
            }, 300);
        };

        const overlay = document.querySelector(`.${classNames.split(' ')[0]}`);
        if (overlay) {
            overlay.addEventListener('mouseenter', handleMouseEnter);
            overlay.addEventListener('mouseleave', handleMouseLeave);

            return () => {
                overlay.removeEventListener('mouseenter', handleMouseEnter);
                overlay.removeEventListener('mouseleave', handleMouseLeave);
                clearTimeout(timeout);
            };
        }

        return () => {
            clearTimeout(timeout);
        };
    }, [isVisible, classNames]);

    return (
        <>
            <style>{focusOverlayStyles}</style>
            <div className={classNames} />
        </>
    );
};

FocusOverlay.displayName = 'FocusOverlay';