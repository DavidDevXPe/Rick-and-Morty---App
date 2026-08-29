import PropTypes from 'prop-types';
import { ArrowRight, CalendarDays, Play, UsersRound } from 'lucide-react';
import { useLanguage } from '../i18n/useLanguage';
import { formatAirDate } from '../utils/formatters';
import './styles/episodeCard.css';

const EpisodeCard = ({ episode, onSelect }) => {
    const { language, t } = useLanguage();

    return (
        <article className='episode_card'>
        <div className='episode_card_header'>
            <span className='episode_chip'>{episode.episode}</span>
            <span className='episode_archive_number' aria-label={t('episodes.numberLabel', { id: episode.id })}>
                #{String(episode.id).padStart(2, '0')}
            </span>
        </div>

        <div className='episode_orbit' aria-hidden='true'>
            <span className='episode_orbit_ring' />
            <span className='episode_orbit_core'>
                <Play size={22} strokeWidth={2} />
            </span>
        </div>

        <div className='episode_card_body'>
            <h3 className='episode_name'>{episode.name}</h3>
            <div className='episode_metadata'>
                <p className='episode_meta_item'>
                    <CalendarDays size={16} aria-hidden='true' />
                    <span>{formatAirDate(episode.air_date, language) || t('common.unknownDate')}</span>
                </p>
                <p className='episode_meta_item'>
                    <UsersRound size={16} aria-hidden='true' />
                    <span>{t('episode.characterCount', { count: episode.characters?.length ?? 0 })}</span>
                </p>
            </div>
        </div>

        <button
            type='button'
            className='episode_select'
            onClick={() => onSelect(episode.id)}
            aria-label={t('episodes.viewCharactersOf', { name: episode.name })}
        >
            <span>{t('episodes.viewCharacters')}</span>
            <ArrowRight size={18} aria-hidden='true' />
        </button>
        </article>
    );
};

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
