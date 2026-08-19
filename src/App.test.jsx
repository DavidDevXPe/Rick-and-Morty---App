import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { createJsonResponse } from './test/fixtures';
import App from './App';

vi.mock('./pages/CharactersPage', () => ({
  default: ({ favoritesRequestId, focusEpisodeId }) => (
    <div data-testid='characters-page'>
      Personajes page (focusEpisodeId: {String(focusEpisodeId)}, favoritesRequestId: {favoritesRequestId})
    </div>
  ),
}));

vi.mock('./pages/EpisodesPage', () => ({
  default: ({ onSelectEpisode }) => (
    <div data-testid='episodes-page'>
      Episodios page
      <button type='button' onClick={() => onSelectEpisode(5)}>Select episode 5</button>
    </div>
  ),
}));

vi.mock('./pages/LocationsPage', () => ({
  default: () => <div data-testid='locations-page'>Ubicaciones page</div>,
}));

describe('App', () => {
  afterEach(() => {
    delete document.documentElement.dataset.theme;
  });

  it('shows the Personajes tab by default', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(createJsonResponse({ info: { count: 826 } })));
    render(<App />);

    expect(await screen.findByTestId('characters-page')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Personajes' })).toHaveAttribute('aria-current', 'page');
  });

  it('switches tabs and passes the selected episode back to Personajes', async () => {
    const user = userEvent.setup();
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(createJsonResponse({ info: { count: 826 } })));
    render(<App />);

    await user.click(screen.getByRole('button', { name: 'Episodios' }));
    expect(await screen.findByTestId('episodes-page')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Ubicaciones' }));
    expect(await screen.findByTestId('locations-page')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Episodios' }));
    await user.click(screen.getByRole('button', { name: 'Select episode 5' }));

    const charactersPage = await screen.findByTestId('characters-page');
    expect(charactersPage).toHaveTextContent('focusEpisodeId: 5');
  });

  it('opens the profile menu and routes to favorites in Personajes', async () => {
    const user = userEvent.setup();
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(createJsonResponse({ info: { count: 826 } })));
    render(<App />);

    await user.click(screen.getByRole('button', { name: 'Ubicaciones' }));
    await user.click(screen.getByRole('button', { name: 'Menú de perfil' }));
    await user.click(within(screen.getByRole('menu')).getByRole('menuitem', { name: /Favoritos/ }));

    const charactersPage = await screen.findByTestId('characters-page');
    expect(charactersPage).toHaveTextContent('favoritesRequestId: 1');
  });

  it('toggles and persists the theme', async () => {
    const user = userEvent.setup();
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(createJsonResponse({ info: { count: 826 } })));
    render(<App />);

    expect(document.documentElement.dataset.theme).toBe('dark');

    await user.click(screen.getByRole('button', { name: 'Cambiar a tema claro' }));

    expect(document.documentElement.dataset.theme).toBe('light');
    expect(JSON.parse(window.localStorage.getItem('rm-theme'))).toBe('light');
  });
});
