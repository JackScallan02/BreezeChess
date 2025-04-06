export const getFlag = (country_code: string): string | undefined => {
    try {
        return `/assets/country_flags/${country_code.toLowerCase()}.svg`;
    } catch (error) {
        console.error('Error loading flag:', error);
    }
}