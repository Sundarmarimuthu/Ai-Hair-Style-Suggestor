export const HAIR_LENGTHS = ['Short', 'Medium', 'Long', 'Shoulder Length'];

export const HAIR_STYLES = {
    'Cuts & Features': [
        { name: 'Bob', imageUrl: 'https://images.placeholders.dev/?width=200&height=200&text=Bob%20Cut' },
        { name: 'Pixie Cut', imageUrl: 'https://images.placeholders.dev/?width=200&height=200&text=Pixie%20Cut' },
        { name: 'Layers', imageUrl: 'https://images.placeholders.dev/?width=200&height=200&text=Layers' },
        { name: 'Bangs', imageUrl: 'https://images.placeholders.dev/?width=200&height=200&text=Bangs' },
        { name: 'Afro', imageUrl: 'https://images.placeholders.dev/?width=200&height=200&text=Afro' },
        { name: 'Wolf Cut', imageUrl: 'https://images.placeholders.dev/?width=200&height=200&text=Wolf%20Cut' },
    ],
    'General Styles': [
        { name: 'Straight', imageUrl: 'https://images.placeholders.dev/?width=200&height=200&text=Straight' },
        { name: 'Wavy', imageUrl: 'https://images.placeholders.dev/?width=200&height=200&text=Wavy' },
        { name: 'Curly', imageUrl: 'https://images.placeholders.dev/?width=200&height=200&text=Curly' },
        { name: 'Coily', imageUrl: 'https://images.placeholders.dev/?width=200&height=200&text=Coily' },
    ],
    'Updos & Braids': [
        { name: 'Updo', imageUrl: 'https://images.placeholders.dev/?width=200&height=200&text=Updo' },
        { name: 'Messy Bun', imageUrl: 'https://images.placeholders.dev/?width=200&height=200&text=Messy%20Bun' },
        { name: 'Ponytail', imageUrl: 'https://images.placeholders.dev/?width=200&height=200&text=Ponytail' },
        { name: 'Braids', imageUrl: 'https://images.placeholders.dev/?width=200&height=200&text=Braids' },
    ],
};

export const HAIR_COLORS = [
    { name: 'Natural Brown', value: '#5C4033' },
    { name: 'Jet Black', value: '#0A0A0A' },
    { name: 'Platinum Blonde', value: '#E6E8FA' },
    { name: 'Fiery Red', value: '#B22222' },
    { name: 'Auburn', value: '#A52A2A' },
    { name: 'Silver/Gray', value: '#C0C0C0' },
    { name: 'Pastel Pink', value: '#FFD1DC' },
    { name: 'Electric Blue', value: '#00FFFF' },
    { name: 'Emerald Green', value: '#50C878' },
];

export const VIBE_SUGGESTIONS = {
    Female: {
        'Effortless and Natural': ['Long Lived-in Layers', 'The French Bob', 'Beachy Waves', 'Curtain Bangs', 'Shag Cut', 'Air-dried Waves'],
        'Chic and Sophisticated': ['Blunt Bob', 'Glass Hair', 'Sleek High Ponytail', 'Low Chignon', 'Polished Pixie', 'Asymmetrical Bob'],
        'Bold and Edgy': ['Wolf Cut', 'Modern Mullet', 'Sharp Pixie Cut', 'Undercut Bob', 'Shaved Side', 'Vibrant Color Streaks'],
        'Romantic and Soft': ['Half-Up Half-Down', 'Wispy Updo', 'Crown Braid', 'Loose Curls', 'Waterfall Braid', 'Fishtail Braid'],
        'Playful and Fun': ['Space Buns', 'Bubble Ponytail', 'High Pigtails', 'Colorful Claw Clip Twist', 'Baby Braids', 'Crimped Hair'],
        'Vintage Inspired': ['Hollywood Waves', 'Pin-up Victory Rolls', 'Flapper Bob', 'Beehive Updo'],
        'Professional and Polished': ['Classic French Twist', 'Sleek Low Bun', 'Shoulder-length Blowout', 'Side-swept Bangs'],
        'Bohemian and Free-Spirited': ['Messy Fishtail Braid', 'Headband with Loose Waves', 'Feather Extensions', 'Dreadlocks'],
    },
    Male: {
        'Effortless and Natural': ['The Bro Flow', 'Textured Crop', 'Mid-Length Waves', 'Touseled Quiff', 'Surfer Hair', 'Messy Curls'],
        'Chic and Sophisticated': ['Classic Side Part', 'Slicked Back Undercut', 'The Pompadour', 'Hard Part Comb Over', 'Ivy League Cut', 'Taper Fade'],
        'Bold and Edgy': ['High Fade with Disconnected Top', 'Buzz Cut with Line Up', 'Modern Mullet', 'Dyed Crop Top', 'Faux Hawk', 'Mohawk Fade'],
        'Modern and Casual': ['Curly Top Fade', 'The Messy Fringe', 'Short Twists', 'The E-Boy Cut', 'Caesar Cut', 'French Crop'],
        'Vintage and Timeless': ['Greaser Slick Back', "The Gentleman's Side Part", 'Rockabilly Pompadour', 'Classic Taper'],
        'Rugged and Masculine': ['Full Beard with Short Hair', 'Viking Braids', 'Man Bun', 'Long and Wild'],
        'Athletic and Practical': ['Crew Cut', 'High and Tight', 'Induction Cut', 'Simple Buzz Cut'],
    },
};

export const GENDERS = ['Female', 'Male', 'Unspecified'];

export const IMAGE_FILTERS = [
    { name: 'None', className: '' },
    { name: 'Vintage', className: 'sepia' },
    { name: 'B & W', className: 'grayscale(100%)' },
    { name: 'Cool', className: 'contrast-125 saturate-150' },
    { name: 'Warm', className: 'sepia(30%) saturate-150' },
];
