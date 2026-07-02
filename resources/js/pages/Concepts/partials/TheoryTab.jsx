import MarkdownEditor from '@/components/exercices/partials/MarkdownEditor';

export default function TheoryTab({ topic, onUpdateTopic }) {
    return (
        <div className="space-y-4">
            <div>
                <h3 className="text-lg font-semibold text-foreground">
                    Theory
                </h3>

                <p className="mt-1 text-sm text-muted-foreground">
                    Write the lesson explanation using Markdown.
                </p>
            </div>

            <MarkdownEditor
                value={topic?.theory || ''}
                onChange={(value) => onUpdateTopic({ theory: value })}
            />
        </div>
    );
}