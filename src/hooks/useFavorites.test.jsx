import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import useFavorites from './useFavorites';

describe('useFavorites', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('toggles favorites and persists them to localStorage', () => {
    const { result } = renderHook(() => useFavorites());

    expect(result.current.favoriteIds).toEqual([]);
    expect(result.current.isFavorite(1)).toBe(false);

    act(() => {
      result.current.toggleFavorite(1);
    });

    expect(result.current.favoriteIds).toEqual([1]);
    expect(result.current.isFavorite(1)).toBe(true);
    expect(JSON.parse(window.localStorage.getItem('rm-favorites'))).toEqual([1]);

    act(() => {
      result.current.toggleFavorite(1);
    });

    expect(result.current.favoriteIds).toEqual([]);
    expect(result.current.isFavorite(1)).toBe(false);
  });

  it('reads previously stored favorites on mount', () => {
    window.localStorage.setItem('rm-favorites', JSON.stringify([3, 7]));

    const { result } = renderHook(() => useFavorites());

    expect(result.current.favoriteIds).toEqual([3, 7]);
    expect(result.current.isFavorite(7)).toBe(true);
    expect(result.current.isFavorite(1)).toBe(false);
  });

  it('keeps favorites independent from each other when toggling multiple ids', () => {
    const { result } = renderHook(() => useFavorites());

    act(() => {
      result.current.toggleFavorite(1);
      result.current.toggleFavorite(2);
    });

    expect(result.current.favoriteIds).toEqual([1, 2]);

    act(() => {
      result.current.toggleFavorite(1);
    });

    expect(result.current.favoriteIds).toEqual([2]);
  });

  it('ignores malformed, duplicated and unsafe stored favorite ids', () => {
    window.localStorage.setItem('rm-favorites', JSON.stringify([1, 1, -2, '3', null, 4]));

    const { result } = renderHook(() => useFavorites());

    expect(result.current.favoriteIds).toEqual([1, 4]);
    expect(result.current.isFavorite(4)).toBe(true);
  });

  it('recovers when the stored favorites value is not an array', () => {
    window.localStorage.setItem('rm-favorites', JSON.stringify({ id: 1 }));

    const { result } = renderHook(() => useFavorites());
    expect(result.current.favoriteIds).toEqual([]);

    act(() => result.current.toggleFavorite(2));
    expect(result.current.favoriteIds).toEqual([2]);
  });
});
