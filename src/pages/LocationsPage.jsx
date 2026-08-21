import { useState } from 'react';
import { AlertTriangle, MapPin, RefreshCw, Search, Sparkles } from 'lucide-react';
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

const LocationSkeleton = () => (
    <section className='location_skeleton' role='status' aria-live='polite'>
        <span className='sr_only'>Cargando ubicación…</span>
        <div className='location_skeleton_heading' aria-hidden='true'>
            <span className='skeleton location_skeleton_eyebrow' />
            <span className='skeleton location_skeleton_title' />
        </div>
        <div className='location_skeleton_details' aria-hidden='true'>
            {Array.from({ length: 3 }, (_, index) => (
                <div className='location_skeleton_detail' key={index}>
                    <span className='skeleton location_skeleton_label' />
                    <span className='skeleton location_skeleton_value' />
                </div>
            ))}
        </div>
    </section>
);

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
            <section className='locations_hero' aria-labelledby='locations-title'>
                <div className='locations_intro'>
                    <span className='locations_eyebrow'>
                        <Sparkles size={15} aria-hidden='true' />
                        Archivo interdimensional
                    </span>
                    <h1 id='locations-title'>Ubicaciones</h1>
                    <p>Explora cada dimensión conocida del multiverso y descubre quién vive en ella.</p>
                    <span className='locations_range'>
                        <MapPin size={16} aria-hidden='true' />
                        {MAX_LOCATION_ID} ubicaciones registradas
                    </span>
                </div>

                <form className='locations_form' onSubmit={handleSubmit} noValidate>
                    <div className='locations_form_heading'>
                        <span className='locations_form_icon' aria-hidden='true'>
                            <MapPin size={20} />
                        </span>
                        <div>
                            <label htmlFor='location-id'>ID de ubicación</label>
                            <p>Abre las coordenadas de un lugar</p>
                        </div>
                    </div>

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
                        <button className='btn locations_search_button' type='submit'>
                            <Search size={18} strokeWidth={2.2} aria-hidden='true' />
                            Buscar
                        </button>
                    </div>
                    <p id='location-help' className='locations_help'>
                        Ingresa un número entero de {MIN_LOCATION_ID} a {MAX_LOCATION_ID}.
                    </p>
                    {validationError && (
                        <p id='location-input-error' className='locations_field_error' role='alert'>
                            <AlertTriangle size={15} aria-hidden='true' />
                            {validationError}
                        </p>
                    )}
                </form>
            </section>

            {isLocationLoading && (
                <LocationSkeleton />
            )}

            {!isLocationLoading && locationError && (
                <div className='collection_state collection_state--error locations_state' role='alert'>
                    <span className='collection_state_icon' aria-hidden='true'>
                        <AlertTriangle size={25} />
                    </span>
                    <div>
                        <h2>Coordenadas no disponibles</h2>
                        <p>{getLocationErrorMessage(locationError, locationId)}</p>
                    </div>
                    <button type='button' className='btn' onClick={refetchLocation}>
                        <RefreshCw size={17} aria-hidden='true' />
                        Reintentar
                    </button>
                </div>
            )}

            {!isLocationLoading && !locationError && location && (
                <div className='locations_results'>
                    <LocationCard location={location} />
                    <ResidentList residentUrls={visibleResidentUrls} />
                    {totalPages > 1 && (
                        <Pagination
                            currentPage={currentPage}
                            setCurrentPage={setCurrentPage}
                            totalPages={totalPages}
                        />
                    )}
                </div>
            )}
        </div>
    );
};

export default LocationsPage;
