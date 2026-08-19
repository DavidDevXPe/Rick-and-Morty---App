import { useState } from 'react';
import PropTypes from 'prop-types';
import EpisodeCard from '../components/EpisodeCard';
import { API_BASE_URL } from '../config';
import usePaginatedList from '../hooks/usePaginatedList';
import './styles/episodesPage.css';

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

    return (
        <div className='episodes_page'>
            <div className='episodes_intro'>
                <h1 className='section_title'>Episodios</h1>
                <p>Recorre todas las temporadas del multiverso.</p>
            </div>

            <form className='episodes_search' onSubmit={handleSubmit} role='search'>
                <label htmlFor='episode-search' className='sr_only'>Buscar episodio</label>
                <input
                    id='episode-search'
                    type='search'
                    placeholder='Buscar episodio...'
                    value={searchValue}
                    onChange={(event) => setSearchValue(event.target.value)}
                    autoComplete='off'
                />
                <button className='btn' type='submit'>Buscar</button>
            </form>

            {items.length === 0 && isLoading && (
                <p className='status_message' role='status'>Cargando episodios…</p>
            )}

            {error && items.length === 0 && (
                <div className='error_panel' role='alert'>
                    <p>No se pudieron cargar los episodios.</p>
                    <button type='button' className='btn' onClick={refetch}>Reintentar</button>
                </div>
            )}

            {!error && !isLoading && items.length === 0 && (
                <p className='status_message'>No se encontraron episodios con ese nombre.</p>
            )}

            {items.length > 0 && (
                <>
                    <div className='page_container'>
                        {items.map((episode) => (
                            <EpisodeCard key={episode.id} episode={episode} onSelect={onSelectEpisode} />
                        ))}
                    </div>
                    {hasMore && (
                        <div className='episodes_load_more'>
                            <button type='button' className='btn btn--ghost' onClick={loadMore} disabled={isLoading}>
                                {isLoading ? 'Cargando…' : 'Cargar más episodios ↓'}
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
