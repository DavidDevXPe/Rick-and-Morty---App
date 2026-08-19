import { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import CharacterCard from '../components/CharacterCard';
import EpisodeSpotlight from '../components/EpisodeSpotlight';
import SearchFilters from '../components/SearchFilters';
import { API_BASE_URL, MAX_EPISODE_ID, MIN_EPISODE_ID } from '../config';
import useFavorites from '../hooks/useFavorites';
import useFetch from '../hooks/useFetch';
import usePaginatedList from '../hooks/usePaginatedList';
import './styles/charactersPage.css';

const EMPTY_FILTERS = { gender: '', name: '', species: '', status: '' };

const CharactersPage = ({ favoritesRequestId, focusEpisodeId = null }) => {
    const [mode, setMode] = useState('browse');
    const [currentEpisodeId, setCurrentEpisodeId] = useState(MIN_EPISODE_ID);
    const [filters, setFilters] = useState(EMPTY_FILTERS);
    const [committedFilters, setCommittedFilters] = useState(EMPTY_FILTERS);
    const { favoriteIds, isFavorite, toggleFavorite } = useFavorites();

    // Adjust state in response to the parent-driven navigation props (rather
    // than in an effect) — see https://react.dev/learn/you-might-not-need-an-effect
    const [trackedFocusEpisodeId, setTrackedFocusEpisodeId] = useState(focusEpisodeId);
    if (focusEpisodeId !== trackedFocusEpisodeId) {
        setTrackedFocusEpisodeId(focusEpisodeId);
        if (focusEpisodeId) {
            setMode('browse');
            setCurrentEpisodeId(focusEpisodeId);
        }
    }

    const [trackedFavoritesRequestId, setTrackedFavoritesRequestId] = useState(favoritesRequestId);
    if (favoritesRequestId !== trackedFavoritesRequestId) {
        setTrackedFavoritesRequestId(favoritesRequestId);
        if (favoritesRequestId > 0) {
            setMode('favorites');
        }
    }

    const { data: episode } = useFetch(
        mode === 'browse' ? `${API_BASE_URL}/episode/${currentEpisodeId}` : null,
    );

    const buildSearchUrl = (page) => {
        const params = new URLSearchParams({ page: String(page) });
        Object.entries(committedFilters).forEach(([key, value]) => {
            if (value) {
                params.set(key, value);
            }
        });
        return `${API_BASE_URL}/character?${params.toString()}`;
    };

    const searchResetKey = JSON.stringify(committedFilters);
    const {
        error: searchError,
        hasMore: hasMoreResults,
        isLoading: isSearchLoading,
        items: searchResults,
        loadMore: loadMoreResults,
        refetch: refetchSearch,
    } = usePaginatedList(buildSearchUrl, searchResetKey);

    const favoritesUrl = mode === 'favorites' && favoriteIds.length > 0
        ? `${API_BASE_URL}/character/${favoriteIds.join(',')}`
        : null;
    const {
        data: favoritesData,
        error: favoritesError,
        isLoading: isFavoritesLoading,
        refetch: refetchFavorites,
    } = useFetch(favoritesUrl);
    const favoriteCharacters = useMemo(
        () => (Array.isArray(favoritesData) ? favoritesData : favoritesData ? [favoritesData] : []),
        [favoritesData],
    );

    const hasActiveFilters = mode !== 'browse'
        || Boolean(filters.name || filters.status || filters.species || filters.gender);

    const handleFilterChange = (field, value) => {
        setFilters((current) => ({ ...current, [field]: value }));
    };

    const handleSearchSubmit = () => {
        setMode('search');
        setCommittedFilters(filters);
    };

    const handleClearFilters = () => {
        setFilters(EMPTY_FILTERS);
        setCommittedFilters(EMPTY_FILTERS);
        setMode('browse');
    };

    return (
        <div className='characters_page'>
            <SearchFilters
                filters={filters}
                hasActiveFilters={hasActiveFilters}
                onChange={handleFilterChange}
                onClear={handleClearFilters}
                onSubmit={handleSearchSubmit}
            />

            {mode === 'browse' && (
                <EpisodeSpotlight
                    key={currentEpisodeId}
                    canGoNext={currentEpisodeId < MAX_EPISODE_ID}
                    canGoPrev={currentEpisodeId > MIN_EPISODE_ID}
                    episode={episode}
                    favoriteIds={favoriteIds}
                    onNext={() => setCurrentEpisodeId((id) => Math.min(MAX_EPISODE_ID, id + 1))}
                    onPrev={() => setCurrentEpisodeId((id) => Math.max(MIN_EPISODE_ID, id - 1))}
                    onToggleFavorite={toggleFavorite}
                />
            )}

            {mode === 'search' && (
                <section aria-labelledby='search-results-title'>
                    <h2 id='search-results-title' className='section_title'>Resultados de búsqueda</h2>

                    {searchResults.length === 0 && isSearchLoading && (
                        <p className='status_message' role='status'>Buscando personajes…</p>
                    )}

                    {searchError && searchResults.length === 0 && (
                        <div className='error_panel' role='alert'>
                            <p>No se encontraron personajes con esos criterios.</p>
                            <button type='button' className='btn' onClick={refetchSearch}>Reintentar</button>
                        </div>
                    )}

                    {searchResults.length > 0 && (
                        <>
                            <div className='page_container'>
                                {searchResults.map((character) => (
                                    <CharacterCard
                                        key={character.id}
                                        character={character}
                                        isFavorite={isFavorite(character.id)}
                                        onToggleFavorite={toggleFavorite}
                                    />
                                ))}
                            </div>
                            {hasMoreResults && (
                                <div className='characters_load_more'>
                                    <button
                                        type='button'
                                        className='btn btn--ghost'
                                        onClick={loadMoreResults}
                                        disabled={isSearchLoading}
                                    >
                                        {isSearchLoading ? 'Cargando…' : 'Cargar más personajes ↓'}
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </section>
            )}

            {mode === 'favorites' && (
                <section aria-labelledby='favorites-title'>
                    <h2 id='favorites-title' className='section_title'>Tus favoritos</h2>

                    {favoriteIds.length === 0 && (
                        <p className='status_message'>Todavía no tienes personajes favoritos.</p>
                    )}

                    {favoriteIds.length > 0 && isFavoritesLoading && (
                        <p className='status_message' role='status'>Cargando favoritos…</p>
                    )}

                    {favoritesError && (
                        <div className='error_panel' role='alert'>
                            <p>No se pudieron cargar tus favoritos.</p>
                            <button type='button' className='btn' onClick={refetchFavorites}>Reintentar</button>
                        </div>
                    )}

                    {favoriteCharacters.length > 0 && (
                        <div className='page_container'>
                            {favoriteCharacters.map((character) => (
                                <CharacterCard
                                    key={character.id}
                                    character={character}
                                    isFavorite
                                    onToggleFavorite={toggleFavorite}
                                />
                            ))}
                        </div>
                    )}
                </section>
            )}
        </div>
    );
};

CharactersPage.propTypes = {
    favoritesRequestId: PropTypes.number.isRequired,
    focusEpisodeId: PropTypes.number,
};

export default CharactersPage;
