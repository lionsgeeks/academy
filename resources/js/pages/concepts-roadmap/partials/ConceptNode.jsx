import { motion, AnimatePresence } from 'framer-motion';
import { Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ConceptNode({
    concept,
    position,
    selected,
    onSelect,
    onEdit,
    onDelete,
    index = 0,
}) {
    return (
        /*
         * Outer div: handles absolute positioning via CSS transforms only.
         * Framer Motion never touches this element so -translate-x/y-1/2 stays intact.
         */
        <div
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: position.x, top: position.y }}
        >
            {/*
             * Inner motion.div: owns entrance animation + group for hover-reveal toolbar.
             * No CSS transform classes here so Framer Motion controls transform cleanly.
             */}
            <motion.div
                className="group relative"
                initial={{ opacity: 0, y: 14, scale: 0.88 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                    type: 'spring',
                    stiffness: 260,
                    damping: 20,
                    delay: 0.15 + index * 0.07,
                }}
            >
                {/* Edit / Delete toolbar — slides down + fades on hover */}
                <div className="absolute -top-10 left-1/2 flex -translate-x-1/2 translate-y-1 items-center gap-1 opacity-0 transition-all duration-150 group-hover:translate-y-0 group-hover:opacity-100">
                    <Button
                        type="button"
                        size="icon"
                        variant="secondary"
                        className="size-7 rounded-full bg-background/85 shadow-md backdrop-blur hover:bg-alpha hover:text-black"
                        onClick={(e) => { e.stopPropagation(); onEdit(); }}
                        aria-label="Edit concept"
                    >
                        <Pencil className="size-3" />
                    </Button>
                    <Button
                        type="button"
                        size="icon"
                        variant="secondary"
                        className="size-7 rounded-full bg-background/85 shadow-md backdrop-blur hover:bg-error hover:text-white"
                        onClick={(e) => { e.stopPropagation(); onDelete(); }}
                        aria-label="Delete concept"
                    >
                        <Trash2 className="size-3" />
                    </Button>
                </div>

                {/* Selected glow — fades in/out via AnimatePresence */}
                <AnimatePresence>
                    {selected && (
                        <motion.div
                            key="glow"
                            className="pointer-events-none absolute inset-0 -m-4 rounded-full bg-alpha/25 blur-xl"
                            initial={{ opacity: 0, scale: 0.6 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.6 }}
                            transition={{ duration: 0.25 }}
                        />
                    )}
                </AnimatePresence>

                {/* Circle — spring scale on hover/tap */}
                <motion.button
                    type="button"
                    data-concept-node="true"
                    onClick={onSelect}
                    className={`relative flex size-[66px] cursor-pointer items-center justify-center rounded-full border-2 bg-card text-2xl shadow-md transition-colors duration-200 hover:border-alpha/60 ${
                        selected
                            ? 'border-alpha ring-4 ring-alpha/20'
                            : 'border-border'
                    }`}
                    aria-label={concept.title}
                    whileHover={{
                        scale: 1.12,
                        boxShadow: '0 8px 28px rgba(0,0,0,0.18)',
                    }}
                    whileTap={{ scale: 0.93 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 18 }}
                >
                    <span aria-hidden="true">{concept.emoji || '📚'}</span>
                </motion.button>

                {/* Title */}
                <p className="mt-2 max-w-[100px] text-center text-xs font-medium leading-tight text-foreground">
                    {concept.title}
                </p>
            </motion.div>
        </div>
    );
}
