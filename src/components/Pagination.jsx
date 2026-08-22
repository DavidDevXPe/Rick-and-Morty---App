import PropTypes from 'prop-types';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useLanguage } from '../i18n/useLanguage';
import './styles/pagination.css';

const Pagination = ({ currentPage, setCurrentPage, totalPages }) => {
    const { t } = useLanguage();
    const handlePrev = () => {
        setCurrentPage((page) => Math.max(1, page - 1));
    };

    const handleNext = () => {
        setCurrentPage((page) => Math.min(totalPages, page + 1));
    };

    return (
        <nav className='pagination' aria-label={t('pagination.ariaLabel')}>
            <button
                type='button'
                className='btn btn--ghost'
                onClick={handlePrev}
                disabled={currentPage <= 1}
            >
                <ArrowLeft size={18} aria-hidden='true' />
                {t('common.previous')}
            </button>
            <span className='pagination_status' aria-live='polite' aria-atomic='true'>
                {t('pagination.status', { current: currentPage, total: totalPages })}
            </span>
            <button
                type='button'
                className='btn'
                onClick={handleNext}
                disabled={currentPage >= totalPages}
            >
                {t('common.next')}
                <ArrowRight size={18} aria-hidden='true' />
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
