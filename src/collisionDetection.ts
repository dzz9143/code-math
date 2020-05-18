import {
    degToR,
    circlePointCollision,
    circleCollision,
    pointInRect,
    rectCollision,
} from './utility';
import { Rect } from './types';

export function pointWithCircle(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    win?: Window,
    doc?: Document,
): void {
    const circle = {
        x: width / 2,
        y: height / 2,
        radius: 40,
    };

    doc.addEventListener('mousemove', (ev) => {
        ctx.clearRect(0, 0, width, height);

        if (circlePointCollision(ev.clientX, ev.clientY, circle)) {
            ctx.fillStyle = 'rgb(200, 100, 100)';
        } else {
            ctx.fillStyle = 'rgb(0, 0, 0)';
        }

        ctx.beginPath();
        ctx.arc(circle.x, circle.y, circle.radius, 0, degToR(360));
        ctx.fill();
    });
}

export function circleWithCircle(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    win?: Window,
    doc?: Document,
): void {
    const circle = {
        x: width / 2,
        y: height / 2,
        radius: 40,
    };

    const moveCircle = {
        x: 0,
        y: 0,
        radius: 20,
    };

    doc.addEventListener('mousemove', (ev) => {
        ctx.clearRect(0, 0, width, height);
        // check collision
        moveCircle.x = ev.clientX;
        moveCircle.y = ev.clientY;
        if (circleCollision(circle, moveCircle)) {
            ctx.fillStyle = 'rgb(200, 100, 100)';
        } else {
            ctx.fillStyle = 'rgb(0, 0, 0)';
        }

        ctx.beginPath();
        ctx.arc(circle.x, circle.y, circle.radius, 0, degToR(360));
        ctx.fill();

        ctx.beginPath();
        ctx.arc(moveCircle.x, moveCircle.y, moveCircle.radius, 0, degToR(360));
        ctx.fill();
    });
}

export function pointWithRect(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    win?: Window,
    doc?: Document,
): void {
    const rect1: Rect = {
        x: 100,
        y: 100,
        width: 300,
        height: 150,
    };

    const rect2: Rect = {
        x: width / 2,
        y: height / 2,
        width: -100,
        height: -200,
    };

    doc.addEventListener('mousemove', (ev) => {
        ctx.clearRect(0, 0, width, height);

        if (
            pointInRect(ev.clientX, ev.clientY, rect1) ||
            pointInRect(ev.clientX, ev.clientY, rect2)
        ) {
            ctx.fillStyle = 'rgb(200, 100, 100)';
        } else {
            ctx.fillStyle = 'rgb(0, 0, 0)';
        }

        ctx.rect(rect1.x, rect1.y, rect1.width, rect1.height);
        ctx.fill();
        ctx.rect(rect2.x, rect2.y, rect2.width, rect2.height);
        ctx.fill();
    });
}

export function rectWithRect(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    win?: Window,
    doc?: Document,
): void {
    const rect: Rect = {
        x: 100,
        y: 100,
        width: 300,
        height: 150,
    };

    const moveRect: Rect = {
        x: 0,
        y: 0,
        width: 50,
        height: 50,
    };

    doc.addEventListener('mousemove', (ev) => {
        ctx.clearRect(0, 0, width, height);

        moveRect.x = ev.clientX - moveRect.width / 2;
        moveRect.y = ev.clientY - moveRect.height / 2;

        if (rectCollision(rect, moveRect)) {
            ctx.fillStyle = 'rgb(200, 100, 100)';
        } else {
            ctx.fillStyle = 'rgb(0, 0, 0)';
        }

        ctx.beginPath();
        ctx.rect(rect.x, rect.y, rect.width, rect.height);
        ctx.rect(moveRect.x, moveRect.y, moveRect.width, moveRect.height);
        ctx.fill();
    });
}
