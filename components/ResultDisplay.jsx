import React, { useState, useEffect } from 'react';

const ImageCard = ({ imageUrl, title, className }) => (
    <div className="w-full">
        <h3 className="text-lg font-semibold text-center mb-2 text-gray-700">{title}</h3>
        <div className="aspect-square w-full rounded-xl shadow-lg overflow-hidden ring-1 ring-black/5">
            <img src={imageUrl} alt={title} className={`w-full h-full object-cover transition-all duration-300 ${className || ''}`} />
        </div>
    </div>
);

const ImagePlaceholder = ({ title }) => (
    <div className="w-full">
        <h3 className="text-lg font-semibold text-center mb-2 text-gray-700">{title}</h3>
        <div className="aspect-square w-full rounded-xl shadow-lg overflow-hidden bg-gray-200 animate-pulse flex items-center justify-center ring-1 ring-black/5">
            <svg className="w-12 h-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
            </svg>
        </div>
    </div>
);

export const ResultDisplay = ({
    isLoading,
    originalImage,
    generatedImage,
    description,
    onSaveToGallery,
    originalImageClassName,
    onPreviousResult,
    canPrevious,
    onEditRequest,
}) => {
    const [showConfirmation, setShowConfirmation] = useState(false);

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'Escape') setShowConfirmation(false);
        };
        if (showConfirmation) document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [showConfirmation]);

    const handleDownload = () => {
        if (!generatedImage) return;
        const link = document.createElement('a');
        link.href = generatedImage;
        link.download = `hairstyle_result_${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleConfirmSave = () => {
        onSaveToGallery();
        setShowConfirmation(false);
    };

    return (
        <div className="w-full mt-4 animate-fade-in">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4 text-center">3. Your New Look!</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <ImageCard imageUrl={originalImage} title="Before" className={originalImageClassName} />
                {isLoading ? <ImagePlaceholder title="After" /> : (generatedImage && <ImageCard imageUrl={generatedImage} title="After" />)}
            </div>

            {!isLoading && generatedImage && (
                <>
                    <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3 mt-6">
                        <button onClick={onPreviousResult} disabled={!canPrevious} className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-gray-500 text-white font-semibold rounded-full shadow-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            Previous
                        </button>
                        <button onClick={onEditRequest} className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-indigo-500 text-white font-semibold rounded-full shadow-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 transition-all">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                                <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
                            </svg>
                            Edit
                        </button>
                        <button onClick={handleDownload} className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-gray-600 text-white font-semibold rounded-full shadow-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                            Download
                        </button>
                        <button onClick={() => setShowConfirmation(true)} className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-purple-500 text-white font-semibold rounded-full shadow-md hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 transition-all">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v1H5V4zM5 8h10a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1V9a1 1 0 011-1z" />
                            </svg>
                            Save to Gallery
                        </button>
                    </div>

                    {description && (
                        <div className="mt-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
                            <p className="text-sm text-purple-800">{description}</p>
                        </div>
                    )}
                </>
            )}

            {showConfirmation && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in-fast"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="confirmation-title"
                >
                    <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 max-w-sm w-full mx-4 text-center transform transition-all animate-scale-in">
                        <h3 id="confirmation-title" className="text-xl font-semibold text-gray-800 mb-4">Save to Gallery?</h3>
                        <p className="text-gray-600 mb-6">This will add the "before" and "after" images to your saved looks.</p>
                        <div className="flex justify-center gap-4">
                            <button onClick={() => setShowConfirmation(false)} className="px-6 py-2.5 rounded-full bg-gray-200 text-gray-800 font-semibold hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-all">
                                Cancel
                            </button>
                            <button onClick={handleConfirmSave} className="px-8 py-2.5 rounded-full bg-purple-500 text-white font-semibold hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 transition-all">
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// Inject animation styles once
const style = document.createElement('style');
style.textContent = `
  @keyframes fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }
  @keyframes fade-in-fast { from { opacity: 0; } to { opacity: 1; } }
  .animate-fade-in-fast { animation: fade-in-fast 0.2s ease-out forwards; }
  @keyframes scale-in { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
  .animate-scale-in { animation: scale-in 0.2s ease-out forwards; }
`;
document.head.append(style);
