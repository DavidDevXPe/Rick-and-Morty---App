const isRecord = (value) => Boolean(value) && typeof value === 'object' && !Array.isArray(value);
const isResource = (value) => (
    isRecord(value)
    && Number.isSafeInteger(value.id)
    && value.id > 0
    && typeof value.name === 'string'
    && value.name.trim().length > 0
);

export const isCharacter = (value) => (
    isResource(value)
    && typeof value.image === 'string'
    && typeof value.status === 'string'
    && Array.isArray(value.episode)
);

export const isEpisode = (value) => (
    isResource(value)
    && typeof value.air_date === 'string'
    && typeof value.episode === 'string'
    && Array.isArray(value.characters)
);

export const isLocation = (value) => (
    isResource(value)
    && Array.isArray(value.residents)
);

const isInfo = (value) => (
    isRecord(value)
    && Number.isSafeInteger(value.count)
    && value.count >= 0
    && (value.next === null || typeof value.next === 'string')
);

export const isCharacterCountResponse = (value) => (
    isRecord(value)
    && isRecord(value.info)
    && Number.isSafeInteger(value.info.count)
    && value.info.count >= 0
);

export const createListValidator = (isItem) => (value) => (
    isRecord(value)
    && isInfo(value.info)
    && Array.isArray(value.results)
    && value.results.every(isItem)
);

export const createBatchValidator = (isItem) => (value) => {
    const items = Array.isArray(value) ? value : [value];
    return items.length > 0 && items.every(isItem);
};

export const isCharacterListResponse = createListValidator(isCharacter);
export const isEpisodeListResponse = createListValidator(isEpisode);
export const isCharacterBatchResponse = createBatchValidator(isCharacter);
