import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import {
    ChevronDown,
    CirclePlay,
    Heart,
    MapPin,
    Moon,
    Sun,
    UsersRound,
} from 'lucide-react';
import rickAndMortyLogo from '../assets/rick-morty/branding/rick-and-morty-header-logo.png';
import rickAvatar from '../assets/rick-morty/branding/rick-avatar.png';
import { API_BASE_URL, THEME_STORAGE_KEY } from '../config';
import useFavorites from '../hooks/useFavorites';
import useFetch from '../hooks/useFetch';
import useLocalStorage from '../hooks/useLocalStorage';
import './styles/header.css';

const TABS = [
    { icon: UsersRound, id: 'characters', label: 'Personajes' },
    { icon: CirclePlay, id: 'episodes', label: 'Episodios' },
    { icon: MapPin, id: 'locations', label: 'Ubicaciones' },
];

const numberFormatter = new Intl.NumberFormat('es-ES');

const Header = ({ activeTab, onTabChange, onShowFavorites }) => {
    const [theme, setTheme] = useLocalStorage(THEME_STORAGE_KEY, 'dark');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef(null);
    const menuButtonRef = useRef(null);
    const firstMenuItemRef = useRef(null);
    const { favoriteIds } = useFavorites();
    const { data } = useFetch(`${API_BASE_URL}/character`);

    useEffect(() => {
        document.documentElement.dataset.theme = theme;
    }, [theme]);

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

    return (
        <header className='header'>
            <div className='header_inner'>
                <button
                    type='button'
                    className='header_brand'
                    onClick={() => handleTabChange('characters')}
                    aria-label='Ir a Personajes — Rick and Morty'
                >
                    <img
                        className='header_brand_logo'
                        src={rickAndMortyLogo}
                        alt=''
                        width='366'
                        height='100'
                    />
                </button>

                <nav className='header_nav' aria-label='Secciones principales'>
                    {TABS.map(({ icon: Icon, id, label }) => (
                        <button
                            key={id}
                            type='button'
                            className={`header_tab${activeTab === id ? ' header_tab--active' : ''}`}
                            aria-current={activeTab === id ? 'page' : undefined}
                            onClick={() => handleTabChange(id)}
                        >
                            <Icon size={21} strokeWidth={1.8} aria-hidden='true' />
                            <span>{label}</span>
                        </button>
                    ))}
                </nav>

                <div className='header_actions'>
                    <span className='header_count' title='Total de personajes en la API'>
                        <UsersRound size={24} strokeWidth={1.8} aria-hidden='true' />
                        <span>
                            <strong>{data ? numberFormatter.format(data.info.count) : '—'}</strong>
                            <small>Personajes</small>
                        </span>
                    </span>

                    <button
                        type='button'
                        className='theme_toggle'
                        onClick={toggleTheme}
                        aria-pressed={theme === 'light'}
                        aria-label={theme === 'dark' ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'}
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
                            aria-label='Menú de perfil'
                        >
                            <span className='header_avatar'>
                                <img
                                    src={rickAvatar}
                                    alt=''
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
                                <p className='header_dropdown_title'>Mi multiverso</p>
                                <button
                                    ref={firstMenuItemRef}
                                    type='button'
                                    role='menuitem'
                                    className='header_dropdown_item'
                                    onClick={handleFavoritesClick}
                                >
                                    <Heart size={17} aria-hidden='true' />
                                    <span>Favoritos</span>
                                    <span className='header_dropdown_count'>{favoriteIds.length}</span>
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
    onShowFavorites: PropTypes.func.isRequired,
    onTabChange: PropTypes.func.isRequired,
};

export default Header;
