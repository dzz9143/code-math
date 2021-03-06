import { Circle, Rect } from './types';
import { Particle } from './particle2';

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
    return Math.max(Math.min(value, Math.max(min, max)), Math.min(min, max));
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

export function inRange(value: number, min: number, max: number): boolean {
    return value <= Math.max(min, max) && value >= Math.min(min, max);
}

export function pointInRect(x: number, y: number, rect: Rect): boolean {
    return (
        inRange(x, rect.x, rect.x + rect.width) &&
        inRange(y, rect.y, rect.y + rect.height)
    );
}

export function rangeIntersect(
    min1: number,
    max1: number,
    min2: number,
    max2: number,
): boolean {
    return max1 >= min2 && min1 <= max2;
}

export function rectCollision(r1: Rect, r2: Rect): boolean {
    return (
        rangeIntersect(r1.x, r1.x + r1.width, r2.x, r2.x + r2.width) &&
        rangeIntersect(r1.y, r1.y + r1.height, r2.y, r2.y + r2.height)
    );
}

export function roundToPlaces(num: number, places: number): number {
    const d = Math.pow(10, places);
    return Math.round(num * d) / d;
}

export function roundNearest(num: number, near: number): number {
    return Math.round(num / near) * near;
}

export function randDist(min: number, max: number, iteration: number): number {
    let sum = 0;
    for (let i = 0; i < iteration; i++) {
        sum += randRange(min, max);
    }

    return sum / iteration;
}

export function quadraticBezier(
    p0: Particle,
    p1: Particle,
    p2: Particle,
    t: number,
    pFinal?: Particle,
): Particle {
    const p = pFinal || new Particle(0, 0, 0, 0);
    p.x = Math.pow(1 - t, 2) * p0.x + (1 - t) * 2 * t * p1.x + t * t * p2.x;
    p.y = Math.pow(1 - t, 2) * p0.y + (1 - t) * 2 * t * p1.y + t * t * p2.y;
    return p;
}

export function cubicBezier(
    p0: Particle,
    p1: Particle,
    p2: Particle,
    p3: Particle,
    t: number,
    pFinal?: Particle,
): Particle {
    const p = pFinal || new Particle(0, 0, 0, 0);
    p.x =
        Math.pow(1 - t, 3) * p0.x +
        Math.pow(1 - t, 2) * 3 * t * p1.x +
        (1 - t) * 3 * t * t * p2.x +
        t * t * t * p3.x;

    p.y =
        Math.pow(1 - t, 3) * p0.y +
        Math.pow(1 - t, 2) * 3 * t * p1.y +
        (1 - t) * 3 * t * t * p2.y +
        t * t * t * p3.y;
    return p;
}

export type tweenTarget = {
    [property: string]: number;
};

export type easingFunction = (t: number, b: number, c: number, d: number) => number;

export const linearTween: easingFunction = (t, b, c, d) => {
    return b + (t / d) * c;
};

export const easeInQuad: easingFunction = (t, b, c, d) => {
    return c * (t /= d) * t + b;
};

export function tween(
    obj: any,
    target: tweenTarget,
    duration: number,
    easingFunc: easingFunction,
): void {
    const start: tweenTarget = {};
    const change: tweenTarget = {};
    const startTime = Date.now();

    // init
    Object.keys(target).forEach((prop) => {
        start[prop] = obj[prop];
        change[prop] = target[prop] - start[prop];
    });

    // update
    function update(): void {
        const time = Date.now() - startTime;

        if (time < duration) {
            Object.keys(target).forEach((prop) => {
                obj[prop] = easingFunc(time, start[prop], change[prop], duration);
            });

            // not done yet, keep looping
            requestAnimationFrame(update);
        } else {
            Object.keys(target).forEach((prop) => {
                obj[prop] = easingFunc(time, start[prop], change[prop], duration);
            });
        }
    }

    update();
}

interface Vec2 {
    x: number;
    y: number;
}

export function getLineIntersect(p0: Vec2, p1: Vec2, p2: Vec2, p3: Vec2): Vec2 {
    const A1 = p0.y - p1.y;
    const B1 = p1.x - p0.x;
    const C1 = A1 * p0.x + B1 * p0.y;

    const A2 = p2.y - p3.y;
    const B2 = p3.x - p2.x;
    const C2 = A2 * p2.x + B2 * p2.y;

    const d = A1 * B2 - A2 * B1;

    return {
        x: (B2 * C1 - B1 * C2) / d,
        y: (A1 * C2 - A2 * C1) / d,
    };
}
