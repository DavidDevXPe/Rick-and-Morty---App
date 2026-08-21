import PropTypes from 'prop-types';
import { Dna, MapPin, Tv } from 'lucide-react';
import { SPECIES_LABELS } from '../config';
import './styles/residentCard.css';

const STATUS_LABELS = {
    alive: 'Vivo',
    dead: 'Muerto',
    unknown: 'Desconocido',
};

const ResidentCard = ({ resident }) => {
    const statusClass = resident.status.toLowerCase();
    const statusLabel = STATUS_LABELS[statusClass] ?? resident.status;
    const speciesLabel = SPECIES_LABELS[resident.species] ?? resident.species ?? 'Desconocida';

    return (
        <article className='resident'>
            <figure className='resident_photo'>
                <img
                    src={resident.image}
                    alt={`Retrato de ${resident.name}`}
                    width='300'
                    height='225'
                    loading='lazy'
                    decoding='async'
                />
                <figcaption className={`resident_status status_badge status_badge--${statusClass}`}>
                    <span className='status_badge_dot' aria-hidden='true' />
                    <span>Estado: {statusLabel}</span>
                </figcaption>
            </figure>

            <div className='resident_body'>
                <h3 className='resident_name'>{resident.name}</h3>
                <dl className='resident_list'>
                    <div className='resident_item'>
                        <dt>
                            <Dna size={15} aria-hidden='true' />
                            Especie
                        </dt>
                        <dd>{speciesLabel}</dd>
                    </div>
                    <div className='resident_item'>
                        <dt>
                            <MapPin size={15} aria-hidden='true' />
                            Origen
                        </dt>
                        <dd>{resident.origin?.name || 'Desconocido'}</dd>
                    </div>
                    <div className='resident_item resident_item--episodes'>
                        <dt>
                            <Tv size={15} aria-hidden='true' />
                            Episodios
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
