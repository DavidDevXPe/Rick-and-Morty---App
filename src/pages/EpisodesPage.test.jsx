import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { createEpisode, createJsonResponse, createListResponse } from '../test/fixtures';
import EpisodesPage from './EpisodesPage';

describe('EpisodesPage', () => {
  it('lists episodes and notifies the parent when one is selected', async () => {
    const user = userEvent.setup();
    const episode = createEpisode({ id: 1, name: 'Pilot' });
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(
      createJsonResponse(createListResponse([episode], { next: null })),
    ));
    const onSelectEpisode = vi.fn();

    render(<EpisodesPage onSelectEpisode={onSelectEpisode} />);

    expect(await screen.findByRole('heading', { name: 'Pilot' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Ver personajes de Pilot' }));

    expect(onSelectEpisode).toHaveBeenCalledWith(1);
  });

  it('searches episodes by name', async () => {
    const user = userEvent.setup();
    const allEpisodes = createListResponse([createEpisode({ id: 1, name: 'Pilot' })], { next: null });
    const searchResults = createListResponse(
      [createEpisode({ id: 5, name: 'Rick Potion #9' })],
      { next: null },
    );
    const fetchMock = vi.fn((url) => Promise.resolve(createJsonResponse(
      url.includes('name=Rick') ? searchResults : allEpisodes,
    )));
    vi.stubGlobal('fetch', fetchMock);

    render(<EpisodesPage onSelectEpisode={vi.fn()} />);

    await screen.findByRole('heading', { name: 'Pilot' });
    await user.type(screen.getByPlaceholderText('Buscar episodio...'), 'Rick');
    await user.click(screen.getByRole('button', { name: 'Buscar' }));

    expect(await screen.findByRole('heading', { name: 'Rick Potion #9' })).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledWith(expect.stringContaining('name=Rick'), expect.anything());

    await user.click(screen.getByRole('button', { name: 'Borrar búsqueda' }));
    expect(await screen.findByRole('heading', { name: 'Pilot' })).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Buscar episodio...')).toHaveValue('');
  });

  it('loads more episodes when requested', async () => {
    const user = userEvent.setup();
    const pageOne = createListResponse([createEpisode({ id: 1, name: 'Pilot' })], { next: 'page2' });
    const pageTwo = createListResponse([createEpisode({ id: 2, name: 'Lawnmower Dog' })], { next: null });
    const fetchMock = vi.fn((url) => Promise.resolve(createJsonResponse(
      url.includes('page=2') ? pageTwo : pageOne,
    )));
    vi.stubGlobal('fetch', fetchMock);

    render(<EpisodesPage onSelectEpisode={vi.fn()} />);

    await screen.findByRole('heading', { name: 'Pilot' });
    await user.click(screen.getByRole('button', { name: 'Cargar más episodios' }));

    expect(await screen.findByRole('heading', { name: 'Lawnmower Dog' })).toBeInTheDocument();
  });

  it('shows an error state with a retry action', async () => {
    const user = userEvent.setup();
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(createJsonResponse({}, 500))
      .mockResolvedValueOnce(createJsonResponse(
        createListResponse([createEpisode({ id: 1, name: 'Pilot' })], { next: null }),
      ));
    vi.stubGlobal('fetch', fetchMock);

    render(<EpisodesPage onSelectEpisode={vi.fn()} />);

    expect(await screen.findByText('No pudimos abrir el archivo interdimensional')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Reintentar' }));

    expect(await screen.findByRole('heading', { name: 'Pilot' })).toBeInTheDocument();
  });
});
