import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  LANGUAGE_STORAGE_KEY,
  PLAYER_NAME_STORAGE_KEY,
  PROFILE_STORAGE_KEY,
  SELECTED_AVATAR_STORAGE_KEY,
  THEME_STORAGE_KEY,
} from './config';
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

const seedProfile = (profile = { name: 'Summer', version: 'rick' }) => {
  window.localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
};

const mockCharacterCount = () => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue(createJsonResponse({ info: { count: 826 } })));
};

describe('App', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  afterEach(() => {
    delete document.documentElement.dataset.theme;
    document.documentElement.removeAttribute('lang');
    vi.unstubAllGlobals();
  });

  it('shows the Personajes tab by default', async () => {
    seedProfile();
    mockCharacterCount();
    render(<App />);

    expect(await screen.findByTestId('characters-page')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Personajes' })).toHaveAttribute('aria-current', 'page');
    await waitFor(() => expect(window.localStorage.getItem(LANGUAGE_STORAGE_KEY)).toBe('es'));
  });

  it('switches tabs and passes the selected episode back to Personajes', async () => {
    const user = userEvent.setup();
    seedProfile();
    mockCharacterCount();
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
    seedProfile();
    mockCharacterCount();
    render(<App />);

    await user.click(screen.getByRole('button', { name: 'Ubicaciones' }));
    await user.click(screen.getByRole('button', { name: /menú de perfil/i }));
    await user.click(within(screen.getByRole('menu')).getByRole('menuitem', { name: /Favoritos/ }));

    const charactersPage = await screen.findByTestId('characters-page');
    expect(charactersPage).toHaveTextContent('favoritesRequestId: 1');
  });

  it('toggles and persists the theme', async () => {
    const user = userEvent.setup();
    seedProfile();
    mockCharacterCount();
    render(<App />);

    expect(document.documentElement.dataset.theme).toBe('dark');

    await user.click(screen.getByRole('button', { name: 'Cambiar a tema claro' }));

    expect(document.documentElement.dataset.theme).toBe('light');
    expect(JSON.parse(window.localStorage.getItem(THEME_STORAGE_KEY))).toBe('light');
  });

  it('persists the Welcome profile data and restores the Morty avatar after reload', async () => {
    const user = userEvent.setup();
    const fetchMock = vi.fn().mockResolvedValue(createJsonResponse({ info: { count: 826 } }));
    window.localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify('light'));
    vi.stubGlobal('fetch', fetchMock);
    const firstRender = render(<App />);

    expect(screen.getByRole('heading', { name: /Bienvenido al Multiverso/i })).toBeInTheDocument();
    expect(document.documentElement.dataset.theme).toBe('dark');
    expect(screen.queryByRole('button', { name: /Cambiar a tema/i })).not.toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();

    await user.click(screen.getByRole('radio', { name: /Morty/i }));
    await user.type(screen.getByRole('textbox', { name: 'Dinos tu nombre' }), '  Beth  ');
    await user.click(screen.getByRole('button', { name: '¡Aventúrate!' }));

    expect(await screen.findByTestId('characters-page')).toBeInTheDocument();
    expect(document.documentElement.dataset.theme).toBe('light');
    expect(screen.getByRole('button', { name: 'Cambiar a tema oscuro' })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Avatar de Morty' })).toHaveAttribute(
      'src',
      expect.stringContaining('welcome-morty'),
    );
    expect(fetchMock).toHaveBeenCalled();
    expect(JSON.parse(window.localStorage.getItem(PROFILE_STORAGE_KEY))).toEqual({
      name: 'Beth',
      version: 'morty',
    });
    expect(window.localStorage.getItem(PLAYER_NAME_STORAGE_KEY)).toBe('Beth');
    expect(window.localStorage.getItem(SELECTED_AVATAR_STORAGE_KEY)).toBe('morty');
    expect(window.localStorage.getItem(LANGUAGE_STORAGE_KEY)).toBe('es');

    firstRender.unmount();
    render(<App />);

    expect(await screen.findByTestId('characters-page')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Personajes' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('img', { name: 'Avatar de Morty' })).toHaveAttribute(
      'src',
      expect.stringContaining('welcome-morty'),
    );
    expect(window.localStorage.getItem(PLAYER_NAME_STORAGE_KEY)).toBe('Beth');
    expect(window.localStorage.getItem(SELECTED_AVATAR_STORAGE_KEY)).toBe('morty');
  });

  it('switches ES to EN in Welcome and translates the main app immediately in both directions', async () => {
    const user = userEvent.setup();
    mockCharacterCount();
    render(<App />);

    await user.click(screen.getByRole('button', { name: /Idioma actual: Español/i }));
    expect(screen.getByRole('heading', { name: /Welcome to the Multiverse/i })).toBeInTheDocument();
    expect(window.localStorage.getItem(LANGUAGE_STORAGE_KEY)).toBe('en');
    expect(document.documentElement).toHaveAttribute('lang', 'en');

    await user.click(screen.getByRole('radio', { name: /Rick/i }));
    await user.type(screen.getByRole('textbox', { name: 'Tell us your name' }), 'Rick Prime');
    await user.click(screen.getByRole('button', { name: "Let's adventure!" }));

    expect(await screen.findByRole('button', { name: 'Characters' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('button', { name: /Current language: English/i })).toHaveTextContent('EN');
    expect(screen.getByRole('img', { name: 'Rick avatar' })).toHaveAttribute(
      'src',
      expect.stringContaining('welcome-rick'),
    );
    expect(window.localStorage.getItem(PLAYER_NAME_STORAGE_KEY)).toBe('Rick Prime');
    expect(window.localStorage.getItem(SELECTED_AVATAR_STORAGE_KEY)).toBe('rick');

    await user.click(screen.getByRole('button', { name: /Current language: English/i }));

    expect(screen.getByRole('button', { name: 'Personajes' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('button', { name: /Idioma actual: Español/i })).toHaveTextContent('ES');
    expect(window.localStorage.getItem(LANGUAGE_STORAGE_KEY)).toBe('es');
    expect(document.documentElement).toHaveAttribute('lang', 'es');
  });

  it('restores raw language and selectedAvatar preferences on a new render', async () => {
    seedProfile({ name: 'Birdperson', version: 'rick' });
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, 'en');
    window.localStorage.setItem(SELECTED_AVATAR_STORAGE_KEY, 'morty');
    window.localStorage.setItem(PLAYER_NAME_STORAGE_KEY, 'Birdperson');
    mockCharacterCount();

    const firstRender = render(<App />);

    expect(await screen.findByRole('button', { name: 'Characters' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('button', { name: /Current language: English/i })).toHaveTextContent('EN');
    expect(screen.getByRole('img', { name: 'Morty avatar' })).toHaveAttribute(
      'src',
      expect.stringContaining('welcome-morty'),
    );

    firstRender.unmount();
    render(<App />);

    expect(await screen.findByRole('button', { name: 'Characters' })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Morty avatar' })).toBeInTheDocument();
    expect(window.localStorage.getItem(LANGUAGE_STORAGE_KEY)).toBe('en');
    expect(window.localStorage.getItem(SELECTED_AVATAR_STORAGE_KEY)).toBe('morty');
    expect(window.localStorage.getItem(PLAYER_NAME_STORAGE_KEY)).toBe('Birdperson');
  });

  it('renders the header logo as static, non-clickable branding', async () => {
    seedProfile();
    mockCharacterCount();
    render(<App />);

    expect(await screen.findByTestId('characters-page')).toBeInTheDocument();
    const logo = screen.getByRole('img', { name: 'Rick and Morty' });

    expect(logo.closest('button')).toBeNull();
    expect(logo.closest('a')).toBeNull();
    expect(screen.queryByRole('button', { name: 'Rick and Morty' })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Rick and Morty' })).not.toBeInTheDocument();
  });

  it('changes user by clearing only identity while preserving language and theme', async () => {
    const user = userEvent.setup();
    seedProfile({ name: 'Jerry', version: 'morty' });
    window.localStorage.setItem(PLAYER_NAME_STORAGE_KEY, 'Jerry');
    window.localStorage.setItem(SELECTED_AVATAR_STORAGE_KEY, 'morty');
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, 'es');
    window.localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify('light'));
    mockCharacterCount();
    render(<App />);

    await user.click(screen.getByRole('button', { name: /menú de perfil/i }));
    expect(within(screen.getByRole('menu')).getByText('Jerry')).toBeInTheDocument();
    await user.click(within(screen.getByRole('menu')).getByRole('menuitem', { name: 'Cambiar usuario' }));

    expect(screen.getByRole('heading', { name: /Bienvenido al Multiverso/i })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Dinos tu nombre' })).toHaveValue('');
    expect(screen.getByRole('radio', { name: /Rick/i })).toBeChecked();
    expect(JSON.parse(window.localStorage.getItem(PROFILE_STORAGE_KEY))).toBeNull();
    expect(window.localStorage.getItem(PLAYER_NAME_STORAGE_KEY)).toBeNull();
    expect(window.localStorage.getItem(SELECTED_AVATAR_STORAGE_KEY)).toBeNull();
    expect(window.localStorage.getItem(LANGUAGE_STORAGE_KEY)).toBe('es');
    expect(JSON.parse(window.localStorage.getItem(THEME_STORAGE_KEY))).toBe('light');
    expect(document.documentElement.dataset.theme).toBe('dark');
  });
});
