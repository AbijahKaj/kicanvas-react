/*
    Copyright (c) 2023 Alethea Katherine Flowers.
    Published under the standard MIT License.
    Full text available at: https://opensource.org/licenses/MIT
*/

import React, { useState, useCallback, useRef } from "react";
import { BaseComponent } from "../base/BaseComponent";
import { Icon } from "./Icon";

export interface TextFilterInputProps {
    name?: string;
    placeholder?: string;
    value?: string;
    className?: string;
    style?: React.CSSProperties;
    onInput?: (value: string) => void;
    onChange?: (value: string) => void;
}

const textFilterInputStyles = `
    .kc-ui-text-filter-input {
        display: flex;
        align-items: center;
        align-content: center;
        position: relative;
        border-bottom: 1px solid var(--grid-outline);
    }

    .kc-ui-text-filter-input .before {
        pointer-events: none;
        position: absolute;
        left: 0;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        padding-left: 0.25em;
    }

    .kc-ui-text-filter-input input {
        all: unset;
        display: block;
        width: 100%;
        max-width: 100%;
        border-radius: 0;
        padding: 0.4em;
        padding-left: 1.5em;
        text-align: left;
        font: inherit;
        background: var(--input-bg);
        color: var(--input-fg);
    }

    .kc-ui-text-filter-input input:placeholder-shown + button {
        display: none;
    }

    .kc-ui-text-filter-input button {
        all: unset;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        color: var(--input-fg);
        padding: 0.25em;
    }

    .kc-ui-text-filter-input button:hover {
        cursor: pointer;
        color: var(--input-accent);
    }
`;

export const TextFilterInput: React.FC<TextFilterInputProps> = ({
    name = "search",
    placeholder = "search",
    value: propValue = "",
    className,
    style,
    onInput,
    onChange,
}) => {
    const [value, setValue] = useState(propValue);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleInput = useCallback(
        (e: React.FormEvent<HTMLInputElement>) => {
            const newValue = e.currentTarget.value;
            setValue(newValue);
            onInput?.(newValue);
        },
        [onInput],
    );

    const handleChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const newValue = e.currentTarget.value;
            onChange?.(newValue);
        },
        [onChange],
    );

    const handleClear = useCallback(
        (e: React.MouseEvent<HTMLButtonElement>) => {
            e.preventDefault();
            e.stopPropagation();
            setValue("");
            if (inputRef.current) {
                inputRef.current.focus();
                // Trigger input event to match web component behavior
                const inputEvent = new Event("input", { bubbles: true });
                inputRef.current.dispatchEvent(inputEvent);
            }
            onInput?.("");
            onChange?.("");
        },
        [onInput, onChange],
    );

    return (
        <BaseComponent styles={textFilterInputStyles}>
            <div
                className={`kc-ui-text-filter-input ${className || ""}`}
                style={style}>
                <Icon className="before">search</Icon>
                <input
                    ref={inputRef}
                    type="text"
                    name={name}
                    placeholder={placeholder}
                    value={value}
                    onInput={handleInput}
                    onChange={handleChange}
                />
                <button type="button" onClick={handleClear}>
                    <Icon>close</Icon>
                </button>
            </div>
        </BaseComponent>
    );
};
