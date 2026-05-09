import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook to manage success and error messages with auto-dismissal
 * and mutual exclusion (setting one clears the other).
 * 
 * @param timeout Duration in milliseconds before the message disappears (default: 5000ms)
 */
export function useTimedMessage(timeout = 5000) {
    const [successMessage, setSuccess] = useState<string>('');
    const [errorMessage, setError] = useState<string>('');

    const setSuccessMessage = useCallback((msg: string) => {
        setError(''); // Clear error when success is set
        setSuccess(msg);
    }, []);

    const setErrorMessage = useCallback((msg: string) => {
        setSuccess(''); // Clear success when error is set
        setError(msg);
    }, []);

    const clearMessages = useCallback(() => {
        setSuccess('');
        setError('');
    }, []);

    useEffect(() => {
        if (successMessage || errorMessage) {
            const timer = setTimeout(() => {
                clearMessages();
            }, timeout);
            return () => clearTimeout(timer);
        }
    }, [successMessage, errorMessage, timeout, clearMessages]);

    return {
        successMessage,
        errorMessage,
        setSuccessMessage,
        setErrorMessage,
        clearMessages
    };
}
