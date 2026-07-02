import { useState } from 'react';
import { router } from '@inertiajs/react';
import {
    store as storeConceptRoute,
    update as updateConceptRoute,
    destroy as destroyConceptRoute,
} from '@/routes/courses/concepts-roadmap/concepts';
import ConceptDetailsCard from './partials/ConceptDetailsCard';
import ConceptModal from './partials/ConceptModal';
import ConceptsRoadmap from './partials/ConceptsRoadmap';
import RoadmapBackground from './partials/RoadmapBackground';
import RoadmapTopBar from './partials/RoadmapTopBar';
import { emptyConceptForm } from './partials/conceptHelpers';

export default function CourseConceptRoadmap({ course }) {
    const concepts = course?.concepts ?? [];
    const [selectedConcept, setSelectedConcept] = useState(null);
    const [isConceptModalOpen, setIsConceptModalOpen] = useState(false);
    const [conceptForm, setConceptForm] = useState(emptyConceptForm);

    const handleAddConcept = () => {
        setConceptForm(emptyConceptForm);
        setSelectedConcept(null);
        setIsConceptModalOpen(true);
    };

    const handleEditConcept = (concept) => {
        setConceptForm({
            title: concept.title ?? '',
            emoji: concept.emoji ?? '',
            description: concept.description ?? '',
            type: concept.type ?? '',
        });
        setSelectedConcept(concept);
        setIsConceptModalOpen(true);
    };

    const handleDeleteConcept = (concept) => {
        if (!window.confirm(`Delete "${concept.title}"?`)) return;
        router.delete(destroyConceptRoute({ course, concept }).url, {
            preserveScroll: true,
            onSuccess: () => setSelectedConcept(null),
        });
    };

    const handleSubmitConcept = (event) => {
        event.preventDefault();
        if (!selectedConcept) {
            router.post(storeConceptRoute(course.id).url, conceptForm, {
                preserveScroll: true,
                onSuccess: () => {
                    setIsConceptModalOpen(false);
                    setConceptForm(emptyConceptForm);
                    setSelectedConcept(null);
                },
            });
        } else {
            router.put(updateConceptRoute({ course, concept: selectedConcept }).url, conceptForm, {
                preserveScroll: true,
                onSuccess: () => {
                    setIsConceptModalOpen(false);
                    setConceptForm(emptyConceptForm);
                    setSelectedConcept(null);
                },
            });
        }
    };

    return (
        /*
         * flex-1 fills the remaining height of SidebarInset (flex-1 flex-col) after the
         * global header. overflow-hidden on this root is what prevents the page from
         * scrolling — only the canvas section below scrolls.
         * No hardcoded height calc needed: CSS flex handles it properly.
         */
        <div className="relative flex flex-1 flex-col overflow-hidden">

            {/* Workspace toolbar — flex-none so it never scrolls */}
            <div className="flex-none">
                <RoadmapTopBar
                    course={course}
                    conceptCount={concepts.length}
                    onAdd={handleAddConcept}
                />
            </div>

            {/*
             * Scrollable canvas section.
             *
             * The dot grid lives here as a CSS background-image with
             * background-attachment: local, which tiles the dots across the
             * full scroll height and scrolls them with the content — the
             * standard "infinite canvas" technique used by Figma and Miro.
             *
             * RoadmapBackground (glow, vignette) is absolute inside this
             * section so it always covers the visible viewport regardless of
             * scroll position, giving a persistent ambient light feel.
             */}
            <div
                className="relative flex-1 overflow-y-auto pt-4"
                style={{
                    backgroundImage: `radial-gradient(circle, color-mix(in srgb, var(--color-alpha) 12%, transparent) 1px, transparent 1px)`,
                    backgroundSize: '24px 24px',
                    backgroundAttachment: 'local',
                }}
            >
                <RoadmapBackground />

                <ConceptsRoadmap
                    course={course}
                    concepts={concepts}
                    selectedConcept={selectedConcept}
                    onSelectConcept={setSelectedConcept}
                    onAddConcept={handleAddConcept}
                    onEditConcept={handleEditConcept}
                    onDeleteConcept={handleDeleteConcept}
                />
            </div>

            <ConceptModal
                course={course}
                open={isConceptModalOpen}
                onOpenChange={setIsConceptModalOpen}
                form={conceptForm}
                setForm={setConceptForm}
                onSubmit={handleSubmitConcept}
                isEditing={Boolean(selectedConcept)}
            />

            <ConceptDetailsCard
                concept={selectedConcept}
                conceptIndex={concepts.findIndex((c) => c.id === selectedConcept?.id)}
                onClose={() => setSelectedConcept(null)}
                onEdit={() => selectedConcept && handleEditConcept(selectedConcept)}
                onDelete={() => selectedConcept && handleDeleteConcept(selectedConcept)}
            />
        </div>
    );
}
