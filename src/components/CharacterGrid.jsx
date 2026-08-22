import { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { AlertTriangle, ChevronDown, RefreshCw } from 'lucide-react';
import { useLanguage } from '../i18n/useLanguage';
import CharacterCard from './CharacterCard';
import CharacterCardSkeleton from './CharacterCardSkeleton';
import CollectionState from './CollectionState';
import LoadMoreButton from './LoadMoreButton';

const sortCharacters = (first, second, sortOrder, locale) => {
    if (sortOrder === 'episodes') {
        return (second.episode?.length ?? 0) - (first.episode?.length ?? 0);
    }

    const comparison = first.name.localeCompare(second.name, locale);
    return sortOrder === 'za' ? -comparison : comparison;
};

const CharacterGrid = ({
    characters,
    emptyActionLabel = null,
    emptyMessage = null,
    error = null,
    hasMore = false,
    isLoading = false,
    isFavorite,
    loadMoreLabel = null,
    onClear,
    onLoadMore,
    onRetry,
    onToggleFavorite,
    title,
}) => {
    const { locale, t } = useLanguage();
    const [sortOrder, setSortOrder] = useState('az');
    const sortedCharacters = useMemo(
        () => [...characters].sort((first, second) => (
            sortCharacters(first, second, sortOrder, locale)
        )),
        [characters, locale, sortOrder],
    );
    const isInitialLoading = isLoading && characters.length === 0;
    const resolvedEmptyActionLabel = emptyActionLabel ?? t('characters.clearFilters');
    const resolvedEmptyMessage = emptyMessage ?? t('characters.emptyMessage');
    const resolvedLoadMoreLabel = loadMoreLabel ?? t('characters.loadMore');

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
                    <span>{t('characters.sortBy')}</span>
                    <span className='select_control'>
                        <select value={sortOrder} onChange={(event) => setSortOrder(event.target.value)}>
                            <option value='az'>A - Z</option>
                            <option value='za'>Z - A</option>
                            <option value='episodes'>{t('characters.moreEpisodes')}</option>
                        </select>
                        <ChevronDown size={16} aria-hidden='true' />
                    </span>
                </label>
            </div>

            {isInitialLoading && (
                <>
                    <span className='sr_only' role='status'>{t('characters.loading')}</span>
                    <div className='character_grid' aria-hidden='true'>
                        {Array.from({ length: 5 }, (_, index) => <CharacterCardSkeleton key={index} />)}
                    </div>
                </>
            )}

            {!isInitialLoading && error && characters.length === 0 && (
                <CollectionState
                    kind='error'
                    title={t('characters.errorTitle')}
                    message={t('characters.errorMessage')}
                    onAction={onRetry}
                />
            )}

            {!isInitialLoading && !error && characters.length === 0 && (
                <CollectionState
                    kind='empty'
                    title={t('characters.emptyTitle')}
                    message={resolvedEmptyMessage}
                    actionLabel={resolvedEmptyActionLabel}
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
                    <span>{t('characters.loadMoreError')}</span>
                    {onRetry && (
                        <button type='button' onClick={onRetry}>
                            <RefreshCw size={15} aria-hidden='true' />
                            {t('common.retry')}
                        </button>
                    )}
                </div>
            )}

            {hasMore && onLoadMore && (
                <LoadMoreButton
                    isLoading={isLoading}
                    label={resolvedLoadMoreLabel}
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
