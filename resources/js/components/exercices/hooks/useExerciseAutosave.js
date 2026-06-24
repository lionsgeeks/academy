import { useCallback, useEffect, useRef, useState } from 'react';

const AUTOSAVE_DELAY_MS = 800;

export function useExerciseAutosave(draftKey, data, enabled = true) {
    const [status, setStatus] = useState('idle');
    const timerRef = useRef(null);

    const restoreDraft = useCallback(() => {
        try {
            const raw = localStorage.getItem(draftKey);

            return raw ? JSON.parse(raw) : null;
        } catch {
            return null;
        }
    }, [draftKey]);

    const clearDraft = useCallback(() => {
        localStorage.removeItem(draftKey);
        setStatus('idle');
    }, [draftKey]);

    useEffect(() => {
        if (!enabled) {
            return;
        }

        clearTimeout(timerRef.current);

        timerRef.current = setTimeout(() => {
            try {
                setStatus('saving');
                localStorage.setItem(draftKey, JSON.stringify(data));
                setStatus('saved');
            } catch {
                setStatus('idle');
            }
        }, AUTOSAVE_DELAY_MS);

        return () => clearTimeout(timerRef.current);
    }, [data, draftKey, enabled]);

    return { status, restoreDraft, clearDraft };
}
