import { Flame, Hash, Leaf, Star, Zap } from 'lucide-react';
import { TransText } from '@/components/TransText';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import ExerciseField from './ExerciseField';
import RulesJsonEditor from './RulesJsonEditor';

const inputClass =
    'h-10 border-beta/15 text-beta focus-visible:border-beta/60 focus-visible:ring-beta/20 dark:border-light/15 dark:text-light dark:focus-visible:border-alpha/60 dark:focus-visible:ring-alpha/20';

const DIFFICULTIES = [
    {
        value: 'beginner',
        icon: Leaf,
        label: <TransText en="Beginner" fr="Beginner" ar="Beginner" />,
        description: <TransText en="Guided tasks, clear steps" fr="Guided tasks, clear steps" ar="Guided tasks, clear steps" />,
        activeClass: 'border-good/60 bg-good/8 text-good dark:border-good/50 dark:bg-good/10',
        iconClass: 'text-good',
    },
    {
        value: 'intermediate',
        icon: Flame,
        label: <TransText en="Intermediate" fr="Intermediate" ar="Intermediate" />,
        description: <TransText en="Requires prior knowledge" fr="Requires prior knowledge" ar="Requires prior knowledge" />,
        activeClass: 'border-beta bg-beta/8 text-beta dark:border-alpha/60 dark:bg-alpha/10 dark:text-alpha',
        iconClass: 'text-beta dark:text-alpha',
    },
    {
        value: 'advanced',
        icon: Zap,
        label: <TransText en="Advanced" fr="Advanced" ar="Advanced" />,
        description: <TransText en="Complex, open-ended challenge" fr="Complex, open-ended challenge" ar="Complex, open-ended challenge" />,
        activeClass: 'border-error/60 bg-error/8 text-error dark:border-error/50 dark:bg-error/10',
        iconClass: 'text-error',
    },
];

export default function StepSettings({ data, errors, onChange }) {
    return (
        <div className="space-y-8">
            {/* Difficulty cards */}
            <div className="space-y-2">
                <div className="flex items-center gap-2">
                    <Flame className="size-3.5 text-beta/50 dark:text-light/50" />
                    <span className="text-sm font-medium text-beta dark:text-light">
                        <TransText en="Difficulty" fr="Difficulty" ar="Difficulty" />
                    </span>
                </div>
                <div className="grid gap-3 sm:grid-cols-3">
                    {DIFFICULTIES.map((item) => {
                        const Icon = item.icon;
                        const isActive = data.difficulty === item.value;
                        return (
                            <button
                                key={item.value}
                                type="button"
                                onClick={() => onChange('difficulty', item.value)}
                                className={cn(
                                    'relative flex flex-col items-start gap-1.5 rounded-xl border-2 p-4 text-left transition-all duration-150',
                                    isActive
                                        ? item.activeClass
                                        : 'border-beta/10 hover:border-beta/25 dark:border-light/10 dark:hover:border-light/25',
                                )}
                            >
                                <Icon
                                    className={cn(
                                        'size-5 transition-colors',
                                        isActive ? item.iconClass : 'text-beta/30 dark:text-light/30',
                                    )}
                                />
                                <span
                                    className={cn(
                                        'text-sm font-semibold',
                                        isActive ? '' : 'text-beta/70 dark:text-light/70',
                                    )}
                                >
                                    {item.label}
                                </span>
                                <span
                                    className={cn(
                                        'text-xs leading-snug',
                                        isActive ? 'opacity-80' : 'text-beta/40 dark:text-light/40',
                                    )}
                                >
                                    {item.description}
                                </span>
                            </button>
                        );
                    })}
                </div>
                {errors.difficulty && (
                    <p className="text-sm text-error">{errors.difficulty}</p>
                )}
            </div>

            {/* XP + Order */}
            <div className="grid gap-4 sm:grid-cols-2">
                <ExerciseField
                    id="xp_reward"
                    label={
                        <span className="flex items-center gap-1.5">
                            <Star className="size-3.5 text-beta/50 dark:text-alpha" />
                            <TransText en="XP reward" fr="XP reward" ar="XP reward" />
                        </span>
                    }
                    error={errors.xp_reward}
                >
                    <Input
                        id="xp_reward"
                        type="number"
                        min={0}
                        step={10}
                        value={data.xp_reward}
                        onChange={(e) =>
                            onChange('xp_reward', Number(e.target.value))
                        }
                        className={inputClass}
                    />
                </ExerciseField>

                <ExerciseField
                    id="order_index"
                    label={
                        <span className="flex items-center gap-1.5">
                            <Hash className="size-3.5 text-beta/50 dark:text-light/50" />
                            <TransText en="Order index" fr="Order index" ar="Order index" />
                        </span>
                    }
                    error={errors.order_index}
                >
                    <Input
                        id="order_index"
                        type="number"
                        min={1}
                        value={data.order_index}
                        onChange={(e) =>
                            onChange('order_index', Number(e.target.value))
                        }
                        className={inputClass}
                    />
                </ExerciseField>
            </div>

            {/* Rules */}
            <RulesJsonEditor data={data} errors={errors} onChange={onChange} />
        </div>
    );
}
