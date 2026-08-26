import { act, renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { createCharacter, createJsonResponse, createListResponse } from '../test/fixtures';
import usePaginatedList from './usePaginatedList';

describe('usePaginatedList', () => {
  it('loads the first page and appends further pages on loadMore', async () => {
    const pageOne = createListResponse([createCharacter({ id: 1 })], { next: 'page2' });
    const pageTwo = createListResponse([createCharacter({ id: 2 })], { next: null });
    const fetchMock = vi.fn((url) => Promise.resolve(createJsonResponse(
      url.includes('page=2') ? pageTwo : pageOne,
    )));
    vi.stubGlobal('fetch', fetchMock);

    const buildUrl = (page) => `/character?page=${page}`;
    const { result } = renderHook(() => usePaginatedList(buildUrl, 'key'));

    await waitFor(() => expect(result.current.items).toHaveLength(1));
    expect(result.current.hasMore).toBe(true);

    act(() => {
      result.current.loadMore();
    });

    await waitFor(() => expect(result.current.items).toHaveLength(2));
    expect(result.current.items.map((item) => item.id)).toEqual([1, 2]);
    expect(result.current.hasMore).toBe(false);
    expect(fetchMock).toHaveBeenNthCalledWith(1, '/character?page=1', expect.anything());
    expect(fetchMock).toHaveBeenNthCalledWith(2, '/character?page=2', expect.anything());
  });

  it('resets accumulated items and page when the reset key changes', async () => {
    const pageOne = createListResponse([createCharacter({ id: 1 })], { next: 'page2' });
    const pageTwo = createListResponse([createCharacter({ id: 2 })], { next: null });
    const fetchMock = vi.fn((url) => Promise.resolve(createJsonResponse(
      url.includes('page=2') ? pageTwo : pageOne,
    )));
    vi.stubGlobal('fetch', fetchMock);

    const buildUrl = (page) => `/character?page=${page}`;
    const { result, rerender } = renderHook(
      ({ resetKey }) => usePaginatedList(buildUrl, resetKey),
      { initialProps: { resetKey: 'first' } },
    );

    await waitFor(() => expect(result.current.items).toHaveLength(1));
    act(() => {
      result.current.loadMore();
    });
    await waitFor(() => expect(result.current.items).toHaveLength(2));

    rerender({ resetKey: 'second' });

    await waitFor(() => expect(result.current.items).toHaveLength(1));
    expect(result.current.items[0].id).toBe(1);
    expect(fetchMock).toHaveBeenCalledTimes(3);
  });

  it('exposes fetch errors without keeping stale items', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(createJsonResponse({}, 404)));

    const buildUrl = (page) => `/episode?page=${page}`;
    const { result } = renderHook(() => usePaginatedList(buildUrl, 'key'));

    await waitFor(() => expect(result.current.error?.status).toBe(404));
    expect(result.current.items).toEqual([]);
    expect(result.current.hasMore).toBe(false);
  });
});
