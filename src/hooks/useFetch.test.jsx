import { act, renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { createDeferred, createJsonResponse } from '../test/fixtures';
import useFetch from './useFetch';

describe('useFetch', () => {
  it('loads JSON data and exposes the loading state', async () => {
    const fetchMock = vi.fn().mockResolvedValue(createJsonResponse({ id: 1 }));
    vi.stubGlobal('fetch', fetchMock);

    const { result } = renderHook(() => useFetch('/resource'));

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => expect(result.current.data).toEqual({ id: 1 }));
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('exposes HTTP errors without keeping stale data', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(createJsonResponse({}, 500)));

    const { result } = renderHook(() => useFetch('/broken'));

    await waitFor(() => expect(result.current.error?.status).toBe(500));
    expect(result.current.data).toBeNull();
    expect(result.current.isLoading).toBe(false);
  });

  it('rejects successful responses that do not match the expected schema', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(createJsonResponse({ unexpected: true })));
    const validate = (value) => Number.isSafeInteger(value?.id);

    const { result } = renderHook(() => useFetch('/resource', { validate }));

    await waitFor(() => expect(result.current.error?.code).toBe('INVALID_RESPONSE'));
    expect(result.current.data).toBeNull();
  });

  it('aborts the previous request when the URL changes and on unmount', async () => {
    const requests = [];
    const fetchMock = vi.fn((url, { signal }) => new Promise((resolve, reject) => {
      requests.push({ reject, resolve, signal, url });
      signal.addEventListener('abort', () => {
        reject(new DOMException('The request was aborted', 'AbortError'));
      });
    }));
    vi.stubGlobal('fetch', fetchMock);

    const { rerender, unmount } = renderHook(
      ({ url }) => useFetch(url),
      { initialProps: { url: '/first' } },
    );

    await waitFor(() => expect(requests).toHaveLength(1));
    rerender({ url: '/second' });
    await waitFor(() => expect(requests).toHaveLength(2));

    expect(requests[0].signal.aborted).toBe(true);
    unmount();
    expect(requests[1].signal.aborted).toBe(true);
  });

  it('ignores an obsolete response even when fetch does not honor abort', async () => {
    const pendingRequests = new Map();
    vi.stubGlobal('fetch', vi.fn((url) => {
      const request = createDeferred();
      pendingRequests.set(url, request);
      return request.promise;
    }));

    const { result, rerender } = renderHook(
      ({ url }) => useFetch(url),
      { initialProps: { url: '/slow' } },
    );

    await waitFor(() => expect(pendingRequests.has('/slow')).toBe(true));
    rerender({ url: '/fast' });
    await waitFor(() => expect(pendingRequests.has('/fast')).toBe(true));

    await act(async () => {
      pendingRequests.get('/fast').resolve(createJsonResponse({ id: 'fast' }));
    });
    await waitFor(() => expect(result.current.data).toEqual({ id: 'fast' }));

    await act(async () => {
      pendingRequests.get('/slow').resolve(createJsonResponse({ id: 'slow' }));
    });
    expect(result.current.data).toEqual({ id: 'fast' });
  });
});

