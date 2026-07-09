import { Plus, Save, X } from 'lucide-react';
import { TransText } from '@/components/TransText';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    DESC_MAX,
    EMOJI_MAX,
    NAME_MAX,
    TYPE_MAX,
    isNearLimit,
} from './conceptHelpers';

export default function ConceptModal({
    course,
    open,
    onOpenChange,
    form,
    setForm,
    onSubmit,
    isEditing = false,
}) {

    const update = (field) => (e) =>
        setForm((prev) => ({ ...prev, [field]: e.target.value }));

    const isOverLimit =
        form.title.length > NAME_MAX ||
        form.emoji.length > EMOJI_MAX ||
        form.description.length > DESC_MAX ||
        form.type.length > TYPE_MAX;

    const isDisabled = !form.title.trim() || isOverLimit;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>
                        {isEditing ? (
                            <TransText
                                en="Edit Concept"
                                fr="Edit Concept"
                                ar="Edit Concept"
                            />
                        ) : (
                            <TransText
                                en="Add Concept"
                                fr="Add Concept"
                                ar="Add Concept"
                            />
                        )}
                    </DialogTitle>
                    <DialogDescription>
                        {isEditing ? (
                            <TransText
                                en="Update this concept's details."
                                fr="Update this concept's details."
                                ar="Update this concept's details."
                            />
                        ) : (
                            <TransText
                                en="Add a new concept to this course roadmap."
                                fr="Add a new concept to this course roadmap."
                                ar="Add a new concept to this course roadmap."
                            />
                        )}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={onSubmit} className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
                        <Field
                            label={
                                <TransText en="Name" fr="Name" ar="Name" />
                            }
                            counter={
                                <CharCounter
                                    current={form.title.length}
                                    max={NAME_MAX}
                                />
                            }
                        >
                            <Input
                                value={form.title}
                                name="title"
                                onChange={update('title')}
                                placeholder="e.g. Introduction to JavaScript"
                                required
                            />
                        </Field>

                        <Field
                            label={
                                <TransText en="Emoji" fr="Emoji" ar="Emoji" />
                            }
                            counter={
                                <CharCounter
                                    current={form.emoji.length}
                                    max={EMOJI_MAX}
                                />
                            }
                        >
                            <Input
                                value={form.emoji}
                                onChange={update('emoji')}
                                placeholder="🚀"
                                className="w-20 text-center text-lg"
                            />
                        </Field>
                    </div>

                    <Field
                        label={
                            <TransText
                                en="Description"
                                fr="Description"
                                ar="Description"
                            />
                        }
                        counter={
                            <CharCounter
                                current={form.description.length}
                                max={DESC_MAX}
                            />
                        }
                    >
                        <textarea
                            value={form.description}
                            onChange={update('description')}
                            placeholder="What this concept covers and what learners will understand."
                            className="min-h-28 w-full resize-none rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                        />
                    </Field>

                    <Field
                        label={
                            <TransText en="Type" fr="Type" ar="Type" />
                        }
                        counter={
                            <CharCounter
                                current={form.type.length}
                                max={TYPE_MAX}
                            />
                        }
                    >
                        <Input
                            value={form.type}
                            onChange={update('type')}
                            placeholder="e.g. theory, practice, project"
                        />
                    </Field>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                        >
                            <X />
                            <TransText en="Cancel" fr="Cancel" ar="Cancel" />
                        </Button>
                        <Button
                            type="submit"
                            disabled={isDisabled}
                            className="bg-alpha"
                        >
                            {isEditing ? <Save /> : <Plus />}
                            {isEditing ? (
                                <TransText
                                    en="Save Changes"
                                    fr="Save Changes"
                                    ar="Save Changes"
                                />
                            ) : (
                                <TransText
                                    en="Create Concept"
                                    fr="Create Concept"
                                    ar="Create Concept"
                                />
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

function CharCounter({ current, max }) {
    const atLimit = current >= max;
    const near = !atLimit && isNearLimit(current, max);

    return (
        <span
            className={`text-xs tabular-nums ${
                atLimit
                    ? 'text-error'
                    : near
                      ? 'text-amber-500'
                      : 'text-muted-foreground'
            }`}
        >
            {current}/{max}
        </span>
    );
}

function Field({ label, counter, children }) {
    return (
        <div className="space-y-2">
            <div className="flex items-baseline justify-between gap-2">
                <Label>{label}</Label>
                {counter}
            </div>
            {children}
        </div>
    );
}
