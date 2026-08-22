import PropTypes from 'prop-types';
import { Box, Globe2, MapPin, Users } from 'lucide-react';
import { useLanguage } from '../i18n/useLanguage';
import './styles/locationCard.css';

const LocationCard = ({ location }) => {
    const { t } = useLanguage();
    const titleId = `location-${location.id}-title`;

    return (
        <section className='location_card' aria-labelledby={titleId}>
            <div className='location_heading'>
                <div>
                    <span className='location_eyebrow'>
                        <MapPin size={15} aria-hidden='true' />
                        {t('location.found')}
                    </span>
                    <h2 id={titleId} className='location_title'>{location.name}</h2>
                </div>
                <span className='location_id' aria-label={t('location.identifier', { id: location.id })}>
                    #{String(location.id).padStart(3, '0')}
                </span>
            </div>

            <dl className='location_list'>
                <div className='location_item'>
                    <dt>
                        <Box size={17} aria-hidden='true' />
                        {t('location.type')}
                    </dt>
                    <dd>{location.type || t('common.unknown')}</dd>
                </div>
                <div className='location_item'>
                    <dt>
                        <Globe2 size={17} aria-hidden='true' />
                        {t('location.dimension')}
                    </dt>
                    <dd>{location.dimension || t('common.unknownFeminine')}</dd>
                </div>
                <div className='location_item location_item--population'>
                    <dt>
                        <Users size={17} aria-hidden='true' />
                        {t('location.population')}
                    </dt>
                    <dd>{location.residents?.length ?? 0}</dd>
                </div>
            </dl>
        </section>
    );
};

LocationCard.propTypes = {
    location: PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        type: PropTypes.string,
        dimension: PropTypes.string,
        residents: PropTypes.arrayOf(PropTypes.string),
    }).isRequired,
};

export default LocationCard;
