'use client';

import React from 'react';
import { LoadingSpinner } from './ui';

interface SubdomainSuggestionProps {
    suggestions: string[];
    onSuggestionClick: (suggestion: string) => void;
    isLoading?: boolean;
}

export const SubdomainSuggestion: React.FC<SubdomainSuggestionProps> = ({
    suggestions,
    onSuggestionClick,
    isLoading = false
}) => {
    if (isLoading) {
        return (
            <div className="mt-2">
                <div className="flex items-center gap-2 text-sm text-text">
                    <LoadingSpinner size={4} className="border-text" />
                    <span>Generating suggestions...</span>
                </div>
            </div>
        );``
    }

    if (suggestions.length === 0) {
        return null;
    }

    return (
        <div className="bg-bg-secondary">
            <div className="flex flex-wrap gap-2">
                {suggestions.map((suggestion, index) => (
                    <button
                        key={index}
                        type="button"
                        onClick={() => onSuggestionClick(suggestion)}
                        className="underline py-2 text-primary cursor-pointer"
                    >
                        {suggestion}
                    </button>
                ))}
            </div>
        </div>
    );
};