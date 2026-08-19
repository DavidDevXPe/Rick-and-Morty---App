import PropTypes from 'prop-types';
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

const ResidentList = ({ residentUrls }) => {
    const residentIds = residentUrls.map(getResidentId).filter(Boolean);
    const residentsUrl = residentIds.length > 0
        ? `${API_BASE_URL}/character/${residentIds.join(',')}`
        : null;
    const { data, error, isLoading, refetch } = useFetch(residentsUrl);

    if (residentIds.length === 0) {
        return <p className='status_message'>No hay residentes conocidos en esta ubicación.</p>;
    }

    if (isLoading) {
        return <p className='status_message' role='status'>Cargando residentes…</p>;
    }

    if (error) {
        return (
            <div className='error_panel' role='alert'>
                <p>No se pudieron cargar los residentes.</p>
                <button type='button' className='btn' onClick={refetch}>Reintentar</button>
            </div>
        );
    }

    const residents = (Array.isArray(data) ? data : data ? [data] : []).filter(isResident);

    if (residents.length === 0) {
        return (
            <div className='error_panel' role='alert'>
                <p>La respuesta de residentes llegó vacía o inválida.</p>
                <button type='button' className='btn' onClick={refetch}>Reintentar</button>
            </div>
        );
    }

    return (
        <section className='resident_section' aria-labelledby='residents-title'>
            <h2 id='residents-title' className='sr_only'>Residentes</h2>
            <div className='page_container'>
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
