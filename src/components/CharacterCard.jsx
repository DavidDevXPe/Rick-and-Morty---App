import PropTypes from 'prop-types';
import { STATUS_LABELS } from '../config';
import './styles/characterCard.css';

const CharacterCard = ({ character, isFavorite, onToggleFavorite }) => {
    const statusClass = character.status.toLowerCase();
    const statusLabel = STATUS_LABELS[statusClass] ?? character.status;

    return (
        <article className='character_card'>
            <figure className='character_photo'>
                <img
                    src={character.image}
                    alt={`Retrato de ${character.name}`}
                    width='300'
                    height='300'
                    loading='lazy'
                    decoding='async'
                />
                <span className={`character_status_pill character_status_pill--${statusClass}`}>
                    <span className={`status_dot status_dot--${statusClass}`} aria-hidden='true' />
                    {statusLabel}
                </span>
                <button
                    type='button'
                    className={`character_favorite${isFavorite ? ' character_favorite--active' : ''}`}
                    onClick={() => onToggleFavorite(character.id)}
                    aria-pressed={isFavorite}
                    aria-label={isFavorite ? `Quitar ${character.name} de favoritos` : `Agregar ${character.name} a favoritos`}
                >
                    {isFavorite ? '♥' : '♡'}
                </button>
            </figure>
            <h3 className='character_name'>{character.name}</h3>
            <p className='character_species'>{character.species || 'Desconocida'}</p>
            <dl className='character_list'>
                <div className='character_item'>
                    <dt>Origen</dt>
                    <dd>{character.origin?.name || 'Desconocido'}</dd>
                </div>
                <div className='character_item'>
                    <dt>Episodios donde aparece</dt>
                    <dd>{character.episode?.length ?? 0}</dd>
                </div>
            </dl>
        </article>
    );
};

CharacterCard.propTypes = {
    character: PropTypes.shape({
        episode: PropTypes.arrayOf(PropTypes.string),
        id: PropTypes.number.isRequired,
        image: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        origin: PropTypes.shape({ name: PropTypes.string }),
        species: PropTypes.string,
        status: PropTypes.string.isRequired,
    }).isRequired,
    isFavorite: PropTypes.bool.isRequired,
    onToggleFavorite: PropTypes.func.isRequired,
};

export default CharacterCard;
