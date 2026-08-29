import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { createCharacter } from '../test/fixtures';
import CharacterGrid from './CharacterGrid';

const defaultProps = {
    characters: [],
    isFavorite: () => false,
    onToggleFavorite: vi.fn(),
    title: 'Personajes del episodio',
};

describe('CharacterGrid', () => {
    it('sorts characters A-Z by default and supports another sort option', async () => {
        const user = userEvent.setup();
        render(
            <CharacterGrid
                {...defaultProps}
                characters={[
                    createCharacter({ id: 2, name: 'Zeta' }),
                    createCharacter({ id: 1, name: 'Alpha' }),
                ]}
            />,
        );

        expect(screen.getAllByRole('heading', { level: 3 }).map((heading) => heading.textContent))
            .toEqual(['Alpha', 'Zeta']);

        await user.selectOptions(screen.getByLabelText('Ordenar por'), 'za');

        expect(screen.getAllByRole('heading', { level: 3 }).map((heading) => heading.textContent))
            .toEqual(['Zeta', 'Alpha']);
    });

    it('announces loading while rendering card skeletons', () => {
        render(<CharacterGrid {...defaultProps} isLoading />);

        expect(screen.getByRole('status')).toHaveTextContent('Cargando personajes');
    });

    it('shows the empty state and lets the user clear filters', async () => {
        const user = userEvent.setup();
        const onClear = vi.fn();
        render(<CharacterGrid {...defaultProps} onClear={onClear} />);

        expect(screen.getByText('No encontramos personajes con estos filtros.')).toBeInTheDocument();
        await user.click(screen.getByRole('button', { name: 'Limpiar filtros' }));
        expect(onClear).toHaveBeenCalledOnce();
    });

    it('can expose the collection title as the page heading', () => {
        render(<CharacterGrid {...defaultProps} headingLevel={1} />);

        expect(screen.getByRole('heading', { level: 1, name: 'Personajes del episodio' }))
            .toBeInTheDocument();
    });
});
