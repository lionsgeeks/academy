import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Code2, Github, Send } from 'lucide-react';
import { requiredLanguagesFor } from './exerciseLabHelpers';

const languageLabels = {
    html: 'HTML',
    css: 'CSS',
    javascript: 'JavaScript',
};

export default function SubmissionForm({
    selectedExercise,
    browserSource,
    githubSource,
    errors,
    submitting,
    onBrowserSourceChange,
    onGithubSourceChange,
    onSubmit,
}) {
    if (!selectedExercise) {
        return (
            <div className="p-6">
                <div className="py-10">
                    <p className="text-sm text-muted-foreground">
                        Select an exercise to start coding.
                    </p>
                </div>
            </div>
        );
    }

    const isBrowser = selectedExercise.correction_engine === 'browser';
    const requiredLanguages = requiredLanguagesFor(selectedExercise);

    return (
        <section className="flex h-full min-h-[42rem] flex-col bg-slate-950 text-slate-100">
            <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900/90 px-4 py-3">
                <div className="flex items-center gap-2 text-sm font-medium">
                    {isBrowser ? (
                        <Code2 className="size-4 text-emerald-400" />
                    ) : (
                        <Github className="size-4 text-slate-300" />
                    )}
                    {isBrowser ? 'Code' : 'GitHub submission'}
                </div>
                <span className="rounded-md border border-slate-700 bg-slate-800 px-2 py-1 text-xs text-slate-300">
                    {isBrowser ? 'Browser workspace' : 'Repository workspace'}
                </span>
            </div>

            <form className="flex flex-1 flex-col" onSubmit={onSubmit}>
                {isBrowser ? (
                    <div className="grid flex-1 divide-y divide-slate-800">
                        {requiredLanguages.map((language) => (
                            <label
                                key={language}
                                className="grid min-h-60 grid-rows-[auto_1fr]"
                            >
                                <span className="border-b border-slate-800 bg-slate-900/60 px-4 py-2 text-xs font-medium text-slate-300">
                                    {languageLabels[language]}
                                </span>
                                <textarea
                                    value={browserSource[language] ?? ''}
                                    onChange={(event) =>
                                        onBrowserSourceChange(
                                            language,
                                            event.target.value,
                                        )
                                    }
                                    spellCheck="false"
                                    placeholder={`Write your ${languageLabels[language]} solution here...`}
                                    className="min-h-52 w-full resize-y bg-slate-950 px-4 py-3 font-mono text-sm leading-6 text-slate-100 outline-none placeholder:text-slate-600 focus:bg-slate-900/40"
                                />
                                {errors[`source_code.${language}`] ? (
                                    <span className="border-t border-red-900/70 bg-red-950/40 px-4 py-2 text-xs text-red-300">
                                        {errors[`source_code.${language}`][0]}
                                    </span>
                                ) : null}
                            </label>
                        ))}
                    </div>
                ) : (
                    <div className="grid flex-1 content-start gap-5 p-5">
                        <p className="text-sm leading-6 text-slate-400">
                            Submit the repository containing your solution for
                            automated correction.
                        </p>
                        <label className="grid gap-2">
                            <span className="text-sm font-medium text-slate-200">
                                Repository URL
                            </span>
                            <Input
                                type="url"
                                value={githubSource.repository_url}
                                placeholder="https://github.com/student/project"
                                onChange={(event) =>
                                    onGithubSourceChange(
                                        'repository_url',
                                        event.target.value,
                                    )
                                }
                                className="border-slate-700 bg-slate-900 text-slate-100 placeholder:text-slate-500"
                            />
                            {errors.repository_url ? (
                                <span className="text-xs text-red-300">
                                    {errors.repository_url[0]}
                                </span>
                            ) : null}
                        </label>
                        <label className="grid gap-2">
                            <span className="text-sm font-medium text-slate-200">
                                Branch
                            </span>
                            <Input
                                value={githubSource.branch}
                                placeholder="main"
                                onChange={(event) =>
                                    onGithubSourceChange(
                                        'branch',
                                        event.target.value,
                                    )
                                }
                                className="border-slate-700 bg-slate-900 text-slate-100 placeholder:text-slate-500"
                            />
                            {errors.branch ? (
                                <span className="text-xs text-red-300">
                                    {errors.branch[0]}
                                </span>
                            ) : null}
                        </label>
                        <label className="grid gap-2">
                            <span className="text-sm font-medium text-slate-200">
                                Commit SHA{' '}
                                <span className="text-slate-500">
                                    (optional)
                                </span>
                            </span>
                            <Input
                                value={githubSource.commit_sha}
                                placeholder="Optional"
                                onChange={(event) =>
                                    onGithubSourceChange(
                                        'commit_sha',
                                        event.target.value,
                                    )
                                }
                                className="border-slate-700 bg-slate-900 text-slate-100 placeholder:text-slate-500"
                            />
                        </label>
                    </div>
                )}

                <div className="border-t border-slate-800 bg-slate-900 px-4 py-3">
                    {errors.source ? (
                        <p className="mb-3 text-sm text-red-300">
                            {errors.source[0]}
                        </p>
                    ) : null}
                    <div className="flex items-center justify-end">
                        <Button
                            type="submit"
                            disabled={submitting}
                            className="bg-emerald-600 text-white hover:bg-emerald-500"
                        >
                            <Send className="size-4" />
                            {submitting ? 'Submitting...' : 'Submit'}
                        </Button>
                    </div>
                </div>
            </form>
        </section>
    );
}
