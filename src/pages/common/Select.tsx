import * as React from "react"
import { Icon } from "./Icon"

export const Select: React.FC<React.SelectHTMLAttributes<HTMLSelectElement>> = ({ children, className = '', ...props }) => (
    <div className="relative">
        <select
            className={`w-full p-2 border rounded appearance-none bg-background ${className}`}
            {...props}
        >
            {children}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
            <Icon name="chevronDown" />
        </div>
    </div>
)

