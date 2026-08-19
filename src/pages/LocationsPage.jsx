import { useState } from 'react';
import LocationCard from '../components/LocationCard';
import Pagination from '../components/Pagination';
import ResidentList from '../components/ResidentList';
import {
    API_BASE_URL,
    MAX_LOCATION_ID,
    MIN_LOCATION_ID,
    RESIDENTS_PER_PAGE,
} from '../config';
import useFetch from '../hooks/useFetch';
import './styles/locationsPage.css';

const getRandomLocationId = () => (
    Math.floor(Math.random() * (MAX_LOCATION_ID - MIN_LOCATION_ID + 1)) + MIN_LOCATION_ID
);

const getLocationErrorMessage = (error, locationId) => {
    if (error?.status === 404) {
        return `No se encontró la ubicación ${locationId}.`;
    }

    return 'No se pudo cargar la ubicación. Verifica tu conexión e intenta de nuevo.';
};

const LocationsPage = () => {
    const [locationId, setLocationId] = useState(getRandomLocationId);
    const [searchValue, setSearchValue] = useState('');
    const [validationError, setValidationError] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    const locationUrl = `${API_BASE_URL}/location/${locationId}`;
    const {
        data: location,
        error: locationError,
        isLoading: isLocationLoading,
        refetch: refetchLocation,
    } = useFetch(locationUrl);

    const residents = Array.isArray(location?.residents) ? location.residents : [];
    const totalPages = Math.max(1, Math.ceil(residents.length / RESIDENTS_PER_PAGE));
    const firstResident = (currentPage - 1) * RESIDENTS_PER_PAGE;
    const visibleResidentUrls = residents.slice(
        firstResident,
        firstResident + RESIDENTS_PER_PAGE,
    );

    const handleInputChange = (event) => {
        setSearchValue(event.target.value);

        if (validationError) {
            setValidationError('');
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        const normalizedValue = searchValue.trim();
        const nextLocationId = Number(normalizedValue);

        if (
            normalizedValue === ''
            || !Number.isInteger(nextLocationId)
            || nextLocationId < MIN_LOCATION_ID
            || nextLocationId > MAX_LOCATION_ID
        ) {
            setValidationError(
                `Ingresa un número entero de ${MIN_LOCATION_ID} a ${MAX_LOCATION_ID}.`,
            );
            return;
        }

        setValidationError('');
        setSearchValue(String(nextLocationId));
        setCurrentPage(1);

        if (nextLocationId === locationId) {
            refetchLocation();
        } else {
            setLocationId(nextLocationId);
        }
    };

    return (
        <div className='locations_page' aria-busy={isLocationLoading}>
            <div className='locations_intro'>
                <h1 className='section_title'>Ubicaciones</h1>
                <p>Explora cada dimensión conocida del multiverso y sus residentes.</p>
            </div>

            <form className='locations_form' onSubmit={handleSubmit} noValidate>
                <label htmlFor='location-id'>ID de ubicación</label>
                <div className='locations_form_controls'>
                    <input
                        id='location-id'
                        name='locationId'
                        type='number'
                        min={MIN_LOCATION_ID}
                        max={MAX_LOCATION_ID}
                        step='1'
                        inputMode='numeric'
                        autoComplete='off'
                        required
                        value={searchValue}
                        onChange={handleInputChange}
                        aria-invalid={Boolean(validationError)}
                        aria-describedby={validationError ? 'location-input-error' : 'location-help'}
                        placeholder={`${MIN_LOCATION_ID} a ${MAX_LOCATION_ID}`}
                    />
                    <button className='btn' type='submit'>Buscar</button>
                </div>
                <p id='location-help' className='locations_help'>
                    Ingresa un número entero de {MIN_LOCATION_ID} a {MAX_LOCATION_ID}.
                </p>
                {validationError && (
                    <p id='location-input-error' className='locations_field_error' role='alert'>
                        {validationError}
                    </p>
                )}
            </form>

            {isLocationLoading && (
                <p className='status_message' role='status' aria-live='polite'>
                    Cargando ubicación…
                </p>
            )}

            {!isLocationLoading && locationError && (
                <div className='error_panel' role='alert'>
                    <p>{getLocationErrorMessage(locationError, locationId)}</p>
                    <button type='button' className='btn' onClick={refetchLocation}>Reintentar</button>
                </div>
            )}

            {!isLocationLoading && !locationError && location && (
                <>
                    <LocationCard location={location} />
                    {totalPages > 1 && (
                        <Pagination
                            currentPage={currentPage}
                            setCurrentPage={setCurrentPage}
                            totalPages={totalPages}
                        />
                    )}
                    <ResidentList residentUrls={visibleResidentUrls} />
                </>
            )}
        </div>
    );
};

export default LocationsPage;
