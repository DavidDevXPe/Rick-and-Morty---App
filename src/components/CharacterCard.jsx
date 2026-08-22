import PropTypes from 'prop-types';
import { Heart, MapPin, UserRound } from 'lucide-react';
import { useLanguage } from '../i18n/useLanguage';
import StatusBadge from './StatusBadge';
import './styles/characterCard.css';

const CharacterCard = ({ character, isFavorite, onToggleFavorite }) => {
    const { t } = useLanguage();
    const speciesKey = `species.${character.species}`;
    const translatedSpecies = character.species ? t(speciesKey) : null;
    const speciesLabel = !character.species
        ? t('common.unknownFeminine')
        : translatedSpecies === speciesKey ? character.species : translatedSpecies;

    return (
        <article className='character_card'>
            <figure className='character_photo'>
                <img
                    src={character.image}
                    alt={t('character.imageAlt', { name: character.name })}
                    width='300'
                    height='225'
                    loading='lazy'
                    decoding='async'
                />
                <StatusBadge status={character.status} />
                <button
                    type='button'
                    className={`character_favorite${isFavorite ? ' character_favorite--active' : ''}`}
                    onClick={() => onToggleFavorite(character.id)}
                    aria-pressed={isFavorite}
                    aria-label={isFavorite
                        ? t('character.removeFavorite', { name: character.name })
                        : t('character.addFavorite', { name: character.name })}
                >
                    <Heart size={22} strokeWidth={2} aria-hidden='true' />
                </button>
            </figure>

            <div className='character_card_body'>
                <h3 className='character_name'>{character.name}</h3>
                <p className='character_species'>
                    <UserRound size={16} aria-hidden='true' />
                    {speciesLabel}
                </p>
                <dl className='character_list'>
                    <div className='character_item'>
                        <dt>
                            <MapPin size={14} aria-hidden='true' />
                            {t('character.origin')}
                        </dt>
                        <dd>{character.origin?.name || t('common.unknown')}</dd>
                    </div>
                    <div className='character_item character_item--episodes'>
                        <dt>{t('character.episodesAppearing')}</dt>
                        <dd>{character.episode?.length ?? 0}</dd>
                    </div>
                </dl>
            </div>
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
