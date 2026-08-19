import PropTypes from 'prop-types';
import './styles/locationCard.css';

const LocationCard = ({ location }) => {
    const titleId = `location-${location.id}-title`;

    return (
        <section className='location' aria-labelledby={titleId}>
            <h2 id={titleId} className='location_title'>{location.name}</h2>
            <dl className='location_list'>
                <div className='location_item'>
                    <dt>Tipo</dt>
                    <dd>{location.type || 'Desconocido'}</dd>
                </div>
                <div className='location_item'>
                    <dt>Dimensión</dt>
                    <dd>{location.dimension || 'Desconocida'}</dd>
                </div>
                <div className='location_item'>
                    <dt>Población</dt>
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
