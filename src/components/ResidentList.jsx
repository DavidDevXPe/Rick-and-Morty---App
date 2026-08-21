import PropTypes from 'prop-types';
import { AlertTriangle, MapPin, RefreshCw, Users } from 'lucide-react';
import { API_BASE_URL } from '../config';
import useFetch from '../hooks/useFetch';
import ResidentCard from './ResidentCard';

const getResidentId = (residentUrl) => residentUrl.split('/').filter(Boolean).at(-1);
const isResident = (resident) => (
    resident
    && Number.isInteger(resident.id)
    && typeof resident.name === 'string'
    && typeof resident.image === 'string'
    && typeof resident.status === 'string'
);

const ResidentSkeleton = ({ skeletonKey }) => (
    <article className='resident resident--skeleton' aria-hidden='true' key={skeletonKey}>
        <div className='skeleton resident_skeleton_image' />
        <div className='resident_body'>
            <span className='skeleton resident_skeleton_title' />
            <span className='skeleton resident_skeleton_line' />
            <span className='skeleton resident_skeleton_line resident_skeleton_line--short' />
            <span className='resident_skeleton_spacer' />
            <span className='skeleton resident_skeleton_line resident_skeleton_line--count' />
        </div>
    </article>
);

ResidentSkeleton.propTypes = {
    skeletonKey: PropTypes.string.isRequired,
};

const ResidentList = ({ residentUrls }) => {
    const residentIds = residentUrls.map(getResidentId).filter(Boolean);
    const residentsUrl = residentIds.length > 0
        ? `${API_BASE_URL}/character/${residentIds.join(',')}`
        : null;
    const { data, error, isLoading, refetch } = useFetch(residentsUrl);

    if (residentIds.length === 0) {
        return (
            <div className='collection_state residents_state'>
                <span className='collection_state_icon' aria-hidden='true'>
                    <MapPin size={25} />
                </span>
                <div>
                    <h3>Ubicación deshabitada</h3>
                    <p>No hay residentes conocidos en esta ubicación.</p>
                </div>
            </div>
        );
    }

    if (isLoading) {
        return (
            <section className='resident_section resident_loading' aria-labelledby='residents-loading-title'>
                <h2 id='residents-loading-title' className='sr_only'>Residentes</h2>
                <span className='sr_only' role='status'>Cargando residentes…</span>
                <div className='resident_header resident_header--loading' aria-hidden='true'>
                    <span className='skeleton resident_header_skeleton' />
                </div>
                <div className='resident_grid'>
                    {residentIds.map((residentId) => (
                        <ResidentSkeleton key={residentId} skeletonKey={residentId} />
                    ))}
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <div className='collection_state collection_state--error residents_state' role='alert'>
                <span className='collection_state_icon' aria-hidden='true'>
                    <AlertTriangle size={25} />
                </span>
                <div>
                    <h3>Residentes fuera de alcance</h3>
                    <p>No se pudieron cargar los residentes.</p>
                </div>
                <button type='button' className='btn' onClick={refetch}>
                    <RefreshCw size={17} aria-hidden='true' />
                    Reintentar
                </button>
            </div>
        );
    }

    const residents = (Array.isArray(data) ? data : data ? [data] : []).filter(isResident);

    if (residents.length === 0) {
        return (
            <div className='collection_state collection_state--error residents_state' role='alert'>
                <span className='collection_state_icon' aria-hidden='true'>
                    <AlertTriangle size={25} />
                </span>
                <div>
                    <h3>Registro incompleto</h3>
                    <p>La respuesta de residentes llegó vacía o inválida.</p>
                </div>
                <button type='button' className='btn' onClick={refetch}>
                    <RefreshCw size={17} aria-hidden='true' />
                    Reintentar
                </button>
            </div>
        );
    }

    return (
        <section className='resident_section' aria-labelledby='residents-title'>
            <div className='resident_header'>
                <div>
                    <span className='resident_eyebrow'>Población registrada</span>
                    <h2 id='residents-title' className='section_title section_title--accent'>Residentes</h2>
                </div>
                <span className='resident_count'>
                    <Users size={17} aria-hidden='true' />
                    {residents.length} {residents.length === 1 ? 'residente' : 'residentes'} en esta página
                </span>
            </div>
            <div className='resident_grid'>
                {residents.map((resident) => (
                    <ResidentCard key={resident.id} resident={resident} />
                ))}
            </div>
        </section>
    );
};

ResidentList.propTypes = {
    residentUrls: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default ResidentList;
