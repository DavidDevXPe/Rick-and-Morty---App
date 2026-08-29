import { useCallback, useEffect, useState } from 'react';

const mergeUniqueItems = (currentItems, nextItems) => {
    const itemsById = new Map(currentItems.map((item) => [item.id, item]));
    nextItems.forEach((item) => itemsById.set(item.id, item));
    return [...itemsById.values()];
};

const initialResult = {
    error: null,
    info: null,
    items: [],
    requestKey: null,
    resetKey: null,
};

const usePaginatedList = (buildUrl, resetKey, validate) => {
    const [pageRequest, setPageRequest] = useState(() => ({ page: 1, resetKey }));
    const [refreshKey, setRefreshKey] = useState(0);
    const [result, setResult] = useState(initialResult);
    const page = pageRequest.resetKey === resetKey ? pageRequest.page : 1;
    const url = buildUrl(page);
    const requestKey = url ? `${resetKey}:${page}:${refreshKey}:${url}` : null;

    useEffect(() => {
        if (!url) {
            return undefined;
        }

        const controller = new AbortController();
        let isActive = true;

        const loadPage = async () => {
            try {
                const response = await fetch(url, { signal: controller.signal });

                if (!response.ok) {
                    const requestError = new Error(`Request failed with status ${response.status}`);
                    requestError.status = response.status;
                    throw requestError;
                }

                const data = await response.json();
                const hasListShape = Array.isArray(data?.results) && data?.info;
                if (!hasListShape || (validate && !validate(data))) {
                    const responseError = new Error('The API returned an invalid response');
                    responseError.code = 'INVALID_RESPONSE';
                    throw responseError;
                }

                if (isActive) {
                    setResult((currentResult) => {
                        const currentItems = currentResult.resetKey === resetKey
                            ? currentResult.items
                            : [];
                        return {
                            error: null,
                            info: data.info ?? null,
                            items: page === 1
                                ? data.results
                                : mergeUniqueItems(currentItems, data.results),
                            requestKey,
                            resetKey,
                        };
                    });
                }
            } catch (error) {
                if (isActive && error.name !== 'AbortError') {
                    setResult((currentResult) => ({
                        ...currentResult,
                        error,
                        requestKey,
                        resetKey,
                    }));
                }
            }
        };

        loadPage();

        return () => {
            isActive = false;
            controller.abort();
        };
    }, [page, requestKey, resetKey, url, validate]);

    const hasCurrentResult = result.requestKey === requestKey;
    const isCurrentCollection = result.resetKey === resetKey;
    const info = isCurrentCollection ? result.info : null;
    const isLoading = Boolean(url) && !hasCurrentResult;

    const loadMore = useCallback(() => {
        if (isLoading || !info?.next) {
            return;
        }

        setPageRequest({ page: page + 1, resetKey });
    }, [info?.next, isLoading, page, resetKey]);

    const refetch = useCallback(() => {
        setRefreshKey((currentKey) => currentKey + 1);
    }, []);

    return {
        error: hasCurrentResult ? result.error : null,
        hasMore: Boolean(info?.next),
        info,
        isLoading,
        items: isCurrentCollection ? result.items : [],
        loadMore,
        refetch,
    };
};

export default usePaginatedList;
