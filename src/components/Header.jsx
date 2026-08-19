import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import portalLogo from '../assets/portal-logo.svg';
import rickAndMortyLogo from '../assets/rick-and-morty-logo.png';
import { API_BASE_URL, THEME_STORAGE_KEY } from '../config';
import useFavorites from '../hooks/useFavorites';
import useFetch from '../hooks/useFetch';
import useLocalStorage from '../hooks/useLocalStorage';
import './styles/header.css';

const TABS = [
    { id: 'characters', label: 'Personajes' },
    { id: 'episodes', label: 'Episodios' },
    { id: 'locations', label: 'Ubicaciones' },
];

const numberFormatter = new Intl.NumberFormat('es-ES');

const Header = ({ activeTab, onTabChange, onShowFavorites }) => {
    const [theme, setTheme] = useLocalStorage(THEME_STORAGE_KEY, 'dark');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef(null);
    const { favoriteIds } = useFavorites();
    const { data } = useFetch(`${API_BASE_URL}/character`);

    useEffect(() => {
        document.documentElement.dataset.theme = theme;
    }, [theme]);

    useEffect(() => {
        if (!isMenuOpen) {
            return undefined;
        }

        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isMenuOpen]);

    const toggleTheme = () => {
        setTheme((currentTheme) => (currentTheme === 'dark' ? 'light' : 'dark'));
    };

    const handleFavoritesClick = () => {
        setIsMenuOpen(false);
        onShowFavorites();
    };

    return (
        <header className='header'>
            <div className='header_inner'>
                <div className='header_brand'>
                    <img
                        className='header_brand_logo'
                        src={rickAndMortyLogo}
                        alt='Rick and Morty'
                        width='361'
                        height='101'
                    />
                </div>

                <nav className='header_nav' aria-label='Secciones'>
                    {TABS.map((tab) => (
                        <button
                            key={tab.id}
                            type='button'
                            className={`header_tab${activeTab === tab.id ? ' header_tab--active' : ''}`}
                            aria-current={activeTab === tab.id ? 'page' : undefined}
                            onClick={() => onTabChange(tab.id)}
                        >
                            {tab.label}
                        </button>
                    ))}
                </nav>

                <div className='header_actions'>
                    <span className='header_badge' title='Total de personajes en la API'>
                        <span className='header_badge_count'>
                            {data ? numberFormatter.format(data.info.count) : '—'}
                        </span>
                        <span className='header_badge_label'>Personajes</span>
                    </span>

                    <button
                        type='button'
                        className='header_icon_btn'
                        onClick={toggleTheme}
                        aria-label={theme === 'dark' ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'}
                    >
                        {theme === 'dark' ? '☀️' : '🌙'}
                    </button>

                    <div className='header_menu' ref={menuRef}>
                        <button
                            type='button'
                            className='header_avatar'
                            onClick={() => setIsMenuOpen((open) => !open)}
                            aria-haspopup='menu'
                            aria-expanded={isMenuOpen}
                            aria-label='Menú de perfil'
                        >
                            <img className='header_logo' src={portalLogo} alt='' width='28' height='28' />
                        </button>

                        {isMenuOpen && (
                            <div className='header_dropdown' role='menu'>
                                <button
                                    type='button'
                                    role='menuitem'
                                    className='header_dropdown_item'
                                    onClick={handleFavoritesClick}
                                >
                                    Favoritos
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
