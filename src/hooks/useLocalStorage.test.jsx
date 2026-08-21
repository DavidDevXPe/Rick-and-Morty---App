import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import useLocalStorage from './useLocalStorage';

describe('useLocalStorage', () => {
    beforeEach(() => {
        window.localStorage.clear();
    });

    it('persists values and synchronizes hook instances in the same document', async () => {
        const { result } = renderHook(() => {
            const first = useLocalStorage('shared-key', []);
            const second = useLocalStorage('shared-key', []);
            return { first, second };
        });

        act(() => {
            result.current.first[1]((current) => [...current, 7]);
        });

        await waitFor(() => expect(result.current.second[0]).toEqual([7]));
        expect(result.current.first[0]).toEqual([7]);
        expect(JSON.parse(window.localStorage.getItem('shared-key'))).toEqual([7]);
    });
});
