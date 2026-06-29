import { router } from '@inertiajs/react';
import { useState } from 'react';
import { Plus } from 'lucide-react';
import { TransText } from '@/components/TransText';
import { Button } from '@/components/ui/button';
import ExerciseModal from './partials/ExerciseModal';

export { default as ExerciseModal } from './partials/ExerciseModal';
export { EMPTY_EXERCISE_FORM } from './partials/ExerciseModal';

export default function Exercises({
    coachType = 'coding',
    topicId,
    publishablePromotions = [],
}) {
    const [open, setOpen] = useState(false);

    const submitExercise = (payload, callbacks = {}) => {
        if (!topicId) {
            callbacks.onError?.({
                submission: 'A topic is required before creating an exercise.',
            });

            return;
        }

        router.post(`/topics/${topicId}/exercises`, payload, {
            preserveScroll: true,
            onSuccess: () => callbacks.onSuccess?.(),
            onError: (errors) => callbacks.onError?.(errors),
            onFinish: () => callbacks.onFinish?.(),
        });
    };

    return (
        <>
            <Button className="bg-alpha" onClick={() => setOpen(true)}>
                <Plus />
                <TransText
                    en="New exercise"
                    fr="Nouvel exercice"
                    ar="تمرين جديد"
                />
            </Button>

            <ExerciseModal
                open={open}
                onOpenChange={setOpen}
                coachType={coachType}
                topicId={topicId}
                publishablePromotions={publishablePromotions}
                onSubmit={submitExercise}
            />
        </>
    );
}