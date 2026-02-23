import React, { useState } from 'react';
import { HAIR_LENGTHS, HAIR_STYLES, HAIR_COLORS, VIBE_SUGGESTIONS, GENDERS } from '../constants.js';

const Selector = ({ label, value, options, onChange }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <select
            value={value}
            onChange={onChange}
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
        >
            {Array.isArray(options) ? (
                options.map(option => <option key={option} value={option}>{option}</option>)
            ) : (
                Object.entries(options).map(([groupLabel, groupOptions]) => (
                    <optgroup key={groupLabel} label={groupLabel}>
                        {groupOptions.map(option => <option key={option} value={option}>{option}</option>)}
                    </optgroup>
                ))
            )}
        </select>
    </div>
);

export const StyleSelector = ({ preferences, setPreferences, onUndo, onRedo, canUndo, canRedo, onReset }) => {
    const [hoveredStyleImage, setHoveredStyleImage] = useState(null);

    const handlePreferenceChange = (key, value) => {
        setPreferences(prev => ({ ...prev, [key]: value }));
    };

    const handleVibeToggle = (vibe) => {
        setPreferences(prev => {
            const newVibes = prev.vibe.includes(vibe) ? prev.vibe.filter(v => v !== vibe) : [...prev.vibe, vibe];
            return { ...prev, vibe: newVibes };
        });
    };

    const currentColorHex =
        HAIR_COLORS.find(c => c.name.toLowerCase() === preferences.color.toLowerCase())?.value ||
        (preferences.color.startsWith('#') ? preferences.color : '#000000');

    const selectedStyleImageUrl =
        Object.values(HAIR_STYLES).flat().find(style => style.name === preferences.style)?.imageUrl || null;

    const imageToShow = hoveredStyleImage || selectedStyleImageUrl;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between mb-2">
                <h2 className="text-2xl font-semibold text-gray-700">2. Choose Your Style</h2>
                <div className="flex items-center space-x-2">
                    <button onClick={onUndo} disabled={!canUndo} className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2" aria-label="Undo" title="Undo">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M11 15l-3-3m0 0l3-3m-3 3h8a5 5 0 015 5v1" />
                        </svg>
                    </button>
                    <button onClick={onRedo} disabled={!canRedo} className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2" aria-label="Redo" title="Redo">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13 15l3-3m0 0l-3-3m3 3H5a5 5 0 00-5 5v1" />
                        </svg>
                    </button>
                    <button onClick={onReset} className="p-2 rounded-md bg-gray-200 hover:bg-gray-300 text-xs font-semibold text-gray-600 transition focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2" title="Clear All Selections">
                        Clear All
                    </button>
                </div>
            </div>

            {/* Gender */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Gender Presentation</label>
                <div className="flex items-center gap-2 rounded-lg bg-gray-200 p-1">
                    {GENDERS.map(gender => (
                        <button
                            key={gender}
                            onClick={() => handlePreferenceChange('gender', gender)}
                            className={`w-full text-center px-4 py-2 text-sm font-semibold rounded-md transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-200 focus:ring-purple-500 ${preferences.gender === gender ? 'bg-white text-purple-600 shadow' : 'bg-transparent text-gray-600 hover:bg-white/60'}`}
                        >
                            {gender}
                        </button>
                    ))}
                </div>
            </div>

            {/* Length + Style display */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Selector label="Hair Length" value={preferences.length} options={HAIR_LENGTHS} onChange={e => handlePreferenceChange('length', e.target.value)} />
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Hair Style</label>
                    <div className="w-full p-3 border border-gray-300 rounded-lg shadow-sm bg-gray-50">
                        <p className="text-gray-800 truncate" title={preferences.style}>{preferences.style}</p>
                    </div>
                </div>
            </div>

            {/* Style picker */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select a Hair Style</label>
                <div className="flex flex-col md:flex-row gap-4" onMouseLeave={() => setHoveredStyleImage(null)}>
                    <div className="w-full md:w-2/3 space-y-3">
                        {Object.entries(HAIR_STYLES).map(([category, styles]) => (
                            <div key={category}>
                                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">{category}</h4>
                                <div className="flex flex-wrap items-center gap-2">
                                    {styles.map(style => (
                                        <button
                                            key={style.name}
                                            type="button"
                                            onMouseEnter={() => setHoveredStyleImage(style.imageUrl)}
                                            onClick={() => handlePreferenceChange('style', style.name)}
                                            className={`px-3 py-1 text-sm font-medium rounded-full transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transform ${preferences.style === style.name ? 'bg-purple-500 text-white shadow-md scale-105' : 'bg-gray-200 text-gray-700 hover:bg-purple-200 hover:text-purple-800 hover:scale-105'}`}
                                        >
                                            {style.name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="hidden md:block md:w-1/3 relative">
                        <div className="sticky top-24">
                            <h4 className="text-sm font-semibold text-gray-600 mb-2 text-center">Style Preview</h4>
                            {imageToShow ? (
                                <div key={imageToShow} className="aspect-square w-full rounded-lg shadow-lg overflow-hidden ring-1 ring-black/5 transition-all duration-300">
                                    <img src={imageToShow} alt="Style preview" className="w-full h-full object-cover" />
                                </div>
                            ) : (
                                <div className="aspect-square w-full rounded-lg bg-gray-100 flex items-center justify-center text-center text-sm text-gray-500 p-4 ring-1 ring-black/5">
                                    <p>Hover over or select a style to see a preview</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Color */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Hair Color</label>
                <div className="flex flex-wrap items-center gap-2 mb-3">
                    {HAIR_COLORS.map(color => (
                        <button
                            key={color.name}
                            type="button"
                            onClick={() => handlePreferenceChange('color', color.name)}
                            className={`w-8 h-8 rounded-full border-2 transition-transform transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 ${preferences.color.toLowerCase() === color.name.toLowerCase() ? 'border-purple-500 scale-110' : 'border-white/50'}`}
                            style={{ backgroundColor: color.value }}
                            title={color.name}
                            aria-label={color.name}
                        />
                    ))}
                </div>
                <div className="flex items-center gap-2">
                    <input
                        type="text"
                        placeholder="e.g., 'Fiery Red' or #B22222"
                        value={preferences.color}
                        onChange={e => handlePreferenceChange('color', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
                    />
                    <div className="relative w-12 h-12 flex-shrink-0">
                        <input type="color" value={currentColorHex} onChange={e => handlePreferenceChange('color', e.target.value)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" aria-label="Choose custom color" title="Choose custom color" />
                        <div className="w-full h-full rounded-lg border border-gray-300" style={{ backgroundColor: currentColorHex }} />
                    </div>
                </div>
            </div>

            {/* Vibe */}
            <div>
                <div className="flex items-center justify-between mb-1">
                    <label className="block text-sm font-medium text-gray-700">Describe the Vibe (Select multiple)</label>
                    {preferences.vibe.length > 0 && (
                        <button type="button" onClick={() => handlePreferenceChange('vibe', [])} className="p-1.5 rounded-full bg-gray-200 text-gray-500 hover:bg-gray-300 hover:text-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500" aria-label="Clear vibe selections" title="Clear vibes">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    )}
                </div>
                <div className="mt-3">
                    {(() => {
                        const selectedGender = preferences.gender;
                        if (selectedGender === 'Unspecified') {
                            return (
                                <div className="p-3 bg-gray-100 rounded-lg text-center text-sm text-gray-600">
                                    <p>Please select a gender presentation to see vibe suggestions.</p>
                                </div>
                            );
                        }
                        const vibeCategories = VIBE_SUGGESTIONS[selectedGender];
                        return (
                            <div className="space-y-4">
                                {Object.entries(vibeCategories).map(([category, vibes]) => (
                                    <div key={category}>
                                        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">{category}</h4>
                                        <div className="flex flex-wrap items-center gap-2">
                                            {vibes.map(vibe => (
                                                <button
                                                    key={vibe}
                                                    type="button"
                                                    onClick={() => handleVibeToggle(vibe)}
                                                    className={`px-3 py-1 text-sm font-medium rounded-full transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 ${preferences.vibe.includes(vibe) ? 'bg-purple-500 text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                                                >
                                                    {vibe}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        );
                    })()}
                </div>
            </div>

            {/* Additional instructions */}
            <div>
                <label htmlFor="additional-instructions" className="block text-sm font-medium text-gray-700 mb-1">
                    Additional Instructions (Optional)
                </label>
                <textarea
                    id="additional-instructions"
                    rows={2}
                    placeholder="e.g., 'add subtle highlights', 'make the bangs wispy'"
                    value={preferences.additionalInstructions}
                    onChange={e => handlePreferenceChange('additionalInstructions', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
                />
            </div>
        </div>
    );
};
