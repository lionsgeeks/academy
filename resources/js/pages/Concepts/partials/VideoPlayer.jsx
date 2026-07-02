import { PlayCircle } from 'lucide-react';

export default function VideoPlayer() {
    return (
        <section className="bg-[#141416] border border-zinc-800 rounded-2xl overflow-hidden">
            <div className="aspect-video bg-black flex flex-col items-center justify-center">
                <PlayCircle className="w-14 h-14 text-zinc-600" />
                <p className="text-sm text-zinc-500 mt-3">
                    Video preview will appear here
                </p>
            </div>
        </section>
    );
}