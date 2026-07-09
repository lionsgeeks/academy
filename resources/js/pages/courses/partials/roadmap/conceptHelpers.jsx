export const emptyConceptForm = {
    title: '',
    emoji: '',
    description: '',
    type: '',
};

export const NAME_MAX = 50;
export const EMOJI_MAX = 4;
export const DESC_MAX = 500;
export const TYPE_MAX = 30;

export const CANVAS_WIDTH = 560;
export const NODE_RADIUS = 33;
export const VERTICAL_STEP = 200;
export const TOP_PADDING = 110;
export const BOTTOM_PADDING = 300;
export const CURVE_AMPLITUDE = 114;
export const CURVE_FREQUENCY = Math.PI * 0.65;

export function getNodePosition(index) {
    return {
        x: CANVAS_WIDTH / 2 + CURVE_AMPLITUDE * Math.sin(index * CURVE_FREQUENCY),
        y: TOP_PADDING + index * VERTICAL_STEP,
    };
}

export function getCanvasHeight(count) {
    const nodes = count + 1;
    return TOP_PADDING + nodes * VERTICAL_STEP + BOTTOM_PADDING;
}

export function isNearLimit(current, max) {
    return current / max > 0.8;
}
