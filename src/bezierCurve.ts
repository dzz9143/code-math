import { Particle } from './particle2';
import { randRange, degToR, lerp, normalize } from './utility';

export function quadBezierCurve1(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    win?: Window,
    doc?: Document,
): void {
    const p0 = new Particle(randRange(0, width), randRange(0, height), 0, 0);

    const p1 = new Particle(randRange(0, width), randRange(0, height), 0, 0);

    const p2 = new Particle(randRange(0, width), randRange(0, height), 0, 0);

    const lines: Particle[][] = [];

    lines.push([p0, p1]);
    lines.push([p1, p2]);

    function getPointFromLine(line: Particle[], t: number): Particle {
        const [a, b] = line;

        return new Particle(lerp(t, a.x, b.x), lerp(t, a.y, b.y), 0, 0);
    }

    const pointsOnCurve: Particle[] = [];

    for (let t = 0; t < 1; t += 0.05) {
        const pA = getPointFromLine(lines[0], t);
        const pB = getPointFromLine(lines[1], t);

        lines.push([pA, pB]);
        const pFinal = getPointFromLine([pA, pB], t);
        pointsOnCurve.push(pFinal);
    }

    function render(): void {
        ctx.clearRect(0, 0, width, height);

        lines.forEach((line) => {
            const [a, b] = line;

            ctx.beginPath();
            ctx.arc(a.x, a.y, 2, 0, degToR(360));
            ctx.fill();

            ctx.beginPath();
            ctx.arc(b.x, b.y, 2, 0, degToR(360));
            ctx.fill();

            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
        });

        ctx.save();
        pointsOnCurve.forEach((p) => {
            ctx.fillStyle = '#0000ff';
            ctx.beginPath();
            ctx.arc(p.x, p.y, 2, 0, degToR(360));
            ctx.fill();
        });
        ctx.restore();

        win.requestAnimationFrame(render);
    }

    render();
}

export function quadBezierCurve2(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    win?: Window,
    doc?: Document,
): void {
    const p0 = new Particle(randRange(0, width), randRange(0, height), 0, 0);

    const p1 = new Particle(randRange(0, width), randRange(0, height), 0, 0);

    const p2 = new Particle(randRange(0, width), randRange(0, height), 0, 0);

    let lines: Particle[][] = [];
    let pointsOnCurve: Particle[] = [];
    let ctl = 0;
    const step = 0.1;

    function getPointFromLine(line: Particle[], t: number): Particle {
        const [a, b] = line;

        return new Particle(lerp(t, a.x, b.x), lerp(t, a.y, b.y), 0, 0);
    }

    doc.addEventListener('mousemove', (ev) => {
        ctl = normalize(ev.clientY, 0, height);
        console.log('ctl:', ctl);
    });

    function update(): void {
        lines = [];
        pointsOnCurve = [];

        lines.push([p0, p1]);
        lines.push([p1, p2]);

        for (let t = 0; t < ctl; t += step) {
            const pA = getPointFromLine(lines[0], t);
            const pB = getPointFromLine(lines[1], t);

            lines.push([pA, pB]);
            const pFinal = getPointFromLine([pA, pB], t);
            pointsOnCurve.push(pFinal);
        }
    }

    function render(): void {
        update();

        ctx.clearRect(0, 0, width, height);

        lines.forEach((line) => {
            const [a, b] = line;

            ctx.beginPath();
            ctx.arc(a.x, a.y, 2, 0, degToR(360));
            ctx.fill();

            ctx.beginPath();
            ctx.arc(b.x, b.y, 2, 0, degToR(360));
            ctx.fill();

            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
        });

        ctx.save();
        pointsOnCurve.forEach((p) => {
            ctx.fillStyle = '#0000ff';
            ctx.beginPath();
            ctx.arc(p.x, p.y, 2, 0, degToR(360));
            ctx.fill();
        });
        ctx.restore();

        if (pointsOnCurve.length > 1) {
            ctx.save();
            ctx.strokeStyle = '#00ff00';
            ctx.moveTo(pointsOnCurve[0].x, pointsOnCurve[0].y);
            for (let i = 1; i < pointsOnCurve.length; i++) {
                ctx.lineTo(pointsOnCurve[i].x, pointsOnCurve[i].y);
            }
            ctx.stroke();
            ctx.restore();
        }

        win.requestAnimationFrame(render);
    }

    render();
}
