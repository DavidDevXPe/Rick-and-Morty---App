import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { createCharacter, createEpisode, createJsonResponse } from '../test/fixtures';
import EpisodeHighlight from './EpisodeHighlight';

describe('EpisodeHighlight', () => {
    it('fetches the episode character batch once and reveals it progressively', async () => {
        const user = userEvent.setup();
        const episode = createEpisode({ id: 1, name: 'Pilot', characterCount: 6 });
        const characters = Array.from({ length: 6 }, (_, index) => (
            createCharacter({ id: index + 1, name: `Character ${index + 1}` })
        ));
        const fetchMock = vi.fn().mockResolvedValue(createJsonResponse(characters));
        vi.stubGlobal('fetch', fetchMock);

        render(
            <EpisodeHighlight
                canGoNext
                canGoPrev={false}
                episode={episode}
                favoriteIds={[]}
                onNext={vi.fn()}
                onPrev={vi.fn()}
                onRetryEpisode={vi.fn()}
                onToggleFavorite={vi.fn()}
            />,
        );

        expect(await screen.findByRole('heading', { name: 'Character 5' })).toBeInTheDocument();
        expect(screen.queryByRole('heading', { name: 'Character 6' })).not.toBeInTheDocument();
        expect(fetchMock).toHaveBeenCalledTimes(1);
        expect(fetchMock).toHaveBeenCalledWith(
            expect.stringContaining('/character/1,2,3,4,5,6'),
            expect.anything(),
        );

        await user.click(screen.getByRole('button', { name: 'Cargar más personajes' }));

        expect(screen.getByRole('heading', { name: 'Character 6' })).toBeInTheDocument();
        expect(fetchMock).toHaveBeenCalledTimes(1);
    });
});
