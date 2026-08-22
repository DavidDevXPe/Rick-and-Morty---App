import PropTypes from 'prop-types';
import { ChevronDown, Filter, Search } from 'lucide-react';
import { GENDER_OPTIONS, SPECIES_OPTIONS, STATUS_OPTIONS } from '../config';
import { useLanguage } from '../i18n/useLanguage';
import './styles/searchFilters.css';

const SearchFilters = ({ filters, hasActiveFilters, onChange, onClear, onSubmit }) => {
    const { t } = useLanguage();
    const handleSubmit = (event) => {
        event.preventDefault();
        onSubmit();
    };

    const handleFieldChange = (field) => (event) => {
        onChange(field, event.target.value);
    };

    return (
        <form className='search_filters' onSubmit={handleSubmit} role='search'>
            <div className='search_filters_input'>
                <label htmlFor='character-search' className='sr_only'>{t('filters.searchLabel')}</label>
                <Search className='search_filters_search_icon' size={24} aria-hidden='true' />
                <input
                    id='character-search'
                    type='search'
                    placeholder={t('filters.searchPlaceholder')}
                    value={filters.name}
                    onChange={handleFieldChange('name')}
                    autoComplete='off'
                />
                <button className='btn search_filters_submit' type='submit'>{t('common.search')}</button>
            </div>

            <div className='search_filters_selects'>
                <label className='search_filters_field'>
                    <span>{t('filters.status')}</span>
                    <span className='select_control'>
                        <select value={filters.status} onChange={handleFieldChange('status')}>
                            <option value=''>{t('filters.all')}</option>
                            {STATUS_OPTIONS.map((status) => (
                                <option key={status} value={status}>{t(`status.${status}`)}</option>
                            ))}
                        </select>
                        <ChevronDown size={18} aria-hidden='true' />
                    </span>
                </label>

                <label className='search_filters_field'>
                    <span>{t('filters.species')}</span>
                    <span className='select_control'>
                        <select value={filters.species} onChange={handleFieldChange('species')}>
                            <option value=''>{t('filters.allFeminine')}</option>
                            {SPECIES_OPTIONS.map((species) => (
                                <option key={species} value={species}>{t(`species.${species}`)}</option>
                            ))}
                        </select>
                        <ChevronDown size={18} aria-hidden='true' />
                    </span>
                </label>

                <label className='search_filters_field'>
                    <span>{t('filters.gender')}</span>
                    <span className='select_control'>
                        <select value={filters.gender} onChange={handleFieldChange('gender')}>
                            <option value=''>{t('filters.all')}</option>
                            {GENDER_OPTIONS.map((gender) => (
                                <option key={gender} value={gender}>{t(`gender.${gender}`)}</option>
                            ))}
                        </select>
                        <ChevronDown size={18} aria-hidden='true' />
                    </span>
                </label>

                <button
                    type='button'
                    className='btn btn--ghost search_filters_clear'
                    onClick={onClear}
                    title={hasActiveFilters ? t('filters.resetTitle') : t('filters.alreadyClearTitle')}
                >
                    <Filter size={18} aria-hidden='true' />
                    {t('filters.clear')}
                </button>
            </div>
        </form>
    );
};

SearchFilters.propTypes = {
    filters: PropTypes.shape({
        gender: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        species: PropTypes.string.isRequired,
        status: PropTypes.string.isRequired,
    }).isRequired,
    hasActiveFilters: PropTypes.bool.isRequired,
    onChange: PropTypes.func.isRequired,
    onClear: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
};

export default SearchFilters;
