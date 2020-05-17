import { Circle } from './types';

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

// collision detection related
export function circleCollision(c1: Circle, c2: Circle): boolean {
    return distance(c1.x, c1.y, c2.x, c2.y) <= c1.radius + c2.radius;
}

export function circlePointCollision(x: number, y: number, c: Circle): boolean {
    return distance(x, y, c.x, c.y) <= c.radius;
}
