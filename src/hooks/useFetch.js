import { useCallback, useEffect, useState } from 'react';

const initialState = {
    data: null,
    error: null,
    isLoading: false,
    url: null,
};

const useFetch = (url) => {
    const [state, setState] = useState(initialState);
    const [refreshKey, setRefreshKey] = useState(0);

    const refetch = useCallback(() => {
        setState((currentState) => ({
            ...currentState,
            data: null,
            error: null,
            isLoading: true,
        }));
        setRefreshKey((currentKey) => currentKey + 1);
    }, []);

    useEffect(() => {
        if (!url) {
            return undefined;
        }

        const controller = new AbortController();
        let isActive = true;

        const loadData = async () => {
            try {
                const response = await fetch(url, { signal: controller.signal });

                if (!response.ok) {
                    const requestError = new Error(`Request failed with status ${response.status}`);
                    requestError.status = response.status;
                    throw requestError;
                }

                const data = await response.json();

                if (isActive) {
                    setState({ data, error: null, isLoading: false, url });
                }
            } catch (error) {
                if (isActive && error.name !== 'AbortError') {
                    setState({ data: null, error, isLoading: false, url });
                }
            }
        };

        loadData();

        return () => {
            isActive = false;
            controller.abort();
        };
    }, [refreshKey, url]);

    const isCurrentRequest = state.url === url;

    return {
        data: isCurrentRequest ? state.data : null,
        error: isCurrentRequest ? state.error : null,
        isLoading: Boolean(url) && (!isCurrentRequest || state.isLoading),
        refetch,
    };
};

export default useFetch;
