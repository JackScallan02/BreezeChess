import { Country } from '../types/country';

// Returns the image path for a given country code
export const getFlag = (country_code: string): string | undefined => {
    try {
        return `/assets/country_flags/${country_code.toLowerCase()}.svg`;
    } catch (error) {
        console.error('Error loading flag:', error);
    }
}

// Returns the country name for a given country code
export const getCountryCode = (name: string, countries: Country[]): string => {
    const country = countries.find((country) => country.name === name);
    return country ? country.iso_code : 'Unknown';
}