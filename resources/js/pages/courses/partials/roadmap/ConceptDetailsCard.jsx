import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { Calendar, Clock, Pencil, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

function formatDate(dateStr) {
    if (!dateStr) return null;
    return new Date(dateStr).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
}

export default function ConceptDetailsCard({ concept, conceptIndex, onClose, onEdit, onDelete }) {
    const cardRef = useRef(null);
    const onCloseRef = useRef(onClose);

    useEffect(() => {
        onCloseRef.current = onClose;
    }, [onClose]);

    useEffect(() => {
        function handleKeyDown(e) {
            if (e.key === 'Escape') onCloseRef.current();
        }
        function handleMouseDown(e) {
            if (cardRef.current && !cardRef.current.contains(e.target)) {
                // Node clicks swap the concept — don't close, let onSelect run.
                if (e.target.closest('[data-concept-node]')) return;
                onCloseRef.current();
            }
        }
        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('mousedown', handleMouseDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('mousedown', handleMouseDown);
        };
    }, []);

    const showDates = concept?.created_at || concept?.updated_at;
    const updatedIsDifferent =
        concept?.updated_at && concept?.created_at && concept.updated_at !== concept.created_at;

    return (
        <AnimatePresence>
            {concept && (
                <motion.div
                    key="concept-details-panel"
                    ref={cardRef}
                    className="fixed bottom-6 right-6 z-50 w-80 overflow-hidden rounded-xl border border-border/70 bg-card"
                    style={{ boxShadow: '0 24px 64px rgba(0,0,0,0.40), 0 4px 16px rgba(0,0,0,0.20)' }}
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                >
                    {/* Yellow accent line — matches TopBar and existing design system */}
                    <div className="h-px bg-[linear-gradient(90deg,var(--color-alpha),transparent_60%)]" />

                    {/*
                     * Content is keyed on concept.id so switching concepts
                     * triggers a quick fade rather than an abrupt swap.
                     */}
                    <motion.div
                        key={concept.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.15 }}
                    >
                        {/* Header — emoji, title, order/type, close */}
                        <div className="flex items-start justify-between gap-3 p-4 pb-3">
                            <div className="flex min-w-0 items-center gap-3">
                                <div className="flex size-11 shrink-0 items-center justify-center rounded-lg border border-border bg-background/60 text-2xl">
                                    {concept.emoji || '📚'}
                                </div>
                                <div className="min-w-0">
                                    <p className="truncate text-sm font-semibold text-foreground">
                                        {concept.title}
                                    </p>
                                    <p className="mt-0.5 text-xs text-muted-foreground">
                                        #{conceptIndex + 1}
                                        {concept.type ? ` · ${concept.type}` : ''}
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={onClose}
                                className="shrink-0 rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                                aria-label="Close"
                            >
                                <X className="size-4" />
                            </button>
                        </div>

                        {/* Description */}
                        {concept.description && (
                            <>
                                <div className="mx-4 border-t border-border/50" />
                                <div className="px-4 py-3">
                                    <p className="text-xs leading-relaxed text-muted-foreground">
                                        {concept.description}
                                    </p>
                                </div>
                            </>
                        )}

                        {/* Dates */}
                        {showDates && (
                            <>
                                <div className="mx-4 border-t border-border/50" />
                                <div className="flex flex-col gap-1.5 px-4 py-3">
                                    {concept.created_at && (
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                            <Calendar className="size-3 shrink-0 text-alpha/70" />
                                            <span>Created {formatDate(concept.created_at)}</span>
                                        </div>
                                    )}
                                    {updatedIsDifferent && (
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                            <Clock className="size-3 shrink-0 text-alpha/70" />
                                            <span>Updated {formatDate(concept.updated_at)}</span>
                                        </div>
                                    )}
                                </div>
                            </>
                        )}

                        {/* Actions */}
                        <div className="mx-4 border-t border-border/50" />
                        <div className="flex items-center gap-2 p-3">
                            <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                className="flex-1 gap-1.5 text-xs hover:border-alpha hover:text-alpha"
                                onClick={onEdit}
                            >
                                <Pencil className="size-3" />
                                Edit
                            </Button>
                            <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                className="flex-1 gap-1.5 text-xs hover:border-destructive hover:text-destructive"
                                onClick={onDelete}
                            >
                                <Trash2 className="size-3" />
                                Delete
                            </Button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
