import { useCallback, useMemo } from 'react';
import { FAVORITES_STORAGE_KEY } from '../config';
import useLocalStorage from './useLocalStorage';

export const normalizeFavoriteIds = (value) => (
    Array.isArray(value)
        ? [...new Set(value.filter((id) => Number.isSafeInteger(id) && id > 0))]
        : []
);

const useFavorites = () => {
    const [storedFavoriteIds, setFavoriteIds] = useLocalStorage(FAVORITES_STORAGE_KEY, []);
    const favoriteIds = useMemo(
        () => normalizeFavoriteIds(storedFavoriteIds),
        [storedFavoriteIds],
    );

    const toggleFavorite = useCallback((id) => {
        if (!Number.isSafeInteger(id) || id <= 0) {
            return;
        }

        setFavoriteIds((currentValue) => {
            const currentIds = normalizeFavoriteIds(currentValue);
            return currentIds.includes(id)
                ? currentIds.filter((favoriteId) => favoriteId !== id)
                : [...currentIds, id];
        });
    }, [setFavoriteIds]);

    const isFavorite = useCallback(
        (id) => favoriteIds.includes(id),
        [favoriteIds],
    );

    return useMemo(() => ({
        favoriteIds,
        isFavorite,
        toggleFavorite,
    }), [favoriteIds, isFavorite, toggleFavorite]);
};

export default useFavorites;
