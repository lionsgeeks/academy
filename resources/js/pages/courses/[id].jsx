import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import {
    store as storeConceptRoute,
    update as updateConceptRoute,
    destroy as destroyConceptRoute,
} from '@/routes/courses/concepts-roadmap/concepts';
import ConceptDetailsCard from './partials/roadmap/ConceptDetailsCard';
import ConceptModal from './partials/roadmap/ConceptModal';
import ConceptsRoadmap from './partials/roadmap/ConceptsRoadmap';
import RoadmapBackground from './partials/roadmap/RoadmapBackground';
import RoadmapTopBar from './partials/roadmap/RoadmapTopBar';
import { emptyConceptForm } from './partials/roadmap/conceptHelpers';

export default function CourseDetails({ course }) {
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

    const openConceptBuilder = (concept) => {
        router.visit(`/concept/${concept.id}/edit`);
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
        <AppSidebarLayout>
            <Head title="Concepts Roadmap" />
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
                 * Dot grid as CSS background-image with background-attachment: local
                 * tiles across the full scroll height — standard infinite canvas technique.
                 * RoadmapBackground (glow, vignette) is absolute inside this section
                 * so it always covers the visible viewport regardless of scroll position.
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
                    onEdit={() => selectedConcept && openConceptBuilder(selectedConcept)}
                    onDelete={() => selectedConcept && handleDeleteConcept(selectedConcept)}
                />
            </div>
        </AppSidebarLayout>
    );
}

