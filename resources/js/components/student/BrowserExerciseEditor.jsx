import { useState, useRef, useEffect } from 'react';
import { Code2, Eye, Maximize2, Minimize2 } from 'lucide-react';

export default function BrowserExerciseEditor({ sourceCode, onChange, preview = true }) {
    const [activeTab, setActiveTab] = useState('html');
    const [code, setCode] = useState(sourceCode || { html: '', css: '', javascript: '' });
    const [isFullscreen, setIsFullscreen] = useState(false);
    const iframeRef = useRef(null);

    useEffect(() => {
        setCode(sourceCode || { html: '', css: '', javascript: '' });
    }, [sourceCode]);

    const handleCodeChange = (language, value) => {
        const newCode = { ...code, [language]: value };
        setCode(newCode);
        onChange(newCode);
    };

    const getPreviewHTML = () => {
        return `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                    * { margin: 0; padding: 0; box-sizing: border-box; }
                    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; }
                    ${code.css}
                </style>
            </head>
            <body>
                ${code.html}
                <script>
                    try {
                        ${code.javascript}
                    } catch (e) {
                        console.error('JavaScript Error:', e);
                        document.body.innerHTML += '<div style="color: red; padding: 20px; font-family: monospace;">Error: ' + e.message + '</div>';
                    }
                </script>
            </body>
            </html>
        `;
    };

    useEffect(() => {
        if (iframeRef.current) {
            const doc = iframeRef.current.contentDocument;
            if (doc) {
                doc.open();
                doc.write(getPreviewHTML());
                doc.close();
            }
        }
    }, [code]);

    const languages = [
        { id: 'html', label: 'HTML', icon: '📄' },
        { id: 'css', label: 'CSS', icon: '🎨' },
        { id: 'javascript', label: 'JavaScript', icon: '⚙️' },
    ];

    return (
        <div className={`flex flex-col rounded-lg border border-gray-300 overflow-hidden bg-gray-50 ${
            isFullscreen ? 'fixed inset-0 z-50' : 'h-96'
        }`}>
            {/* Toolbar */}
            <div className="flex items-center gap-2 px-4 py-3 bg-gray-900 border-b border-gray-700">
                <Code2 className="w-5 h-5 text-white" />
                <span className="text-white font-medium text-sm">Code Editor</span>
                <div className="flex-1"></div>
                <button
                    onClick={() => setIsFullscreen(!isFullscreen)}
                    className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded transition-colors"
                    title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
                >
                    {isFullscreen ? (
                        <Minimize2 className="w-4 h-4" />
                    ) : (
                        <Maximize2 className="w-4 h-4" />
                    )}
                </button>
            </div>

            {/* Content */}
            <div className="flex flex-1 overflow-hidden">
                {/* Editor */}
                <div className={`flex flex-col flex-1 ${preview ? 'w-1/2' : 'w-full'}`}>
                    {/* Tabs */}
                    <div className="flex gap-1 px-3 pt-3 pb-0 bg-gray-800 border-b border-gray-700">
                        {languages.map((lang) => (
                            <button
                                key={lang.id}
                                onClick={() => setActiveTab(lang.id)}
                                className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                                    activeTab === lang.id
                                        ? 'bg-gray-700 text-white'
                                        : 'bg-gray-900 text-gray-400 hover:text-gray-300'
                                }`}
                            >
                                {lang.icon} {lang.label}
                            </button>
                        ))}
                    </div>

                    {/* Editor Area */}
                    <div className="flex-1 overflow-hidden bg-gray-900">
                        {languages.map((lang) => (
                            <div
                                key={lang.id}
                                className={`h-full ${activeTab === lang.id ? 'block' : 'hidden'}`}
                            >
                                <CodeEditor
                                    value={code[lang.id]}
                                    onChange={(value) => handleCodeChange(lang.id, value)}
                                    language={lang.id}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Preview */}
                {preview && (
                    <div className="flex-1 flex flex-col border-l border-gray-300">
                        <div className="px-4 py-3 bg-gray-100 border-b border-gray-300 flex items-center gap-2">
                            <Eye className="w-4 h-4 text-gray-700" />
                            <span className="text-sm font-medium text-gray-700">Live Preview</span>
                        </div>
                        <iframe
                            ref={iframeRef}
                            title="Live Preview"
                            className="flex-1 border-0 w-full"
                            sandbox="allow-scripts"
                        />
                    </div>
                )}
            </div>
        </div>
    );
}

function CodeEditor({ value, onChange, language }) {
    const textareaRef = useRef(null);
    const [lineNumbers, setLineNumbers] = useState([]);

    useEffect(() => {
        const lines = value.split('\n').length;
        setLineNumbers(Array.from({ length: lines }, (_, i) => i + 1));
    }, [value]);

    const handleScroll = (e) => {
        if (textareaRef.current) {
            const container = e.currentTarget.parentElement;
            const lineNumbersEl = container.querySelector('.line-numbers');
            if (lineNumbersEl) {
                lineNumbersEl.scrollTop = e.currentTarget.scrollTop;
            }
        }
    };

    const getLanguageClass = () => {
        const colors = {
            html: 'text-orange-400',
            css: 'text-blue-400',
            javascript: 'text-yellow-400',
        };
        return colors[language] || 'text-gray-400';
    };

    return (
        <div className="flex h-full">
            {/* Line Numbers */}
            <div className="line-numbers bg-gray-800 border-r border-gray-700 px-2 py-2 text-right text-gray-600 font-mono text-sm overflow-hidden">
                {lineNumbers.map((num) => (
                    <div key={num} className="leading-5">
                        {num}
                    </div>
                ))}
            </div>

            {/* Editor */}
            <textarea
                ref={textareaRef}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onScroll={handleScroll}
                className={`flex-1 p-4 font-mono text-sm bg-gray-900 text-gray-100 border-0 focus:outline-none resize-none overflow-hidden`}
                spellCheck="false"
                style={{
                    tab: '4',
                }}
            />
        </div>
    );
}
