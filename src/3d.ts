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
            x: randRange(-width / 2, width / 2),
            y: randRange(-height / 2, height / 2),
            z: randRange(100, 1000),
        });
    }

    function render(): void {
        ctx.clearRect(-width / 2, -height / 2, width, height);

        shapes.forEach((shape) => {
            ctx.save();

            const perspective = fl / (fl + shape.z);

            ctx.translate(shape.x * perspective, shape.y * perspective);
            ctx.scale(perspective, perspective);

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
