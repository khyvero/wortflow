import { useState, useRef, useEffect } from 'react';
import './CustomSelect.css';

type Option = {
  label: string;
  value: string;
};

interface CustomMultiSelectProps {
  value: string[]; 
  onChange: (value: string[]) => void; 
  options: Option[];
  placeholder?: string;
}

export default function CustomMultiSelect({ value = [], onChange, options, placeholder }: CustomMultiSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // remove if already exist, add if not exist
    const handleToggle = (optValue: string) => {
        if (value.includes(optValue)) {
            onChange(value.filter(v => v !== optValue));
        } else {
            onChange([...value, optValue]);
        }
    };

    // click x to remove
    const handleRemoveTag = (e: React.MouseEvent, optValue: string) => {
        e.stopPropagation(); // aviod open the drop down menu
        handleToggle(optValue);
    };

    // find all selected option object
    const selectedOptions = options.filter(opt => value.includes(opt.value));

    return (
        <div className="custom-select-container" ref={dropdownRef}>

            {/* selected option show as tag */}
            {selectedOptions.length > 0 && (
                <div className="multi-select-tags">
                    {selectedOptions.map(opt => (
                        <span key={opt.value} className="multi-select-tag">
                            {opt.label}
                            <button
                                type="button"
                                className="multi-select-tag-close"
                                onClick={(e) => handleRemoveTag(e, opt.value)}
                            >
                                &times;
                            </button>
                        </span>
                    ))}
                </div>
            )}

            {/* drop down menu button*/}
            <div className="custom-select-trigger" onClick={() => setIsOpen(!isOpen)}>
                <span className={`trigger-text ${value.length > 0 ? 'has-value' : 'is-empty'}`}>
                    {value.length > 0 
                        ? `${value.length} selected` 
                        : (placeholder || 'Select...')}
                </span>
                <span className="dropdown-arrow">⌄</span>
            </div>

            {/* drop down menu button*/}
            {isOpen && (
                <ul className="custom-select-menu">
                    {options.map((opt) => {
                        const isSelected = value.includes(opt.value);
                        return (
                            <li
                                key={opt.value}
                                className={`custom-select-option ${isSelected ? 'selected' : ''}`}
                                onClick={() => handleToggle(opt.value)}
                            >
                                <span>{opt.label}</span>
                                {isSelected && <span className="check-mark">✓</span>}
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    ); 
}