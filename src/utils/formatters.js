const spanishDateFormatter = new Intl.DateTimeFormat('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
});

export const formatAirDate = (airDate) => {
    if (!airDate) {
        return 'Fecha desconocida';
    }

    const parsedDate = new Date(`${airDate} 00:00:00 UTC`);
    return Number.isNaN(parsedDate.getTime()) ? airDate : spanishDateFormatter.format(parsedDate);
};
