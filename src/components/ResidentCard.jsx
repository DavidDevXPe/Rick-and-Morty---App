import PropTypes from 'prop-types';
import { Dna, MapPin, Tv } from 'lucide-react';
import { useLanguage } from '../i18n/useLanguage';
import './styles/residentCard.css';

const ResidentCard = ({ resident }) => {
    const { t } = useLanguage();
    const statusClass = resident.status.toLowerCase();
    const statusKey = `status.${statusClass}`;
    const translatedStatus = t(statusKey);
    const statusLabel = translatedStatus === statusKey ? resident.status : translatedStatus;
    const speciesKey = `species.${resident.species}`;
    const translatedSpecies = resident.species ? t(speciesKey) : null;
    const speciesLabel = !resident.species
        ? t('common.unknownFeminine')
        : translatedSpecies === speciesKey ? resident.species : translatedSpecies;

    return (
        <article className='resident'>
            <figure className='resident_photo'>
                <img
                    src={resident.image}
                    alt={t('resident.imageAlt', { name: resident.name })}
                    width='300'
                    height='225'
                    loading='lazy'
                    decoding='async'
                />
                <figcaption className={`resident_status status_badge status_badge--${statusClass}`}>
                    <span className='status_badge_dot' aria-hidden='true' />
                    <span>{t('resident.status')}: {statusLabel}</span>
                </figcaption>
            </figure>

            <div className='resident_body'>
                <h3 className='resident_name'>{resident.name}</h3>
                <dl className='resident_list'>
                    <div className='resident_item'>
                        <dt>
                            <Dna size={15} aria-hidden='true' />
                            {t('resident.species')}
                        </dt>
                        <dd>{speciesLabel}</dd>
                    </div>
                    <div className='resident_item'>
                        <dt>
                            <MapPin size={15} aria-hidden='true' />
                            {t('resident.origin')}
                        </dt>
                        <dd>{resident.origin?.name || t('common.unknown')}</dd>
                    </div>
                    <div className='resident_item resident_item--episodes'>
                        <dt>
                            <Tv size={15} aria-hidden='true' />
                            {t('resident.episodes')}
                        </dt>
                        <dd>{resident.episode?.length ?? 0}</dd>
                    </div>
                </dl>
            </div>
        </article>
    );
};

ResidentCard.propTypes = {
    resident: PropTypes.shape({
        name: PropTypes.string.isRequired,
        image: PropTypes.string.isRequired,
        status: PropTypes.string.isRequired,
        species: PropTypes.string,
        origin: PropTypes.shape({ name: PropTypes.string }),
        episode: PropTypes.arrayOf(PropTypes.string),
    }).isRequired,
};

export default ResidentCard;
