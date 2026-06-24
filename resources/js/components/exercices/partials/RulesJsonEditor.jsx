import { useRef, useState } from 'react';
import { CheckCircle2, ClipboardPaste, FileJson, ShieldCheck, Upload, X } from 'lucide-react';
import { TransText } from '@/components/TransText';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import ExerciseField from './ExerciseField';

const MODES = {
    PASTE: 'paste',
    UPLOAD: 'upload',
};

const textareaClass = cn(
    'min-h-[180px] w-full resize-y rounded-md border border-beta/15 bg-transparent px-3 py-2.5',
    'font-mono text-sm text-beta leading-relaxed outline-none',
    'placeholder:text-beta/25 dark:placeholder:text-light/25',
    'focus-visible:border-beta/60 focus-visible:ring-2 focus-visible:ring-beta/20',
    'dark:border-light/15 dark:text-light dark:focus-visible:border-alpha/60 dark:focus-visible:ring-alpha/20',
);

function parseRulesJson(text) {
    const parsed = JSON.parse(text);
    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
        throw new Error('Rules must be a JSON object.');
    }
    return parsed;
}

export default function RulesJsonEditor({ data, errors, onChange }) {
    const inputRef = useRef(null);
    const [mode, setMode] = useState(data.rulesSource ?? MODES.PASTE);
    const [jsonText, setJsonText] = useState(
        data.rules ? JSON.stringify(data.rules, null, 2) : '',
    );
    const [localError, setLocalError] = useState(null);

    const applyParsed = (parsed, source, fileName = '') => {
        onChange('rules', parsed);
        onChange('rulesSource', source);
        onChange('rulesFileName', fileName);
        setLocalError(null);
    };

    const handlePasteChange = (text) => {
        setJsonText(text);
        if (!text.trim()) {
            onChange('rules', null);
            onChange('rulesFileName', '');
            setLocalError(null);
            return;
        }
        try {
            applyParsed(parseRulesJson(text), MODES.PASTE);
        } catch (err) {
            setLocalError(err.message ?? 'Invalid JSON.');
            onChange('rules', null);
        }
    };

    const handleFile = async (file) => {
        if (!file) return;
        if (!file.name.endsWith('.json')) {
            setLocalError('Only .json files are allowed.');
            return;
        }
        try {
            const text = await file.text();
            const parsed = parseRulesJson(text);
            setJsonText(JSON.stringify(parsed, null, 2));
            applyParsed(parsed, MODES.UPLOAD, file.name);
        } catch (err) {
            setLocalError(err.message ?? 'Invalid JSON file.');
            onChange('rules', null);
        }
    };

    const clearRules = () => {
        onChange('rules', null);
        onChange('rulesFileName', '');
        setJsonText('');
        setLocalError(null);
        if (inputRef.current) inputRef.current.value = '';
    };

    const displayError = errors.rules ?? localError;
    const isValid = Boolean(data.rules && !displayError);

    return (
        <ExerciseField
            id="rules"
            label={
                <span className="flex items-center gap-1.5">
                    <ShieldCheck className="size-3.5 text-beta/50 dark:text-light/50" />
                    <TransText en="Grading rules (JSON)" fr="Grading rules (JSON)" ar="Grading rules (JSON)" />
                </span>
            }
            error={displayError}
        >
            {/* Mode toggle */}
            <div className="flex rounded-lg border border-beta/10 bg-beta/5 p-1 dark:border-light/10 dark:bg-light/5">
                {[
                    { key: MODES.PASTE, icon: ClipboardPaste, label: <TransText en="Paste JSON" fr="Paste JSON" ar="Paste JSON" /> },
                    { key: MODES.UPLOAD, icon: Upload, label: <TransText en="Upload file" fr="Upload file" ar="Upload file" /> },
                ].map(({ key, icon: Icon, label }) => (
                    <button
                        key={key}
                        type="button"
                        onClick={() => setMode(key)}
                        className={cn(
                            'flex flex-1 items-center justify-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-all duration-150',
                                    mode === key
                                        ? 'bg-dark text-light shadow-sm dark:bg-alpha dark:text-beta'
                                        : 'text-beta/50 hover:text-beta dark:text-light/50 dark:hover:text-light',
                        )}
                    >
                        <Icon className="size-3.5" />
                        {label}
                    </button>
                ))}
            </div>

            {/* Paste mode */}
            {mode === MODES.PASTE ? (
                <textarea
                    value={jsonText}
                    onChange={(e) => handlePasteChange(e.target.value)}
                    placeholder={'{\n  "maxAttempts": 3,\n  "passScore": 70,\n  "timeLimitMinutes": 45\n}'}
                    className={cn(textareaClass, isValid && 'border-good/50')}
                    spellCheck={false}
                />
            ) : (
                /* Upload mode */
                <>
                    <input
                        ref={inputRef}
                        type="file"
                        accept=".json,application/json"
                        className="hidden"
                        onChange={(e) => handleFile(e.target.files?.[0])}
                    />

                    {!data.rulesFileName ? (
                        <button
                            type="button"
                            onClick={() => inputRef.current?.click()}
                            className={cn(
                                'flex w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-6 py-10 transition-all duration-150',
                                'border-beta/15 hover:border-beta/50 hover:bg-beta/5',
                                'dark:border-light/15 dark:hover:border-alpha/40 dark:hover:bg-alpha/5',
                            )}
                        >
                            <FileJson className="size-8 text-beta/25 dark:text-light/25" />
                            <div className="text-center">
                                <p className="text-sm font-medium text-beta/60 dark:text-light/60">
                                    <TransText
                                        en="Click to choose a rules.json file"
                                        fr="Click to choose a rules.json file"
                                        ar="Click to choose a rules.json file"
                                    />
                                </p>
                                <p className="mt-0.5 text-xs text-beta/35 dark:text-light/35">
                                    .json files only
                                </p>
                            </div>
                        </button>
                    ) : (
                        <div className="flex items-center justify-between rounded-xl border border-good/30 bg-good/5 px-4 py-3">
                            <div className="flex items-center gap-3">
                                <FileJson className="size-5 text-beta dark:text-alpha" />
                                <div>
                                    <p className="text-sm font-medium text-beta dark:text-light">
                                        {data.rulesFileName}
                                    </p>
                                    <p className="text-xs text-good">
                                        <TransText en="File loaded successfully" fr="File loaded successfully" ar="File loaded successfully" />
                                    </p>
                                </div>
                            </div>
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="size-7 text-beta/40 hover:text-error dark:text-light/40"
                                onClick={clearRules}
                            >
                                <X className="size-4" />
                            </Button>
                        </div>
                    )}
                </>
            )}

            {/* Valid JSON preview */}
            {isValid && (
                <div className="space-y-1.5">
                    <div className="flex items-center gap-1.5 text-xs font-medium text-good">
                        <CheckCircle2 className="size-3.5" />
                        <TransText en="Valid JSON — grading rules ready" fr="Valid JSON — grading rules ready" ar="Valid JSON — grading rules ready" />
                    </div>
                    <pre className="custom-scrollbar max-h-36 overflow-auto rounded-md border border-good/20 bg-good/5 p-3 text-xs text-beta dark:border-good/15 dark:bg-good/5 dark:text-light">
                        {JSON.stringify(data.rules, null, 2)}
                    </pre>
                </div>
            )}
        </ExerciseField>
    );
}
