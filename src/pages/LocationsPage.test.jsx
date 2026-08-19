import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createJsonResponse, createLocation } from '../test/fixtures';
import LocationsPage from './LocationsPage';

vi.mock('../components/ResidentList', () => ({
  default: ({ residentUrls }) => (
    <section aria-label='Resident results'>
      {residentUrls.map((url) => <span key={url}>{url}</span>)}
    </section>
  ),
}));

describe('LocationsPage', () => {
  beforeEach(() => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
  });

  it('validates the search and never requests an empty location', async () => {
    const user = userEvent.setup();
    const fetchMock = vi.fn().mockResolvedValue(createJsonResponse(createLocation()));
    vi.stubGlobal('fetch', fetchMock);
    render(<LocationsPage />);

    await screen.findByRole('heading', { name: 'Location 1' });
    const input = screen.getByRole('spinbutton', { name: 'ID de ubicación' });

    expect(input).toBeRequired();
    expect(input).toHaveAttribute('min', '1');
    expect(input).toHaveAttribute('max', '126');
    expect(input).toHaveAttribute('step', '1');

    await user.click(screen.getByRole('button', { name: 'Buscar' }));

    expect(screen.getByRole('alert')).toHaveTextContent('Ingresa un número entero de 1 a 126');
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('uses the exact number of pages and slices residents correctly', async () => {
    const user = userEvent.setup();
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(createJsonResponse(createLocation({ residentCount: 10 }))),
    );
    render(<LocationsPage />);

    expect(await screen.findByText('Página 1 de 2')).toBeInTheDocument();
    expect(screen.getByText(/character\/1$/)).toBeInTheDocument();
    expect(screen.queryByText(/character\/6$/)).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Siguiente' }));

    expect(screen.getByText('Página 2 de 2')).toBeInTheDocument();
    expect(screen.getByText(/character\/6$/)).toBeInTheDocument();
    expect(screen.queryByText(/character\/1$/)).not.toBeInTheDocument();
  });

  it('resets pagination when a new location is searched', async () => {
    const user = userEvent.setup();
    const fetchMock = vi.fn((url) => {
      if (url.endsWith('/location/2')) {
        return Promise.resolve(createJsonResponse(createLocation({
          id: 2,
          residentCount: 2,
          residentStart: 21,
        })));
      }

      return Promise.resolve(createJsonResponse(createLocation({ residentCount: 12 })));
    });
    vi.stubGlobal('fetch', fetchMock);
    render(<LocationsPage />);

    await screen.findByText('Página 1 de 3');
    await user.click(screen.getByRole('button', { name: 'Siguiente' }));
    await user.click(screen.getByRole('button', { name: 'Siguiente' }));
    expect(screen.getByText('Página 3 de 3')).toBeInTheDocument();

    await user.type(screen.getByRole('spinbutton', { name: 'ID de ubicación' }), '2');
    await user.click(screen.getByRole('button', { name: 'Buscar' }));

    expect(await screen.findByRole('heading', { name: 'Location 2' })).toBeInTheDocument();
    expect(screen.queryByRole('navigation', { name: 'Páginas de residentes' })).not.toBeInTheDocument();
    expect(screen.getByText(/character\/21$/)).toBeInTheDocument();
  });

  it('shows a useful API error and allows retrying', async () => {
    const user = userEvent.setup();
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(createJsonResponse(createLocation()))
      .mockResolvedValueOnce(createJsonResponse({}, 404))
      .mockResolvedValueOnce(createJsonResponse(createLocation({ id: 2 })));
    vi.stubGlobal('fetch', fetchMock);
    render(<LocationsPage />);

    await screen.findByRole('heading', { name: 'Location 1' });
    await user.type(screen.getByRole('spinbutton', { name: 'ID de ubicación' }), '2');
    await user.click(screen.getByRole('button', { name: 'Buscar' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('No se encontró la ubicación 2');
    await user.click(screen.getByRole('button', { name: 'Reintentar' }));
    expect(await screen.findByRole('heading', { name: 'Location 2' })).toBeInTheDocument();
  });
});
