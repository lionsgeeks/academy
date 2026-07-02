import React, { useState } from 'react';
import { usePage } from '@inertiajs/react';
import {
    ConceptTopbar,
    CourseStructureSidebar,
    TopicWorkspace,
} from '@/components/concept-builder';

export default function Concept() {
    const { concept: serverConcept, topics: serverTopics = [] } = usePage().props;

    const concept = serverConcept || {
        id: null,
        title: 'New Concept',
        description: '',
    };

    const [topics, setTopics] = useState(() =>
        serverTopics.map((topic) => ({
            id: topic.id,
            title: topic.title || '',
            description: topic.description || '',
            theory: topic.lessons?.[0]?.content || '',
            videoUrl: topic.lessons?.[0]?.content_url || '',
            videoFile: null,
            resources: [],
            difficulty: 'easy',
            status: 'draft',
            hasQuiz: false,
            hasExercise: false,
        }))
    );

    const [activeTopicId, setActiveTopicId] = useState(
        topics[0]?.id ?? null
    );

    const activeTopic =
        topics.find((topic) => topic.id === activeTopicId) || null;

    const addTopic = () => {
        const newId = topics.length
            ? Math.max(...topics.map((topic) => topic.id)) + 1
            : 1;

        const newTopic = {
            id: newId,
            title: '',
            description: '',
            theory: '',
            videoUrl: '',
            videoFile: null,
            resources: [],
            difficulty: 'easy',
            status: 'draft',
            hasQuiz: false,
            hasExercise: false,
        };

        setTopics((prev) => [...prev, newTopic]);
        setActiveTopicId(newId);
    };

    const updateTopic = (topicId, updates) => {
        setTopics((prev) =>
            prev.map((topic) =>
                topic.id === topicId ? { ...topic, ...updates } : topic
            )
        );
    };

    return (
        <div className="h-screen bg-background text-foreground flex flex-col overflow-hidden">
            <ConceptTopbar concept={concept} />

            <div className="flex flex-1 overflow-hidden">
                <CourseStructureSidebar
                    concept={concept}
                    topics={topics}
                    activeTopicId={activeTopicId}
                    onSelectTopic={setActiveTopicId}
                    onAddTopic={addTopic}
                />

                <TopicWorkspace
                    topic={activeTopic}
                    onUpdateTopic={(updates) => {
                        if (!activeTopic) return;
                        updateTopic(activeTopic.id, updates);
                    }}
                />
            </div>
        </div>
    );
}