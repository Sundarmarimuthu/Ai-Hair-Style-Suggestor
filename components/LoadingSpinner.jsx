
import React from 'react';

export const LoadingSpinner = () => {
    return (
        <div className="flex flex-col items-center justify-center space-y-4 my-8">
            <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-purple-500"></div>
            <p className="text-purple-700 font-medium">AI is working its magic...</p>
        </div>
    );
};
