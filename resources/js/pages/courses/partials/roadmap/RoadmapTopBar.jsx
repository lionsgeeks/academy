import { motion } from 'framer-motion';
import { router } from '@inertiajs/react';
import { ArrowLeft, Layers3, Plus } from 'lucide-react';
import { TransText } from '@/components/TransText';
import { Button } from '@/components/ui/button';
import { index as coursesIndex } from '@/routes/courses';

export default function RoadmapTopBar({ course, conceptCount, onAdd }) {
    return (
        /*
         * Flat workspace toolbar — border-b only, no rounded corners, no card shadow.
         * backdrop-blur gives it the "floating panel" depth without elevation.
         * Matches how Linear, Figma, and Raycast style their toolbars.
         */
        <motion.div
            className="relative border-b border-border/70 bg-card/90 backdrop-blur-sm"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        >
            {/* Accent line — top yellow stripe kept from original */}
            <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,var(--color-alpha),transparent_72%)]" />

            <div className="flex items-center justify-between gap-4 px-4 py-3 md:px-6">
                <div className="flex items-center gap-3">
                    <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => router.visit(coursesIndex().url)}
                        aria-label="Back to courses"
                    >
                        <ArrowLeft className="size-4" />
                    </Button>
                    <div className="flex items-center gap-2">
                        <span className="text-xl" aria-hidden="true">
                            {course?.emoji || '📚'}
                        </span>
                        <h1 className="text-lg font-semibold text-foreground">
                            {course?.title}
                        </h1>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <span className="inline-flex items-center gap-2 rounded-full border border-border bg-background/70 px-3 py-1.5 text-xs font-medium text-muted-foreground">
                        <Layers3 className="size-4 text-alpha" />
                        {conceptCount ?? 0}{' '}
                        <TransText en="concepts" fr="concepts" ar="concepts" />
                    </span>
                    <Button
                        type="button"
                        className="bg-alpha"
                        onClick={onAdd}
                    >
                        <Plus />
                        <TransText
                            en="Add Concept"
                            fr="Add Concept"
                            ar="Add Concept"
                        />
                    </Button>
                </div>
            </div>
        </motion.div>
    );
}
