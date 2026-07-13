import { useMemo, useState } from 'react';
import { Link2, Upload, Video, X } from 'lucide-react';

function getYouTubeEmbedUrl(input) {
    if (!input) return null;

    try {
        const url = new URL(input);

        if (url.hostname.includes('youtube.com') && url.searchParams.get('v')) {
            return `https://www.youtube.com/embed/${url.searchParams.get('v')}`;
        }

        if (url.hostname === 'youtu.be') {
            return `https://www.youtube.com/embed${url.pathname}`;
        }

        if (url.pathname.startsWith('/embed/')) return input;
    } catch {
        return null;
    }

    return null;
}

export default function VideoSection({ topic, onUpdateTopic }) {
    const [mode, setMode] = useState('url');

    const embedUrl = getYouTubeEmbedUrl(topic?.videoUrl || '');

    const localVideoUrl = useMemo(() => {
        if (!topic?.videoFile) return null;
        return URL.createObjectURL(topic.videoFile);
    }, [topic?.videoFile]);

    const hasVideo = embedUrl || localVideoUrl;

    return (
        <section className="bg-card border border-border rounded-2xl overflow-hidden">
            <div className="p-4 border-b border-border flex items-center justify-between">
                <div>
                    <p className="text-sm font-semibold text-card-foreground">
                        Lesson Video
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                        Add a video by URL or upload a recording.
                    </p>
                </div>

                <div className="flex rounded-lg bg-muted border border-border p-1">
                    <button
                        type="button"
                        onClick={() => setMode('url')}
                        className={`px-3 py-1.5 rounded-md text-xs font-semibold transition ${
                            mode === 'url'
                                ? 'bg-background text-foreground shadow-sm'
                                : 'text-muted-foreground hover:text-foreground'
                        }`}
                    >
                        URL
                    </button>

                    <button
                        type="button"
                        onClick={() => setMode('upload')}
                        className={`px-3 py-1.5 rounded-md text-xs font-semibold transition ${
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
                {!hasVideo ? (
                    <div className="min-h-[260px] rounded-2xl border border-dashed border-border bg-muted/40 flex flex-col items-center justify-center text-center p-8">
                        <div className="w-14 h-14 rounded-2xl bg-background border border-border flex items-center justify-center mb-4">
                            <Video className="w-7 h-7 text-muted-foreground" />
                        </div>

                        <p className="text-sm font-semibold text-foreground">
                            No video added yet
                        </p>

                        <p className="text-xs text-muted-foreground mt-1 max-w-sm">
                            Paste a YouTube link or upload a video file from your computer.
                        </p>

                        <div className="mt-5 w-full max-w-md">
                            {mode === 'url' ? (
                                <div>
                                    <div className="flex items-center gap-2 bg-background border border-border rounded-xl px-3 py-2">
                                        <Link2 className="w-4 h-4 text-muted-foreground" />
                                        <input
                                            type="url"
                                            value={topic?.videoUrl || ''}
                                            onChange={(e) =>
                                                onUpdateTopic({
                                                    videoUrl: e.target.value,
                                                    videoFile: null,
                                                })
                                            }
                                            placeholder="Paste YouTube link..."
                                            className="w-full bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground"
                                        />
                                    </div>

                                    {topic?.videoUrl && !embedUrl && (
                                        <p className="text-[11px] text-error flex items-center gap-1 mt-2">
                                            <X className="w-3 h-3" />
                                            Invalid YouTube URL
                                        </p>
                                    )}
                                </div>
                            ) : (
                                <label className="cursor-pointer border border-dashed border-border rounded-xl p-5 flex flex-col items-center justify-center text-xs text-muted-foreground hover:bg-background transition">
                                    <Upload className="w-5 h-5 mb-2" />
                                    <span>
                                        {topic?.videoFile
                                            ? topic.videoFile.name
                                            : 'Choose a video from your computer'}
                                    </span>

                                    <input
                                        type="file"
                                        accept="video/*"
                                        className="hidden"
                                        onChange={(e) =>
                                            onUpdateTopic({
                                                videoFile: e.target.files?.[0] || null,
                                                videoUrl: '',
                                            })
                                        }
                                    />
                                </label>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="rounded-2xl overflow-hidden bg-black border border-border aspect-video">
                            {embedUrl ? (
                                <iframe
                                    src={embedUrl}
                                    title={topic?.title || 'Video preview'}
                                    className="w-full h-full"
                                    allowFullScreen
                                />
                            ) : (
                                <video
                                    src={localVideoUrl}
                                    controls
                                    className="w-full h-full"
                                />
                            )}
                        </div>

                        <div className="flex items-center justify-between">
                            <p className="text-xs text-muted-foreground">
                                Video ready for this lesson.
                            </p>

                            <button
                                type="button"
                                onClick={() =>
                                    onUpdateTopic({
                                        videoUrl: '',
                                        videoFile: null,
                                    })
                                }
                                className="text-xs font-semibold text-error hover:underline"
                            >
                                Remove video
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}