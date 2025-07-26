/*
    Copyright (c) 2023 Alethea Katherine Flowers.
    Published under the standard MIT License.
    Full text available at: https://opensource.org/licenses/MIT
*/

import React from 'react';

export interface IconProps {
    children?: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
}

/**
 * React equivalent of kc-ui-icon web component
 * Material Symbols icon component
 */
export const Icon: React.FC<IconProps> = ({ 
    children, 
    className = '', 
    style = {} 
}) => {
    const text = typeof children === 'string' ? children : '';
    
    const iconStyle: React.CSSProperties = {
        boxSizing: 'border-box',
        fontFamily: '"Material Symbols Outlined"',
        fontWeight: 'normal',
        fontStyle: 'normal',
        fontSize: 'inherit',
        lineHeight: 1,
        letterSpacing: 'normal',
        textTransform: 'none',
        whiteSpace: 'nowrap',
        wordWrap: 'normal',
        direction: 'ltr',
        WebkitFontFeatureSettings: '"liga"',
        MozFontFeatureSettings: '"liga"',
        fontFeatureSettings: '"liga"',
        WebkitFontSmoothing: 'antialiased',
        userSelect: 'none',
        ...style
    };

    // Handle SVG sprites (similar to the original web component)
    if (text.startsWith('svg:')) {
        const name = text.slice(4);
        // This would need to be configured, similar to KCUIIconElement.sprites_url
        const spritesUrl = (Icon as any).spritesUrl || '';
        const url = `${spritesUrl}#${name}`;
        
        return (
            <svg 
                className={className}
                style={{ ...iconStyle, width: '1.2em', height: 'auto', fill: 'currentColor' }}
                viewBox="0 0 48 48" 
                width="48"
            >
                <use xlinkHref={url} />
            </svg>
        );
    } else {
        return (
            <span className={className} style={iconStyle}>
                {children}
            </span>
        );
    }
};

// Static property for sprites URL (similar to the original)
(Icon as any).spritesUrl = '';