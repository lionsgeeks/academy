import { useState } from 'react';
import { FileText, Image, Link2, Plus, Trash2 } from 'lucide-react';

export default function ResourcesTab({ topic, onUpdateTopic }) {
    const [name, setName] = useState('');
    const [type, setType] = useState('pdf');
    const [url, setUrl] = useState('');

    const resources = topic?.resources || [];

    const iconMap = {
        pdf: <FileText className="h-4 w-4 text-error" />,
        image: <Image className="h-4 w-4 text-good" />,
        link: <Link2 className="h-4 w-4 text-blue-500" />,
    };

    const addResource = (e) => {
        e.preventDefault();

        if (!name || !url) return;

        const newResource = {
            id: Date.now(),
            type,
            name,
            url,
            meta:
                type === 'pdf'
                    ? 'PDF file'
                    : type === 'image'
                      ? 'Image file'
                      : 'External link',
        };

        onUpdateTopic({
            resources: [...resources, newResource],
        });

        setName('');
        setUrl('');
        setType('pdf');
    };

    const deleteResource = (id) => {
        onUpdateTopic({
            resources: resources.filter((resource) => resource.id !== id),
        });
    };

    return (
        <div className="space-y-5">
            <div>
                <h3 className="text-lg font-semibold text-foreground">
                    Resources
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                    Add PDFs, links, images or files for this topic.
                </p>
            </div>

            <form
                onSubmit={addResource}
                className="rounded-2xl border border-border bg-muted/30 p-4 space-y-3"
            >
                <div className="flex gap-2">
                    <select
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        className="rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground outline-none"
                    >
                        <option value="pdf">PDF</option>
                        <option value="link">Link</option>
                        <option value="image">Image</option>
                    </select>

                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Resource name"
                        className="flex-1 rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground"
                    />

                    <button
                        type="submit"
                        className="flex items-center gap-2 rounded-xl bg-alpha px-4 py-2 text-sm font-semibold"
                    >
                        <Plus className="h-4 w-4" />
                        Add
                    </button>
                </div>

                <input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground"
                />
            </form>

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
                            key={resource.id}
                            className="flex items-center justify-between rounded-xl border border-border bg-background px-4 py-3 transition hover:bg-muted/60"
                        >
                            <div className="flex items-center gap-3">
                                <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card">
                                    {iconMap[resource.type]}
                                </div>

                                <div>
                                    <p className="text-sm font-medium text-foreground">
                                        {resource.name}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {resource.meta}
                                    </p>
                                </div>
                            </div>

                            <button
                                onClick={() => deleteResource(resource.id)}
                                className="text-muted-foreground transition hover:text-error"
                            >
                                <Trash2 className="h-4 w-4" />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}