export const emptyBrowserSource = {
    html: '',
    css: '',
    javascript: '',
};

export const emptyGithubSource = {
    repository_url: '',
    branch: '',
    commit_sha: '',
};

export const engineLabels = {
    browser: 'Browser',
    github_actions: 'GitHub Actions',
};

export const statusStyles = {
    completed: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    failed: 'border-red-200 bg-red-50 text-red-700',
    pending: 'border-slate-200 bg-slate-50 text-slate-700',
    processing: 'border-amber-200 bg-amber-50 text-amber-700',
};

export const formatScore = (attempt) => {
    if (attempt?.score === null || attempt?.score === undefined) {
        return 'No score yet';
    }

    return `${attempt.score}%`;
};

export const requiredLanguagesFor = (exercise) => {
    switch (exercise?.exercise_type) {
        case 'html':
            return ['html'];
        case 'css':
            return ['css'];
        case 'javascript':
            return ['javascript'];
        case 'html_css_javascript':
            return ['html', 'css', 'javascript'];
        default:
            return ['html', 'css', 'javascript'];
    }
};

export const parseJsonResponse = async (response) => {
    const text = await response.text();

    if (!text) {
        return {};
    }

    try {
        return JSON.parse(text);
    } catch {
        return { message: text };
    }
};
