import { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import CharacterGrid from '../components/CharacterGrid';
import EpisodeHighlight from '../components/EpisodeHighlight';
import SearchFilters from '../components/SearchFilters';
import { API_BASE_URL, MAX_EPISODE_ID, MIN_EPISODE_ID } from '../config';
import useFavorites from '../hooks/useFavorites';
import useFetch from '../hooks/useFetch';
import usePaginatedList from '../hooks/usePaginatedList';
import { useLanguage } from '../i18n/useLanguage';
import {
    isCharacterBatchResponse,
    isCharacterListResponse,
    isEpisode,
} from '../utils/apiValidation';
import './styles/charactersPage.css';

const EMPTY_FILTERS = { gender: '', name: '', species: '', status: '' };

const CharactersPage = ({ favoritesRequestId, focusEpisodeId = null }) => {
    const { t } = useLanguage();
    const [mode, setMode] = useState(() => (
        favoritesRequestId > 0 ? 'favorites' : 'browse'
    ));
    const [currentEpisodeId, setCurrentEpisodeId] = useState(
        () => focusEpisodeId ?? MIN_EPISODE_ID,
    );
    const [filters, setFilters] = useState(EMPTY_FILTERS);
    const [committedFilters, setCommittedFilters] = useState(EMPTY_FILTERS);
    const { favoriteIds, isFavorite, toggleFavorite } = useFavorites();

    const {
        data: episode,
        error: episodeError,
        isLoading: isEpisodeLoading,
        refetch: refetchEpisode,
    } = useFetch(
        mode === 'browse' ? `${API_BASE_URL}/episode/${currentEpisodeId}` : null,
        { validate: isEpisode },
    );

    const buildSearchUrl = (page) => {
        if (mode !== 'search') {
            return null;
        }

        const params = new URLSearchParams({ page: String(page) });
        Object.entries(committedFilters).forEach(([key, value]) => {
            if (value) {
                params.set(key, value);
            }
        });
        return `${API_BASE_URL}/character?${params.toString()}`;
    };

    const searchResetKey = mode === 'search'
        ? JSON.stringify(committedFilters)
        : 'inactive';
    const {
        error: searchError,
        hasMore: hasMoreResults,
        isLoading: isSearchLoading,
        items: searchResults,
        loadMore: loadMoreResults,
        refetch: refetchSearch,
    } = usePaginatedList(buildSearchUrl, searchResetKey, isCharacterListResponse);

    const favoritesUrl = mode === 'favorites' && favoriteIds.length > 0
        ? `${API_BASE_URL}/character/${favoriteIds.join(',')}`
        : null;
    const {
        data: favoritesData,
        error: favoritesError,
        isLoading: isFavoritesLoading,
        refetch: refetchFavorites,
    } = useFetch(favoritesUrl, { validate: isCharacterBatchResponse });
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
        const normalizedFilters = {
            ...filters,
            name: filters.name.trim(),
        };

        setMode('search');
        setFilters(normalizedFilters);
        setCommittedFilters(normalizedFilters);
    };

    const handleClearFilters = () => {
        setFilters(EMPTY_FILTERS);
        setCommittedFilters(EMPTY_FILTERS);
        setMode('browse');
    };

    const isEmptySearch = searchError?.status === 404;

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
                <EpisodeHighlight
                    key={currentEpisodeId}
                    canGoNext={currentEpisodeId < MAX_EPISODE_ID}
                    canGoPrev={currentEpisodeId > MIN_EPISODE_ID}
                    episode={episode}
                    episodeError={episodeError}
                    favoriteIds={favoriteIds}
                    isEpisodeLoading={isEpisodeLoading}
                    onNext={() => setCurrentEpisodeId((id) => Math.min(MAX_EPISODE_ID, id + 1))}
                    onPrev={() => setCurrentEpisodeId((id) => Math.max(MIN_EPISODE_ID, id - 1))}
                    onRetryEpisode={refetchEpisode}
                    onToggleFavorite={toggleFavorite}
                />
            )}

            {mode === 'search' && (
                <CharacterGrid
                    characters={searchResults}
                    emptyMessage={t('characters.emptyMessage')}
                    error={isEmptySearch ? null : searchError}
                    hasMore={!searchError && hasMoreResults}
                    isFavorite={isFavorite}
                    isLoading={isSearchLoading}
                    headingLevel={1}
                    onClear={handleClearFilters}
                    onLoadMore={loadMoreResults}
                    onRetry={refetchSearch}
                    onToggleFavorite={toggleFavorite}
                    title={t('characters.searchResults')}
                />
            )}

            {mode === 'favorites' && (
                <CharacterGrid
                    characters={favoriteCharacters}
                    emptyActionLabel={t('characters.backToEpisodes')}
                    emptyMessage={t('characters.noFavorites')}
                    error={favoritesError}
                    isFavorite={isFavorite}
                    isLoading={isFavoritesLoading}
                    headingLevel={1}
                    onClear={handleClearFilters}
                    onRetry={refetchFavorites}
                    onToggleFavorite={toggleFavorite}
                    title={t('characters.favoritesTitle')}
                />
            )}
        </div>
    );
};

CharactersPage.propTypes = {
    favoritesRequestId: PropTypes.number.isRequired,
    focusEpisodeId: PropTypes.number,
};

export default CharactersPage;
