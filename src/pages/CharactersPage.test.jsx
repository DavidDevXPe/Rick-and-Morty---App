import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createCharacter, createEpisode, createJsonResponse, createListResponse } from '../test/fixtures';
import CharactersPage from './CharactersPage';

const episode = createEpisode({ id: 1, name: 'Pilot', characterCount: 2 });
const rick = createCharacter({ id: 1, name: 'Rick Sanchez' });
const morty = createCharacter({ id: 2, name: 'Morty Smith' });

const buildFetchMock = () => vi.fn((url) => {
  if (url.includes('/episode/1')) {
    return Promise.resolve(createJsonResponse(episode));
  }

  if (url.includes('/character/1,2')) {
    return Promise.resolve(createJsonResponse([rick, morty]));
  }

  if (url.includes('/character?')) {
    return Promise.resolve(createJsonResponse(createListResponse([rick])));
  }

  return Promise.reject(new Error(`Unexpected request: ${url}`));
});

describe('CharactersPage', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('shows the current episode spotlight with its characters', async () => {
    vi.stubGlobal('fetch', buildFetchMock());
    render(<CharactersPage favoritesRequestId={0} />);

    expect(await screen.findByRole('heading', { name: 'Pilot' })).toBeInTheDocument();
    expect(await screen.findByRole('heading', { name: 'Rick Sanchez' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Morty Smith' })).toBeInTheDocument();
  });

  it('opens the episode supplied by navigation on the initial mount', async () => {
    const selectedEpisode = createEpisode({ id: 5, name: 'Meeseeks and Destroy', characterCount: 2 });
    const fetchMock = vi.fn((url) => {
      if (url.includes('/episode/5')) {
        return Promise.resolve(createJsonResponse(selectedEpisode));
      }

      if (url.includes('/character/1,2')) {
        return Promise.resolve(createJsonResponse([rick, morty]));
      }

      return Promise.reject(new Error(`Unexpected request: ${url}`));
    });
    vi.stubGlobal('fetch', fetchMock);

    render(<CharactersPage favoritesRequestId={0} focusEpisodeId={5} />);

    expect(await screen.findByRole('heading', { name: 'Meeseeks and Destroy' })).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('/episode/5'),
      expect.anything(),
    );
  });

  it('searches characters with the selected name filter', async () => {
    const user = userEvent.setup();
    const fetchMock = buildFetchMock();
    vi.stubGlobal('fetch', fetchMock);
    render(<CharactersPage favoritesRequestId={0} />);

    await screen.findByRole('heading', { name: 'Pilot' });

    await user.type(screen.getByPlaceholderText('Buscar personaje...'), '  Rick  ');
    await user.click(screen.getByRole('button', { name: 'Buscar' }));

    expect(await screen.findByRole('heading', { name: 'Resultados de búsqueda' })).toBeInTheDocument();
    expect(await screen.findByRole('heading', { name: 'Rick Sanchez' })).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('name=Rick'),
      expect.anything(),
    );
    expect(fetchMock).not.toHaveBeenCalledWith(
      expect.stringContaining('name=++Rick++'),
      expect.anything(),
    );
  });

  it('toggles a favorite and persists it to localStorage', async () => {
    const user = userEvent.setup();
    vi.stubGlobal('fetch', buildFetchMock());
    render(<CharactersPage favoritesRequestId={0} />);

    await screen.findByRole('heading', { name: 'Rick Sanchez' });
    await user.click(screen.getByRole('button', { name: 'Agregar Rick Sanchez a favoritos' }));

    expect(JSON.parse(window.localStorage.getItem('rm-favorites'))).toEqual([1]);
  });

  it('opens favorites on its initial mount when requested from another tab', async () => {
    window.localStorage.setItem('rm-favorites', JSON.stringify([1]));
    const fetchMock = vi.fn((url) => {
      if (url.endsWith('/character/1')) {
        return Promise.resolve(createJsonResponse(rick));
      }

      return Promise.reject(new Error(`Unexpected request: ${url}`));
    });
    vi.stubGlobal('fetch', fetchMock);

    render(<CharactersPage favoritesRequestId={1} />);

    expect(await screen.findByRole('heading', { level: 1, name: 'Tus favoritos' })).toBeInTheDocument();
    expect(await screen.findByRole('heading', { name: 'Rick Sanchez' })).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalledWith(expect.stringContaining('/episode/'), expect.anything());
  });
});
