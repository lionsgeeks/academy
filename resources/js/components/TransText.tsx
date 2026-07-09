import { useAppContext } from '../context/AppContext';
import React from 'react';

interface TextProps {
    ar: string;
    fr: string;
    en: string;
}

export const TransText: React.FC<TextProps> = (props) => {
    return useTranslatedText(props);
};

export const useTranslatedText = (props: TextProps): string => {
    const appContext = useAppContext();
    const storedLanguage = typeof window !== 'undefined' ? localStorage.getItem('language') : null;
    const selectedLanguage = appContext?.selectedLanguage ?? storedLanguage ?? 'en';
    const allowedLanguages = ['ar', 'fr', 'en'];

    if (!allowedLanguages.includes(selectedLanguage as keyof TextProps)) {
        throw new Error(`Invalid language: ${selectedLanguage}. Supported languages are: ${allowedLanguages.join(', ')}`);
    }

    return props[selectedLanguage as keyof TextProps];
};
