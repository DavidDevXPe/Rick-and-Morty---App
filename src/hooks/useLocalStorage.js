import { useCallback, useEffect, useRef, useState } from 'react';

const LOCAL_STORAGE_EVENT = 'rm-local-storage';

const readValue = (key, initialValue) => {
    if (typeof window === 'undefined') {
        return initialValue;
    }

    try {
        const storedValue = window.localStorage.getItem(key);
        return storedValue === null ? initialValue : JSON.parse(storedValue);
    } catch {
        return initialValue;
    }
};

const useLocalStorage = (key, initialValue) => {
    const [value, setValueState] = useState(() => readValue(key, initialValue));
    const valueRef = useRef(value);

    useEffect(() => {
        const handleStorage = (event) => {
            if (event.key === key) {
                const nextValue = readValue(key, initialValue);
                valueRef.current = nextValue;
                setValueState(nextValue);
            }
        };
        const handleLocalStorage = (event) => {
            if (event.detail?.key === key) {
                valueRef.current = event.detail.value;
                setValueState(event.detail.value);
            }
        };

        window.addEventListener('storage', handleStorage);
        window.addEventListener(LOCAL_STORAGE_EVENT, handleLocalStorage);
        return () => {
            window.removeEventListener('storage', handleStorage);
            window.removeEventListener(LOCAL_STORAGE_EVENT, handleLocalStorage);
        };
    }, [initialValue, key]);

    const setValue = useCallback((nextValueOrUpdater) => {
        const nextValue = typeof nextValueOrUpdater === 'function'
            ? nextValueOrUpdater(valueRef.current)
            : nextValueOrUpdater;
        valueRef.current = nextValue;
        setValueState(nextValue);

        try {
            window.localStorage.setItem(key, JSON.stringify(nextValue));
            window.dispatchEvent(new CustomEvent(LOCAL_STORAGE_EVENT, {
                detail: { key, value: nextValue },
            }));
        } catch {
            // Persistence can be unavailable in private browsing or strict environments.
        }
    }, [key]);

    return [value, setValue];
};

export default useLocalStorage;
