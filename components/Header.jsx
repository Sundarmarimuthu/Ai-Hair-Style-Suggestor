
import React from 'react';

export const Header = () => {
    return (
        <header className="py-6 bg-white/30 backdrop-blur-md shadow-sm">
            <div className="container mx-auto px-4 text-center">
                <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500">
                    AI Hairstyle Suggester
                </h1>
                <p className="text-lg text-gray-600 mt-1">Visualize Your Next Look</p>
            </div>
        </header>
    );
};
