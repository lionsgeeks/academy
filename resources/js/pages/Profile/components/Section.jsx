const ACCENT = "#F4B400";

export default function Section({ title, children }) {
    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
                <div
                    className="w-1 h-4 rounded-full"
                    style={{ background: ACCENT }}
                />

                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">
                    {title}
                </h3>
            </div>

            {children}
        </div>
    );
}