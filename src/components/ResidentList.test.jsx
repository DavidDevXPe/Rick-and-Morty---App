import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { createJsonResponse, createResident } from '../test/fixtures';
import ResidentList from './ResidentList';

const residentUrls = [
  'https://rickandmortyapi.com/api/character/1',
  'https://rickandmortyapi.com/api/character/2',
];

describe('ResidentList', () => {
  it('loads all visible residents with one batched request', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      createJsonResponse([createResident(1), createResident(2)]),
    );
    vi.stubGlobal('fetch', fetchMock);

    render(<ResidentList residentUrls={residentUrls} />);

    expect(screen.getByRole('status')).toHaveTextContent('Cargando residentes');
    expect(await screen.findByRole('heading', { name: 'Rick Sanchez' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Resident 2' })).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith(
      'https://rickandmortyapi.com/api/character/1,2',
      expect.objectContaining({ signal: expect.any(AbortSignal) }),
    );
  });

  it('offers a retry after a request error', async () => {
    const user = userEvent.setup();
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(createJsonResponse({}, 500))
      .mockResolvedValueOnce(createJsonResponse([createResident(1), createResident(2)]));
    vi.stubGlobal('fetch', fetchMock);

    render(<ResidentList residentUrls={residentUrls} />);

    expect(await screen.findByRole('alert')).toHaveTextContent('No se pudieron cargar los residentes');
    await user.click(screen.getByRole('button', { name: 'Reintentar' }));

    expect(await screen.findByRole('heading', { name: 'Rick Sanchez' })).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('handles an empty or malformed successful response', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(createJsonResponse({})));

    render(<ResidentList residentUrls={residentUrls} />);

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'La respuesta de residentes llegó vacía o inválida',
    );
  });
});
