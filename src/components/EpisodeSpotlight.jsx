import { useState } from 'react';
import PropTypes from 'prop-types';
import { API_BASE_URL } from '../config';
import useFetch from '../hooks/useFetch';
import CharacterCard from './CharacterCard';
import './styles/episodeSpotlight.css';

const CHARACTERS_STEP = 5;
const getCharacterId = (characterUrl) => characterUrl.split('/').filter(Boolean).at(-1);

// Rendered with `key={episode.id}` by its parent so a new episode remounts
// this component and naturally resets `visibleCount`.
const EpisodeSpotlight = ({
    canGoNext,
    canGoPrev,
    episode = null,
    favoriteIds,
    onNext,
    onPrev,
    onToggleFavorite,
}) => {
    const [visibleCount, setVisibleCount] = useState(CHARACTERS_STEP);

    const characterUrls = episode?.characters ?? [];
    const visibleIds = characterUrls.slice(0, visibleCount).map(getCharacterId).filter(Boolean);
    const charactersUrl = visibleIds.length > 0
        ? `${API_BASE_URL}/character/${visibleIds.join(',')}`
        : null;
    const { data, error, isLoading, refetch } = useFetch(charactersUrl);
    const characters = Array.isArray(data) ? data : data ? [data] : [];
    const hasMore = visibleCount < characterUrls.length;

    return (
        <section className='spotlight' aria-labelledby='spotlight-title'>
            <div className='spotlight_hero'>
                <span className='spotlight_badge'>Episodio actual</span>

                {episode && (
                    <>
                        <h2 id='spotlight-title' className='spotlight_name'>{episode.name}</h2>
                        <div className='spotlight_meta'>
                            <span className='spotlight_chip'>{episode.episode}</span>
                            <span className='spotlight_meta_item'>
                                📅 Air date: {episode.air_date}
                            </span>
                            <span className='spotlight_meta_item'>
                                👥 {characterUrls.length} personajes
                            </span>
                        </div>
                    </>
                )}

                <div className='spotlight_controls'>
                    <button type='button' className='btn btn--ghost' onClick={onPrev} disabled={!canGoPrev}>
                        ← Anterior
                    </button>
                    <button type='button' className='btn' onClick={onNext} disabled={!canGoNext}>
                        Siguiente →
                    </button>
                </div>
            </div>

            <div className='spotlight_characters'>
                <h3 className='section_title'>Personajes del episodio</h3>

                {characterUrls.length === 0 && (
                    <p className='status_message'>Este episodio no tiene personajes registrados.</p>
                )}

                {isLoading && (
                    <p className='status_message' role='status'>Cargando personajes…</p>
                )}

                {!isLoading && error && (
                    <div className='error_panel' role='alert'>
                        <p>No se pudieron cargar los personajes.</p>
                        <button type='button' className='btn' onClick={refetch}>Reintentar</button>
                    </div>
                )}

                {!isLoading && !error && characters.length > 0 && (
                    <>
                        <div className='page_container'>
                            {characters.map((character) => (
                                <CharacterCard
                                    key={character.id}
                                    character={character}
                                    isFavorite={favoriteIds.includes(character.id)}
                                    onToggleFavorite={onToggleFavorite}
                                />
                            ))}
                        </div>
                        {hasMore && (
                            <div className='spotlight_load_more'>
                                <button
                                    type='button'
                                    className='btn btn--ghost'
                                    onClick={() => setVisibleCount((count) => count + CHARACTERS_STEP)}
                                >
                                    Cargar más personajes ↓
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </section>
    );
};

EpisodeSpotlight.propTypes = {
    canGoNext: PropTypes.bool.isRequired,
    canGoPrev: PropTypes.bool.isRequired,
    episode: PropTypes.shape({
        air_date: PropTypes.string,
        characters: PropTypes.arrayOf(PropTypes.string),
        episode: PropTypes.string,
        id: PropTypes.number,
        name: PropTypes.string,
    }),
    favoriteIds: PropTypes.arrayOf(PropTypes.number).isRequired,
    onNext: PropTypes.func.isRequired,
    onPrev: PropTypes.func.isRequired,
    onToggleFavorite: PropTypes.func.isRequired,
};

export default EpisodeSpotlight;
