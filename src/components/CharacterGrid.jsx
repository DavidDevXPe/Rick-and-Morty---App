import { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { AlertTriangle, ChevronDown, RefreshCw } from 'lucide-react';
import CharacterCard from './CharacterCard';
import CharacterCardSkeleton from './CharacterCardSkeleton';
import CollectionState from './CollectionState';
import LoadMoreButton from './LoadMoreButton';

const SORTERS = {
    az: (first, second) => first.name.localeCompare(second.name, 'es'),
    episodes: (first, second) => (second.episode?.length ?? 0) - (first.episode?.length ?? 0),
    za: (first, second) => second.name.localeCompare(first.name, 'es'),
};

const CharacterGrid = ({
    characters,
    emptyActionLabel = 'Limpiar filtros',
    emptyMessage = 'No encontramos personajes con estos filtros.',
    error = null,
    hasMore = false,
    isLoading = false,
    isFavorite,
    loadMoreLabel = 'Cargar más personajes',
    onClear,
    onLoadMore,
    onRetry,
    onToggleFavorite,
    title,
}) => {
    const [sortOrder, setSortOrder] = useState('az');
    const sortedCharacters = useMemo(
        () => [...characters].sort(SORTERS[sortOrder]),
        [characters, sortOrder],
    );
    const isInitialLoading = isLoading && characters.length === 0;

    return (
        <section className='character_collection' aria-labelledby={`${title.replace(/\s+/g, '-').toLowerCase()}-title`}>
            <div className='characters_header'>
                <div>
                    <h2
                        id={`${title.replace(/\s+/g, '-').toLowerCase()}-title`}
                        className='section_title section_title--accent'
                    >
                        {title}
                    </h2>
                </div>

                <label className='sort_control'>
                    <span>Ordenar por</span>
                    <span className='select_control'>
                        <select value={sortOrder} onChange={(event) => setSortOrder(event.target.value)}>
                            <option value='az'>A - Z</option>
                            <option value='za'>Z - A</option>
                            <option value='episodes'>Más episodios</option>
                        </select>
                        <ChevronDown size={16} aria-hidden='true' />
                    </span>
                </label>
            </div>

            {isInitialLoading && (
                <>
                    <span className='sr_only' role='status'>Cargando personajes…</span>
                    <div className='character_grid' aria-hidden='true'>
                        {Array.from({ length: 5 }, (_, index) => <CharacterCardSkeleton key={index} />)}
                    </div>
                </>
            )}

            {!isInitialLoading && error && characters.length === 0 && (
                <CollectionState
                    kind='error'
                    title='No pudimos cargar los personajes'
                    message='La API no respondió como esperábamos. Intenta nuevamente.'
                    onAction={onRetry}
                />
            )}

            {!isInitialLoading && !error && characters.length === 0 && (
                <CollectionState
                    kind='empty'
                    title='Sin resultados en este universo'
                    message={emptyMessage}
                    actionLabel={emptyActionLabel}
                    onAction={onClear}
                />
            )}

            {sortedCharacters.length > 0 && (
                <div className='character_grid'>
                    {sortedCharacters.map((character) => (
                        <CharacterCard
                            key={character.id}
                            character={character}
                            isFavorite={isFavorite(character.id)}
                            onToggleFavorite={onToggleFavorite}
                        />
                    ))}
                </div>
            )}

            {error && characters.length > 0 && (
                <div className='collection_inline_error' role='alert'>
                    <AlertTriangle size={18} aria-hidden='true' />
                    <span>No pudimos cargar más personajes.</span>
                    {onRetry && (
                        <button type='button' onClick={onRetry}>
                            <RefreshCw size={15} aria-hidden='true' />
                            Reintentar
                        </button>
                    )}
                </div>
            )}

            {hasMore && onLoadMore && (
                <LoadMoreButton
                    isLoading={isLoading}
                    label={loadMoreLabel}
                    onClick={onLoadMore}
                />
            )}
        </section>
    );
};

CharacterGrid.propTypes = {
    characters: PropTypes.arrayOf(PropTypes.shape({
        episode: PropTypes.arrayOf(PropTypes.string),
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
    })).isRequired,
    emptyActionLabel: PropTypes.string,
    emptyMessage: PropTypes.string,
    error: PropTypes.instanceOf(Error),
    hasMore: PropTypes.bool,
    isFavorite: PropTypes.func.isRequired,
    isLoading: PropTypes.bool,
    loadMoreLabel: PropTypes.string,
    onClear: PropTypes.func,
    onLoadMore: PropTypes.func,
    onRetry: PropTypes.func,
    onToggleFavorite: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
};

export default CharacterGrid;
