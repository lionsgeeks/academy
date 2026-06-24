import InputError from '@/components/input-error';
import { Label } from '@/components/ui/label';

export default function ExerciseField({ id, label, error, children }) {
    return (
        <div className="space-y-2">
            <Label htmlFor={id} className="text-beta dark:text-light">
                {label}
            </Label>
            {children}
            <InputError message={error} />
        </div>
    );
}
