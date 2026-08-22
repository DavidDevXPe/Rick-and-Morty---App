const dateFormatters = Object.fromEntries(
    ['es-ES', 'en-US'].map((locale) => [locale, new Intl.DateTimeFormat(locale, {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        timeZone: 'UTC',
    })]),
);

export const formatAirDate = (airDate, language = 'es') => {
    if (!airDate) {
        return '';
    }

    const parsedDate = new Date(`${airDate} 00:00:00 UTC`);
    const locale = language === 'en' ? 'en-US' : 'es-ES';
    return Number.isNaN(parsedDate.getTime()) ? airDate : dateFormatters[locale].format(parsedDate);
};
