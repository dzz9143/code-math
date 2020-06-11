import { randRange, degToR, map } from './utility';

export function rectInSpace(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    win?: Window,
    doc?: Document,
): void {
    const fl = 300;

    ctx.translate(width / 2, height / 2);

    const shapes: any[] = [];

    for (let i = 0; i < 100; i++) {
        shapes.push({
            x: randRange(-1000, 1000),
            y: randRange(-1000, 1000),
            z: randRange(100, 5000),
        });
    }

    function render(): void {
        ctx.clearRect(-width / 2, -height / 2, width, height);

        shapes.forEach((shape) => {
            ctx.save();

            const perspective = fl / (fl + shape.z);

            ctx.scale(perspective, perspective);
            ctx.translate(shape.x, shape.y);

            ctx.fillRect(shape.x, shape.y, 200, 100);

            ctx.restore();

            shape.z -= 5;

            if (shape.z < 0) {
                shape.z = randRange(100, 2000);
            }
        });

        win.requestAnimationFrame(render);
    }

    render();
}

export function lineInSpace(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    win?: Window,
    doc?: Document,
): void {
    const fl = 300;

    ctx.translate(width / 2, height / 2);

    const lines: any[] = [];

    for (let i = 0; i < 300; i++) {
        lines.push({
            x: randRange(-4000, 4000),
            y: randRange(-4000, 4000),
            z: randRange(100, 10000),
            length: randRange(1000, 2000),
            speed: randRange(50, 150),
        });
    }

    function render(): void {
        ctx.clearRect(-width / 2, -height / 2, width, height);

        lines.forEach((line) => {
            const p1 = line.z < 0 ? 1 : fl / (fl + line.z);
            const p2 = fl / (fl + line.z + line.length);
            ctx.beginPath();
            ctx.moveTo(line.x * p1, line.y * p1);
            ctx.lineTo(line.x * p2, line.y * p2);
            ctx.stroke();

            line.z -= line.speed;
            if (line.z < -line.length) {
                line.z = 10000;
            }
        });

        win.requestAnimationFrame(render);
    }

    render();
}

export function carouselRect(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    win?: Window,
    doc?: Document,
): void {
    const fl = 300;

    ctx.translate(width / 2, height / 2);

    const rects: any[] = [];
    const num = 10;
    const centerZ = 600;
    const radius = 400;
    const baseY = 0;

    let baseAngle = 0;
    let rotationSpeed = 0;
    let yOffset = 0;

    for (let i = 0; i < num; i++) {
        rects.push({
            angle: degToR((360 / num) * i),
            w: 200,
            h: 100,
        });
    }

    doc.addEventListener('mousemove', (ev) => {
        const clientX = ev.clientX;
        const clientY = ev.clientY;
        rotationSpeed = map(clientX, 0, width, 0.05, -0.05);
        yOffset = map(clientY, 0, height, -300, 300);
    });

    function render(): void {
        ctx.clearRect(-width / 2, -height / 2, width, height);

        rects.forEach((rect) => {
            const x = Math.sin(rect.angle + baseAngle) * radius;
            const z = centerZ + Math.cos(rect.angle + baseAngle) * radius;
            const p = fl / (fl + z);
            const y = baseY + yOffset;

            ctx.save();
            ctx.scale(p, p);
            ctx.translate(x, y);

            ctx.beginPath();

            ctx.rect(-rect.w / 2, -rect.h / 2, rect.w, rect.h);

            ctx.stroke();

            ctx.restore();
        });

        baseAngle += rotationSpeed;

        win.requestAnimationFrame(render);
    }

    render();
}
