import React from 'react';

interface DataRowProps {
    label: string;
    // ReactNode allows strings, numbers, undefined, null, and JSX elements!
    value?: React.ReactNode; 
    // Added this so TypeScript knows isLast is a valid, optional boolean prop
    isLast?: boolean;        
    icon?: React.ReactNode;
}

export default function DataRow({ label, value, isLast = false, icon }: DataRowProps) {
    return (
        // I added a conditional border bottom using the isLast prop
        <div className={`flex flex-col mb-4 ${!isLast ? 'border-b border-gray-100 pb-4' : ''}`}>
            <div className="flex items-center gap-2 mb-1">
                {icon && <span className="text-gray-400">{icon}</span>}
                <span className="text-sm text-gray-500">{label}</span>
            </div>
            <span className="text-base text-gray-800 font-medium">
                {/* Fallback to a dash '-' if the value is missing/undefined */}
                {value || '-'}
            </span>
        </div>
    );
}