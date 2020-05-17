import { map, degToR, clamp } from './utility';

export function mapMouseMove(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    win?: Window,
    doc?: Document,
): void {
    doc.addEventListener('mousemove', (ev) => {
        const radius = map(ev.clientY, 0, height, 20, 300);
        const alpha = map(ev.clientX, 0, width, 0.1, 1);

        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = `rgba(0, 0, 0, ${alpha})`;
        ctx.beginPath();
        ctx.arc(width / 2, height / 2, radius, 0, degToR(360));
        ctx.fill();
    });
}

export function clampTheBall(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    win?: Window,
    doc?: Document,
): void {
    const rect = {
        x: 100,
        y: 100,
        width: 300,
        height: 300,
    };

    doc.addEventListener('mousemove', (ev) => {
        const x = clamp(ev.clientX, rect.x, rect.x + rect.width);
        const y = clamp(ev.clientY, rect.y, rect.y + rect.height);

        ctx.clearRect(0, 0, width, height);
        ctx.rect(rect.x, rect.y, rect.width, rect.height);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(x, y, 5, 0, degToR(360));
        ctx.fill();
    });
}

export function lineToCenter(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    win?: Window,
    doc?: Document,
): void {
    const centerX = width / 2;
    const centerY = height / 2;

    doc.addEventListener('mousemove', (ev) => {
        ctx.clearRect(0, 0, width, height);
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(ev.clientX, ev.clientY);
        ctx.stroke();
    });
}
