import PropTypes from 'prop-types';
import { useLanguage } from '../i18n/useLanguage';

const StatusBadge = ({ status }) => {
    const { t } = useLanguage();
    const normalizedStatus = status?.toLowerCase() || 'unknown';
    const translationKey = `status.${normalizedStatus}`;
    const translatedStatus = t(translationKey);
    const label = translatedStatus === translationKey
        ? status ?? t('status.unknown')
        : translatedStatus;

    return (
        <span className={`status_badge status_badge--${normalizedStatus}`}>
            <span className='status_badge_dot' aria-hidden='true' />
            {label}
        </span>
    );
};

StatusBadge.propTypes = {
    status: PropTypes.string,
};

export default StatusBadge;
