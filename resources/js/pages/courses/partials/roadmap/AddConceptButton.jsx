import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';

/*
 * Variant names propagate from parent to children in Framer Motion,
 * so the icon inherits "hover" / "rest" state from the button without extra wiring.
 */
const buttonVariants = {
    rest: { scale: 1 },
    hover: { scale: 1.15 },
    tap: { scale: 0.92 },
};

const iconVariants = {
    rest: { rotate: 0 },
    hover: { rotate: 90 },
};

export default function AddConceptButton({ position, onAdd, index = 0 }) {
    return (
        /*
         * Outer div: CSS positioning + centering only, never animated by Framer Motion.
         */
        <div
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: position.x, top: position.y }}
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                    type: 'spring',
                    stiffness: 260,
                    damping: 20,
                    delay: 0.2 + index * 0.07,
                }}
            >
                <motion.button
                    type="button"
                    onClick={onAdd}
                    aria-label="Add concept"
                    className="flex size-[66px] cursor-pointer items-center justify-center rounded-full border-2 border-dashed border-alpha/50 bg-alpha/5 text-alpha shadow-sm transition-colors duration-150 hover:border-alpha hover:bg-alpha/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-alpha/50"
                    variants={buttonVariants}
                    initial="rest"
                    whileHover="hover"
                    whileTap="tap"
                    transition={{ type: 'spring', stiffness: 400, damping: 18 }}
                >
                    <motion.span
                        variants={iconVariants}
                        transition={{ type: 'spring', stiffness: 400, damping: 18 }}
                    >
                        <Plus className="size-5" />
                    </motion.span>
                </motion.button>
            </motion.div>
        </div>
    );
}
