import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import SearchFilters from './SearchFilters';

const baseFilters = { gender: '', name: '', species: '', status: '' };

describe('SearchFilters', () => {
  it('reports name and select changes to the parent', () => {
    const onChange = vi.fn();
    render(
      <SearchFilters
        filters={baseFilters}
        hasActiveFilters={false}
        onChange={onChange}
        onClear={vi.fn()}
        onSubmit={vi.fn()}
      />,
    );

    fireEvent.change(screen.getByPlaceholderText('Buscar personaje...'), {
      target: { value: 'Rick' },
    });
    expect(onChange).toHaveBeenCalledWith('name', 'Rick');

    fireEvent.change(screen.getByRole('combobox', { name: 'Estado' }), {
      target: { value: 'alive' },
    });
    expect(onChange).toHaveBeenCalledWith('status', 'alive');

    fireEvent.change(screen.getByRole('combobox', { name: 'Especie' }), {
      target: { value: 'Human' },
    });
    expect(onChange).toHaveBeenCalledWith('species', 'Human');

    fireEvent.change(screen.getByRole('combobox', { name: 'Género' }), {
      target: { value: 'male' },
    });
    expect(onChange).toHaveBeenCalledWith('gender', 'male');
  });

  it('submits the search and clears the filters on request', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    const onClear = vi.fn();
    render(
      <SearchFilters
        filters={baseFilters}
        hasActiveFilters
        onChange={vi.fn()}
        onClear={onClear}
        onSubmit={onSubmit}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Buscar' }));
    expect(onSubmit).toHaveBeenCalledTimes(1);

    await user.click(screen.getByRole('button', { name: 'Limpiar filtros' }));
    expect(onClear).toHaveBeenCalledTimes(1);
  });

  it('reflects whether there are active filters in the clear button title', () => {
    const { rerender } = render(
      <SearchFilters
        filters={baseFilters}
        hasActiveFilters={false}
        onChange={vi.fn()}
        onClear={vi.fn()}
        onSubmit={vi.fn()}
      />,
    );

    expect(screen.getByRole('button', { name: 'Limpiar filtros' }))
      .toHaveAttribute('title', 'Los filtros ya están limpios');

    rerender(
      <SearchFilters
        filters={{ ...baseFilters, name: 'Rick' }}
        hasActiveFilters
        onChange={vi.fn()}
        onClear={vi.fn()}
        onSubmit={vi.fn()}
      />,
    );

    expect(screen.getByRole('button', { name: 'Limpiar filtros' }))
      .toHaveAttribute('title', 'Restablecer todos los filtros');
  });
});
