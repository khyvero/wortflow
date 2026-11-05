import { useState, useRef, useEffect } from 'react';
import './CustomSelect.css';

type Option = {
  label: string;
  value: string;
};

interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  placeholder?: string;
}

export default function CustomSelect({ value, onChange, options, placeholder }: CustomSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const selectedOption = options.find(opt => opt.value === value) ;

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="custom-select-container" ref={dropdownRef}>
            {/* drop down menu button*/}
            <div className="custom-select-trigger" onClick={() => setIsOpen(!isOpen)}>
                <span className={`trigger-text ${selectedOption ? 'has-value' : 'is-empty'}`}>
                    {selectedOption ? selectedOption.label : (placeholder || (options[0]?.label || ''))}
                </span>
                <span className="dropdown-arrow">⌄</span>
            </div>

            {isOpen && (
                <ul className="custom-select-menu">
                    {options.map((opt) => {
                        const isSelected = opt.value === value;
                        return (
                            <li
                                key={opt.value}
                                className={`custom-select-option ${isSelected ? 'selected' : ''}`}
                                onClick={() => {
                                    onChange(opt.value);
                                    setIsOpen(false);
                                }}>
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
