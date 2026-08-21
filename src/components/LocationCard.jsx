import PropTypes from 'prop-types';
import { Box, Globe2, MapPin, Users } from 'lucide-react';
import './styles/locationCard.css';

const LocationCard = ({ location }) => {
    const titleId = `location-${location.id}-title`;

    return (
        <section className='location_card' aria-labelledby={titleId}>
            <div className='location_heading'>
                <div>
                    <span className='location_eyebrow'>
                        <MapPin size={15} aria-hidden='true' />
                        Ubicación encontrada
                    </span>
                    <h2 id={titleId} className='location_title'>{location.name}</h2>
                </div>
                <span className='location_id' aria-label={`Identificador ${location.id}`}>
                    #{String(location.id).padStart(3, '0')}
                </span>
            </div>

            <dl className='location_list'>
                <div className='location_item'>
                    <dt>
                        <Box size={17} aria-hidden='true' />
                        Tipo
                    </dt>
                    <dd>{location.type || 'Desconocido'}</dd>
                </div>
                <div className='location_item'>
                    <dt>
                        <Globe2 size={17} aria-hidden='true' />
                        Dimensión
                    </dt>
                    <dd>{location.dimension || 'Desconocida'}</dd>
                </div>
                <div className='location_item location_item--population'>
                    <dt>
                        <Users size={17} aria-hidden='true' />
                        Población
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
