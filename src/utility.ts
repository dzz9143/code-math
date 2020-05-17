export function normalize(value: number, min: number, max: number): number {
    return (value - min) / (max - min);
}

// linear interpolation
export function lerp(norm: number, min: number, max: number): number {
    return min + norm * (max - min);
}

export function map(
    value: number,
    srcMin: number,
    srcMax: number,
    dstMin: number,
    dstMax: number,
): number {
    return lerp(normalize(value, srcMin, srcMax), dstMin, dstMax);
}

export function clamp(value: number, min: number, max: number): number {
    return Math.max(Math.min(value, max), min);
}

export function randRange(min: number, max: number): number {
    return min + Math.random() * (max - min);
}

// degree to radian
export function degToR(deg: number): number {
    return (Math.PI * deg) / 180;
}

export function range(min: number, max: number): number[] {
    const result = [];
    for (let i = min; i < max; i++) {
        result.push(i);
    }
    return result;
}

export function distance(x1: number, y1: number, x2: number, y2: number): number {
    const dx = x1 - x2;
    const dy = y1 - y2;

    return Math.sqrt(dx * dx + dy * dy);
}
