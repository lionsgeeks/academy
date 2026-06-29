import {
    Braces,
    Flame,
    Github,
    Globe2,
    Hash,
    Leaf,
    Rocket,
    Star,
    Users,
    Zap,
} from 'lucide-react';
import { TransText } from '@/components/TransText';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import ExerciseField from './ExerciseField';
import RulesJsonEditor from './RulesJsonEditor';

const inputClass =
    'h-10 border-beta/15 text-beta focus-visible:border-beta/60 focus-visible:ring-beta/20 dark:border-light/15 dark:text-light dark:focus-visible:border-alpha/60 dark:focus-visible:ring-alpha/20';

const DIFFICULTIES = [
    {
        value: 'beginner',
        icon: Leaf,
        label: <TransText en="Beginner" fr="Débutant" ar="مبتدئ" />,
        description: (
            <TransText
                en="Guided tasks, clear steps"
                fr="Tâches guidées, étapes claires"
                ar="مهام موجهة وخطوات واضحة"
            />
        ),
        activeClass: 'border-good/60 bg-good/8 text-good dark:border-good/50 dark:bg-good/10',
        iconClass: 'text-good',
    },
    {
        value: 'intermediate',
        icon: Flame,
        label: <TransText en="Intermediate" fr="Intermédiaire" ar="متوسط" />,
        description: (
            <TransText
                en="Requires prior knowledge"
                fr="Nécessite des connaissances préalables"
                ar="يتطلب معرفة مسبقة"
            />
        ),
        activeClass: 'border-beta bg-beta/8 text-beta dark:border-alpha/60 dark:bg-alpha/10 dark:text-alpha',
        iconClass: 'text-beta dark:text-alpha',
    },
    {
        value: 'advanced',
        icon: Zap,
        label: <TransText en="Advanced" fr="Avancé" ar="متقدم" />,
        description: (
            <TransText
                en="Complex, open-ended challenge"
                fr="Défi complexe et ouvert"
                ar="تحدٍ معقد ومفتوح"
            />
        ),
        activeClass: 'border-error/60 bg-error/8 text-error dark:border-error/50 dark:bg-error/10',
        iconClass: 'text-error',
    },
];

const ENGINE_OPTIONS = [
    {
        value: 'browser',
        icon: Globe2,
        label: (
            <TransText
                en="Browser validation"
                fr="Validation navigateur"
                ar="التحقق في المتصفح"
            />
        ),
    },
    {
        value: 'github_actions',
        icon: Github,
        label: (
            <TransText
                en="GitHub Actions"
                fr="GitHub Actions"
                ar="GitHub Actions"
            />
        ),
    },
];

const EXERCISE_TYPES = {
    browser: [
        {
            value: 'html',
            label: 'HTML',
        },
        {
            value: 'css',
            label: 'CSS',
        },
        {
            value: 'javascript',
            label: 'JavaScript',
        },
        {
            value: 'html_css_javascript',
            label: 'HTML + CSS + JavaScript',
        },
    ],
    github_actions: [
        {
            value: 'laravel',
            label: 'Laravel',
        },
        {
            value: 'react',
            label: 'React',
        },
    ],
};

