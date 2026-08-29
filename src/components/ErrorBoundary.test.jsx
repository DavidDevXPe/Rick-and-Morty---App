import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import ErrorBoundary from './ErrorBoundary';

const BrokenView = () => {
    throw new Error('Broken view');
};

describe('ErrorBoundary', () => {
    it('replaces an unexpected render failure with an accessible recovery view', () => {
        vi.spyOn(console, 'error').mockImplementation(() => {});
        const preventWindowError = (event) => event.preventDefault();
        window.addEventListener('error', preventWindowError);

        try {
            render(
                <ErrorBoundary
                    message='Try again'
                    reloadLabel='Reload'
                    skipLabel='Skip to content'
                    title='Portal error'
                >
                    <BrokenView />
                </ErrorBoundary>,
            );
        } finally {
            window.removeEventListener('error', preventWindowError);
        }

        expect(screen.getByRole('alert')).toHaveTextContent('Portal error');
        expect(screen.getByRole('button', { name: 'Reload' })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'Skip to content' })).toHaveAttribute(
            'href',
            '#main-content',
        );
    });
});
