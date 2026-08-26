import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createJsonResponse, createListResponse } from '../test/fixtures';
import Header from './Header';

const profile = { name: 'Ana', version: 'rick' };

const renderHeader = (props = {}) => render(
  <Header
    activeTab='characters'
    onChangeUser={vi.fn()}
    onShowFavorites={vi.fn()}
    onTabChange={vi.fn()}
    profile={profile}
    {...props}
  />,
);

describe('Header', () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(
      createJsonResponse(createListResponse([], { count: 826 })),
    ));
  });

  it('notifies the parent when a navigation tab is selected', async () => {
    const user = userEvent.setup();
    const onTabChange = vi.fn();
    renderHeader({ onTabChange });

    await user.click(screen.getByRole('button', { name: 'Episodios' }));
    expect(onTabChange).toHaveBeenCalledWith('episodes');
  });

  it('shows the total character count once it loads', async () => {
    renderHeader();
    expect(await screen.findByText('826')).toBeInTheDocument();
  });

  it('toggles the theme and persists it to localStorage', async () => {
    const user = userEvent.setup();
    renderHeader();

    expect(document.documentElement.dataset.theme).toBe('dark');
    await user.click(screen.getByRole('button', { name: 'Cambiar a tema claro' }));

    expect(document.documentElement.dataset.theme).toBe('light');
    expect(JSON.parse(window.localStorage.getItem('rm-theme'))).toBe('light');
  });

  it('opens the profile menu and triggers the favorites action', async () => {
    const user = userEvent.setup();
    const onShowFavorites = vi.fn();
    window.localStorage.setItem('rm-favorites', JSON.stringify([1, 2]));
    renderHeader({ onShowFavorites });

    await user.click(screen.getByRole('button', { name: 'Menú de perfil' }));
    const menu = screen.getByRole('menu');

    expect(within(menu).getByText('Ana')).toBeInTheDocument();
    expect(within(menu).getByText('2')).toBeInTheDocument();

    await user.click(within(menu).getByRole('menuitem', { name: /Favoritos/ }));
    expect(onShowFavorites).toHaveBeenCalledTimes(1);
  });

  it('triggers the change-user action from the profile menu', async () => {
    const user = userEvent.setup();
    const onChangeUser = vi.fn();
    renderHeader({ onChangeUser });

    await user.click(screen.getByRole('button', { name: 'Menú de perfil' }));
    await user.click(screen.getByRole('menuitem', { name: 'Cambiar usuario' }));

    expect(onChangeUser).toHaveBeenCalledTimes(1);
  });
});
