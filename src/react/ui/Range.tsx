/*
    Copyright (c) 2025 Alethea Katherine Flowers.
    Published under the standard MIT License.
    Full text available at: https://opensource.org/licenses/MIT
*/

import { forwardRef } from 'react';
import type { InputHTMLAttributes } from 'react';

interface RangeProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
    showValue?: boolean;
}

/**
 * Range component
 * 
 * A slider control with optional visible value display
 */
export const Range = forwardRef<HTMLInputElement, RangeProps>(
    ({ className = '', showValue = false, ...props }, ref) => {
        // Combine class names
        const classNames = [
            'kc-range',
            className
        ].filter(Boolean).join(' ');

        const rangeStyles = `
            .kc-range-container {
                display: flex;
                align-items: center;
                gap: 0.5em;
                width: 100%;
            }

            .kc-range {
                appearance: none;
                width: 100%;
                height: 6px;
                background: var(--range-bg);
                border-radius: 3px;
                outline: none;
                margin: 0;
                padding: 0;
            }

            .kc-range::-webkit-slider-thumb {
                appearance: none;
                width: 16px;
                height: 16px;
                border-radius: 50%;
                background: var(--range-thumb-bg);
                cursor: pointer;
                transition: background var(--transition-time-short) ease;
            }

            .kc-range::-moz-range-thumb {
                width: 16px;
                height: 16px;
                border: none;
                border-radius: 50%;
                background: var(--range-thumb-bg);
                cursor: pointer;
                transition: background var(--transition-time-short) ease;
            }

            .kc-range:hover::-webkit-slider-thumb {
                background: var(--range-thumb-hover-bg);
            }

            .kc-range:hover::-moz-range-thumb {
                background: var(--range-thumb-hover-bg);
            }

            .kc-range-value {
                min-width: 2em;
                text-align: right;
                font-variant-numeric: tabular-nums;
                color: var(--range-value-fg);
            }
        `;

        return (
            <>
                <style>{rangeStyles}</style>
                <div className="kc-range-container">
                    <input
                        ref={ref}
                        className={classNames}
                        type="range"
                        {...props}
                    />
                    {showValue && props.value !== undefined && (
                        <span className="kc-range-value">{props.value}</span>
                    )}
                </div>
            </>
        );
    }
);

Range.displayName = 'Range';