import {
    useCallback,
    useEffect,
    useLayoutEffect,
    useMemo,
    useState,
} from 'react';
import PropTypes from 'prop-types';
import { LANGUAGE_STORAGE_KEY } from '../config';
import {
    DEFAULT_LANGUAGE,
    getLanguageLocale,
    SUPPORTED_LANGUAGES,
    translate,
} from './translations';
import { LanguageContext } from './useLanguage';

const isSupportedLanguage = (language) => SUPPORTED_LANGUAGES.includes(language);

const readStoredLanguage = () => {
    if (typeof window === 'undefined') {
        return DEFAULT_LANGUAGE;
    }

    try {
        const storedLanguage = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
        return isSupportedLanguage(storedLanguage) ? storedLanguage : DEFAULT_LANGUAGE;
    } catch {
        return DEFAULT_LANGUAGE;
    }
};

export const LanguageProvider = ({ children }) => {
    const [language, setLanguageState] = useState(readStoredLanguage);

    const setLanguage = useCallback((nextLanguageOrUpdater) => {
        setLanguageState((currentLanguage) => {
            const nextLanguage = typeof nextLanguageOrUpdater === 'function'
                ? nextLanguageOrUpdater(currentLanguage)
                : nextLanguageOrUpdater;
            return isSupportedLanguage(nextLanguage)
                ? nextLanguage
                : DEFAULT_LANGUAGE;
        });
    }, []);

    const toggleLanguage = useCallback(() => {
        setLanguage((currentLanguage) => (currentLanguage === 'es' ? 'en' : 'es'));
    }, [setLanguage]);

    useLayoutEffect(() => {
        document.documentElement.lang = language;
    }, [language]);

    useEffect(() => {
        try {
            window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
        } catch {
            // Preferences can be unavailable in private or restricted contexts.
        }
    }, [language]);

    useEffect(() => {
        const handleStorage = (event) => {
            if (event.key === LANGUAGE_STORAGE_KEY) {
                setLanguageState(isSupportedLanguage(event.newValue) ? event.newValue : DEFAULT_LANGUAGE);
            }
        };

        window.addEventListener('storage', handleStorage);
        return () => window.removeEventListener('storage', handleStorage);
    }, []);

    const t = useCallback(
        (key, variables) => translate(language, key, variables),
        [language],
    );
    const value = useMemo(() => ({
        language,
        locale: getLanguageLocale(language),
        setLanguage,
        t,
        toggleLanguage,
    }), [language, setLanguage, t, toggleLanguage]);

    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    );
};

LanguageProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
