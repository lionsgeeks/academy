import { createContext, useContext, useEffect, useState } from 'react';

const AppContext = createContext();

const readStoredDarkMode = () => {
    if (typeof window === 'undefined') {
        return false;
    }
    const storedTheme = localStorage.getItem('darkMode');
    return storedTheme !== null && storedTheme !== 'false';
};

export const AppContextProvider = ({ children }) => {
    const [selectedLanguage, setSelectedLanguage] = useState(() => {
        if (typeof window === 'undefined') {
            return 'en';
        }
        return localStorage.getItem('language') || 'en';
    });
    const [darkMode, setDarkMode] = useState(readStoredDarkMode);

    useEffect(() => {
        const storedLanguage = localStorage.getItem('language');
        if (storedLanguage) {
            setSelectedLanguage(storedLanguage);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('language', selectedLanguage);
        localStorage.setItem('darkMode', String(darkMode));
    }, [selectedLanguage, darkMode]);

    return <AppContext.Provider value={{ selectedLanguage, setSelectedLanguage, darkMode, setDarkMode }}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);
