import PropTypes from 'prop-types';
import { AlertTriangle, RotateCcw, SearchX } from 'lucide-react';

const CollectionState = ({ actionLabel = 'Reintentar', kind, message, onAction, title }) => {
    const Icon = kind === 'error' ? AlertTriangle : SearchX;

    return (
        <div className={`collection_state collection_state--${kind}`} role={kind === 'error' ? 'alert' : 'status'}>
            <div className='collection_state_icon' aria-hidden='true'>
                <Icon size={28} strokeWidth={1.8} />
            </div>
            <div>
                <h3>{title}</h3>
                <p>{message}</p>
            </div>
            {onAction && (
                <button type='button' className='btn btn--ghost' onClick={onAction}>
                    <RotateCcw size={17} aria-hidden='true' />
                    {actionLabel}
                </button>
            )}
        </div>
    );
};

CollectionState.propTypes = {
    actionLabel: PropTypes.string,
    kind: PropTypes.oneOf(['empty', 'error']).isRequired,
    message: PropTypes.string.isRequired,
    onAction: PropTypes.func,
    title: PropTypes.string.isRequired,
};

export default CollectionState;
