import PropTypes from 'prop-types';
import './styles/residentCard.css';

const STATUS_LABELS = {
    alive: 'Vivo',
    dead: 'Muerto',
    unknown: 'Desconocido',
};

const ResidentCard = ({ resident }) => {
    const statusClass = resident.status.toLowerCase();
    const statusLabel = STATUS_LABELS[statusClass] ?? resident.status;

    return (
        <article className='resident'>
            <figure className='resident_photo'>
                <img
                    src={resident.image}
                    alt={`Retrato de ${resident.name}`}
                    width='300'
                    height='300'
                    loading='lazy'
                    decoding='async'
                />
                <figcaption className='resident_status'>
                    <span
                        className={`status_dot status_dot--${statusClass}`}
                        aria-hidden='true'
                    />
                    <span>Estado: {statusLabel}</span>
                </figcaption>
            </figure>
            <h3 className='resident_name'>{resident.name}</h3>
            <dl className='resident_list'>
                <div className='resident_item'>
                    <dt>Especie</dt>
                    <dd>{resident.species || 'Desconocida'}</dd>
                </div>
                <div className='resident_item'>
                    <dt>Origen</dt>
                    <dd>{resident.origin?.name || 'Desconocido'}</dd>
                </div>
                <div className='resident_item'>
                    <dt>Episodios</dt>
                    <dd>{resident.episode?.length ?? 0}</dd>
                </div>
            </dl>
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
