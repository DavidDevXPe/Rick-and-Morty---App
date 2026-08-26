import { useLayoutEffect, useState } from 'react';
import PropTypes from 'prop-types';
import mortyPortrait from '../assets/rick-morty/branding/welcome-morty.webp';
import rickAndMortyWordmark from '../assets/rick-morty/branding/rick-and-morty-wordmark.webp';
import rickPortrait from '../assets/rick-morty/branding/welcome-rick.webp';
import bottomFrame from '../assets/rick-morty/decorative/welcome-bottom-frame.webp';
import portalGun from '../assets/rick-morty/decorative/portal-gun.webp';
import portal from '../assets/rick-morty/decorative/welcome-portal.webp';
import { PLAYER_NAME_STORAGE_KEY, SELECTED_AVATAR_STORAGE_KEY } from '../config';
import { useLanguage } from '../i18n/useLanguage';
import './styles/welcomeScreen.css';

const MAX_PLAYER_NAME_LENGTH = 32;
const VALID_VERSIONS = ['rick', 'morty'];

const getStoredPlayerName = () => {
    if (typeof window === 'undefined') {
        return '';
    }

    try {
        return (window.localStorage.getItem(PLAYER_NAME_STORAGE_KEY) ?? '')
            .slice(0, MAX_PLAYER_NAME_LENGTH);
    } catch {
        return '';
    }
};

const getStoredVersion = () => {
    if (typeof window === 'undefined') {
        return 'rick';
    }

    try {
        const storedVersion = window.localStorage.getItem(SELECTED_AVATAR_STORAGE_KEY);
        return VALID_VERSIONS.includes(storedVersion) ? storedVersion : 'rick';
    } catch {
        return 'rick';
    }
};

const storeVersion = (version) => {
    try {
        window.localStorage.setItem(SELECTED_AVATAR_STORAGE_KEY, version);
    } catch {
        // Storage can be unavailable in private or restricted browser contexts.
    }
};

const VERSIONS = [
    {
        descriptionKey: 'welcome.rickDescription',
        id: 'rick',
        image: rickPortrait,
        name: 'Rick',
    },
    {
        descriptionKey: 'welcome.mortyDescription',
        id: 'morty',
        image: mortyPortrait,
        name: 'Morty',
    },
];

const WelcomeScreen = ({ onEnter }) => {
    const { language, t, toggleLanguage } = useLanguage();
    const [version, setVersion] = useState(getStoredVersion);
    const [name, setName] = useState(getStoredPlayerName);
    const [hasSubmitted, setHasSubmitted] = useState(false);
    const hasNameError = hasSubmitted && name.trim().length === 0;

    useLayoutEffect(() => {
        const previousTheme = document.documentElement.dataset.theme;
        document.documentElement.dataset.theme = 'dark';

        return () => {
            if (previousTheme) {
                document.documentElement.dataset.theme = previousTheme;
            } else {
                delete document.documentElement.dataset.theme;
            }
        };
    }, []);

    const handleVersionChange = (nextVersion) => {
        setVersion(nextVersion);
        storeVersion(nextVersion);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        setHasSubmitted(true);

        const trimmedName = name.trim();
        if (!trimmedName) {
            return;
        }

        try {
            window.localStorage.setItem(PLAYER_NAME_STORAGE_KEY, trimmedName);
        } catch {
            // Storage can be unavailable in private or restricted browser contexts.
        }
        storeVersion(version);

        onEnter({ name: trimmedName, version });
    };

    return (
        <section className='welcome_screen' aria-labelledby='welcome-title'>
            <div className='welcome_topbar'>
                <button
                    type='button'
                    className='welcome_language'
                    onClick={toggleLanguage}
                    aria-label={t('language.controlLabel')}
                >
                    {language.toUpperCase()}
                </button>
            </div>

            <main className='welcome_content'>
                <img
                    className='welcome_wordmark'
                    src={rickAndMortyWordmark}
                    alt='Rick and Morty'
                    width='2068'
                    height='632'
                    decoding='async'
                />

                <header className='welcome_intro'>
                    <h1 id='welcome-title'>
                        {t('welcome.titlePrefix')}
                        <span>{t('welcome.titleAccent')}</span>
                        {t('welcome.titleSuffix')}
                    </h1>
                    <p>{t('welcome.subtitle')}</p>
                </header>

                <form className='welcome_form' onSubmit={handleSubmit} noValidate>
                    <fieldset className='welcome_fieldset'>
                        <legend className='welcome_section_title'>
                            <span>{t('welcome.selectVersion')}</span>
                        </legend>

                        <div className='welcome_choices'>
                            {VERSIONS.map((item) => (
                                <label className='welcome_choice' key={item.id}>
                                    <input
                                        className='welcome_choice_input'
                                        type='radio'
                                        name='version'
                                        value={item.id}
                                        checked={version === item.id}
                                        onChange={() => handleVersionChange(item.id)}
                                    />
                                    <span className='welcome_choice_card'>
                                        <img
                                            className='welcome_choice_portrait'
                                            src={item.image}
                                            alt=''
                                            width={item.id === 'rick' ? '630' : '618'}
                                            height={item.id === 'rick' ? '638' : '603'}
                                            decoding='async'
                                        />
                                        <span className='welcome_choice_copy'>
                                            <strong>{item.name}</strong>
                                            <small>{t(item.descriptionKey)}</small>
                                        </span>
                                    </span>
                                </label>
                            ))}
                        </div>
                    </fieldset>

                    <div className='welcome_name_section'>
                        <label className='welcome_section_title' htmlFor='traveler-name'>
                            <span>{t('welcome.enterName')}</span>
                        </label>

                        <div className={`welcome_name_shell${hasNameError ? ' welcome_name_shell--error' : ''}`}>
                            <img
                                className='welcome_gun'
                                src={portalGun}
                                alt=''
                                width='1188'
                                height='713'
                                aria-hidden='true'
                            />
                            <input
                                id='traveler-name'
                                type='text'
                                value={name}
                                onChange={(event) => setName(event.target.value)}
                                placeholder={t('welcome.namePlaceholder')}
                                autoComplete='off'
                                maxLength={MAX_PLAYER_NAME_LENGTH}
                                required
                                aria-invalid={hasNameError}
                                aria-describedby={hasNameError ? 'traveler-name-error' : undefined}
                            />
                            <button className='welcome_submit' type='submit'>
                                <span>{t('welcome.adventure')}</span>
                                <img
                                    className='welcome_submit_portal'
                                    src={portal}
                                    alt=''
                                    width='939'
                                    height='932'
                                    aria-hidden='true'
                                />
                            </button>
                        </div>

                        {hasNameError && (
                            <p id='traveler-name-error' className='welcome_error' role='alert'>
                                {t('welcome.nameError')}
                            </p>
                        )}
                    </div>
                </form>
            </main>

            <img
                className='welcome_bottom_frame'
                src={bottomFrame}
                alt=''
                width='2172'
                height='208'
                aria-hidden='true'
            />
        </section>
    );
};

WelcomeScreen.propTypes = {
    onEnter: PropTypes.func.isRequired,
};

export default WelcomeScreen;
