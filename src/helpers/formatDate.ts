export const formatDate: (date: Date) => string = (date: Date): string => {
    const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: '2-digit',
    };
    // TODO: Add support for different countries/languages
    return new Intl.DateTimeFormat('en-US', options).format(date);
}