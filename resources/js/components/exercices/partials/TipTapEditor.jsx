import { useEffect, useRef } from 'react';
import Bold from '@tiptap/extension-bold';
import Document from '@tiptap/extension-document';
import Gapcursor from '@tiptap/extension-gapcursor';
import Heading from '@tiptap/extension-heading';
import History from '@tiptap/extension-history';
import Italic from '@tiptap/extension-italic';
import { ListKit } from '@tiptap/extension-list/kit';
import Paragraph from '@tiptap/extension-paragraph';
import Placeholder from '@tiptap/extension-placeholder';
import Text from '@tiptap/extension-text';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import { EditorContent, useEditor } from '@tiptap/react';
import {
    AlignCenter,
    AlignLeft,
    AlignRight,
    Bold as BoldIcon,
    Heading2,
    Heading3,
    Italic as ItalicIcon,
    List,
    ListOrdered,
    Underline as UnderlineIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Toggle } from '@/components/ui/toggle';
import { cn } from '@/lib/utils';

const editorProps = {
    attributes: {
        class: cn(
            'min-h-[320px] max-w-none px-3 py-2 outline-none',
            'text-beta dark:text-light',
            'focus-visible:outline-none',
        ),
    },
};

const extensions = [
    Document,
    Paragraph,
    Text,
    Bold,
    Italic,
    Underline,
    Heading.configure({ levels: [2, 3] }),
    ListKit.configure({
        bulletList: {},
        orderedList: {},
        listItem: {},
        listKeymap: {},
        taskItem: false,
        taskList: false,
    }),
    History,
    Gapcursor,
    TextAlign.configure({ types: ['heading', 'paragraph'] }),
    Placeholder.configure({
        placeholder: 'Describe the exercise instructions…',
    }),
];

function stopToolbarFromStealingFocus(event) {
    if (event.button !== 0) return;
    event.preventDefault();
}

