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
                <p className='episodes_eyebrow'>Archivo interdimensional</p>
                <h1 className='section_title'>Episodios</h1>
                <p className='episodes_intro_copy'>
                    Recorre todas las temporadas y encuentra cada aventura del multiverso.
                </p>
            </header>

            <form className='episodes_search' onSubmit={handleSubmit} role='search'>
                <label htmlFor='episode-search' className='sr_only'>Buscar episodio</label>
                <Search className='episodes_search_icon' size={21} aria-hidden='true' />
                <input
                    id='episode-search'
                    type='search'
                    placeholder='Buscar episodio...'
                    value={searchValue}
                    onChange={(event) => setSearchValue(event.target.value)}
                    autoComplete='off'
                />
                {searchValue && (
                    <button
                        type='button'
                        className='episodes_search_clear'
                        onClick={() => setSearchValue('')}
                        aria-label='Borrar búsqueda'
                    >
                        <X size={18} aria-hidden='true' />
                    </button>
                )}
                <button className='btn episodes_search_submit' type='submit'>
                    <Search size={18} aria-hidden='true' />
                    <span>Buscar</span>
                </button>
            </form>

            <div className='episodes_section_heading'>
                <div>
                    <p className='episodes_section_kicker'>Rick and Morty API</p>
                    <h2 className='section_title section_title--accent'>
                        {submittedName ? `Resultados para “${submittedName}”` : 'Todos los episodios'}
                    </h2>
                </div>
                {!isInitialLoading && items.length > 0 && (
                    <span className='episodes_result_count' aria-live='polite'>
                        <Sparkles size={15} aria-hidden='true' />
                        {items.length} cargados
                    </span>
                )}
            </div>

            {isInitialLoading && (
                <div
                    className='episodes_grid'
                    role='status'
                    aria-label='Cargando episodios'
                    aria-live='polite'
                >
                    <span className='sr_only'>Cargando episodios…</span>
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
                        <h3>No pudimos abrir el archivo interdimensional</h3>
                        <p>No se pudieron cargar los episodios. Revisa tu conexión e inténtalo otra vez.</p>
                    </div>
                    <button type='button' className='btn' onClick={refetch}>
                        <RefreshCw size={17} aria-hidden='true' />
                        Reintentar
                    </button>
                </div>
            )}

            {isEmpty && (
                <div className='collection_state episodes_state'>
                    <span className='collection_state_icon' aria-hidden='true'>
                        <Film size={26} />
                    </span>
                    <div>
                        <h3>No encontramos ese episodio</h3>
                        <p>Prueba con otro nombre o vuelve a explorar el archivo completo.</p>
                    </div>
                    {submittedName && (
                        <button type='button' className='btn btn--ghost' onClick={handleClearSearch}>
                            <X size={17} aria-hidden='true' />
                            Limpiar búsqueda
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
                            <span>No se pudieron cargar más episodios.</span>
                            <button type='button' onClick={refetch}>Reintentar</button>
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
                                <span>{isLoading ? 'Cargando…' : 'Cargar más episodios'}</span>
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
