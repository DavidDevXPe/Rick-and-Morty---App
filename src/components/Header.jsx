import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import {
    ChevronDown,
    CirclePlay,
    Heart,
    MapPin,
    Moon,
    RefreshCcw,
    Sun,
    UsersRound,
} from 'lucide-react';
import rickAndMortyLogo from '../assets/rick-morty/branding/rick-and-morty-header-logo.png';
import rickAvatar from '../assets/rick-morty/branding/welcome-rick.png';
import mortyAvatar from '../assets/rick-morty/branding/welcome-morty.png';
import {
    API_BASE_URL,
    SELECTED_AVATAR_STORAGE_KEY,
    THEME_STORAGE_KEY,
} from '../config';
import useFavorites from '../hooks/useFavorites';
import useFetch from '../hooks/useFetch';
import useLocalStorage from '../hooks/useLocalStorage';
import { useLanguage } from '../i18n/useLanguage';
import './styles/header.css';

const TABS = [
    { icon: UsersRound, id: 'characters' },
    { icon: CirclePlay, id: 'episodes' },
    { icon: MapPin, id: 'locations' },
];

const AVATARS = {
    morty: mortyAvatar,
    rick: rickAvatar,
};

const getSelectedAvatar = (fallbackAvatar) => {
    try {
        const storedAvatar = window.localStorage.getItem(SELECTED_AVATAR_STORAGE_KEY);
        return AVATARS[storedAvatar] ? storedAvatar : fallbackAvatar;
    } catch {
        return fallbackAvatar;
    }
};

