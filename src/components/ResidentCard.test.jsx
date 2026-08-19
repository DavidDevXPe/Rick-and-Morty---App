import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { createResident } from '../test/fixtures';
import ResidentCard from './ResidentCard';

describe('ResidentCard', () => {
  it('renders resident details with a descriptive image', () => {
    render(<ResidentCard resident={createResident()} />);

    expect(screen.getByRole('heading', { name: 'Rick Sanchez' })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Retrato de Rick Sanchez' })).toHaveAttribute(
      'loading',
      'lazy',
    );
    expect(screen.getByText('Estado: Vivo')).toBeInTheDocument();
    expect(screen.getByText('Especie')).toBeInTheDocument();
    expect(screen.getByText('Earth (C-137)')).toBeInTheDocument();
    expect(screen.getByText('Episodios')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });
});
