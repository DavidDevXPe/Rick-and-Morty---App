import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
    LANGUAGE_STORAGE_KEY,
    PLAYER_NAME_STORAGE_KEY,
    SELECTED_AVATAR_STORAGE_KEY,
} from '../config';
import { LanguageProvider } from '../i18n/LanguageContext';
import WelcomeScreen from './WelcomeScreen';

const renderWelcome = (onEnter = vi.fn()) => render(
    <LanguageProvider>
        <WelcomeScreen onEnter={onEnter} />
    </LanguageProvider>,
);

describe('WelcomeScreen', () => {
    beforeEach(() => {
        window.localStorage.clear();
    });

    afterEach(() => {
        delete document.documentElement.dataset.theme;
        document.documentElement.lang = '';
    });

    it('starts with Rick selected and submits a trimmed traveler profile', async () => {
        const user = userEvent.setup();
        const onEnter = vi.fn();
        renderWelcome(onEnter);

        expect(screen.getByRole('radio', { name: /Rick/i })).toBeChecked();
        expect(screen.getByRole('textbox')).toHaveAttribute('autocomplete', 'off');

        await user.click(screen.getByRole('radio', { name: /Morty/i }));
        await user.type(screen.getByRole('textbox', { name: 'Dinos tu nombre' }), '  Birdperson  ');
        await user.click(screen.getByRole('button', { name: '¡Aventúrate!' }));

        expect(onEnter).toHaveBeenCalledWith({ name: 'Birdperson', version: 'morty' });
        expect(window.localStorage.getItem(PLAYER_NAME_STORAGE_KEY)).toBe('Birdperson');
        expect(window.localStorage.getItem(SELECTED_AVATAR_STORAGE_KEY)).toBe('morty');
    });

    it('restores the player name from localStorage without browser autocomplete', () => {
        window.localStorage.setItem(PLAYER_NAME_STORAGE_KEY, 'David');

        renderWelcome();

        expect(screen.getByRole('textbox')).toHaveValue('David');
        expect(screen.getByRole('textbox')).toHaveAttribute('autocomplete', 'off');
    });

    it('shows an accessible error when the name is empty', async () => {
        const user = userEvent.setup();
        const onEnter = vi.fn();
        renderWelcome(onEnter);

        await user.click(screen.getByRole('button', { name: '¡Aventúrate!' }));

        expect(screen.getByRole('alert')).toHaveTextContent('Dinos tu nombre para abrir el portal.');
        expect(screen.getByRole('textbox', { name: 'Dinos tu nombre' })).toHaveAttribute('aria-invalid', 'true');
        expect(onEnter).not.toHaveBeenCalled();
    });

    it('toggles ES and EN immediately and persists the raw language preference', async () => {
        const user = userEvent.setup();
        renderWelcome();

        const languageButton = screen.getByRole('button', {
            name: 'Idioma actual: Español. Cambiar a inglés',
        });

        expect(languageButton).toHaveTextContent('ES');
        expect(screen.getByRole('heading', { name: '¡Bienvenido al Multiverso!' })).toBeInTheDocument();
        expect(window.localStorage.getItem(LANGUAGE_STORAGE_KEY)).toBe('es');

        await user.click(languageButton);

        expect(screen.getByRole('button', {
            name: 'Current language: English. Switch to Spanish',
        })).toHaveTextContent('EN');
        expect(screen.getByRole('heading', { name: 'Welcome to the Multiverse!' })).toBeInTheDocument();
        expect(screen.getByRole('textbox', { name: 'Tell us your name' })).toHaveAttribute(
            'placeholder',
            'Enter your name, adventurer...',
        );
        expect(window.localStorage.getItem(LANGUAGE_STORAGE_KEY)).toBe('en');
        expect(document.documentElement.lang).toBe('en');
    });

    it('restores the stored language and selected avatar after remounting', async () => {
        const user = userEvent.setup();
        const firstRender = renderWelcome();

        await user.click(screen.getByRole('radio', { name: /Morty/i }));
        await user.click(screen.getByRole('button', {
            name: 'Idioma actual: Español. Cambiar a inglés',
        }));
        firstRender.unmount();

        renderWelcome();

        expect(screen.getByRole('radio', { name: /Morty/i })).toBeChecked();
        expect(screen.getByRole('button', {
            name: 'Current language: English. Switch to Spanish',
        })).toHaveTextContent('EN');
        expect(screen.getByText('Good... just Morty')).toBeInTheDocument();
        expect(window.localStorage.getItem(SELECTED_AVATAR_STORAGE_KEY)).toBe('morty');
        expect(window.localStorage.getItem(LANGUAGE_STORAGE_KEY)).toBe('en');
    });

    it('stays dark without changing the stored theme preference', () => {
        window.localStorage.setItem('rm-theme', JSON.stringify('light'));
        document.documentElement.dataset.theme = 'light';
        const { unmount } = renderWelcome();

        expect(document.documentElement.dataset.theme).toBe('dark');
        expect(screen.getByRole('button', {
            name: 'Idioma actual: Español. Cambiar a inglés',
        })).toHaveTextContent('ES');
        expect(screen.queryByRole('button', { name: /Cambiar a tema/i })).not.toBeInTheDocument();
        expect(JSON.parse(window.localStorage.getItem('rm-theme'))).toBe('light');

        unmount();
        expect(document.documentElement.dataset.theme).toBe('light');
    });
});
