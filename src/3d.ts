import { randRange } from './utility';

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

    for (let i = 0; i < 100; i++) {
        lines.push({
            x: randRange(-1000, 1000),
            y: randRange(-1000, 1000),
            z: randRange(100, 10000),
            length: randRange(1000, 2000),
        });
    }

    function render(): void {
        ctx.clearRect(-width / 2, -height / 2, width, height);

        lines.forEach((line) => {
            const p1 = fl / (fl + line.z);
            const p2 = fl / (fl + line.z + line.length);
            ctx.beginPath();
            ctx.moveTo(line.x * p1, line.y * p1);
            ctx.lineTo(line.x * p2, line.y * p2);
            ctx.stroke();

            line.z -= 50;
            if (line.z < 0) {
                line.z = 10000;
            }
        });

        win.requestAnimationFrame(render);
    }

    render();
}
