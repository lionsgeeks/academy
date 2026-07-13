import { motion } from 'framer-motion';

export default function ConceptPath({ from, to, index = 0, canvasWidth = 0 }) {
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const sameRow = Math.abs(dy) < 90;
    const rowDrop = Math.abs(dx) < 80 && Math.abs(dy) >= 90;
    const bend = index % 2 === 0 ? 44 : -44;
    const side = from.x > canvasWidth / 2 ? 1 : -1;
    const dropBow = Math.min(Math.max(canvasWidth * 0.025, 28), 52);

    let d = `M ${from.x} ${from.y} C ${from.x} ${from.y + dy * 0.65} ${to.x} ${to.y - dy * 0.65} ${to.x} ${to.y}`;

    if (sameRow) {
        d = `M ${from.x} ${from.y} C ${from.x + dx * 0.35} ${from.y + bend} ${to.x - dx * 0.35} ${to.y - bend} ${to.x} ${to.y}`;
    }

    if (rowDrop) {
        d = `M ${from.x} ${from.y} C ${from.x + side * dropBow} ${from.y + dy * 0.28} ${to.x + side * dropBow} ${to.y - dy * 0.28} ${to.x} ${to.y}`;
    }

    return (
        <>
            <motion.path
                d={d}
                fill="none"
                stroke="currentColor"
                strokeWidth={9}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-alpha/10"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{
                    pathLength: {
                        duration: 0.65,
                        delay: 0.1 + index * 0.09,
                        ease: 'easeInOut',
                    },
                    opacity: {
                        duration: 0.15,
                        delay: 0.1 + index * 0.09,
                    },
                }}
            />
            <motion.path
                d={d}
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-muted-foreground/45"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{
                    pathLength: {
                        duration: 0.65,
                        delay: 0.1 + index * 0.09,
                        ease: 'easeInOut',
                    },
                    opacity: {
                        duration: 0.15,
                        delay: 0.1 + index * 0.09,
                    },
                }}
            />
        </>
    );
}
