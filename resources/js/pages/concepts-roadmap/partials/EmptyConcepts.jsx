import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { TransText } from '@/components/TransText';

export default function EmptyConcepts({ onAdd }) {
    return (
        <motion.button
            type="button"
            className="group flex min-h-96 w-full flex-col items-center justify-center px-6 text-center transition-colors hover:bg-muted/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-alpha/50"
            onClick={onAdd}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
        >
            {/* Icon pulses gently to draw attention */}
            <motion.div
                className="mb-4 flex size-16 items-center justify-center rounded-full border-2 border-dashed border-alpha/40 bg-alpha/10 text-alpha transition-colors group-hover:border-alpha group-hover:bg-alpha group-hover:text-black"
                animate={{ scale: [1, 1.07, 1] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}
            >
                <Plus className="size-7" />
            </motion.div>
            <h3 className="text-base font-semibold text-foreground">
                <TransText
                    en="Start building your concepts roadmap"
                    fr="Start building your concepts roadmap"
                    ar="Start building your concepts roadmap"
                />
            </h3>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                <TransText
                    en="Add your first concept to begin structuring the course journey."
                    fr="Add your first concept to begin structuring the course journey."
                    ar="Add your first concept to begin structuring the course journey."
                />
            </p>
        </motion.button>
    );
}
