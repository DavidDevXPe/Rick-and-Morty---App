import { useState } from 'react';
import useFetch from './useFetch';

const usePaginatedList = (buildUrl, resetKey) => {
    const [page, setPage] = useState(1);
    const [items, setItems] = useState([]);
    const [trackedResetKey, setTrackedResetKey] = useState(resetKey);
    const [appendedData, setAppendedData] = useState(null);

    if (resetKey !== trackedResetKey) {
        setTrackedResetKey(resetKey);
        setPage(1);
        setItems([]);
        setAppendedData(null);
    }

    const url = buildUrl(page);
    const { data, error, isLoading, refetch } = useFetch(url);

    if (data?.results && data !== appendedData) {
        setAppendedData(data);
        setItems((currentItems) => (page === 1 ? data.results : [...currentItems, ...data.results]));
    }

    return {
        error,
        hasMore: Boolean(data?.info?.next),
        info: data?.info ?? null,
        isLoading,
        items,
        loadMore: () => setPage((currentPage) => currentPage + 1),
        refetch,
    };
};

export default usePaginatedList;
