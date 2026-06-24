import { useState, useRef } from 'react';
import { Upload, FileText, X, Loader2 } from 'lucide-react';
import { TransText } from '@/components/TransText';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

const ACCEPTED_MIME = new Set([
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel',
]);

const MAX_SIZE_MB = 20;

export default function PdfModal({ open, onOpenChange }) {
    const [file, setFile] = useState(null);
    const [dragging, setDragging] = useState(false);
    const [error, setError] = useState('');
    const [processing, setProcessing] = useState(false);
    const inputRef = useRef(null);

    const reset = () => {
        setFile(null);
        setError('');
        setProcessing(false);
    };

    const handleOpenChange = (nextOpen) => {
        if (!nextOpen) reset();
        onOpenChange(nextOpen);
    };

    const validateAndSet = (picked) => {
        if (!picked) return;
        setError('');

        if (!ACCEPTED_MIME.has(picked.type)) {
            setError('Only PDF, Word (.doc/.docx) or Excel (.xls/.xlsx) files are accepted.');
            return;
        }
        if (picked.size > MAX_SIZE_MB * 1024 * 1024) {
            setError(`File size must not exceed ${MAX_SIZE_MB} MB.`);
            return;
        }
        setFile(picked);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragging(false);
        validateAndSet(e.dataTransfer.files[0]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!file) {
            setError('Please upload a file before submitting.');
            return;
        }
        setProcessing(true);
        // TODO: replace with real API call
        setTimeout(() => {
            setProcessing(false);
            handleOpenChange(false);
        }, 3000);
    };

    const fileExt = file ? file.name.split('.').pop().toUpperCase() : '';
    const fileSizeKb = file ? (file.size / 1024).toFixed(1) : '';

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>
                        <TransText
                            en="Generate Quiz from File"
                            fr="Générer un Quiz depuis un Fichier"
                            ar="إنشاء اختبار من ملف"
                        />
                    </DialogTitle>
                    <DialogDescription>
                        <TransText
                            en="Upload a PDF, Word, or Excel file and we'll extract questions from it automatically."
                            fr="Téléchargez un fichier PDF, Word ou Excel et nous en extrairons les questions automatiquement."
                            ar="قم بتحميل ملف PDF أو Word أو Excel وسنستخرج الأسئلة منه تلقائيًا."
                        />
                    </DialogDescription>
                </DialogHeader>

                <form id="pdf-quiz-form" onSubmit={handleSubmit} className="space-y-4">
                    {/* Drop zone */}
                    <div
                        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                        onDragLeave={() => setDragging(false)}
                        onDrop={handleDrop}
                        onClick={() => !file && inputRef.current?.click()}
                        className={[
                            'relative flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-8 transition-colors',
                            file ? 'cursor-default' : 'cursor-pointer',
                            dragging
                                ? 'border-alpha bg-alpha/10'
                                : file
                                    ? 'border-good/40 bg-good/5 dark:border-good/30 dark:bg-good/5'
                                    : 'border-beta/20 hover:border-alpha/50 hover:bg-alpha/5 dark:border-beta dark:hover:border-alpha/40 dark:hover:bg-alpha/5',
                        ].join(' ')}
                    >
                        <input
                            ref={inputRef}
                            type="file"
                            accept=".pdf,.doc,.docx,.xls,.xlsx"
                            className="sr-only"
                            onChange={(e) => validateAndSet(e.target.files?.[0])}
                        />

                        {file ? (
                            <div className="flex w-full items-center gap-3">
                                <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-alpha/15 text-beta dark:text-alpha">
                                    <FileText className="size-5" />
                                </span>
                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm font-medium text-beta dark:text-light">
                                        {file.name}
                                    </p>
                                    <p className="text-xs text-beta/50 dark:text-light/50">
                                        {fileExt} · {fileSizeKb} KB
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={(e) => { e.stopPropagation(); reset(); }}
                                    className="shrink-0 rounded-md p-1 text-beta/40 transition-colors hover:text-error dark:text-light/40 dark:hover:text-error"
                                >
                                    <X className="size-4" />
                                </button>
                            </div>
                        ) : (
                            <>
                                <span className="flex size-12 items-center justify-center rounded-xl bg-alpha/10 text-alpha">
                                    <Upload className="size-6" />
                                </span>
                                <div className="text-center">
                                    <p className="text-sm font-medium text-beta dark:text-light">
                                        <TransText
                                            en="Click or drag & drop your file here"
                                            fr="Cliquez ou glissez-déposez votre fichier ici"
                                            ar="انقر أو اسحب وأفلت ملفك هنا"
                                        />
                                    </p>
                                    <p className="mt-1 text-xs text-beta/50 dark:text-light/50">
                                        PDF, DOC, DOCX, XLS, XLSX — max {MAX_SIZE_MB} MB
                                    </p>
                                </div>
                            </>
                        )}
                    </div>

                    {error && (
                        <p className="text-xs text-error">{error}</p>
                    )}
                </form>

                <DialogFooter>
                    <Button
                        type="button"
                        variant="outline"
                        className="border-beta/20 text-beta/70 dark:border-light/20 dark:text-light/70"
                        onClick={() => handleOpenChange(false)}
                        disabled={processing}
                    >
                        <TransText en="Cancel" fr="Annuler" ar="إلغاء" />
                    </Button>
                    <Button
                        type="submit"
                        form="pdf-quiz-form"
                        disabled={processing || !file}
                        className="gap-1.5 bg-alpha font-semibold hover:bg-alpha/85 disabled:opacity-60"
                    >
                        {processing ? (
                            <>
                                <Loader2 className="size-4 animate-spin" />
                                <TransText en="Processing…" fr="Traitement…" ar="جارٍ المعالجة…" />
                            </>
                        ) : (
                            <TransText en="Generate Quiz" fr="Générer le Quiz" ar="إنشاء الاختبار" />
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
