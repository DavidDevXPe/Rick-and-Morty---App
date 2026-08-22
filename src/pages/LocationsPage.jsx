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
import { useLanguage } from '../i18n/useLanguage';
import './styles/locationsPage.css';

const getRandomLocationId = () => (
    Math.floor(Math.random() * (MAX_LOCATION_ID - MIN_LOCATION_ID + 1)) + MIN_LOCATION_ID
);

const getLocationErrorMessage = (error, locationId, t) => {
    if (error?.status === 404) {
        return t('locations.notFound', { id: locationId });
    }

    return t('locations.loadError');
};

const LocationSkeleton = () => {
    const { t } = useLanguage();

    return (
        <section className='location_skeleton' role='status' aria-live='polite'>
        <span className='sr_only'>{t('locations.loading')}</span>
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
};

const LocationsPage = () => {
    const { t } = useLanguage();
    const [locationId, setLocationId] = useState(getRandomLocationId);
    const [searchValue, setSearchValue] = useState('');
    const [hasValidationError, setHasValidationError] = useState(false);
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

        if (hasValidationError) {
            setHasValidationError(false);
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
            setHasValidationError(true);
            return;
        }

        setHasValidationError(false);
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
                        {t('locations.archiveEyebrow')}
                    </span>
                    <h1 id='locations-title'>{t('locations.title')}</h1>
                    <p>{t('locations.intro')}</p>
                    <span className='locations_range'>
                        <MapPin size={16} aria-hidden='true' />
                        {t('locations.registeredCount', { count: MAX_LOCATION_ID })}
                    </span>
                </div>

                <form className='locations_form' onSubmit={handleSubmit} noValidate>
                    <div className='locations_form_heading'>
                        <span className='locations_form_icon' aria-hidden='true'>
                            <MapPin size={20} />
                        </span>
                        <div>
                            <label htmlFor='location-id'>{t('locations.idLabel')}</label>
                            <p>{t('locations.formHint')}</p>
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
                            aria-invalid={hasValidationError}
                            aria-describedby={hasValidationError ? 'location-input-error' : 'location-help'}
                            placeholder={t('locations.rangePlaceholder', {
                                min: MIN_LOCATION_ID,
                                max: MAX_LOCATION_ID,
                            })}
                        />
                        <button className='btn locations_search_button' type='submit'>
                            <Search size={18} strokeWidth={2.2} aria-hidden='true' />
                            {t('common.search')}
                        </button>
                    </div>
                    <p id='location-help' className='locations_help'>
                        {t('locations.validation', { min: MIN_LOCATION_ID, max: MAX_LOCATION_ID })}
                    </p>
                    {hasValidationError && (
                        <p id='location-input-error' className='locations_field_error' role='alert'>
                            <AlertTriangle size={15} aria-hidden='true' />
                            {t('locations.validation', { min: MIN_LOCATION_ID, max: MAX_LOCATION_ID })}
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
                        <h2>{t('locations.unavailableTitle')}</h2>
                        <p>{getLocationErrorMessage(locationError, locationId, t)}</p>
                    </div>
                    <button type='button' className='btn' onClick={refetchLocation}>
                        <RefreshCw size={17} aria-hidden='true' />
                        {t('common.retry')}
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
