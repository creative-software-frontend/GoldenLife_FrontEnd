import * as React from "react"

export const Textarea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = (props) => (
    <textarea
        {...props}
        className={`w-full p-2 border rounded bg-background text-foreground ${props.className || ''}`}
    />
)

