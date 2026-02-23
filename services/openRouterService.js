const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

if (!process.env.OPENROUTER_API_KEY) {
    throw new Error('OPENROUTER_API_KEY environment variable not set');
}

const API_KEY = process.env.OPENROUTER_API_KEY;

// Convert a File object to a base64 data URI
const fileToBase64 = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result); // "data:image/jpeg;base64,..."
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });

// Convert a base64 data URI to just the base64 string + mimeType
const parseDataUri = (dataUri) => {
    const match = dataUri.match(/^data:(.*?);base64,(.+)$/);
    if (!match) throw new Error('Invalid base64 data URI format');
    return { mimeType: match[1], data: match[2] };
};

const constructPrompt = (preferences) => {
    let prompt = `Change the hairstyle to a ${preferences.length}, ${preferences.style} style in a ${preferences.color} color`;
    if (preferences.gender !== 'Unspecified') {
        prompt += ` suitable for a ${preferences.gender.toLowerCase()}`;
    }
    prompt += '.';
    if (preferences.vibe.length > 0) {
        prompt += ` The overall vibe should be ${preferences.vibe.join(', ')}.`;
    }
    if (preferences.additionalInstructions) {
        prompt += ` Additional instructions: ${preferences.additionalInstructions}.`;
    }
    prompt +=
        ' The new hairstyle must look hyper-realistic and be seamlessly blended onto the person\'s head, appearing natural and flattering for their face shape. Pay close attention to individual hair strands with fine detail and realistic lighting. The final image must be crisp, sharp, and high resolution. The background must remain unchanged.';
    return prompt;
};

/**
 * Step 1: Use a vision model to analyse the face and describe it in detail.
 * Step 2: Use an image-generation model to create the new hairstyle image.
 */
export const generateHairstyle = async (imageFile, preferences) => {
    const dataUri = await fileToBase64(imageFile);
    const { mimeType, data } = parseDataUri(dataUri);

    const hairstylePrompt = constructPrompt(preferences);

    // --- Step 1: Analyse the person's features ---
    const analysisResponse = await fetch(OPENROUTER_API_URL, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${API_KEY}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': window.location.origin,
            'X-Title': 'AI Hairstyle Suggester',
        },
        body: JSON.stringify({
            model: 'meta-llama/llama-3.2-11b-vision-instruct:free',
            messages: [
                {
                    role: 'user',
                    content: [
                        {
                            type: 'image_url',
                            image_url: { url: `data:${mimeType};base64,${data}` },
                        },
                        {
                            type: 'text',
                            text: 'Describe this person\'s face shape, skin tone, facial features (eyes, nose, mouth), approximate age range, and any visible clothing in precise detail. Be specific and objective. Do not include any commentary — just a factual description that can be used to recreate this person in an AI image.',
                        },
                    ],
                },
            ],
        }),
    });

    if (!analysisResponse.ok) {
        const err = await analysisResponse.json().catch(() => ({}));
        throw new Error(err?.error?.message || 'Failed to analyse the uploaded image.');
    }

    const analysisData = await analysisResponse.json();
    const personDescription = analysisData.choices?.[0]?.message?.content || '';

    if (!personDescription) {
        throw new Error('Could not analyse the image. Please try a clearer, front-facing photo.');
    }

    // --- Step 2: Generate the new hairstyle image ---
    const generationResponse = await fetch(OPENROUTER_API_URL, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${API_KEY}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': window.location.origin,
            'X-Title': 'AI Hairstyle Suggester',
        },
        body: JSON.stringify({
            model: 'google/gemini-2.0-flash-exp:free',
            messages: [
                {
                    role: 'user',
                    content: [
                        {
                            type: 'image_url',
                            image_url: { url: `data:${mimeType};base64,${data}` },
                        },
                        {
                            type: 'text',
                            text: `You are a professional photo editor. Given the person in the image, ${hairstylePrompt} Keep the face, expression, background, and clothing completely unchanged. Only modify the hair. Return a photorealistic edited image.`,
                        },
                    ],
                },
            ],
            modalities: ['text', 'image'],
        }),
    });

    if (!generationResponse.ok) {
        const err = await generationResponse.json().catch(() => ({}));
        const msg = err?.error?.message || '';
        if (msg.toLowerCase().includes('blocked') || msg.toLowerCase().includes('safety')) {
            throw new Error('Your request was blocked due to safety settings. Please try a different image or prompt.');
        }
        throw new Error('Failed to generate hairstyle. The AI might be busy — please try again.');
    }

    const generationData = await generationResponse.json();
    const parts = generationData.choices?.[0]?.message?.content;

    let imageUrl = null;
    let textDescription = null;

    // The response content may be a string or an array of content parts
    if (typeof parts === 'string') {
        textDescription = parts;
    } else if (Array.isArray(parts)) {
        for (const part of parts) {
            if (part.type === 'image_url' && part.image_url?.url) {
                imageUrl = part.image_url.url;
            } else if (part.type === 'text' && part.text) {
                textDescription = part.text;
            }
        }
    }

    if (!imageUrl) {
        throw new Error('AI did not return an image. Please try a different photo or hairstyle preference.');
    }

    return { imageUrl, textDescription };
};

export const editHairstyle = async (base64ImageData, editPrompt) => {
    const { mimeType, data } = parseDataUri(base64ImageData);

    const textPrompt = `Based on this user instruction: "${editPrompt}", subtly edit the hairstyle in the image. The user's face, features, skin tone, expression, and the background must remain completely unchanged. Only modify the hair as requested. Maintain the same high-resolution, photorealistic quality.`;

    const response = await fetch(OPENROUTER_API_URL, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${API_KEY}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': window.location.origin,
            'X-Title': 'AI Hairstyle Suggester',
        },
        body: JSON.stringify({
            model: 'google/gemini-2.0-flash-exp:free',
            messages: [
                {
                    role: 'user',
                    content: [
                        {
                            type: 'image_url',
                            image_url: { url: `data:${mimeType};base64,${data}` },
                        },
                        { type: 'text', text: textPrompt },
                    ],
                },
            ],
            modalities: ['text', 'image'],
        }),
    });

    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        const msg = err?.error?.message || '';
        if (msg.toLowerCase().includes('blocked') || msg.toLowerCase().includes('safety')) {
            throw new Error('Your edit request was blocked due to safety settings. Please modify your text and try again.');
        }
        throw new Error('Failed to edit hairstyle. The AI might be busy — please try again.');
    }

    const responseData = await response.json();
    const parts = responseData.choices?.[0]?.message?.content;

    let imageUrl = null;
    let textDescription = null;

    if (typeof parts === 'string') {
        textDescription = parts;
    } else if (Array.isArray(parts)) {
        for (const part of parts) {
            if (part.type === 'image_url' && part.image_url?.url) {
                imageUrl = part.image_url.url;
            } else if (part.type === 'text' && part.text) {
                textDescription = part.text;
            }
        }
    }

    if (!imageUrl) {
        throw new Error('AI did not return an edited image. Please try a different instruction.');
    }

    return { imageUrl, textDescription };
};