export default function TipTapEditor({ value, onChange, error }) {
    const skipExternalContentSync = useRef(false);
    const initialHtmlRef = useRef(value ?? '');

    const editor = useEditor(
        {
            extensions,
            shouldRerenderOnTransaction: true,
            editorProps,
            onCreate: ({ editor: ed }) => {
                const html = initialHtmlRef.current;
                if (html) {
                    ed.commands.setContent(html, { emitUpdate: false });
                }
            },
            onUpdate: ({ editor: ed }) => {
                skipExternalContentSync.current = true;
                onChange(ed.getHTML());
            },
        },
        [],
    );

    useEffect(() => {
        initialHtmlRef.current = value ?? '';
    }, [value]);

    useEffect(() => {
        if (!editor || editor.isDestroyed) return;
        if (skipExternalContentSync.current) {
            skipExternalContentSync.current = false;
            return;
        }
        const incoming = value || '';
        const current = editor.getHTML();
        if (incoming === current) return;
        editor.commands.setContent(incoming, { emitUpdate: false });
    }, [value, editor]);

    return (
        <div className="space-y-2">
            <div
                className={cn(
                    'rounded-md border border-beta/15 bg-light dark:border-light/15 dark:bg-dark_gray',
                    error && 'border-error',
                )}
            >
                {editor ? (
                    <div className="flex flex-col gap-2 p-2">
                        <div
                            className="flex flex-wrap gap-1 border-b border-beta/15 pb-2 dark:border-light/10"
                            onMouseDown={stopToolbarFromStealingFocus}
                            onPointerDownCapture={stopToolbarFromStealingFocus}
                            role="toolbar"
                            aria-label="Formatting"
                        >
                            <Toggle
                                size="sm"
                                variant="outline"
                                pressed={editor.isActive('bold')}
                                onPressedChange={() =>
                                    editor.chain().focus().toggleBold().run()
                                }
                                aria-label="Bold"
                            >
                                <BoldIcon className="size-4" />
                            </Toggle>
                            <Toggle
                                size="sm"
                                variant="outline"
                                pressed={editor.isActive('italic')}
                                onPressedChange={() =>
                                    editor.chain().focus().toggleItalic().run()
                                }
                                aria-label="Italic"
                            >
                                <ItalicIcon className="size-4" />
                            </Toggle>
                            <Toggle
                                size="sm"
                                variant="outline"
                                pressed={editor.isActive('underline')}
                                onPressedChange={() =>
                                    editor.chain().focus().toggleUnderline().run()
                                }
                                aria-label="Underline"
                            >
                                <UnderlineIcon className="size-4" />
                            </Toggle>
                            <span
                                className="mx-1 hidden h-6 w-px bg-beta/20 sm:inline dark:bg-light/20"
                                aria-hidden
                            />
                            <Toggle
                                size="sm"
                                variant="outline"
                                pressed={editor.isActive('heading', { level: 2 })}
                                onPressedChange={() =>
                                    editor.chain().focus().toggleHeading({ level: 2 }).run()
                                }
                                aria-label="Heading 2"
                            >
                                <Heading2 className="size-4" />
                            </Toggle>
                            <Toggle
                                size="sm"
                                variant="outline"
                                pressed={editor.isActive('heading', { level: 3 })}
                                onPressedChange={() =>
                                    editor.chain().focus().toggleHeading({ level: 3 }).run()
                                }
                                aria-label="Heading 3"
                            >
                                <Heading3 className="size-4" />
                            </Toggle>
                            <span
                                className="mx-1 hidden h-6 w-px bg-beta/20 sm:inline dark:bg-light/20"
                                aria-hidden
                            />
                            <Button
                                type="button"
                                size="sm"
                                variant={
                                    editor.isActive('bulletList') ? 'secondary' : 'outline'
                                }
                                className="h-8 px-2"
                                onMouseDown={stopToolbarFromStealingFocus}
                                onPointerDownCapture={stopToolbarFromStealingFocus}
                                onClick={() =>
                                    editor.chain().focus().toggleBulletList().run()
                                }
                                aria-label="Bullet list"
                            >
                                <List className="size-4" />
                            </Button>
                            <Button
                                type="button"
                                size="sm"
                                variant={
                                    editor.isActive('orderedList') ? 'secondary' : 'outline'
                                }
                                className="h-8 px-2"
                                onMouseDown={stopToolbarFromStealingFocus}
                                onPointerDownCapture={stopToolbarFromStealingFocus}
                                onClick={() =>
                                    editor.chain().focus().toggleOrderedList().run()
                                }
                                aria-label="Numbered list"
                            >
                                <ListOrdered className="size-4" />
                            </Button>
                            <span
                                className="mx-1 hidden h-6 w-px bg-beta/20 sm:inline dark:bg-light/20"
                                aria-hidden
                            />
                            <Button
                                type="button"
                                size="sm"
                                variant={
                                    editor.isActive({ textAlign: 'left' })
                                        ? 'secondary'
                                        : 'outline'
                                }
                                className="h-8 px-2"
                                onMouseDown={stopToolbarFromStealingFocus}
                                onPointerDownCapture={stopToolbarFromStealingFocus}
                                onClick={() =>
                                    editor.chain().focus().setTextAlign('left').run()
                                }
                                aria-label="Align left"
                            >
                                <AlignLeft className="size-4" />
                            </Button>
                            <Button
                                type="button"
                                size="sm"
                                variant={
                                    editor.isActive({ textAlign: 'center' })
                                        ? 'secondary'
                                        : 'outline'
                                }
                                className="h-8 px-2"
                                onMouseDown={stopToolbarFromStealingFocus}
                                onPointerDownCapture={stopToolbarFromStealingFocus}
                                onClick={() =>
                                    editor.chain().focus().setTextAlign('center').run()
                                }
                                aria-label="Align center"
                            >
                                <AlignCenter className="size-4" />
                            </Button>
                            <Button
                                type="button"
                                size="sm"
                                variant={
                                    editor.isActive({ textAlign: 'right' })
                                        ? 'secondary'
                                        : 'outline'
                                }
                                className="h-8 px-2"
                                onMouseDown={stopToolbarFromStealingFocus}
                                onPointerDownCapture={stopToolbarFromStealingFocus}
                                onClick={() =>
                                    editor.chain().focus().setTextAlign('right').run()
                                }
                                aria-label="Align right"
                            >
                                <AlignRight className="size-4" />
                            </Button>
                        </div>
                        <div
                            className={cn(
                                'custom-scrollbar max-h-[min(50vh,24rem)] overflow-y-auto',
                                '[&_h2]:text-xl [&_h2]:font-semibold [&_h3]:text-lg [&_h3]:font-semibold',
                                'text-beta dark:text-light',
                            )}
                        >
                            <EditorContent editor={editor} />
                        </div>
                    </div>
                ) : (
                    <div
                        className="min-h-[320px] animate-pulse rounded-md bg-muted/40"
                        aria-hidden
                    />
                )}
            </div>
            {error ? <p className="text-sm text-error">{error}</p> : null}
        </div>
    );
}
