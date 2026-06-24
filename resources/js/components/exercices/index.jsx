import { useState } from 'react';
import { Plus } from 'lucide-react';
import { TransText } from '@/components/TransText';
import { Button } from '@/components/ui/button';
import ExerciseModal from './partials/ExerciseModal';

export { default as ExerciseModal } from './partials/ExerciseModal';
export { EMPTY_EXERCISE_FORM } from './partials/ExerciseModal';

export default function Exercises({ coachType = 'coding', topicId }) {
    const [open, setOpen] = useState(false);

    return (
        <>
            <Button className="bg-alpha" onClick={() => setOpen(true)}>
                <Plus />
                <TransText en="New exercise" fr="New exercise" ar="New exercise" />
            </Button>

            <ExerciseModal
                open={open}
                onOpenChange={setOpen}
                coachType={coachType}
                topicId={topicId}
                onSubmit={(payload) => console.log('Submit exercise:', payload)}
            />
        </>
    );
}
