/*
    Copyright (c) 2025 Alethea Katherine Flowers.
    Published under the standard MIT License.
    Full text available at: https://opensource.org/licenses/MIT
*/

import React, { useState, useRef, useEffect } from 'react';
import { Button } from './Button';

interface TextFilterInputProps {
    placeholder?: string;
    value?: string;
    onChange?: (value: string) => void;
    className?: string;
    autoFocus?: boolean;
}

/**
 * TextFilterInput component
 * 
 * A text input with clear button for filtering content
 */
export const TextFilterInput: React.FC<TextFilterInputProps> = ({
    placeholder = 'Filter...',
    value: externalValue,
    onChange,
    className = '',
    autoFocus = false
}) => {
    // Use controlled or uncontrolled input based on whether value prop is provided
    const [internalValue, setInternalValue] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);
    
    // Determine if the component is controlled or uncontrolled
    const isControlled = externalValue !== undefined;
    const currentValue = isControlled ? externalValue : internalValue;

    // Focus input on mount if autoFocus is true
    useEffect(() => {
        if (autoFocus && inputRef.current) {
            inputRef.current.focus();
        }
    }, [autoFocus]);

    // Combine class names
    const classNames = [
        'kc-text-filter-input',
        className
    ].filter(Boolean).join(' ');

    const textFilterInputStyles = `
        .kc-text-filter-container {
            display: flex;
            align-items: center;
            width: 100%;
            background: var(--input-bg);
            border: 1px solid var(--input-border-color);
            border-radius: 4px;
            overflow: hidden;
        }

        .kc-text-filter-input {
            flex: 1;
            border: none;
            padding: 0.5em;
            background: transparent;
            color: var(--input-fg);
            font-family: inherit;
            font-size: inherit;
        }

        .kc-text-filter-input:focus {
            outline: none;
        }

        .kc-text-filter-input::placeholder {
            color: var(--input-placeholder-fg);
        }

        .kc-clear-button {
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0.25em;
            background: transparent;
            border: none;
            cursor: pointer;
            color: var(--input-fg);
            opacity: 0.6;
        }

        .kc-clear-button:hover {
            opacity: 1;
        }
    `;

    // Handle input change
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        
        if (!isControlled) {
            setInternalValue(newValue);
        }
        
        if (onChange) {
            onChange(newValue);
        }
    };

    // Handle clearing the input
    const handleClear = () => {
        if (!isControlled) {
            setInternalValue('');
        }
        
        if (onChange) {
            onChange('');
        }
        
        if (inputRef.current) {
            inputRef.current.focus();
        }
    };

    return (
        <>
            <style>{textFilterInputStyles}</style>
            <div className="kc-text-filter-container">
                <input
                    ref={inputRef}
                    className={classNames}
                    type="text"
                    placeholder={placeholder}
                    value={currentValue}
                    onChange={handleChange}
                />
                {currentValue && (
                    <Button 
                        className="kc-clear-button"
                        icon="close" 
                        onClick={handleClear} 
                        aria-label="Clear" 
                    />
                )}
            </div>
        </>
    );
};

TextFilterInput.displayName = 'TextFilterInput';