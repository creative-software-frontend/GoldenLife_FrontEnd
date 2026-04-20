import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

// 1. Define the TypeScript types for the props
interface CustomSelectProps {
    label: string;
    options: string[];
    name: string;
    defaultValue?: string;
}

// Added type for the classNames utility
const classNames = (...classes: (string | boolean | undefined | null)[]) => {
    return classes.filter(Boolean).join(' ');
};

// 2. Apply the CustomSelectProps type to your component
const CustomSelect: React.FC<CustomSelectProps> = ({ label, options, name, defaultValue }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selected, setSelected] = useState(defaultValue || options[0]);

    // 3. Added types for the ref and event
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="space-y-1.5 w-full relative" ref={containerRef}>
            <label className="text-xs font-bold text-gray-500 uppercase ml-1">{label}</label>

            {/* Hidden input to ensure native form submission still works */}
            <input type="hidden" name={name} value={selected} />

            {/* Trigger Button */}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={classNames(
                    "w-full h-11 sm:h-12 px-3 sm:px-4 bg-white rounded-xl border border-gray-200 flex items-center justify-between transition-all outline-none",
                    isOpen ? "border-blue-500 ring-2 ring-blue-500/20" : "hover:border-blue-400 focus:border-blue-500"
                )}
            >
                <span className="font-medium text-[13px] sm:text-sm text-gray-700 truncate">{selected}</span>
                <ChevronDown
                    size={14}
                    className={classNames(
                        "text-gray-400 transition-transform duration-200 shrink-0 ml-2",
                        isOpen ? "rotate-180" : ""
                    )}
                />
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute z-[100] w-full mt-1 bg-white rounded-xl border border-gray-100 shadow-xl overflow-hidden left-0 right-0">
                    <div className="py-1 max-h-40 sm:max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
                        {options.map((option) => (
                            <button
                                key={option}
                                type="button"
                                onClick={() => {
                                    setSelected(option);
                                    setIsOpen(false);
                                }}
                                className={classNames(
                                    "w-full px-4 py-2.5 sm:py-3 text-left text-[13px] sm:text-sm font-medium transition-colors hover:bg-gray-50",
                                    selected === option ? "text-blue-600 bg-blue-50" : "text-gray-600"
                                )}
                            >
                                {option}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CustomSelect;