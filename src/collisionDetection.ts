import { degToR, distance } from './utility';

export function pointWithCircle(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    win?: Window,
    doc?: Document,
): void {
    const centerX = width / 2;
    const centerY = height / 2;

    const radius = 40;

    doc.addEventListener('mousemove', (ev) => {
        ctx.clearRect(0, 0, width, height);
        // check collision
        const dst = distance(ev.clientX, ev.clientY, centerX, centerY);
        if (dst <= radius) {
            ctx.fillStyle = 'rgb(200, 100, 100)';
        } else {
            ctx.fillStyle = 'rgb(0, 0, 0)';
        }

        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, degToR(360));
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
    const centerX = width / 2;
    const centerY = height / 2;
    const centerRadius = 40;

    const moveRadius = 20;

    doc.addEventListener('mousemove', (ev) => {
        ctx.clearRect(0, 0, width, height);
        // check collision
        const dst = distance(ev.clientX, ev.clientY, centerX, centerY);
        if (dst <= moveRadius + centerRadius) {
            ctx.fillStyle = 'rgb(200, 100, 100)';
        } else {
            ctx.fillStyle = 'rgb(0, 0, 0)';
        }

        ctx.beginPath();
        ctx.arc(centerX, centerY, centerRadius, 0, degToR(360));
        ctx.fill();

        ctx.beginPath();
        ctx.arc(ev.clientX, ev.clientY, moveRadius, 0, degToR(360));
        ctx.fill();
    });
}
