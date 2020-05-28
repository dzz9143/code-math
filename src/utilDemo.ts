import { map, degToR, clamp, roundNearest, randDist } from './utility';
import { Particle } from './particle2';

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

export function nearToGrid(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    win?: Window,
    doc?: Document,
): void {
    const gridSize = 40;
    const h = Math.floor(height / gridSize);
    const v = Math.floor(width / gridSize);

    let cx = 0;
    let cy = 0;

    doc.addEventListener('mousemove', (ev) => {
        cx = roundNearest(ev.clientX, gridSize);
        cy = roundNearest(ev.clientY, gridSize);
    });

    function render(): void {
        ctx.clearRect(0, 0, width, height);
        for (let i = 0; i < h; i++) {
            ctx.beginPath();
            ctx.moveTo(0, i * gridSize);
            ctx.lineTo(width, i * gridSize);
            ctx.stroke();
        }

        for (let i = 0; i < v; i++) {
            ctx.beginPath();
            ctx.moveTo(i * gridSize, 0);
            ctx.lineTo(i * gridSize, height);
            ctx.stroke();
        }

        ctx.beginPath();
        ctx.arc(cx, cy, 20, 0, degToR(360));
        ctx.stroke();

        win.requestAnimationFrame(render);
    }
    render();
}

export function bellCurve(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    win?: Window,
    doc?: Document,
): void {
    const result: number[] = [];
    const w = width / 100;

    function update(): void {
        const val = Math.floor(randDist(0, 100, 3));
        if (!result[val]) {
            result[val] = 0;
        }

        result[val]++;
    }

    function render(): void {
        update();
        ctx.clearRect(0, 0, width, height);

        for (let i = 0; i < 100; i++) {
            ctx.beginPath();
            ctx.fillRect(i * w, height, w, -10 * result[i]);
            ctx.fill();
        }

        win.requestAnimationFrame(render);
    }
    render();
}

export function pointsInSpace(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    win?: Window,
    doc?: Document,
): void {
    const points: Particle[] = [];

    for (let i = 0; i < 50000; i++) {
        points.push(new Particle(randDist(0, width, 5), randDist(0, height, 5), 0, 0));
    }

    function render(): void {
        ctx.clearRect(0, 0, width, height);

        points.forEach((p) => {
            ctx.beginPath();
            ctx.arc(p.x, p.y, 1, 0, degToR(360));
            ctx.fill();
        });

        win.requestAnimationFrame(render);
    }
    render();
}
