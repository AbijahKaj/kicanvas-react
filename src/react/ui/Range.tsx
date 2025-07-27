/*
    Copyright (c) 2023 Alethea Katherine Flowers.
    Published under the standard MIT License.
    Full text available at: https://opensource.org/licenses/MIT
*/

import React, { useState, useCallback } from "react";
import { BaseComponent } from "../base/BaseComponent";

export interface RangeProps {
    name?: string;
    min?: string | number;
    max?: string | number;
    step?: string | number;
    value?: string | number;
    disabled?: boolean;
    className?: string;
    style?: React.CSSProperties;
    onInput?: (value: string, valueAsNumber: number) => void;
    onChange?: (value: string, valueAsNumber: number) => void;
}

const rangeStyles = `
    .kc-ui-range {
        display: block;
        width: 100%;
        user-select: none;
    }

    .kc-ui-range input[type="range"] {
        all: unset;
        box-sizing: border-box;
        display: block;
        width: 100%;
        max-width: 100%;
        padding-top: 0.25em;
        padding-bottom: 0.25em;
        -webkit-appearance: none;
        appearance: none;
        font: inherit;
        cursor: grab;
        background: transparent;
        transition:
            color var(--transition-time-medium) ease,
            box-shadow var(--transition-time-medium) ease,
            outline var(--transition-time-medium) ease,
            background var(--transition-time-medium) ease,
            border var(--transition-time-medium) ease;
    }

    .kc-ui-range input[type="range"]:hover {
        z-index: 10;
        box-shadow: var(--input-range-hover-shadow);
    }

    .kc-ui-range input[type="range"]:focus {
        box-shadow: none;
        outline: none;
    }

    .kc-ui-range input[type="range"]:disabled:hover {
        cursor: unset;
    }

    .kc-ui-range input[type="range"]::-webkit-slider-runnable-track {
        box-sizing: border-box;
        height: 0.5em;
        border: 1px solid transparent;
        border-radius: 0.5em;
        background: var(--input-range-bg);
    }
    .kc-ui-range input[type="range"]::-moz-range-track {
        box-sizing: border-box;
        height: 0.5em;
        border: 1px solid transparent;
        border-radius: 0.5em;
        background: var(--input-range-bg);
    }

    .kc-ui-range input[type="range"]:hover::-webkit-slider-runnable-track,
    .kc-ui-range input[type="range"]:focus::-webkit-slider-runnable-track {
        border: 1px solid var(--input-range-hover-bg);
    }
    .kc-ui-range input[type="range"]:hover::-moz-range-track,
    .kc-ui-range input[type="range"]:focus::-moz-range-track {
        border: 1px solid var(--input-range-hover-bg);
    }

    .kc-ui-range input[type="range"]:disabled::-webkit-slider-runnable-track {
        background: var(--input-range-disabled-bg);
    }
    .kc-ui-range input[type="range"]:disabled::-moz-range-track {
        background: var(--input-range-disabled-bg);
    }

    .kc-ui-range input[type="range"]::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        height: 1em;
        width: 1em;
        border-radius: 0.5em;
        margin-top: -0.3em;
        background: var(--input-range-fg);
    }
    .kc-ui-range input[type="range"]::-moz-range-thumb {
        border: none;
        height: 1em;
        width: 1em;
        border-radius: 100%;
        margin-top: -0.3em;
        background: var(--input-range-fg);
    }

    .kc-ui-range input[type="range"]:focus::-webkit-slider-thumb {
        box-shadow: var(--input-range-handle-shadow);
    }
    .kc-ui-range input[type="range"]:focus::-moz-range-thumb {
        box-shadow: var(--input-range-handle-shadow);
    }
`;

export const Range: React.FC<RangeProps> = ({
    name,
    min = "",
    max = "",
    step = "",
    value = "",
    disabled = false,
    className,
    style,
    onInput,
    onChange,
}) => {
    const [currentValue, setCurrentValue] = useState(value?.toString() || "");

    const handleInput = useCallback(
        (e: React.FormEvent<HTMLInputElement>) => {
            const target = e.target as HTMLInputElement;
            const newValue = target.value;
            const newValueAsNumber = target.valueAsNumber;

            setCurrentValue(newValue);
            onInput?.(newValue, newValueAsNumber);
        },
        [onInput],
    );

    const handleChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const target = e.target;
            const newValue = target.value;
            const newValueAsNumber = target.valueAsNumber;

            onChange?.(newValue, newValueAsNumber);
        },
        [onChange],
    );

    return (
        <BaseComponent styles={rangeStyles}>
            <div className={`kc-ui-range ${className || ""}`} style={style}>
                <input
                    type="range"
                    name={name}
                    min={min}
                    max={max}
                    step={step}
                    value={currentValue}
                    disabled={disabled}
                    onInput={handleInput}
                    onChange={handleChange}
                />
            </div>
        </BaseComponent>
    );
};
