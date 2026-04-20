import * as React from "react"

export const Label: React.FC<React.LabelHTMLAttributes<HTMLLabelElement>> = ({ children, ...props }) => (
    <label {...props} className={`block text-sm font-medium text-foreground mb-1 ${props.className || ''}`}>
        {children}
    </label>
)

