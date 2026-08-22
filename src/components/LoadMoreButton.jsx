import PropTypes from 'prop-types';
import { ArrowDown, LoaderCircle } from 'lucide-react';
import { useLanguage } from '../i18n/useLanguage';

const LoadMoreButton = ({ isLoading = false, label, onClick }) => {
    const { t } = useLanguage();

    return (
        <div className='load_more'>
        <button
            type='button'
            className='load_more_button'
            onClick={onClick}
            disabled={isLoading}
        >
            <span>{isLoading ? t('common.loading') : label}</span>
            {isLoading
                ? <LoaderCircle className='spin' size={20} aria-hidden='true' />
                : <ArrowDown size={20} aria-hidden='true' />}
        </button>
        </div>
    );
};

LoadMoreButton.propTypes = {
    isLoading: PropTypes.bool,
    label: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
};

export default LoadMoreButton;
