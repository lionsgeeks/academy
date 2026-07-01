import { Sliders } from 'lucide-react';

const inputClass =
    'w-full rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-alpha focus:ring-2 focus:ring-alpha/20';

export default function TopicSettingsTab({ topic, onUpdateTopic }) {
    return (
        <div className="space-y-5">
            <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-muted">
                    <Sliders className="h-5 w-5 text-muted-foreground" />
                </div>

                <div>
                    <h3 className="text-lg font-semibold text-foreground">
                        Settings
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Configure title, description, difficulty and publishing options.
                    </p>
                </div>
            </div>

            <div>
                <label className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Topic title
                </label>
                <input
                    type="text"
                    value={topic?.title || ''}
                    onChange={(e) => onUpdateTopic({ title: e.target.value })}
                    placeholder="e.g. While Loop"
                    className={inputClass}
                />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                    <label className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                        Difficulty
                    </label>
                    <select
                        className={inputClass}
                        value={topic?.difficulty || 'easy'}
                        onChange={(e) => onUpdateTopic({ difficulty: e.target.value })}
                    >
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                    </select>
                </div>

                <div>
                    <label className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                        Status
                    </label>
                    <select
                        className={inputClass}
                        value={topic?.status || 'draft'}
                        onChange={(e) => onUpdateTopic({ status: e.target.value })}
                    >
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                    </select>
                </div>
            </div>

            <div>
                <label className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Topic description
                </label>
                <textarea
                    rows={5}
                    value={topic?.description || ''}
                    onChange={(e) => onUpdateTopic({ description: e.target.value })}
                    placeholder="Write topic description..."
                    className={`${inputClass} resize-none`}
                />
            </div>
        </div>
    );
}