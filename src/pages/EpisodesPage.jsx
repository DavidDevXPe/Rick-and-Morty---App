import { useState } from 'react';
import PropTypes from 'prop-types';
import {
    ArrowDown,
    Film,
    LoaderCircle,
    RadioTower,
    RefreshCw,
    Search,
    Sparkles,
    X,
} from 'lucide-react';
import EpisodeCard from '../components/EpisodeCard';
import { API_BASE_URL } from '../config';
import usePaginatedList from '../hooks/usePaginatedList';
import { useLanguage } from '../i18n/useLanguage';
import { isEpisodeListResponse } from '../utils/apiValidation';
import './styles/episodesPage.css';

const SKELETON_COUNT = 8;

const EpisodeCardSkeleton = () => (
    <article className='episode_card episode_card--skeleton' aria-hidden='true'>
        <div className='episodes_skeleton_header'>
            <span className='skeleton episodes_skeleton_chip' />
            <span className='skeleton episodes_skeleton_number' />
        </div>
        <span className='skeleton episodes_skeleton_orbit' />
        <span className='skeleton episodes_skeleton_title' />
        <span className='skeleton episodes_skeleton_meta' />
        <span className='skeleton episodes_skeleton_meta episodes_skeleton_meta--short' />
        <span className='skeleton episodes_skeleton_button' />
    </article>
);

const EpisodesPage = ({ onSelectEpisode }) => {
    const { t } = useLanguage();
    const [searchValue, setSearchValue] = useState('');
    const [submittedName, setSubmittedName] = useState('');

    const buildUrl = (page) => {
        const params = new URLSearchParams({ page: String(page) });
        if (submittedName) {
            params.set('name', submittedName);
        }
        return `${API_BASE_URL}/episode?${params.toString()}`;
    };

    const { error, hasMore, isLoading, items, loadMore, refetch } = usePaginatedList(
        buildUrl,
        submittedName,
        isEpisodeListResponse,
    );

    const handleSubmit = (event) => {
        event.preventDefault();
        setSubmittedName(searchValue.trim());
    };

    const handleClearSearch = () => {
        setSearchValue('');
        setSubmittedName('');
    };

    const isInitialLoading = items.length === 0 && isLoading;
    const isNoResults = error?.status === 404 && items.length === 0;
    const hasInitialError = Boolean(error) && !isNoResults && items.length === 0;
    const isEmpty = isNoResults || (!error && !isLoading && items.length === 0);

    return (
        <div className='episodes_page' aria-busy={isLoading}>
            <header className='episodes_intro'>
                <div className='episodes_intro_icon' aria-hidden='true'>
                    <Film size={24} strokeWidth={1.8} />
                </div>
                <p className='episodes_eyebrow'>{t('episodes.archiveEyebrow')}</p>
                <h1 className='section_title'>{t('episodes.title')}</h1>
                <p className='episodes_intro_copy'>
                    {t('episodes.intro')}
                </p>
            </header>

            <form className='episodes_search' onSubmit={handleSubmit} role='search'>
                <label htmlFor='episode-search' className='sr_only'>{t('episodes.searchLabel')}</label>
                <Search className='episodes_search_icon' size={21} aria-hidden='true' />
                <input
                    id='episode-search'
                    type='search'
                    placeholder={t('episodes.searchPlaceholder')}
                    value={searchValue}
                    onChange={(event) => setSearchValue(event.target.value)}
                    autoComplete='off'
                />
                {searchValue && (
                    <button
                        type='button'
                        className='episodes_search_clear'
                        onClick={handleClearSearch}
                        aria-label={t('episodes.clearSearchAria')}
                    >
                        <X size={18} aria-hidden='true' />
                    </button>
                )}
                <button className='btn episodes_search_submit' type='submit'>
                    <Search size={18} aria-hidden='true' />
                    <span>{t('common.search')}</span>
                </button>
            </form>

            <div className='episodes_section_heading'>
                <div>
                    <p className='episodes_section_kicker'>Rick and Morty API</p>
                    <h2 className='section_title section_title--accent'>
                        {submittedName
                            ? t('episodes.resultsFor', { query: submittedName })
                            : t('episodes.all')}
                    </h2>
                </div>
                {!isInitialLoading && items.length > 0 && (
                    <span className='episodes_result_count' aria-live='polite'>
                        <Sparkles size={15} aria-hidden='true' />
                        {t('episodes.loadedCount', { count: items.length })}
                    </span>
                )}
            </div>

            {isInitialLoading && (
                <div
                    className='episodes_grid'
                    role='status'
                    aria-label={t('episodes.loadingLabel')}
                    aria-live='polite'
                >
                    <span className='sr_only'>{t('episodes.loadingStatus')}</span>
                    {Array.from({ length: SKELETON_COUNT }, (_, index) => (
                        <EpisodeCardSkeleton key={index} />
                    ))}
                </div>
            )}

            {hasInitialError && (
                <div className='collection_state collection_state--error episodes_state' role='alert'>
                    <span className='collection_state_icon' aria-hidden='true'>
                        <RadioTower size={26} />
                    </span>
                    <div>
                        <h3>{t('episodes.errorTitle')}</h3>
                        <p>{t('episodes.errorMessage')}</p>
                    </div>
                    <button type='button' className='btn' onClick={refetch}>
                        <RefreshCw size={17} aria-hidden='true' />
                        {t('common.retry')}
                    </button>
                </div>
            )}

            {isEmpty && (
                <div className='collection_state episodes_state'>
                    <span className='collection_state_icon' aria-hidden='true'>
                        <Film size={26} />
                    </span>
                    <div>
                        <h3>{t('episodes.emptyTitle')}</h3>
                        <p>{t('episodes.emptyMessage')}</p>
                    </div>
                    {submittedName && (
                        <button type='button' className='btn btn--ghost' onClick={handleClearSearch}>
                            <X size={17} aria-hidden='true' />
                            {t('episodes.clearSearch')}
                        </button>
                    )}
                </div>
            )}

            {items.length > 0 && (
                <>
                    <div className='episodes_grid'>
                        {items.map((episode) => (
                            <EpisodeCard key={episode.id} episode={episode} onSelect={onSelectEpisode} />
                        ))}
                    </div>

                    {error && (
                        <div className='episodes_inline_error' role='alert'>
                            <RadioTower size={18} aria-hidden='true' />
                            <span>{t('episodes.loadMoreError')}</span>
                            <button type='button' onClick={refetch}>{t('common.retry')}</button>
                        </div>
                    )}

                    {(hasMore || isLoading) && !error && (
                        <div className='episodes_load_more'>
                            <button
                                type='button'
                                className='load_more_button'
                                onClick={loadMore}
                                disabled={isLoading}
                            >
                                <span>{isLoading ? t('common.loading') : t('episodes.loadMore')}</span>
                                {isLoading
                                    ? <LoaderCircle className='spin' size={20} aria-hidden='true' />
                                    : <ArrowDown size={20} aria-hidden='true' />}
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

EpisodesPage.propTypes = {
    onSelectEpisode: PropTypes.func.isRequired,
};

export default EpisodesPage;
