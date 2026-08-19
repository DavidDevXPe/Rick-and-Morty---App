import { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import Pagination from './Pagination';

const PaginationHarness = () => {
  const [page, setPage] = useState(1);
  return <Pagination currentPage={page} setCurrentPage={setPage} totalPages={2} />;
};

describe('Pagination', () => {
  it('moves between pages and disables boundary controls', async () => {
    const user = userEvent.setup();
    render(<PaginationHarness />);

    const previousButton = screen.getByRole('button', { name: 'Anterior' });
    const nextButton = screen.getByRole('button', { name: 'Siguiente' });

    expect(previousButton).toBeDisabled();
    expect(nextButton).toBeEnabled();
    expect(screen.getByText('Página 1 de 2')).toBeInTheDocument();

    await user.click(nextButton);

    expect(screen.getByText('Página 2 de 2')).toBeInTheDocument();
    expect(previousButton).toBeEnabled();
    expect(nextButton).toBeDisabled();
  });
});
