export function normalize(value: number, min: number, max: number): number {
    return (value - min) / (max - min);
}

export function lerp(norm: number, min: number, max: number): number {
    return min + norm * (max - min);
}
