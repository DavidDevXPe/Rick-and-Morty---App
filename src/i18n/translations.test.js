import { describe, expect, it } from 'vitest';
import {
    DEFAULT_LANGUAGE,
    getLanguageLocale,
    translate,
    translations,
} from './translations';

describe('translations', () => {
    it('keeps the Spanish and English dictionaries in exact key parity', () => {
        expect(Object.keys(translations.en).sort()).toEqual(Object.keys(translations.es).sort());
    });

    it('uses Spanish as the default fallback without altering API-provided values', () => {
        expect(DEFAULT_LANGUAGE).toBe('es');
        expect(translate('unsupported', 'nav.characters')).toBe('Personajes');
        expect(translate('en', 'species.Human')).toBe('Human');
        expect(translate('en', 'species.Plumbus')).toBe('species.Plumbus');
    });

    it('interpolates localized dynamic labels and returns the proper locales', () => {
        expect(translate('es', 'episode.characterCount', { count: 1 })).toBe('1 personaje');
        expect(translate('en', 'episode.characterCount', { count: 2 })).toBe('2 characters');
        expect(getLanguageLocale('es')).toBe('es-ES');
        expect(getLanguageLocale('en')).toBe('en-US');
    });
});
