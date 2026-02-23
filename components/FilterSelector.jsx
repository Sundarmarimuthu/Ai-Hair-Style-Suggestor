import React from 'react';
import { IMAGE_FILTERS } from '../constants.js';

export const FilterSelector = ({ selectedFilter, onFilterChange }) => {
    return (
        <div className="w-full animate-fade-in">
            <div className="flex items-center justify-center flex-wrap gap-2">
                <span className="text-sm font-medium text-gray-600 mr-2">Filters:</span>
                {IMAGE_FILTERS.map(filter => (
                    <button
                        key={filter.name}
                        onClick={() => onFilterChange(filter.className)}
                        className={`px-4 py-1.5 text-sm font-semibold rounded-full transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 ${selectedFilter === filter.className
                                ? 'bg-purple-500 text-white shadow-md'
                                : 'bg-white text-gray-700 hover:bg-gray-100 ring-1 ring-inset ring-gray-300'
                            }`}
                    >
                        {filter.name}
                    </button>
                ))}
            </div>
        </div>
    );
};
