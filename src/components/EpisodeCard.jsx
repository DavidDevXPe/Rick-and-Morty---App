import PropTypes from 'prop-types';
import './styles/episodeCard.css';

const EpisodeCard = ({ episode, onSelect }) => (
    <article className='episode_card'>
        <span className='episode_chip'>{episode.episode}</span>
        <h3 className='episode_name'>{episode.name}</h3>
        <p className='episode_date'>📅 {episode.air_date}</p>
        <p className='episode_count'>👥 {episode.characters?.length ?? 0} personajes</p>
        <button type='button' className='btn btn--ghost episode_select' onClick={() => onSelect(episode.id)}>
            Ver personajes
        </button>
    </article>
);

EpisodeCard.propTypes = {
    episode: PropTypes.shape({
        air_date: PropTypes.string,
        characters: PropTypes.arrayOf(PropTypes.string),
        episode: PropTypes.string,
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
    }).isRequired,
    onSelect: PropTypes.func.isRequired,
};

export default EpisodeCard;
