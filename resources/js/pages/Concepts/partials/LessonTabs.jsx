import { useState } from 'react';
import { BookOpen, Paperclip, HelpCircle, Award, Settings } from 'lucide-react';

import TheoryTab from './TheoryTab';
import ResourcesTab from './ResourcesTab';
import TopicSettingsTab from './TopicSettingsTab';

import Quizes from '@/components/quizes';
import Exercises from '@/components/exercices';

export default function LessonTabs({ topic, onUpdateTopic }) {
    const [activeTab, setActiveTab] = useState('theory');

    const tabs = [
        { id: 'theory', label: 'Theory', icon: BookOpen },
        { id: 'resources', label: 'Resources', icon: Paperclip },
        { id: 'quiz', label: 'Quiz', icon: HelpCircle },
        { id: 'exercise', label: 'Exercise', icon: Award },
        { id: 'settings', label: 'Settings', icon: Settings },
    ];

    return (
        <section className="rounded-2xl border border-border bg-card overflow-hidden">
            <div className="flex items-center gap-1 border-b border-border bg-muted/40 px-2 pt-2">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;

                    return (
                        <button
                            key={tab.id}
                            type="button"
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 rounded-t-xl px-4 py-2.5 text-xs font-semibold transition ${
                                isActive
                                    ? 'border border-border border-b-card bg-card text-foreground'
                                    : 'text-muted-foreground hover:bg-background hover:text-foreground'
                            }`}
                        >
                            <Icon className="size-4" />
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            <div className="p-6">
                {activeTab === 'theory' && (
                    <TheoryTab
                        topic={topic}
                        onUpdateTopic={onUpdateTopic}
                    />
                )}

                {activeTab === 'resources' && (
                    <ResourcesTab
                        topic={topic}
                        onUpdateTopic={onUpdateTopic}
                    />
                )}

                {activeTab === 'quiz' && (
                    <div className="space-y-5">
                        <div>
                            <h3 className="text-lg font-semibold text-foreground">
                                Lesson Quiz
                            </h3>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Create or generate quiz questions for this lesson.
                            </p>
                        </div>

                        <div className="rounded-2xl border border-dashed border-border bg-muted/30 p-8">
                            <div className="flex items-center justify-between gap-4">
                                <div>
                                    <h4 className="font-medium text-foreground">
                                        No quiz created yet
                                    </h4>
                                    <p className="mt-1 text-sm text-muted-foreground">
                                        Generate with AI or create one manually.
                                    </p>
                                </div>

                                <Quizes topicId={topic?.id} />
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'exercise' && (
                    <div className="space-y-5">
                        <div>
                            <h3 className="text-lg font-semibold text-foreground">
                                Practical Exercise
                            </h3>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Create a coding challenge for this lesson.
                            </p>
                        </div>

                        <div className="rounded-2xl border border-dashed border-border bg-muted/30 p-8">
                            <div className="flex items-center justify-between gap-4">
                                <div>
                                    <h4 className="font-medium text-foreground">
                                        No exercise created yet
                                    </h4>
                                    <p className="mt-1 text-sm text-muted-foreground">
                                        Help students practice what they learned.
                                    </p>
                                </div>

                                <Exercises coachType="coding" topicId={topic?.id} />
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'settings' && (
                    <TopicSettingsTab
                        topic={topic}
                        onUpdateTopic={onUpdateTopic}
                    />
                )}
            </div>
        </section>
    );
}