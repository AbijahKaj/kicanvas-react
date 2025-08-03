/*
    Copyright (c) 2025 Alethea Katherine Flowers.
    Published under the standard MIT License.
    Full text available at: https://opensource.org/licenses/MIT
*/

import React, { useState, useRef, useEffect } from 'react';

interface SplitViewProps {
    orientation?: 'horizontal' | 'vertical';
    initialSize?: string;
    minSize?: string;
    maxSize?: string;
    fixedPanel?: 'first' | 'second';
    className?: string;
    children: [React.ReactNode, React.ReactNode]; // Exactly two children required
}

/**
 * SplitView component
 * 
 * Creates a resizable split view with two panels
 */
export const SplitView: React.FC<SplitViewProps> = ({
    orientation = 'horizontal',
    initialSize = '50%',
    minSize = '0',
    maxSize = '100%',
    fixedPanel = 'first',
    className = '',
    children
}) => {
    const [size, setSize] = useState(initialSize);
    const splitRef = useRef<HTMLDivElement>(null);
    const resizerRef = useRef<HTMLDivElement>(null);
    const isResizing = useRef(false);
    const startPos = useRef(0);
    const startSize = useRef(0);

    // Combine class names
    const classNames = [
        'kc-split-view',
        orientation === 'vertical' ? 'vertical' : 'horizontal',
        `fixed-${fixedPanel}`,
        className
    ].filter(Boolean).join(' ');

    const splitViewStyles = `
        .kc-split-view {
            display: flex;
            width: 100%;
            height: 100%;
            overflow: hidden;
        }

        .kc-split-view.vertical {
            flex-direction: column;
        }

        .kc-split-view.horizontal {
            flex-direction: row;
        }

        .kc-split-view-panel {
            overflow: auto;
        }

        .kc-split-view.horizontal.fixed-first > .kc-split-view-panel:first-child {
            flex: 0 0 ${size};
            min-width: ${minSize};
            max-width: ${maxSize};
        }

        .kc-split-view.horizontal.fixed-second > .kc-split-view-panel:last-child {
            flex: 0 0 ${size};
            min-width: ${minSize};
            max-width: ${maxSize};
        }

        .kc-split-view.vertical.fixed-first > .kc-split-view-panel:first-child {
            flex: 0 0 ${size};
            min-height: ${minSize};
            max-height: ${maxSize};
        }

        .kc-split-view.vertical.fixed-second > .kc-split-view-panel:last-child {
            flex: 0 0 ${size};
            min-height: ${minSize};
            max-height: ${maxSize};
        }

        .kc-split-view-resizer {
            flex: 0 0 auto;
            position: relative;
            background-color: var(--split-view-resizer-bg);
            z-index: 1;
        }

        .kc-split-view.horizontal > .kc-split-view-resizer {
            width: 4px;
            cursor: col-resize;
        }

        .kc-split-view.vertical > .kc-split-view-resizer {
            height: 4px;
            cursor: row-resize;
        }

        .kc-split-view-resizer::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
        }

        .kc-split-view.horizontal > .kc-split-view-resizer::after {
            cursor: col-resize;
        }

        .kc-split-view.vertical > .kc-split-view-resizer::after {
            cursor: row-resize;
        }

        .kc-split-view-resizer:hover,
        .kc-split-view-resizer.resizing {
            background-color: var(--split-view-resizer-hover-bg);
        }
    `;

    // Handle mouse events for resizing
    const handleMouseDown = (e: React.MouseEvent) => {
        if (!splitRef.current) return;
        
        e.preventDefault();
        
        isResizing.current = true;
        startPos.current = orientation === 'horizontal' ? e.clientX : e.clientY;
        
        const rect = splitRef.current.getBoundingClientRect();
        const sizeInPixels = fixedPanel === 'first'
            ? (orientation === 'horizontal' ? rect.width : rect.height) * parseFloat(size) / 100
            : (orientation === 'horizontal' ? rect.width : rect.height) - parseFloat(size);
        
        startSize.current = sizeInPixels;
        
        // Add resizing class for styling
        if (resizerRef.current) {
            resizerRef.current.classList.add('resizing');
        }
        
        // Add global event listeners
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (!isResizing.current || !splitRef.current) return;
        
        const rect = splitRef.current.getBoundingClientRect();
        const pos = orientation === 'horizontal' ? e.clientX : e.clientY;
        const delta = pos - startPos.current;
        
        let newSizeInPixels = startSize.current + delta;
        
        // Calculate size as percentage
        const containerSize = orientation === 'horizontal' ? rect.width : rect.height;
        const newSizePercent = (newSizeInPixels / containerSize) * 100;
        
        // Update size
        setSize(`${newSizePercent}%`);
    };

    const handleMouseUp = () => {
        isResizing.current = false;
        
        // Remove resizing class
        if (resizerRef.current) {
            resizerRef.current.classList.remove('resizing');
        }
        
        // Remove global event listeners
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
    };

    // Cleanup event listeners on unmount
    useEffect(() => {
        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, []);

    if (React.Children.count(children) !== 2) {
        console.error('SplitView requires exactly two children');
        return null;
    }

    return (
        <>
            <style>{splitViewStyles}</style>
            <div ref={splitRef} className={classNames}>
                <div className="kc-split-view-panel">
                    {children[0]}
                </div>
                <div 
                    ref={resizerRef}
                    className="kc-split-view-resizer" 
                    onMouseDown={handleMouseDown}
                />
                <div className="kc-split-view-panel">
                    {children[1]}
                </div>
            </div>
        </>
    );
};

SplitView.displayName = 'SplitView';