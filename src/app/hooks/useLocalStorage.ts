import { useEffect, useState } from "react";

export function useLocalStorage<T>(key: string, initialValue: T) {
    const [storedValue, setStoredValue] = useState<T>(initialValue);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        try {
            const item = window.localStorage.getItem(key);
            if (item) {
                // eslint-disable-next-line react-hooks/set-state-in-effect
                setStoredValue(JSON.parse(item));
            }
            setIsLoaded(true);
        } catch (error) {
            console.log(`Error reading localStorage key "${key}":`, error);
            setIsLoaded(true);
        }
    }, [key]);

    const setValue = (value: T | ((val: T) => T)) => {
        try {
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);
            if (typeof window !== "undefined") {
                window.localStorage.setItem(key, JSON.stringify(valueToStore));
            }
        } catch (error) {
            console.log(`Error setting localStorage key "${key}":`, error);
        }
    };

    return [storedValue, setValue, isLoaded] as const;
}