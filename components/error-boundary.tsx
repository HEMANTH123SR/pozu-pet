'use client';

import React, { ReactNode, useState, useEffect } from 'react';

interface ErrorBoundaryProps {
    children: ReactNode;
    fallback?: ReactNode;
}

const ErrorBoundary: React.FC<ErrorBoundaryProps> = ({ children, fallback }) => {
    const [hasError, setHasError] = useState(false);
    const [error, setError] = useState<ErrorEvent | null>(null);

    useEffect(() => {
        const errorHandler = (event: ErrorEvent) => {
            console.error("Uncaught error:", event.error);
            setHasError(true);
            setError(event);
        };

        const unhandledRejectionHandler = (event: PromiseRejectionEvent) => {
            console.error("Unhandled promise rejection:", event.reason);
            setHasError(true);
            setError({
                error: event.reason,
                message: event.reason.message,
                filename: '',
                lineno: 0,
                colno: 0,
                type: 'unhandledrejection'
            } as ErrorEvent);
        };

        window.addEventListener('error', errorHandler);
        window.addEventListener('unhandledrejection', unhandledRejectionHandler);

        return () => {
            window.removeEventListener('error', errorHandler);
            window.removeEventListener('unhandledrejection', unhandledRejectionHandler);
        };
    }, []);

    if (hasError) {
        return fallback || (
            <div className="w-full text-center text-red-500 p-4">
                <h2>Something went wrong</h2>
                <p>{error?.error?.message || 'Unknown error'}</p>
            </div>
        );
    }

    return <>{children}</>;
};

export default ErrorBoundary;