import PropTypes from 'prop-types';
import './styles/pagination.css';

const Pagination = ({ currentPage, setCurrentPage, totalPages }) => {
    const handlePrev = () => {
        setCurrentPage((page) => Math.max(1, page - 1));
    };

    const handleNext = () => {
        setCurrentPage((page) => Math.min(totalPages, page + 1));
    };

    return (
        <nav className='pagination' aria-label='Páginas de residentes'>
            <button
                type='button'
                className='btn btn--ghost'
                onClick={handlePrev}
                disabled={currentPage <= 1}
            >
                Anterior
            </button>
            <span aria-live='polite' aria-atomic='true'>
                Página {currentPage} de {totalPages}
            </span>
            <button
                type='button'
                className='btn'
                onClick={handleNext}
                disabled={currentPage >= totalPages}
            >
                Siguiente
            </button>
        </nav>
    );
};

Pagination.propTypes = {
    currentPage: PropTypes.number.isRequired,
    setCurrentPage: PropTypes.func.isRequired,
    totalPages: PropTypes.number.isRequired,
};

export default Pagination;
