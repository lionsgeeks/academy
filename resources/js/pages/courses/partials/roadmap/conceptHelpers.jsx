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
export const VERTICAL_STEP = 175;
export const TOP_PADDING = 130;
export const BOTTOM_PADDING = 220;
export const MIN_CANVAS_WIDTH = 360;

function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

function getLaneCount(canvasWidth) {
    if (canvasWidth >= 1180) return 4;
    if (canvasWidth >= 760) return 3;
    return 2;
}

export function getNodePosition(index, canvasWidth = CANVAS_WIDTH) {
    const width = Math.max(canvasWidth, MIN_CANVAS_WIDTH);
    const lanes = getLaneCount(width);
    const edgePadding = clamp(width * 0.16, 120, 260);
    const row = Math.floor(index / lanes);
    const column = index % lanes;
    const laneIndex = row % 2 === 0 ? column : lanes - 1 - column;
    const usableWidth = width - edgePadding * 2;
    const laneGap = lanes > 1 ? usableWidth / (lanes - 1) : 0;
    const verticalWave = [0, 46, 12, 54];

    return {
        x: edgePadding + laneIndex * laneGap,
        y: TOP_PADDING + row * VERTICAL_STEP + verticalWave[column % verticalWave.length],
    };
}

export function getCanvasHeight(count, canvasWidth = CANVAS_WIDTH) {
    const nodes = count + 1;
    const lanes = getLaneCount(Math.max(canvasWidth, MIN_CANVAS_WIDTH));
    const rows = Math.max(1, Math.ceil(nodes / lanes));

    return TOP_PADDING + rows * VERTICAL_STEP + BOTTOM_PADDING;
}

export function isNearLimit(current, max) {
    return current / max > 0.8;
}
