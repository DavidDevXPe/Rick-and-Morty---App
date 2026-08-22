import { createContext, useContext } from 'react';
import {
    DEFAULT_LANGUAGE,
    getLanguageLocale,
    translate,
} from './translations';

const defaultContext = {
    language: DEFAULT_LANGUAGE,
    locale: getLanguageLocale(DEFAULT_LANGUAGE),
    setLanguage: () => {},
    t: (key, variables) => translate(DEFAULT_LANGUAGE, key, variables),
    toggleLanguage: () => {},
};

export const LanguageContext = createContext(defaultContext);

export const useLanguage = () => useContext(LanguageContext);
