import * as React from "react"

export const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => (
    <input
        {...props}
        className={`w-full p-2 border rounded bg-background text-foreground ${props.className || ''}`}
    />
)

