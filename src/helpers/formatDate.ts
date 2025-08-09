export const formatDate: (date: Date | string) => string = (date: Date | string): string => {
    const dateObj = new Date(date);
    const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: '2-digit',
    };
    // TODO: Add support for different countries/languages
    return new Intl.DateTimeFormat('en-US', options).format(dateObj);
}
