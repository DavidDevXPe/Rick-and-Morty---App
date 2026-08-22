import { useState } from 'react';
import PropTypes from 'prop-types';
import {
    ArrowLeft,
    ArrowRight,
    CalendarDays,
    Sparkles,
    UsersRound,
} from 'lucide-react';
import { API_BASE_URL } from '../config';
import useFetch from '../hooks/useFetch';
import { useLanguage } from '../i18n/useLanguage';
import { formatAirDate } from '../utils/formatters';
import CharacterCardSkeleton from './CharacterCardSkeleton';
import CharacterGrid from './CharacterGrid';
import CollectionState from './CollectionState';
import './styles/episodeHighlight.css';

const CHARACTERS_STEP = 5;
const getCharacterId = (characterUrl) => characterUrl.split('/').filter(Boolean).at(-1);

const EpisodeHighlightSkeleton = () => {
    const { t } = useLanguage();

    return (
        <section className='episode_highlight' aria-busy='true' aria-label={t('episode.loadingLabel')}>
        <span className='sr_only' role='status'>{t('episode.loadingStatus')}</span>
        <div className='episode_highlight_hero episode_highlight_hero--skeleton' aria-hidden='true'>
            <div className='skeleton episode_highlight_skeleton_media' />
            <div className='episode_highlight_skeleton_content'>
                <div className='skeleton episode_highlight_skeleton_badge' />
                <div className='skeleton episode_highlight_skeleton_title' />
                <div className='skeleton episode_highlight_skeleton_meta' />
                <div className='skeleton episode_highlight_skeleton_actions' />
            </div>
        </div>
        <div className='characters_header' aria-hidden='true'>
            <div className='skeleton episode_highlight_skeleton_heading' />
        </div>
        <div className='character_grid' aria-hidden='true'>
            {Array.from({ length: 5 }, (_, index) => <CharacterCardSkeleton key={index} />)}
        </div>
        </section>
    );
};

const EpisodeHighlight = ({
    canGoNext,
    canGoPrev,
    episode = null,
    episodeError = null,
    favoriteIds,
    isEpisodeLoading = false,
    onNext,
    onPrev,
    onRetryEpisode,
    onToggleFavorite,
}) => {
    const { language, t } = useLanguage();
    const [visibleCount, setVisibleCount] = useState(CHARACTERS_STEP);
    const characterUrls = episode?.characters ?? [];
    const visibleIds = characterUrls.slice(0, visibleCount).map(getCharacterId).filter(Boolean);
    const charactersUrl = visibleIds.length > 0
        ? `${API_BASE_URL}/character/${visibleIds.join(',')}`
        : null;
    const {
        data,
        error: charactersError,
        isLoading: areCharactersLoading,
        refetch: refetchCharacters,
    } = useFetch(charactersUrl);
    const characters = Array.isArray(data) ? data : data ? [data] : [];
    const featuredCharacter = characters[0] ?? null;

    if (isEpisodeLoading) {
        return <EpisodeHighlightSkeleton />;
    }

    if (episodeError || !episode) {
        return (
            <section className='episode_highlight episode_highlight--error'>
                <CollectionState
                    kind='error'
                    title={t('episode.errorTitle')}
                    message={t('episode.errorMessage')}
                    onAction={onRetryEpisode}
                />
            </section>
        );
    }

    return (
        <section className='episode_highlight' aria-labelledby='episode-highlight-title'>
            <div className='episode_highlight_hero'>
                <div className='episode_highlight_art' aria-hidden='true' />
                <div className='episode_highlight_media'>
                    {featuredCharacter ? (
                        <img
                            src={featuredCharacter.image}
                            alt={t('episode.imageAlt', {
                                character: featuredCharacter.name,
                                episode: episode.name,
                            })}
                            width='300'
                            height='300'
                        />
                    ) : (
                        <div className='episode_highlight_media_placeholder' aria-hidden='true'>
                            <Sparkles size={36} />
                        </div>
                    )}
                </div>

                <div className='episode_highlight_content'>
                    <span className='episode_highlight_badge'>
                        <Sparkles size={14} aria-hidden='true' />
                        {t('episode.current')}
                    </span>
                    <h1 id='episode-highlight-title' className='episode_highlight_name'>{episode.name}</h1>
                    <div className='episode_highlight_meta'>
                        <span className='episode_highlight_code'>{episode.episode}</span>
                        <span>
                            <CalendarDays size={17} aria-hidden='true' />
                            {t('episode.airDate')}: {formatAirDate(episode.air_date, language) || t('common.unknownDate')}
                        </span>
                        <span>
                            <UsersRound size={18} aria-hidden='true' />
                            {t('episode.characterCount', { count: characterUrls.length })}
                        </span>
                    </div>
                    <div className='episode_highlight_controls'>
                        <button type='button' className='btn btn--ghost' onClick={onPrev} disabled={!canGoPrev}>
                            <ArrowLeft size={19} aria-hidden='true' />
                            {t('common.previous')}
                        </button>
                        <button type='button' className='btn' onClick={onNext} disabled={!canGoNext}>
                            {t('common.next')}
                            <ArrowRight size={19} aria-hidden='true' />
                        </button>
                    </div>
                </div>
            </div>

            <CharacterGrid
                characters={characters}
                emptyMessage={t('episode.emptyCharacters')}
                error={charactersError}
                hasMore={!charactersError && visibleCount < characterUrls.length}
                isFavorite={(id) => favoriteIds.includes(id)}
                isLoading={areCharactersLoading}
                onLoadMore={() => setVisibleCount((count) => count + CHARACTERS_STEP)}
                onRetry={refetchCharacters}
                onToggleFavorite={onToggleFavorite}
                title={t('episode.charactersTitle')}
            />
        </section>
    );
};

EpisodeHighlight.propTypes = {
    canGoNext: PropTypes.bool.isRequired,
    canGoPrev: PropTypes.bool.isRequired,
    episode: PropTypes.shape({
        air_date: PropTypes.string,
        characters: PropTypes.arrayOf(PropTypes.string),
        episode: PropTypes.string,
        id: PropTypes.number,
        name: PropTypes.string,
    }),
    episodeError: PropTypes.instanceOf(Error),
    favoriteIds: PropTypes.arrayOf(PropTypes.number).isRequired,
    isEpisodeLoading: PropTypes.bool,
    onNext: PropTypes.func.isRequired,
    onPrev: PropTypes.func.isRequired,
    onRetryEpisode: PropTypes.func.isRequired,
    onToggleFavorite: PropTypes.func.isRequired,
};

export default EpisodeHighlight;