const Header = ({ activeTab, onChangeUser, onTabChange, onShowFavorites, profile }) => {
    const { language, locale, t, toggleLanguage } = useLanguage();
    const [theme, setTheme] = useLocalStorage(THEME_STORAGE_KEY, 'dark');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef(null);
    const menuButtonRef = useRef(null);
    const firstMenuItemRef = useRef(null);
    const { favoriteIds } = useFavorites();
    const { data } = useFetch(`${API_BASE_URL}/character`);
    const selectedAvatar = getSelectedAvatar(profile.version);
    const selectedAvatarName = selectedAvatar === 'morty' ? 'Morty' : 'Rick';

    useLayoutEffect(() => {
        document.documentElement.dataset.theme = theme;
    }, [theme]);

    useEffect(() => {
        try {
            window.localStorage.setItem(SELECTED_AVATAR_STORAGE_KEY, selectedAvatar);
        } catch {
            // Preferences can be unavailable in private or restricted contexts.
        }
    }, [selectedAvatar]);

    useEffect(() => {
        if (!isMenuOpen) {
            return undefined;
        }

        firstMenuItemRef.current?.focus();

        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        };
        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                setIsMenuOpen(false);
                menuButtonRef.current?.focus();
            } else if (['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) {
                event.preventDefault();
                firstMenuItemRef.current?.focus();
            } else if (event.key === 'Tab') {
                setIsMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isMenuOpen]);

    const toggleTheme = () => {
        setTheme((currentTheme) => (currentTheme === 'dark' ? 'light' : 'dark'));
    };

    const handleTabChange = (tabId) => {
        setIsMenuOpen(false);
        onTabChange(tabId);
    };

    const handleFavoritesClick = () => {
        setIsMenuOpen(false);
        onShowFavorites();
    };

    const handleChangeUser = () => {
        setIsMenuOpen(false);
        onChangeUser();
    };

    return (
        <header className='header'>
            <div className='header_inner'>
                <div className='header_brand'>
                    <img
                        className='header_brand_logo'
                        src={rickAndMortyLogo}
                        alt='Rick and Morty'
                        width='366'
                        height='100'
                    />
                </div>

                <nav className='header_nav' aria-label={t('nav.ariaLabel')}>
                    {TABS.map(({ icon: Icon, id }) => (
                        <button
                            key={id}
                            type='button'
                            className={`header_tab${activeTab === id ? ' header_tab--active' : ''}`}
                            aria-current={activeTab === id ? 'page' : undefined}
                            onClick={() => handleTabChange(id)}
                        >
                            <Icon size={21} strokeWidth={1.8} aria-hidden='true' />
                            <span>{t(`nav.${id}`)}</span>
                        </button>
                    ))}
                </nav>

                <div className='header_actions'>
                    <span className='header_count'>
                        <UsersRound size={24} strokeWidth={1.8} aria-hidden='true' />
                        <span>
                            <strong>{data ? new Intl.NumberFormat(locale).format(data.info.count) : '—'}</strong>
                            <small>{t('header.characters')}</small>
                        </span>
                    </span>

                    <button
                        type='button'
                        className='header_language'
                        onClick={toggleLanguage}
                        aria-label={t('language.controlLabel')}
                    >
                        {language.toUpperCase()}
                    </button>

                    <button
                        type='button'
                        className='theme_toggle'
                        onClick={toggleTheme}
                        aria-pressed={theme === 'light'}
                        aria-label={theme === 'dark' ? t('header.themeToLight') : t('header.themeToDark')}
                    >
                        <span className={theme === 'light' ? 'theme_toggle_option theme_toggle_option--active' : 'theme_toggle_option'}>
                            <Sun size={18} aria-hidden='true' />
                        </span>
                        <span className={theme === 'dark' ? 'theme_toggle_option theme_toggle_option--active' : 'theme_toggle_option'}>
                            <Moon size={18} aria-hidden='true' />
                        </span>
                    </button>

                    <div className='header_menu' ref={menuRef}>
                        <button
                            ref={menuButtonRef}
                            type='button'
                            className='header_profile'
                            onClick={() => setIsMenuOpen((open) => !open)}
                            aria-haspopup='menu'
                            aria-expanded={isMenuOpen}
                            aria-controls='profile-menu'
                            aria-label={t('header.profileMenu')}
                        >
                            <span className='header_avatar'>
                                <img
                                    src={AVATARS[selectedAvatar]}
                                    alt={t('header.avatarAlt', { name: selectedAvatarName })}
                                    width='1254'
                                    height='1254'
                                    decoding='async'
                                />
                            </span>
                            <ChevronDown
                                className={isMenuOpen ? 'header_profile_chevron header_profile_chevron--open' : 'header_profile_chevron'}
                                size={18}
                                aria-hidden='true'
                            />
                        </button>

                        {isMenuOpen && (
                            <div id='profile-menu' className='header_dropdown' role='menu'>
                                <div className='header_dropdown_profile'>
                                    <strong>{profile.name}</strong>
                                    <span>{t('header.profileVersion', { version: selectedAvatarName })}</span>
                                </div>
                                <button
                                    ref={firstMenuItemRef}
                                    type='button'
                                    role='menuitem'
                                    className='header_dropdown_item'
                                    onClick={handleFavoritesClick}
                                >
                                    <Heart size={17} aria-hidden='true' />
                                    <span>{t('header.favorites')}</span>
                                    <span className='header_dropdown_count'>{favoriteIds.length}</span>
                                </button>
                                <button
                                    type='button'
                                    role='menuitem'
                                    className='header_dropdown_item header_dropdown_item--secondary'
                                    onClick={handleChangeUser}
                                >
                                    <RefreshCcw size={17} aria-hidden='true' />
                                    <span>{t('header.changeUser')}</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

Header.propTypes = {
    activeTab: PropTypes.string.isRequired,
    onChangeUser: PropTypes.func.isRequired,
    onShowFavorites: PropTypes.func.isRequired,
    onTabChange: PropTypes.func.isRequired,
    profile: PropTypes.shape({
        name: PropTypes.string.isRequired,
        version: PropTypes.oneOf(['rick', 'morty']).isRequired,
    }).isRequired,
};

export default Header;
