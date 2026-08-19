import { useCallback, useMemo } from 'react';
import { FAVORITES_STORAGE_KEY } from '../config';
import useLocalStorage from './useLocalStorage';

const useFavorites = () => {
    const [favoriteIds, setFavoriteIds] = useLocalStorage(FAVORITES_STORAGE_KEY, []);

    const toggleFavorite = useCallback((id) => {
        setFavoriteIds((currentIds) => (
            currentIds.includes(id)
                ? currentIds.filter((favoriteId) => favoriteId !== id)
                : [...currentIds, id]
        ));
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
