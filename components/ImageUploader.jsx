import React, { useRef, useState, useEffect, useCallback } from 'react';

export const ImageUploader = ({ onImageUpload, previewUrl }) => {
    const fileInputRef = useRef(null);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    const [mode, setMode] = useState('upload');
    const [cameraStream, setCameraStream] = useState(null);
    const [cameraError, setCameraError] = useState(null);

    const startCamera = useCallback(async () => {
        if (cameraStream) return;
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 512, height: 512, facingMode: 'user' } });
            if (videoRef.current) videoRef.current.srcObject = stream;
            setCameraStream(stream);
            setCameraError(null);
        } catch (err) {
            console.error('Error accessing camera:', err);
            setCameraError('Could not access camera. Please check permissions.');
            setCameraStream(null);
        }
    }, [cameraStream]);

    const stopCamera = useCallback(() => {
        if (cameraStream) {
            cameraStream.getTracks().forEach(track => track.stop());
            setCameraStream(null);
            if (videoRef.current) videoRef.current.srcObject = null;
        }
    }, [cameraStream]);

    useEffect(() => {
        if (mode === 'camera' && !previewUrl) {
            startCamera();
        } else {
            stopCamera();
        }
        return () => stopCamera();
    }, [mode, previewUrl, startCamera, stopCamera]);

    const handleCapture = () => {
        if (videoRef.current && canvasRef.current) {
            const canvas = canvasRef.current;
            const video = videoRef.current;
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const context = canvas.getContext('2d');
            if (context) {
                context.translate(canvas.width, 0);
                context.scale(-1, 1);
                context.drawImage(video, 0, 0, canvas.width, canvas.height);
                const dataUrl = canvas.toDataURL('image/webp');
                canvas.toBlob(blob => {
                    if (blob) {
                        const file = new File([blob], `capture-${Date.now()}.webp`, { type: 'image/webp' });
                        onImageUpload(file, dataUrl);
                    }
                }, 'image/webp');
                stopCamera();
            }
        }
    };

    const handleFileChange = (event) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                if (typeof reader.result === 'string') onImageUpload(file, reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleClickUpload = () => fileInputRef.current?.click();

    const handleClearOrRetake = () => {
        if (mode === 'camera') startCamera();
        onImageUpload(null, null);
    };

    const renderUploadMode = () => (
        <div
            onClick={handleClickUpload}
            className="w-full h-64 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
        >
            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/png, image/jpeg, image/webp" />
            <div className="text-center text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="mt-2">Click to upload an image</p>
                <p className="text-xs">PNG, JPG, or WEBP</p>
            </div>
        </div>
    );

    const renderCameraMode = () => (
        <div className="w-full flex flex-col items-center">
            <div className="w-full h-64 rounded-xl overflow-hidden bg-gray-900 flex items-center justify-center relative ring-1 ring-black/10">
                {cameraError ? (
                    <div className="text-center text-red-400 p-4"><p>{cameraError}</p></div>
                ) : (
                    <>
                        <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            muted
                            className={`w-full h-full object-cover transition-opacity duration-300 transform scale-x-[-1] ${cameraStream ? 'opacity-100' : 'opacity-0'}`}
                        />
                        {!cameraStream && !cameraError && <div className="text-white text-center">Loading Camera...</div>}
                    </>
                )}
            </div>
            <button
                onClick={handleCapture}
                disabled={!cameraStream}
                className="mt-4 flex items-center justify-center gap-2 px-6 py-2.5 bg-pink-500 text-white font-semibold rounded-full shadow-md hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2 6a2 2 0 012-2h1.586a2 2 0 011.414.586l1.414 1.414A2 2 0 009.586 6H10a2 2 0 00-2 2v6a2 2 0 002 2h0a2 2 0 002-2V8a2 2 0 00-2-2h-.414A2 2 0 007 4.586L5.586 3.172A2 2 0 014.172 2.586 2 2 0 014 2H4a2 2 0 00-2 2v4z" />
                </svg>
                Capture Photo
            </button>
        </div>
    );

    const renderContent = () => {
        if (previewUrl) {
            return (
                <div className="w-full relative">
                    <img src={previewUrl} alt="Preview" className="w-full h-64 object-cover rounded-xl" />
                    <button
                        onClick={handleClearOrRetake}
                        className="absolute top-2 right-2 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors focus:outline-none focus:ring-2 focus:ring-white"
                        aria-label={mode === 'camera' ? 'Retake Photo' : 'Clear Image'}
                        title={mode === 'camera' ? 'Retake Photo' : 'Clear Image'}
                    >
                        {mode === 'camera' ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.899 2.186l-1.07-1.07a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 111.414-1.414l1.07 1.07A5.002 5.002 0 006 7.002V5a1 1 0 011-1z" clipRule="evenodd" />
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        )}
                    </button>
                </div>
            );
        }
        return mode === 'upload' ? renderUploadMode() : renderCameraMode();
    };

    return (
        <div className="flex flex-col items-center">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">1. Provide Your Photo</h2>
            <div className="flex w-full justify-center mb-4 rounded-lg bg-gray-200 p-1">
                <button
                    onClick={() => setMode('upload')}
                    className={`w-full flex items-center justify-center gap-2 text-center px-4 py-2 text-sm font-semibold rounded-md transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-200 focus:ring-purple-500 ${mode === 'upload' ? 'bg-white text-purple-600 shadow' : 'bg-transparent text-gray-600 hover:bg-white/60'}`}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                    Upload File
                </button>
                <button
                    onClick={() => setMode('camera')}
                    className={`w-full flex items-center justify-center gap-2 text-center px-4 py-2 text-sm font-semibold rounded-md transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-200 focus:ring-purple-500 ${mode === 'camera' ? 'bg-white text-purple-600 shadow' : 'bg-transparent text-gray-600 hover:bg-white/60'}`}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2 6a2 2 0 012-2h1.586a2 2 0 011.414.586l1.414 1.414A2 2 0 009.586 6H10a2 2 0 00-2 2v6a2 2 0 002 2h0a2 2 0 002-2V8a2 2 0 00-2-2h-.414A2 2 0 007 4.586L5.586 3.172A2 2 0 014.172 2.586 2 2 0 014 2H4a2 2 0 00-2 2v4z" />
                    </svg>
                    Use Camera
                </button>
            </div>
            {renderContent()}
            <canvas ref={canvasRef} className="hidden" />
        </div>
    );
};
