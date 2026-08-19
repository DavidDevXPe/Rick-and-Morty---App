export const createLocation = ({ id = 1, residentCount = 5, residentStart = 1 } = {}) => ({
  id,
  name: `Location ${id}`,
  type: 'Planet',
  dimension: 'Dimension C-137',
  residents: Array.from(
    { length: residentCount },
    (_, index) => `https://rickandmortyapi.com/api/character/${residentStart + index}`,
  ),
});

export const createResident = (id = 1) => ({
  id,
  name: id === 1 ? 'Rick Sanchez' : `Resident ${id}`,
  image: `https://example.com/resident-${id}.png`,
  status: 'Alive',
  species: 'Human',
  origin: { name: 'Earth (C-137)' },
  episode: [
    'https://rickandmortyapi.com/api/episode/1',
    'https://rickandmortyapi.com/api/episode/2',
  ],
});

export const createCharacter = ({ id = 1, name, status = 'Alive', species = 'Human' } = {}) => ({
  id,
  name: name ?? (id === 1 ? 'Rick Sanchez' : `Character ${id}`),
  image: `https://example.com/character-${id}.png`,
  status,
  species,
  origin: { name: 'Earth (C-137)' },
  episode: [
    'https://rickandmortyapi.com/api/episode/1',
    'https://rickandmortyapi.com/api/episode/2',
  ],
});

export const createEpisode = ({ id = 1, name, characterCount = 5 } = {}) => ({
  id,
  name: name ?? `Episode ${id}`,
  air_date: 'December 2, 2013',
  episode: `S0${Math.ceil(id / 10) || 1}E0${id}`,
  characters: Array.from(
    { length: characterCount },
    (_, index) => `https://rickandmortyapi.com/api/character/${index + 1}`,
  ),
});

export const createListResponse = (results, { count, pages = 1, next = null } = {}) => ({
  info: {
    count: count ?? results.length,
    pages,
    next,
    prev: null,
  },
  results,
});

export const createJsonResponse = (data, status = 200) => ({
  ok: status >= 200 && status < 300,
  status,
  json: async () => data,
});

export const createDeferred = () => {
  let resolve;
  let reject;
  const promise = new Promise((promiseResolve, promiseReject) => {
    resolve = promiseResolve;
    reject = promiseReject;
  });

  return { promise, reject, resolve };
};

