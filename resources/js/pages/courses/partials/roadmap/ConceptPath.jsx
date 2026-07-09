import { motion } from 'framer-motion';

export default function ConceptPath({ from, to, index = 0 }) {
    const midY = (from.y + to.y) / 2;
    const d = `M ${from.x} ${from.y} C ${from.x} ${midY} ${to.x} ${midY} ${to.x} ${to.y}`;

    return (
        <motion.path
            d={d}
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
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
    );
}
