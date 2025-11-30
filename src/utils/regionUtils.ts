// Utility functions for handling region codes and flags

// Map emoji flags to ISO 3166-1-alpha-2 country codes
const emojiToCountryCode: Record<string, string> = {
  '🇺🇸': 'us', // United States
  '🇨🇳': 'cn', // China
  '🇯🇵': 'jp', // Japan
  '🇰🇷': 'kr', // South Korea
  '🇬🇧': 'gb', // United Kingdom
  '🇩🇪': 'de', // Germany
  '🇫🇷': 'fr', // France
  '🇨🇦': 'ca', // Canada
  '🇦🇺': 'au', // Australia
  '🇸🇬': 'sg', // Singapore
  '🇭🇰': 'hk', // Hong Kong
  '🇹🇼': 'tw', // Taiwan
  '🇮🇳': 'in', // India
  '🇧🇷': 'br', // Brazil
  '🇷🇺': 'ru', // Russia
  '🇳🇱': 'nl', // Netherlands
  '🇸🇪': 'se', // Sweden
  '🇳🇴': 'no', // Norway
  '🇩🇰': 'dk', // Denmark
  '🇫🇮': 'fi', // Finland
  '🇨🇭': 'ch', // Switzerland
  '🇦🇹': 'at', // Austria
  '🇧🇪': 'be', // Belgium
  '🇮🇹': 'it', // Italy
  '🇪🇸': 'es', // Spain
  '🇵🇹': 'pt', // Portugal
  '🇵🇱': 'pl', // Poland
  '🇨🇿': 'cz', // Czech Republic
  '🇭🇺': 'hu', // Hungary
  '🇷🇴': 'ro', // Romania
  '🇬🇷': 'gr', // Greece
  '🇹🇷': 'tr', // Turkey
  '🇮🇱': 'il', // Israel
  '🇦🇪': 'ae', // United Arab Emirates
  '🇸🇦': 'sa', // Saudi Arabia
  '🇪🇬': 'eg', // Egypt
  '🇿🇦': 'za', // South Africa
  '🇲🇽': 'mx', // Mexico
  '🇦🇷': 'ar', // Argentina
  '🇨🇱': 'cl', // Chile
  '🇨🇴': 'co', // Colombia
  '🇵🇪': 'pe', // Peru
  '🇻🇪': 've', // Venezuela
  '🇺🇾': 'uy', // Uruguay
  '🇪🇨': 'ec', // Ecuador
  '🇧🇴': 'bo', // Bolivia
  '🇵🇾': 'py', // Paraguay
  '🇹🇭': 'th', // Thailand
  '🇻🇳': 'vn', // Vietnam
  '🇲🇾': 'my', // Malaysia
  '🇮🇩': 'id', // Indonesia
  '🇵🇭': 'ph', // Philippines
  '🇰🇭': 'kh', // Cambodia
  '🇱🇦': 'la', // Laos
  '🇲🇲': 'mm', // Myanmar
  '🇧🇩': 'bd', // Bangladesh
  '🇱🇰': 'lk', // Sri Lanka
  '🇳🇵': 'np', // Nepal
  '🇵🇰': 'pk', // Pakistan
  '🇦🇫': 'af', // Afghanistan
  '🇮🇷': 'ir', // Iran
  '🇮🇶': 'iq', // Iraq
  '🇯🇴': 'jo', // Jordan
  '🇱🇧': 'lb', // Lebanon
  '🇸🇾': 'sy', // Syria
  '🇰🇼': 'kw', // Kuwait
  '🇶🇦': 'qa', // Qatar
  '🇧🇭': 'bh', // Bahrain
  '🇴🇲': 'om', // Oman
  '🇾🇪': 'ye', // Yemen
  '🇰🇿': 'kz', // Kazakhstan
  '🇺🇿': 'uz', // Uzbekistan
  '🇹🇲': 'tm', // Turkmenistan
  '🇰🇬': 'kg', // Kyrgyzstan
  '🇹🇯': 'tj', // Tajikistan
  '🇲🇳': 'mn', // Mongolia
  '🇰🇵': 'kp', // North Korea
};

// Language code to country code mapping for LanguageSwitch
const languageToCountryCode: Record<string, string> = {
  'en': 'us',    // English -> United States
  'zh-CN': 'cn', // Chinese -> China
  'ja': 'jp',    // Japanese -> Japan
};

/**
 * Extract country code from region string
 * Handles both emoji flags and text-based region names
 */
export function getCountryCodeFromRegion(region: string): string {
  if (!region) return 'xx'; // Default/unknown flag
  
  // Check if region contains emoji flag
  for (const [emoji, code] of Object.entries(emojiToCountryCode)) {
    if (region.includes(emoji)) {
      return code;
    }
  }
  
  // If no emoji found, try to match common region names
  const regionLower = region.toLowerCase();
  
  // Common region name mappings
  const regionNameMap: Record<string, string> = {
    'united states': 'us',
    'usa': 'us',
    'america': 'us',
    'china': 'cn',
    'japan': 'jp',
    'korea': 'kr',
    'south korea': 'kr',
    'united kingdom': 'gb',
    'uk': 'gb',
    'britain': 'gb',
    'germany': 'de',
    'france': 'fr',
    'canada': 'ca',
    'australia': 'au',
    'singapore': 'sg',
    'hong kong': 'hk',
    'taiwan': 'tw',
    'india': 'in',
    'brazil': 'br',
    'russia': 'ru',
    'netherlands': 'nl',
    'sweden': 'se',
    'norway': 'no',
    'denmark': 'dk',
    'finland': 'fi',
    'switzerland': 'ch',
    'austria': 'at',
    'belgium': 'be',
    'italy': 'it',
    'spain': 'es',
    'portugal': 'pt',
    'poland': 'pl',
  };
  
  for (const [name, code] of Object.entries(regionNameMap)) {
    if (regionLower.includes(name)) {
      return code;
    }
  }
  
  // If still no match, return default
  return 'xx';
}

/**
 * Get country code for language switch
 */
export function getCountryCodeFromLanguage(languageCode: string): string {
  return languageToCountryCode[languageCode] || 'xx';
}

/**
 * Create flag icon component props
 */
export function getFlagIconClass(countryCode: string): string {
  return `fi fi-${countryCode.toLowerCase()}`;
}