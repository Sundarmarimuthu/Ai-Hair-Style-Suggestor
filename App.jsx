import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header.jsx';
import { ImageUploader } from './components/ImageUploader.jsx';
import { StyleSelector } from './components/StyleSelector.jsx';
import { ResultDisplay } from './components/ResultDisplay.jsx';
import { LoadingSpinner } from './components/LoadingSpinner.jsx';
import { FilterSelector } from './components/FilterSelector.jsx';
import { Gallery } from './components/Gallery.jsx';
import { EditModal } from './components/EditModal.jsx';
import { generateHairstyle, editHairstyle } from './services/openRouterService.js';

const App = () => {
    const initialPreferences = {
        length: 'Short',
        style: 'Straight',
        color: 'Natural Brown',
        vibe: [],
        gender: 'Unspecified',
        additionalInstructions: '',
    };

    const [history, setHistory] = useState([initialPreferences]);
    const [historyIndex, setHistoryIndex] = useState(0);

    const preferences = history[historyIndex];

    const setPreferences = useCallback(
        (updater) => {
            const newPrefs = updater(preferences);
            if (JSON.stringify(newPrefs) === JSON.stringify(preferences)) return;
            const newHistory = [...history.slice(0, historyIndex + 1), newPrefs];
            setHistory(newHistory);
            setHistoryIndex(newHistory.length - 1);
        },
        [history, historyIndex, preferences]
    );

    const handleResetPreferences = useCallback(() => {
        const newHistory = [...history.slice(0, historyIndex + 1), initialPreferences];
        setHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);
    }, [history, historyIndex]);

    const [uploadedImage, setUploadedImage] = useState(null);
    const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [originalImageForDisplay, setOriginalImageForDisplay] = useState(null);

    const [generationHistory, setGenerationHistory] = useState([]);
    const [generationIndex, setGenerationIndex] = useState(-1);

    const [selectedFilter, setSelectedFilter] = useState('');
    const [galleryItems, setGalleryItems] = useState([]);

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editError, setEditError] = useState(null);
    const [imageToEditIndex, setImageToEditIndex] = useState(null);

    useEffect(() => {
        try {
            const savedGallery = localStorage.getItem('hairstyleGallery');
            if (savedGallery) setGalleryItems(JSON.parse(savedGallery));
        } catch (e) {
            console.error('Failed to load gallery from localStorage', e);
        }
    }, []);

    const handleImageUpload = (file, previewUrl) => {
        setUploadedImage(file);
        setImagePreviewUrl(previewUrl);
        setGenerationHistory([]);
        setGenerationIndex(-1);
        setOriginalImageForDisplay(null);
        setError(null);
    };

    const handleGenerateClick = useCallback(async () => {
        if (!uploadedImage || !imagePreviewUrl) {
            setError('Please upload an image first.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setOriginalImageForDisplay(imagePreviewUrl);
        try {
            const result = await generateHairstyle(uploadedImage, preferences);
            const newHistoryBranch = [...generationHistory.slice(0, generationIndex + 1), result];
            setGenerationHistory(newHistoryBranch);
            setGenerationIndex(newHistoryBranch.length - 1);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, [uploadedImage, preferences, imagePreviewUrl, generationHistory, generationIndex]);

    const handleSaveToGallery = useCallback(() => {
        const currentResult = generationHistory[generationIndex];
        if (!originalImageForDisplay || !currentResult?.imageUrl) return;
        const newItem = {
            id: crypto.randomUUID(),
            originalImage: originalImageForDisplay,
            generatedImage: currentResult.imageUrl,
            preferences: preferences,
            timestamp: Date.now(),
        };
        const updatedGallery = [newItem, ...galleryItems];
        setGalleryItems(updatedGallery);
        localStorage.setItem('hairstyleGallery', JSON.stringify(updatedGallery));
    }, [originalImageForDisplay, preferences, galleryItems, generationHistory, generationIndex]);

    const handleDeleteFromGallery = (id) => {
        const updatedGallery = galleryItems.filter(item => item.id !== id);
        setGalleryItems(updatedGallery);
        localStorage.setItem('hairstyleGallery', JSON.stringify(updatedGallery));
    };

    const canUndo = historyIndex > 0;
    const canRedo = historyIndex < history.length - 1;

    const handleUndo = useCallback(() => { if (canUndo) setHistoryIndex(prev => prev - 1); }, [canUndo]);
    const handleRedo = useCallback(() => { if (canRedo) setHistoryIndex(prev => prev + 1); }, [canRedo]);

    const handlePreviousResult = useCallback(() => {
        if (generationIndex > 0) setGenerationIndex(prev => prev - 1);
    }, [generationIndex]);

    const handleEditRequest = useCallback(() => {
        if (generationIndex > -1) {
            setImageToEditIndex(generationIndex);
            setIsEditModalOpen(true);
            setEditError(null);
        }
    }, [generationIndex]);

    const handleCloseEditModal = useCallback(() => {
        setIsEditModalOpen(false);
        setImageToEditIndex(null);
        setEditError(null);
    }, []);

    const handleApplyEdit = useCallback(async (prompt) => {
        if (imageToEditIndex === null) return;
        const imageToEdit = generationHistory[imageToEditIndex];
        if (!imageToEdit?.imageUrl) return;
        setIsEditing(true);
        setEditError(null);
        try {
            const result = await editHairstyle(imageToEdit.imageUrl, prompt);
            const newHistoryBranch = [...generationHistory.slice(0, imageToEditIndex + 1), result];
            setGenerationHistory(newHistoryBranch);
            setGenerationIndex(newHistoryBranch.length - 1);
            handleCloseEditModal();
        } catch (err) {
            setEditError(err instanceof Error ? err.message : 'An unknown error occurred.');
            console.error(err);
        } finally {
            setIsEditing(false);
        }
    }, [imageToEditIndex, generationHistory, handleCloseEditModal]);

    const canPreviousResult = generationIndex > 0;
    const currentResult = generationIndex > -1 ? generationHistory[generationIndex] : null;

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-100 text-gray-800">
            <Header />
            <main className="container mx-auto px-4 py-8">
                <div className="max-w-5xl mx-auto bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg p-6 md:p-10">
                    <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
                        Welcome to the future of hairstyling! Upload a clear, front-facing photo of yourself, select your desired hairstyle, and let our AI create a stunning new look for you.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                        <div className="flex flex-col space-y-8">
                            <ImageUploader onImageUpload={handleImageUpload} previewUrl={imagePreviewUrl} />
                            <StyleSelector
                                preferences={preferences}
                                setPreferences={setPreferences}
                                onUndo={handleUndo}
                                onRedo={handleRedo}
                                canUndo={canUndo}
                                canRedo={canRedo}
                                onReset={handleResetPreferences}
                            />
                        </div>

                        <div className="flex flex-col items-center justify-center space-y-6">
                            <button
                                onClick={handleGenerateClick}
                                disabled={isLoading || !uploadedImage}
                                className="w-full md:w-auto transform transition-transform duration-200 ease-in-out bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-4 px-10 rounded-full shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:saturate-50 hover:scale-105 active:scale-100 focus:outline-none focus:ring-4 focus:ring-purple-300"
                            >
                                {isLoading ? 'Styling...' : 'Generate New Look'}
                            </button>

                            {error && <p className="text-red-500 text-center bg-red-100 p-3 rounded-lg">{error}</p>}
                            {isLoading && !originalImageForDisplay && <LoadingSpinner />}

                            {(isLoading || currentResult) && originalImageForDisplay && (
                                <>
                                    <FilterSelector selectedFilter={selectedFilter} onFilterChange={setSelectedFilter} />
                                    <ResultDisplay
                                        isLoading={isLoading}
                                        originalImage={originalImageForDisplay}
                                        generatedImage={currentResult?.imageUrl ?? null}
                                        description={currentResult?.textDescription ?? null}
                                        onSaveToGallery={handleSaveToGallery}
                                        originalImageClassName={selectedFilter}
                                        onPreviousResult={handlePreviousResult}
                                        canPrevious={canPreviousResult}
                                        onEditRequest={handleEditRequest}
                                    />
                                </>
                            )}
                        </div>
                    </div>
                </div>

                <EditModal
                    isOpen={isEditModalOpen}
                    onClose={handleCloseEditModal}
                    onApply={handleApplyEdit}
                    imageUrl={imageToEditIndex !== null ? generationHistory[imageToEditIndex]?.imageUrl ?? null : null}
                    isEditing={isEditing}
                    editError={editError}
                />

                <Gallery items={galleryItems} onDelete={handleDeleteFromGallery} />
            </main>
            <footer className="text-center py-6 text-gray-500 text-sm">
                <p>Powered by OpenRouter AI. &copy; 2024 AI Stylist. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default App;
