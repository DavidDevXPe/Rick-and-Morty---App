import { useEffect, useState } from 'react';

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
    const [value, setValue] = useState(() => readValue(key, initialValue));

    useEffect(() => {
        try {
            window.localStorage.setItem(key, JSON.stringify(value));
        } catch {
            // Storage can be unavailable (e.g. private browsing); ignore persistence failures.
        }
    }, [key, value]);

    return [value, setValue];
};

export default useLocalStorage;
