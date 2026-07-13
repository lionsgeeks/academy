import { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { CANVAS_WIDTH, getCanvasHeight, getNodePosition } from './conceptHelpers';
import AddConceptButton from './AddConceptButton';
import ConceptNode from './ConceptNode';
import ConceptPath from './ConceptPath';
import EmptyConcepts from './EmptyConcepts';

/*
 * No RoadmapBackground here — it lives in the parent scrollable section
 * (courses/[id].jsx) so it fills the full viewport width, not just the 560px canvas.
 * The canvas itself is transparent: nodes float on the workspace background.
 */
export default function ConceptsRoadmap({
    concepts,
    selectedConcept,
    onSelectConcept,
    onAddConcept,
    onEditConcept,
    onDeleteConcept,
}) {
    const canvasRef = useRef(null);
    const [canvasWidth, setCanvasWidth] = useState(CANVAS_WIDTH);

    useEffect(() => {
        const element = canvasRef.current;
        if (!element) return;

        const updateWidth = () => {
            setCanvasWidth(element.getBoundingClientRect().width || CANVAS_WIDTH);
        };

        updateWidth();

        const observer = new ResizeObserver(updateWidth);
        observer.observe(element);

        return () => observer.disconnect();
    }, []);

    const canvasHeight = getCanvasHeight(concepts.length, canvasWidth);
    const positions = useMemo(
        () => concepts.map((_, index) => getNodePosition(index, canvasWidth)),
        [concepts, canvasWidth]
    );
    const addPosition = getNodePosition(concepts.length, canvasWidth);

    if (concepts.length === 0) {
        return <EmptyConcepts onAdd={onAddConcept} />;
    }

    return (
        /*
         * The canvas is a transparent, fixed-width positioning context for nodes.
         * No card styling (no bg-card, no border, no rounded, no shadow) — those
         * would reintroduce the "panel inside the workspace" feeling.
         * overflow-hidden is kept to clip SVG paths and node overflow correctly.
         */
        <motion.div
            ref={canvasRef}
            className="relative mx-auto w-full overflow-hidden px-8 sm:px-12 lg:px-16"
            style={{ minHeight: Math.max(canvasHeight, 560) }}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
        >
            {/* SVG layer — animated connection paths */}
            <svg
                className="absolute inset-0 h-full w-full"
                aria-hidden="true"
            >
                {concepts.map((concept, index) => {
                    if (index === 0) return null;
                    return (
                        <ConceptPath
                            key={concept.id}
                            from={positions[index - 1]}
                            to={positions[index]}
                            index={index}
                            canvasWidth={canvasWidth}
                        />
                    );
                })}
                {/* Path from last concept to the Add button */}
                <ConceptPath
                    from={positions[concepts.length - 1]}
                    to={addPosition}
                    index={concepts.length}
                    canvasWidth={canvasWidth}
                />
            </svg>

            {/* Concept nodes — staggered via index prop */}
            {concepts.map((concept, index) => (
                <ConceptNode
                    key={concept.id}
                    concept={concept}
                    position={positions[index]}
                    selected={selectedConcept?.id === concept.id}
                    onSelect={() => onSelectConcept(concept)}
                    onEdit={() => onEditConcept(concept)}
                    onDelete={() => onDeleteConcept(concept)}
                    index={index}
                />
            ))}

            {/* Add button — appears after all nodes */}
            <AddConceptButton
                position={addPosition}
                onAdd={onAddConcept}
                index={concepts.length}
            />
        </motion.div>
    );
}
