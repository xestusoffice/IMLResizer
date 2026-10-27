/**
 * Comprehensive Presets Database for IMLResizer
 * Includes Government Exams, Visa/Passport Photos, Social Media, and Target Sizes
 */

export const PRESET_CATEGORIES = {
  EXAMS: 'Govt & Exams',
  VISAS: 'Passport & Visa',
  SOCIAL: 'Social Media',
  TARGET_KB: 'Target File Size',
  PRINT: 'Print & Paper'
};

export const PRESETS = [
  // --- GOVERNMENT EXAMS (INDIA) ---
  {
    id: 'ssc_cgl_photo',
    name: 'SSC CGL / CHSL Photo',
    category: PRESET_CATEGORIES.EXAMS,
    unit: 'cm',
    width: 3.5,
    height: 4.5,
    dpi: 200,
    format: 'image/jpeg',
    targetKB: 40,
    minKB: 20,
    maxKB: 50,
    description: '3.5 x 4.5 cm (200 DPI), file size between 20 KB and 50 KB'
  },
  {
    id: 'ssc_cgl_signature',
    name: 'SSC Signature',
    category: PRESET_CATEGORIES.EXAMS,
    unit: 'cm',
    width: 4.0,
    height: 2.0,
    dpi: 200,
    format: 'image/jpeg',
    targetKB: 15,
    minKB: 10,
    maxKB: 20,
    description: '4.0 x 2.0 cm (200 DPI), file size between 10 KB and 20 KB'
  },
  {
    id: 'upsc_photo',
    name: 'UPSC Photo',
    category: PRESET_CATEGORIES.EXAMS,
    unit: 'px',
    width: 350,
    height: 350,
    dpi: 300,
    format: 'image/jpeg',
    targetKB: 75,
    minKB: 20,
    maxKB: 100,
    description: '350 x 350 px, file size between 20 KB and 100 KB'
  },
  {
    id: 'upsc_signature',
    name: 'UPSC Signature',
    category: PRESET_CATEGORIES.EXAMS,
    unit: 'px',
    width: 1000,
    height: 550,
    dpi: 300,
    format: 'image/jpeg',
    targetKB: 25,
    minKB: 10,
    maxKB: 40,
    description: '1000 x 550 px, file size between 10 KB and 40 KB'
  },
  {
    id: 'pan_card_photo',
    name: 'PAN Card Photo (NSDL / UTI)',
    category: PRESET_CATEGORIES.EXAMS,
    unit: 'cm',
    width: 3.5,
    height: 2.5,
    dpi: 200,
    format: 'image/jpeg',
    targetKB: 30,
    minKB: 10,
    maxKB: 50,
    description: '3.5 x 2.5 cm, 200 DPI, less than 50 KB'
  },
  {
    id: 'pan_card_signature',
    name: 'PAN Card Signature',
    category: PRESET_CATEGORIES.EXAMS,
    unit: 'cm',
    width: 4.5,
    height: 2.0,
    dpi: 200,
    format: 'image/jpeg',
    targetKB: 15,
    minKB: 5,
    maxKB: 20,
    description: '4.5 x 2.0 cm, 200 DPI, less than 20 KB'
  },
  {
    id: 'neet_photo',
    name: 'NEET UG Passport Photo',
    category: PRESET_CATEGORIES.EXAMS,
    unit: 'cm',
    width: 3.5,
    height: 4.5,
    dpi: 200,
    format: 'image/jpeg',
    targetKB: 100,
    minKB: 10,
    maxKB: 200,
    description: '3.5 x 4.5 cm with white background, 10 KB - 200 KB'
  },
  {
    id: 'ibps_photo',
    name: 'IBPS Bank PO / Clerk Photo',
    category: PRESET_CATEGORIES.EXAMS,
    unit: 'cm',
    width: 4.5,
    height: 3.5,
    dpi: 200,
    format: 'image/jpeg',
    targetKB: 35,
    minKB: 20,
    maxKB: 50,
    description: '4.5 x 3.5 cm, 20 KB to 50 KB'
  },

  // --- PASSPORT & VISA PHOTOS ---
  {
    id: 'india_passport',
    name: 'India Passport / Visa',
    category: PRESET_CATEGORIES.VISAS,
    unit: 'mm',
    width: 35,
    height: 45,
    dpi: 300,
    format: 'image/jpeg',
    targetKB: 100,
    minKB: 30,
    maxKB: 200,
    description: '35 x 45 mm, 300 DPI, white background, facial height 70-80%'
  },
  {
    id: 'us_visa',
    name: 'US Visa / Passport (2x2")',
    category: PRESET_CATEGORIES.VISAS,
    unit: 'inch',
    width: 2.0,
    height: 2.0,
    dpi: 300,
    format: 'image/jpeg',
    targetKB: 150,
    minKB: 50,
    maxKB: 240,
    description: '2 x 2 inches (600x600 px), 300 DPI, white background, max 240 KB'
  },
  {
    id: 'schengen_visa',
    name: 'Schengen Visa (Europe)',
    category: PRESET_CATEGORIES.VISAS,
    unit: 'mm',
    width: 35,
    height: 45,
    dpi: 300,
    format: 'image/jpeg',
    targetKB: 120,
    minKB: 40,
    maxKB: 250,
    description: '35 x 45 mm, 300 DPI, light gray/white background'
  },
  {
    id: 'uk_passport',
    name: 'UK Passport / Visa',
    category: PRESET_CATEGORIES.VISAS,
    unit: 'mm',
    width: 35,
    height: 45,
    dpi: 300,
    format: 'image/jpeg',
    targetKB: 100,
    minKB: 30,
    maxKB: 200,
    description: '35 x 45 mm, light gray or cream background'
  },
  {
    id: 'canada_visa',
    name: 'Canada Visa / Passport',
    category: PRESET_CATEGORIES.VISAS,
    unit: 'mm',
    width: 50,
    height: 70,
    dpi: 300,
    format: 'image/jpeg',
    targetKB: 200,
    minKB: 60,
    maxKB: 400,
    description: '50 x 70 mm (2 x 2.75 inches), 300 DPI'
  },
  {
    id: 'australia_visa',
    name: 'Australia Visa',
    category: PRESET_CATEGORIES.VISAS,
    unit: 'mm',
    width: 35,
    height: 45,
    dpi: 300,
    format: 'image/jpeg',
    targetKB: 120,
    minKB: 40,
    maxKB: 250,
    description: '35 x 45 mm, 300 DPI'
  },

  // --- TARGET FILE SIZES ---
  {
    id: 'target_20kb',
    name: 'Resize to 20 KB',
    category: PRESET_CATEGORIES.TARGET_KB,
    unit: 'px',
    targetKB: 20,
    format: 'image/jpeg',
    description: 'Compress image strictly under 20 KB for online portals'
  },
  {
    id: 'target_50kb',
    name: 'Resize to 50 KB',
    category: PRESET_CATEGORIES.TARGET_KB,
    unit: 'px',
    targetKB: 50,
    format: 'image/jpeg',
    description: 'Compress image under 50 KB for exam applications'
  },
  {
    id: 'target_100kb',
    name: 'Resize to 100 KB',
    category: PRESET_CATEGORIES.TARGET_KB,
    unit: 'px',
    targetKB: 100,
    format: 'image/jpeg',
    description: 'Compress image under 100 KB for admission forms'
  },
  {
    id: 'target_200kb',
    name: 'Resize to 200 KB',
    category: PRESET_CATEGORIES.TARGET_KB,
    unit: 'px',
    targetKB: 200,
    format: 'image/jpeg',
    description: 'Compress image under 200 KB for document scans'
  },

  // --- SOCIAL MEDIA ---
  {
    id: 'insta_square',
    name: 'Instagram Square (1:1)',
    category: PRESET_CATEGORIES.SOCIAL,
    unit: 'px',
    width: 1080,
    height: 1080,
    dpi: 72,
    format: 'image/jpeg',
    description: '1080 x 1080 px, classic Instagram post'
  },
  {
    id: 'insta_portrait',
    name: 'Instagram Portrait (4:5)',
    category: PRESET_CATEGORIES.SOCIAL,
    unit: 'px',
    width: 1080,
    height: 1350,
    dpi: 72,
    format: 'image/jpeg',
    description: '1080 x 1350 px, vertical post'
  },
  {
    id: 'insta_story',
    name: 'Instagram Story / Reel (9:16)',
    category: PRESET_CATEGORIES.SOCIAL,
    unit: 'px',
    width: 1080,
    height: 1920,
    dpi: 72,
    format: 'image/jpeg',
    description: '1080 x 1920 px, full screen vertical'
  },
  {
    id: 'youtube_thumb',
    name: 'YouTube Thumbnail (16:9)',
    category: PRESET_CATEGORIES.SOCIAL,
    unit: 'px',
    width: 1280,
    height: 720,
    dpi: 72,
    format: 'image/jpeg',
    targetKB: 1800,
    maxKB: 2000,
    description: '1280 x 720 px, under 2 MB limit'
  },
  {
    id: 'facebook_post',
    name: 'Facebook Feed Post',
    category: PRESET_CATEGORIES.SOCIAL,
    unit: 'px',
    width: 1200,
    height: 630,
    dpi: 72,
    format: 'image/jpeg',
    description: '1200 x 630 px landscape'
  },
  {
    id: 'twitter_post',
    name: 'Twitter / X Post',
    category: PRESET_CATEGORIES.SOCIAL,
    unit: 'px',
    width: 1600,
    height: 900,
    dpi: 72,
    format: 'image/jpeg',
    description: '1600 x 900 px (16:9)'
  },
  {
    id: 'linkedin_post',
    name: 'LinkedIn Post Image',
    category: PRESET_CATEGORIES.SOCIAL,
    unit: 'px',
    width: 1200,
    height: 627,
    dpi: 72,
    format: 'image/jpeg',
    description: '1200 x 627 px'
  },

  // --- PRINT & DOCUMENT SIZES ---
  {
    id: 'print_a4',
    name: 'A4 Document (300 DPI)',
    category: PRESET_CATEGORIES.PRINT,
    unit: 'mm',
    width: 210,
    height: 297,
    dpi: 300,
    format: 'image/jpeg',
    description: '210 x 297 mm, standard A4 paper at 300 DPI'
  },
  {
    id: 'print_4x6',
    name: '4 x 6 Inch Photo Print',
    category: PRESET_CATEGORIES.PRINT,
    unit: 'inch',
    width: 4.0,
    height: 6.0,
    dpi: 300,
    format: 'image/jpeg',
    description: 'Standard 4 x 6 photo print (1200 x 1800 px)'
  }
];
