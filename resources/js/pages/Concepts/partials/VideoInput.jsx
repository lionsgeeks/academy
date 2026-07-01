import { Link2, Upload } from 'lucide-react';

export default function VideoInput() {
    return (
        <section className="bg-[#141416] border border-zinc-800 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <p className="text-xs font-semibold text-white">
                        Video Source
                    </p>
                    <p className="text-[11px] text-zinc-500 mt-0.5">
                        Paste a video URL or upload a video file.
                    </p>
                </div>

                <div className="flex rounded-lg bg-zinc-900 border border-zinc-800 p-1">
                    <button className="px-3 py-1.5 rounded-md bg-white text-black text-xs font-semibold">
                        URL
                    </button>
                    <button className="px-3 py-1.5 rounded-md text-zinc-400 text-xs font-semibold">
                        Upload
                    </button>
                </div>
            </div>

            <div className="flex items-center gap-2 bg-[#0E0E10] border border-zinc-800 rounded-xl px-3 py-2">
                <Link2 className="w-4 h-4 text-zinc-500" />
                <input
                    type="url"
                    placeholder="Paste YouTube or video URL..."
                    className="w-full bg-transparent outline-none text-sm text-white placeholder:text-zinc-600"
                />
            </div>

            <div className="mt-3 border border-dashed border-zinc-800 rounded-xl p-4 flex items-center justify-center gap-2 text-xs text-zinc-500">
                <Upload className="w-4 h-4" />
                Upload option UI will be connected later
            </div>
        </section>
    );
}