export default function StepSettings({
    data,
    errors,
    onChange,
    publishableClasses = [],
}) {
    const engine = data.correction_engine || 'browser';
    const availableTypes = EXERCISE_TYPES[engine] ?? [];
    const selectedClassIds = data.class_ids ?? [];

    const classLabel = (classItem) => {
        const formattedType = classItem.type
            ? `${classItem.type.charAt(0).toUpperCase()}${classItem.type.slice(1)}`
            : 'Class';

        return `Promo ${classItem.promo} · ${formattedType} ${classItem.class}`;
    };

    const toggleClass = (classId) => {
        const normalizedId = Number(classId);

        const nextClassIds = selectedClassIds.includes(normalizedId)
            ? selectedClassIds.filter((id) => id !== normalizedId)
            : [...selectedClassIds, normalizedId];

        onChange('class_ids', nextClassIds);
    };

    const changeEngine = (nextEngine) => {
        const nextTypes = EXERCISE_TYPES[nextEngine] ?? [];

        onChange('correction_engine', nextEngine);
        onChange('exercise_type', nextTypes[0]?.value ?? '');
    };

    return (
        <div className="space-y-8">
            {errors.submission && (
                <div className="rounded-lg border border-error/30 bg-error/10 px-4 py-3 text-sm text-error">
                    {errors.submission}
                </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
                <ExerciseField
                    id="correction_engine"
                    label={
                        <span className="flex items-center gap-1.5">
                            <Rocket className="size-3.5 text-beta/50 dark:text-light/50" />
                            <TransText
                                en="Correction method"
                                fr="Méthode de correction"
                                ar="طريقة التصحيح"
                            />
                        </span>
                    }
                    error={errors.correction_engine}
                >
                    <Select
                        value={engine}
                        onValueChange={changeEngine}
                    >
                        <SelectTrigger className={cn(inputClass, 'w-full')}>
                            <SelectValue />
                        </SelectTrigger>

                        <SelectContent>
                            {ENGINE_OPTIONS.map((option) => {
                                const Icon = option.icon;

                                return (
                                    <SelectItem
                                        key={option.value}
                                        value={option.value}
                                    >
                                        <span className="flex items-center gap-2">
                                            <Icon className="size-3.5 text-alpha" />
                                            {option.label}
                                        </span>
                                    </SelectItem>
                                );
                            })}
                        </SelectContent>
                    </Select>
                </ExerciseField>

                <ExerciseField
                    id="exercise_type"
                    label={
                        <span className="flex items-center gap-1.5">
                            <Braces className="size-3.5 text-beta/50 dark:text-light/50" />
                            <TransText
                                en="Exercise type"
                                fr="Type d'exercice"
                                ar="نوع التمرين"
                            />
                        </span>
                    }
                    error={errors.exercise_type}
                >
                    <Select
                        value={data.exercise_type}
                        onValueChange={(value) =>
                            onChange('exercise_type', value)
                        }
                    >
                        <SelectTrigger className={cn(inputClass, 'w-full')}>
                            <SelectValue />
                        </SelectTrigger>

                        <SelectContent>
                            {availableTypes.map((type) => (
                                <SelectItem
                                    key={type.value}
                                    value={type.value}
                                >
                                    {type.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </ExerciseField>
            </div>

            <div className="space-y-2">
                <div className="flex items-center gap-2">
                    <Flame className="size-3.5 text-beta/50 dark:text-light/50" />
                    <span className="text-sm font-medium text-beta dark:text-light">
                        <TransText
                            en="Difficulty"
                            fr="Difficulté"
                            ar="الصعوبة"
                        />
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
                                        isActive
                                            ? item.iconClass
                                            : 'text-beta/30 dark:text-light/30',
                                    )}
                                />

                                <span
                                    className={cn(
                                        'text-sm font-semibold',
                                        isActive
                                            ? ''
                                            : 'text-beta/70 dark:text-light/70',
                                    )}
                                >
                                    {item.label}
                                </span>

                                <span
                                    className={cn(
                                        'text-xs leading-snug',
                                        isActive
                                            ? 'opacity-80'
                                            : 'text-beta/40 dark:text-light/40',
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

            <div className="grid gap-4 sm:grid-cols-2">
                <ExerciseField
                    id="xp_reward"
                    label={
                        <span className="flex items-center gap-1.5">
                            <Star className="size-3.5 text-beta/50 dark:text-alpha" />
                            <TransText
                                en="XP reward"
                                fr="Récompense XP"
                                ar="مكافأة XP"
                            />
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
                        onChange={(event) =>
                            onChange('xp_reward', Number(event.target.value))
                        }
                        className={inputClass}
                    />
                </ExerciseField>

                <ExerciseField
                    id="order_index"
                    label={
                        <span className="flex items-center gap-1.5">
                            <Hash className="size-3.5 text-beta/50 dark:text-light/50" />
                            <TransText
                                en="Order index"
                                fr="Ordre"
                                ar="ترتيب التمرين"
                            />
                        </span>
                    }
                    error={errors.order_index}
                >
                    <Input
                        id="order_index"
                        type="number"
                        min={1}
                        value={data.order_index}
                        onChange={(event) =>
                            onChange('order_index', Number(event.target.value))
                        }
                        className={inputClass}
                    />
                </ExerciseField>
            </div>

            <ExerciseField
                id="status"
                label={
                    <span className="flex items-center gap-1.5">
                        <Rocket className="size-3.5 text-beta/50 dark:text-light/50" />
                        <TransText
                            en="Exercise status"
                            fr="Statut de l'exercice"
                            ar="حالة التمرين"
                        />
                    </span>
                }
                error={errors.status}
            >
                <Select
                    value={data.status}
                    onValueChange={(value) => onChange('status', value)}
                >
                    <SelectTrigger className={cn(inputClass, 'w-full')}>
                        <SelectValue />
                    </SelectTrigger>

                    <SelectContent>
                        <SelectItem value="draft">
                            <TransText
                                en="Draft"
                                fr="Brouillon"
                                ar="مسودة"
                            />
                        </SelectItem>

                        <SelectItem value="published">
                            <TransText
                                en="Publish now"
                                fr="Publier maintenant"
                                ar="نشر الآن"
                            />
                        </SelectItem>
                    </SelectContent>
                </Select>
            </ExerciseField>

            {data.status === 'published' && (
                <div className="space-y-3 rounded-xl border border-alpha/25 bg-alpha/5 p-4">
                    <div className="flex items-start gap-2">
                        <Users className="mt-0.5 size-4 text-alpha" />

                        <div>
                            <p className="text-sm font-medium text-beta dark:text-light">
                                <TransText
                                    en="Publish to current classes"
                                    fr="Publier pour les classes actuelles"
                                    ar="النشر للأقسام الحالية"
                                />
                            </p>

                            <p className="mt-0.5 text-xs leading-5 text-beta/55 dark:text-light/55">
                                <TransText
                                    en="Only eligible classes are shown. Finished classes and classes that have not started are excluded."
                                    fr="Seules les classes éligibles sont affichées. Les classes terminées et celles qui n'ont pas commencé sont exclues."
                                    ar="تظهر فقط الأقسام المؤهلة. يتم استبعاد الأقسام المنتهية والأقسام التي لم تبدأ بعد."
                                />
                            </p>
                        </div>
                    </div>

                    {publishableClasses.length === 0 ? (
                        <p className="rounded-lg border border-dashed border-beta/20 px-3 py-3 text-sm text-beta/55 dark:border-light/20 dark:text-light/55">
                            <TransText
                                en="No current class is available. Save this exercise as a draft."
                                fr="Aucune classe actuelle n'est disponible. Enregistrez cet exercice comme brouillon."
                                ar="لا يوجد قسم حالي متاح. احفظ هذا التمرين كمسودة."
                            />
                        </p>
                    ) : (
                        <div className="space-y-2">
                            {publishableClasses.map((classItem) => {
                                const checked = selectedClassIds.includes(
                                    Number(classItem.id),
                                );

                                return (
                                    <label
                                        key={classItem.id}
                                        className={cn(
                                            'flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-3 transition-colors',
                                            checked
                                                ? 'border-alpha/50 bg-alpha/10'
                                                : 'border-beta/10 hover:border-beta/25 dark:border-light/10 dark:hover:border-light/25',
                                        )}
                                    >
                                        <Checkbox
                                            checked={checked}
                                            onCheckedChange={() =>
                                                toggleClass(classItem.id)
                                            }
                                            className="data-[state=checked]:border-alpha data-[state=checked]:bg-alpha data-[state=checked]:text-beta"
                                        />

                                        <span className="min-w-0">
                                            <span className="block text-sm font-medium text-beta dark:text-light">
                                                {classLabel(classItem)}
                                            </span>

                                            <span className="block text-xs text-beta/45 dark:text-light/45">
                                                <TransText
                                                    en="Exact class target"
                                                    fr="Classe ciblée"
                                                    ar="قسم مستهدف"
                                                />
                                            </span>
                                        </span>
                                    </label>
                                );
                            })}
                        </div>
                    )}

                    {errors.class_ids && (
                        <p className="text-sm text-error">{errors.class_ids}</p>
                    )}
                </div>
            )}

            {engine === 'browser' ? (
                <RulesJsonEditor
                    data={data}
                    errors={{
                        ...errors,
                        rules: errors.correction_rules ?? errors.rules,
                    }}
                    onChange={onChange}
                />
            ) : (
                <div className="rounded-xl border border-beta/10 bg-beta/5 px-4 py-3 text-sm text-beta/60 dark:border-light/10 dark:bg-light/5 dark:text-light/60">
                    <div className="flex items-center gap-2 font-medium text-beta dark:text-light">
                        <Github className="size-4 text-alpha" />
                        <TransText
                            en="GitHub Actions correction"
                            fr="Correction GitHub Actions"
                            ar="تصحيح GitHub Actions"
                        />
                    </div>

                    <p className="mt-1 text-xs leading-5">
                        <TransText
                            en="Browser JSON rules are not required for this exercise type. Repository and workflow configuration will be added in the GitHub Actions task."
                            fr="Les règles JSON du navigateur ne sont pas requises pour ce type d'exercice. La configuration du dépôt et du workflow sera ajoutée dans la tâche GitHub Actions."
                            ar="قواعد JSON الخاصة بالمتصفح ليست مطلوبة لهذا النوع. سيتم إضافة إعدادات المستودع وWorkflow في مهمة GitHub Actions."
                        />
                    </p>
                </div>
            )}
        </div>
    );
}