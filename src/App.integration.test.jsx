import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { API_BASE_URL } from './config';
import {
  createCharacter,
  createEpisode,
  createJsonResponse,
  createListResponse,
  createLocation,
} from './test/fixtures';
import App from './App';

// End-to-end smoke test with no page-level mocks: renders the real Header,
// CharactersPage, EpisodesPage and LocationsPage together to catch wiring
// issues that per-page unit tests (which mock their siblings) would miss.
const buildFetchMock = () => vi.fn((url) => {
  if (url === `${API_BASE_URL}/character`) {
    return Promise.resolve(createJsonResponse({ info: { count: 826 } }));
  }

  if (/\/episode\/\d+$/.test(url)) {
    return Promise.resolve(createJsonResponse(createEpisode({ id: 1, name: 'Pilot', characterCount: 2 })));
  }

  if (/\/character\/[\d,]+$/.test(url)) {
    return Promise.resolve(createJsonResponse([
      createCharacter({ id: 1, name: 'Rick Sanchez' }),
      createCharacter({ id: 2, name: 'Morty Smith' }),
    ]));
  }

  if (url.startsWith(`${API_BASE_URL}/episode?`)) {
    return Promise.resolve(createJsonResponse(
      createListResponse([createEpisode({ id: 2, name: 'Lawnmower Dog' })]),
    ));
  }

  if (/\/location\/\d+$/.test(url)) {
    return Promise.resolve(createJsonResponse(createLocation({ id: 3, residentCount: 1 })));
  }

  return Promise.reject(new Error(`Unhandled request: ${url}`));
});

describe('App (integration)', () => {
  it('renders every tab end-to-end without mocked pages', async () => {
    const user = userEvent.setup();
    vi.stubGlobal('fetch', buildFetchMock());
    render(<App />);

    expect(await screen.findByText('826')).toBeInTheDocument();
    expect(await screen.findByRole('heading', { name: 'Pilot' })).toBeInTheDocument();
    expect(await screen.findByRole('heading', { name: 'Rick Sanchez' })).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Buscar personaje...')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Agregar Rick Sanchez a favoritos' }));
    await user.click(screen.getByRole('button', { name: 'Menú de perfil' }));
    expect(within(screen.getByRole('menu')).getByText('1')).toBeInTheDocument();
    await user.keyboard('{Escape}');

    await user.click(screen.getByRole('button', { name: 'Episodios' }));
    expect(await screen.findByRole('heading', { name: 'Lawnmower Dog' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Ubicaciones' }));
    expect(await screen.findByRole('heading', { name: 'Location 3' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Personajes' }));
    expect(await screen.findByRole('heading', { name: 'Pilot' })).toBeInTheDocument();
  });
});
