import React, { useState } from 'react';
import { LoadingSpinner } from './LoadingSpinner.jsx';

export const EditModal = ({ isOpen, onClose, onApply, imageUrl, isEditing, editError }) => {
    const [prompt, setPrompt] = useState('');

    if (!isOpen) return null;

    const handleApplyClick = async () => {
        if (!prompt.trim()) return;
        await onApply(prompt);
    };

    return (
        <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in-fast"
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-title"
        >
            <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 max-w-lg w-full mx-4 transform transition-all animate-scale-in relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500"
                    aria-label="Close edit modal"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <h3 id="edit-title" className="text-2xl font-semibold text-gray-800 mb-4 text-center">
                    Edit Your Hairstyle
                </h3>

                <div className="flex flex-col md:flex-row gap-6">
                    <div className="w-full md:w-1/2 flex-shrink-0">
                        <p className="text-sm font-medium text-gray-600 text-center mb-2">Current Style</p>
                        {imageUrl && (
                            <img src={imageUrl} alt="Hairstyle to edit" className="rounded-lg shadow-md aspect-square w-full object-cover" />
                        )}
                    </div>
                    <div className="w-full md:w-1/2 flex flex-col justify-center">
                        {isEditing ? (
                            <div className="flex flex-col items-center justify-center h-full">
                                <LoadingSpinner />
                                <p className="text-sm text-gray-600 mt-2">Applying your edits...</p>
                            </div>
                        ) : (
                            <>
                                <label htmlFor="edit-prompt" className="block text-sm font-medium text-gray-700 mb-2">
                                    What would you like to change?
                                </label>
                                <textarea
                                    id="edit-prompt"
                                    rows={3}
                                    value={prompt}
                                    onChange={(e) => setPrompt(e.target.value)}
                                    placeholder="e.g., 'make it blonde', 'add curls', 'a bit shorter'"
                                    className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
                                    disabled={isEditing}
                                />
                                {editError && <p className="text-red-500 text-sm mt-2">{editError}</p>}
                                <div className="mt-4 flex justify-end gap-3">
                                    <button
                                        onClick={onClose}
                                        disabled={isEditing}
                                        className="px-6 py-2.5 rounded-full bg-gray-200 text-gray-800 font-semibold hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-all disabled:opacity-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleApplyClick}
                                        disabled={isEditing || !prompt.trim()}
                                        className="px-8 py-2.5 rounded-full bg-purple-500 text-white font-semibold hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Apply
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
