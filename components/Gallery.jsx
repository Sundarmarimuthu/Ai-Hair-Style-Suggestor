import React from 'react';

export const Gallery = ({ items, onDelete }) => {
    if (items.length === 0) return null;

    return (
        <div className="max-w-5xl mx-auto mt-12">
            <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">Your Saved Looks</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {items.map(item => (
                    <GalleryCard key={item.id} item={item} onDelete={onDelete} />
                ))}
            </div>
        </div>
    );
};

const GalleryCard = ({ item, onDelete }) => {
    return (
        <div className="bg-white/80 p-4 rounded-xl shadow-md backdrop-blur-sm group relative">
            <div className="grid grid-cols-2 gap-3">
                <div>
                    <p className="text-xs font-semibold text-center mb-1 text-gray-600">Before</p>
                    <img src={item.originalImage} alt="Original" className="aspect-square w-full object-cover rounded-lg" />
                </div>
                <div>
                    <p className="text-xs font-semibold text-center mb-1 text-gray-600">After</p>
                    <img src={item.generatedImage} alt="Generated" className="aspect-square w-full object-cover rounded-lg" />
                </div>
            </div>
            <button
                onClick={() => onDelete(item.id)}
                className="absolute top-2 right-2 p-1.5 bg-black/40 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-black/60 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-white"
                aria-label="Delete from gallery"
                title="Delete"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
    );
};
