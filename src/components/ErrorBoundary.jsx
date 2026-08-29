import { Component } from 'react';
import PropTypes from 'prop-types';

class ErrorBoundary extends Component {
    state = { hasError: false };

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error('Unexpected application error', error, errorInfo);
    }

    render() {
        const {
            children,
            message,
            reloadLabel,
            skipLabel,
            title,
        } = this.props;

        if (!this.state.hasError) {
            return children;
        }

        return (
            <>
                <a className='skip_link' href='#main-content'>{skipLabel}</a>
                <main id='main-content' className='app_fatal' tabIndex='-1'>
                    <section className='collection_state collection_state--error' role='alert'>
                        <div>
                            <h1>{title}</h1>
                            <p>{message}</p>
                        </div>
                        <button type='button' className='btn' onClick={() => window.location.reload()}>
                            {reloadLabel}
                        </button>
                    </section>
                </main>
            </>
        );
    }
}

ErrorBoundary.propTypes = {
    children: PropTypes.node.isRequired,
    message: PropTypes.string.isRequired,
    reloadLabel: PropTypes.string.isRequired,
    skipLabel: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
};

export default ErrorBoundary;
