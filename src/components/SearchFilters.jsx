import PropTypes from 'prop-types';
import { ChevronDown, Filter, Search } from 'lucide-react';
import { GENDER_OPTIONS, SPECIES_LABELS, SPECIES_OPTIONS, STATUS_OPTIONS } from '../config';
import './styles/searchFilters.css';

const SearchFilters = ({ filters, hasActiveFilters, onChange, onClear, onSubmit }) => {
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
                <label htmlFor='character-search' className='sr_only'>Buscar personaje</label>
                <Search className='search_filters_search_icon' size={24} aria-hidden='true' />
                <input
                    id='character-search'
                    type='search'
                    placeholder='Buscar personaje...'
                    value={filters.name}
                    onChange={handleFieldChange('name')}
                    autoComplete='off'
                />
                <button className='btn search_filters_submit' type='submit'>Buscar</button>
            </div>

            <div className='search_filters_selects'>
                <label className='search_filters_field'>
                    <span>Estado</span>
                    <span className='select_control'>
                        <select value={filters.status} onChange={handleFieldChange('status')}>
                            <option value=''>Todos</option>
                            {STATUS_OPTIONS.map((option) => (
                                <option key={option.value} value={option.value}>{option.label}</option>
                            ))}
                        </select>
                        <ChevronDown size={18} aria-hidden='true' />
                    </span>
                </label>

                <label className='search_filters_field'>
                    <span>Especie</span>
                    <span className='select_control'>
                        <select value={filters.species} onChange={handleFieldChange('species')}>
                            <option value=''>Todas</option>
                            {SPECIES_OPTIONS.map((species) => (
                                <option key={species} value={species}>{SPECIES_LABELS[species] ?? species}</option>
                            ))}
                        </select>
                        <ChevronDown size={18} aria-hidden='true' />
                    </span>
                </label>

                <label className='search_filters_field'>
                    <span>Género</span>
                    <span className='select_control'>
                        <select value={filters.gender} onChange={handleFieldChange('gender')}>
                            <option value=''>Todos</option>
                            {GENDER_OPTIONS.map((option) => (
                                <option key={option.value} value={option.value}>{option.label}</option>
                            ))}
                        </select>
                        <ChevronDown size={18} aria-hidden='true' />
                    </span>
                </label>

                <button
                    type='button'
                    className='btn btn--ghost search_filters_clear'
                    onClick={onClear}
                    title={hasActiveFilters ? 'Restablecer todos los filtros' : 'Los filtros ya están limpios'}
                >
                    <Filter size={18} aria-hidden='true' />
                    Limpiar filtros
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
