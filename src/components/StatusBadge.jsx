import PropTypes from 'prop-types';
import { STATUS_LABELS } from '../config';

const StatusBadge = ({ status }) => {
    const normalizedStatus = status?.toLowerCase() || 'unknown';
    const label = STATUS_LABELS[normalizedStatus] ?? status ?? STATUS_LABELS.unknown;

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
