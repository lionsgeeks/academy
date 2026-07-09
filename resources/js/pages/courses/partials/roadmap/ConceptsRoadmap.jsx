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
    if (concepts.length === 0) {
        return <EmptyConcepts onAdd={onAddConcept} />;
    }

    const canvasHeight = getCanvasHeight(concepts.length);

    return (
        /*
         * The canvas is a transparent, fixed-width positioning context for nodes.
         * No card styling (no bg-card, no border, no rounded, no shadow) — those
         * would reintroduce the "panel inside the workspace" feeling.
         * overflow-hidden is kept to clip SVG paths and node overflow correctly.
         */
        <motion.div
            className="relative mx-auto overflow-hidden"
            style={{ width: CANVAS_WIDTH, minHeight: Math.max(canvasHeight, 720) }}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
        >
            {/* SVG layer — animated connection paths */}
            <svg
                className="absolute inset-0 h-full w-full text-muted-foreground/40"
                aria-hidden="true"
            >
                {concepts.map((concept, index) => {
                    if (index === 0) return null;
                    return (
                        <ConceptPath
                            key={concept.id}
                            from={getNodePosition(index - 1)}
                            to={getNodePosition(index)}
                            index={index}
                        />
                    );
                })}
                {/* Path from last concept to the Add button */}
                <ConceptPath
                    from={getNodePosition(concepts.length - 1)}
                    to={getNodePosition(concepts.length)}
                    index={concepts.length}
                />
            </svg>

            {/* Concept nodes — staggered via index prop */}
            {concepts.map((concept, index) => (
                <ConceptNode
                    key={concept.id}
                    concept={concept}
                    position={getNodePosition(index)}
                    selected={selectedConcept?.id === concept.id}
                    onSelect={() => onSelectConcept(concept)}
                    onEdit={() => onEditConcept(concept)}
                    onDelete={() => onDeleteConcept(concept)}
                    index={index}
                />
            ))}

            {/* Add button — appears after all nodes */}
            <AddConceptButton
                position={getNodePosition(concepts.length)}
                onAdd={onAddConcept}
                index={concepts.length}
            />
        </motion.div>
    );
}
