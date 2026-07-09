import { useState } from 'react';
import { Archive, BadgeInfo, File, FileText, Image, Link2, Pencil, Plus, Trash2, Upload } from 'lucide-react';

function formatFileSize(bytes) {
    if (!bytes) return 'Unknown size';

    const units = ['B', 'KB', 'MB', 'GB'];
    const exponent = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
    const value = bytes / Math.pow(1024, exponent);

    return `${value.toFixed(value >= 10 || exponent === 0 ? 0 : 1)} ${units[exponent]}`;
}

function fileMeta(file) {
    return [file.type || 'File', formatFileSize(file.size)].filter(Boolean).join(' - ');
}
function resourceKey(resource) {
    return resource.id ?? resource.tempId;
}

export default function ResourcesTab({ topic, onUpdateTopic }) {
    const [mode, setMode] = useState('link');
    const [name, setName] = useState('');
    const [url, setUrl] = useState('');
    const [editingResourceKey, setEditingResourceKey] = useState(null);
    const [uploadFile, setUploadFile] = useState(null);

    const resources = topic?.resources || [];

    const iconMap = {
        pdf: <FileText className="h-4 w-4 text-error" />,
        image: <Image className="h-4 w-4 text-good" />,
        zip: <Archive className="h-4 w-4 text-alpha" />,
        doc: <FileText className="h-4 w-4 text-blue-500" />,
        file: <File className="h-4 w-4 text-muted-foreground" />,
        link: <Link2 className="h-4 w-4 text-blue-500" />,
    };

    const resetLinkForm = () => {
        setName('');
        setUrl('');
        setEditingResourceKey(null);
    };

    const saveResource = (e) => {
        e.preventDefault();

        if (!name || !url) return;

        if (editingResourceKey) {
            onUpdateTopic({
                resources: resources.map((resource) =>
                    resourceKey(resource) === editingResourceKey
                        ? {
                            ...resource,
                            type: 'link',
                            name,
                            url,
                            meta: 'External link',
                        }
                        : resource
                ),
            });
            resetLinkForm();
            return;
        }

        const newResource = {
            id: null,
            tempId: `tmp-${Date.now()}`,
            type: 'link',
            name,
            url,
            meta: 'External link',
        };

        onUpdateTopic({
            resources: [...resources, newResource],
        });

        resetLinkForm();
    };

    const addUploadResource = (file) => {
        if (!file) return;

        const newResource = {
            id: null,
            tempId: `tmp-${Date.now()}`,
            type: 'file',
            name: file.name,
            url: '',
            meta: fileMeta(file),
            file,
        };

        setUploadFile(file);
        onUpdateTopic({
            resources: [...resources, newResource],
        });
    };

    const editResource = (resource) => {
        setMode('link');
        setName(resource.name || '');
        setUrl(resource.url || '');
        setEditingResourceKey(resourceKey(resource));
    };

    const deleteResource = (resourceToDelete) => {
        const deletedKey = resourceKey(resourceToDelete);

        onUpdateTopic({
            resources: resources.filter((resource) => resourceKey(resource) !== deletedKey),
        });

        if (editingResourceKey === deletedKey) {
            resetLinkForm();
        }
    };

    return (
        <div className="space-y-5">
            <section className="overflow-hidden rounded-2xl border border-border bg-card">
                <div className="flex items-center justify-between border-b border-border p-4">
                    <div>
                        <p className="text-sm font-semibold text-card-foreground">
                            Lesson Resources
                        </p>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                            Add links or upload files for this lesson.
                        </p>
                    </div>

                    <div className="flex rounded-lg border border-border bg-muted p-1">
                        <button
                            type="button"
                            onClick={() => setMode('link')}
                            className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                                mode === 'link'
                                    ? 'bg-background text-foreground shadow-sm'
                                    : 'text-muted-foreground hover:text-foreground'
                            }`}
                        >
                            Link
                        </button>

                        <button
                            type="button"
                            onClick={() => setMode('upload')}
                            className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                                mode === 'upload'
                                    ? 'bg-background text-foreground shadow-sm'
                                    : 'text-muted-foreground hover:text-foreground'
                            }`}
                        >
                            Upload
                        </button>
                    </div>
                </div>

                <div className="p-4">
                    {mode === 'link' ? (
                        <form onSubmit={saveResource} className="space-y-3">
                            <div className="flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2">
                                <FileText className="h-4 w-4 text-muted-foreground" />
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Resource name"
                                    className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
                                />
                            </div>

                            <div className="flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2">
                                <Link2 className="h-4 w-4 text-muted-foreground" />
                                <input
                                    type="url"
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                    placeholder="https://..."
                                    className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
                                />
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    type="submit"
                                    className="flex items-center gap-2 rounded-xl bg-alpha px-4 py-2 text-sm font-semibold transition"
                                >
                                    <Plus className="h-4 w-4" />
                                    {editingResourceKey ? 'Update Resource' : 'Add Resource'}
                                </button>

                                {editingResourceKey && (
                                    <button
                                        type="button"
                                        onClick={resetLinkForm}
                                        className="rounded-xl border border-border bg-background px-4 py-2 text-sm font-semibold text-muted-foreground transition hover:text-foreground"
                                    >
                                        Cancel
                                    </button>
                                )}
                            </div>
                        </form>
                    ) : (
                        <div className="min-h-[260px] rounded-2xl border border-dashed border-border bg-muted/40 p-8 text-center">
                            <label className="flex h-full cursor-pointer flex-col items-center justify-center text-xs text-muted-foreground transition hover:text-foreground">
                                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-background">
                                    <Upload className="h-7 w-7 text-muted-foreground" />
                                </div>

                                <p className="text-sm font-semibold text-foreground">
                                    {uploadFile ? uploadFile.name : 'Choose a file or drop it here'}
                                </p>
                                <p className="mt-1 max-w-sm text-xs text-muted-foreground">
                                    PDFs, images, zip archives, docs, and files are supported.
                                </p>

                                <input
                                    type="file"
                                    accept=".pdf,image/*,.zip,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.csv,application/pdf,application/zip,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                                    className="hidden"
                                    onChange={(e) => addUploadResource(e.target.files?.[0] || null)}
                                />
                            </label>

                            {uploadFile && (
                                <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1.5 text-xs font-semibold text-muted-foreground">
                                    <BadgeInfo className="h-3.5 w-3.5" />
                                    File will upload when you save
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </section>

            {resources.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-border bg-muted/30 p-8 text-center">
                    <p className="text-sm font-medium text-foreground">
                        No resources added yet
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Add links, PDFs, or images for this topic.
                    </p>
                </div>
            ) : (
                <div className="space-y-2">
                    {resources.map((resource) => (
                        <div
                            key={resourceKey(resource)}
                            className="flex items-center justify-between rounded-xl border border-border bg-background px-4 py-3 transition hover:bg-muted/60"
                        >
                            <div className="flex min-w-0 items-center gap-3">
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-card">
                                    {iconMap[resource.type] || iconMap.file}
                                </div>

                                <div className="min-w-0">
                                    <p className="truncate text-sm font-medium text-foreground">
                                        {resource.name}
                                    </p>
                                    {resource.url ? (
                                        <div className="space-y-0.5">
                                            <p className="truncate text-xs text-muted-foreground">
                                                {resource.meta || resource.type}
                                            </p>
                                            <a
                                                href={resource.url}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="block truncate text-xs text-blue-500 transition hover:underline"
                                            >
                                                {resource.url}
                                            </a>
                                        </div>
                                    ) : (
                                        <p className="truncate text-xs text-muted-foreground">
                                            {resource.meta || resource.type}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                {resource.type === 'link' && (
                                    <button
                                        type="button"
                                        onClick={() => editResource(resource)}
                                        className="text-muted-foreground transition hover:text-foreground"
                                    >
                                        <Pencil className="h-4 w-4" />
                                    </button>
                                )}

                                <button
                                    type="button"
                                    onClick={() => deleteResource(resource)}
                                    className="text-muted-foreground transition hover:text-error"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}


