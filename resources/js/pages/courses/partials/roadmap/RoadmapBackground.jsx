import { motion } from 'framer-motion';

/*
 * Ambient overlay — rendered as `absolute inset-0` inside the scrollable canvas
 * section of courses/[id].jsx. Because the parent is `position: relative` and has
 * overflow-y-auto, this element is always sized to the visible viewport, not the
 * full scroll height. This is intentional: glow and vignette persist at the
 * viewport level regardless of how far the user has scrolled.
 *
 * The dot grid is NOT here — it lives as a CSS background-image on the scrollable
 * parent so it tiles across the full scroll height (background-attachment: local).
 */
export default function RoadmapBackground() {
    return (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">

            {/* Noise texture — very subtle grain for material depth */}
            <div
                className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] mix-blend-overlay"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
                    backgroundSize: '200px 200px',
                }}
            />

            {/* Diagonal yellow gradient — very soft directional tint */}
            <div className="absolute inset-0 bg-linear-to-br from-alpha/5 via-transparent to-alpha/3" />

            {/*
             * Ambient glow blobs — centered horizontally so they align with the
             * 560px canvas node column regardless of viewport width.
             * Wrapper divs preserve -translate-x-1/2 centering since Framer Motion
             * overrides the transform property on motion elements directly.
             */}
            <div className="absolute -top-32 left-1/2 -translate-x-1/2">
                <motion.div
                    className="h-[420px] w-[420px] rounded-full bg-alpha/10 blur-3xl"
                    animate={{ scale: [1, 1.08, 1], y: [0, -16, 0] }}
                    transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
                />
            </div>

            <div className="absolute bottom-0 left-1/2 -translate-x-1/2">
                <motion.div
                    className="h-72 w-72 rounded-full bg-alpha/7 blur-3xl"
                    animate={{ scale: [1, 1.1, 1], y: [0, 12, 0] }}
                    transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
                />
            </div>

            {/* Light centre pulse — always centred in the viewport */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                <motion.div
                    className="h-48 w-48 rounded-full bg-alpha/5 blur-2xl"
                    animate={{ scale: [1, 1.18, 1], opacity: [0.4, 0.7, 0.4] }}
                    transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
                />
            </div>

            {/* Radial vignette — darker edges make the centre feel illuminated */}
            <div
                className="absolute inset-0"
                style={{
                    background:
                        'radial-gradient(ellipse 75% 55% at center, transparent 35%, rgba(0,0,0,0.09) 100%)',
                }}
            />

        </div>
    );
}
