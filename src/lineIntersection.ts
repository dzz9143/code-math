import { getLineIntersect, degToR, circlePointCollision } from './utility';

export function lineIntersect(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    win?: Window,
    doc?: Document,
): void {
    const p0 = {
        x: 100,
        y: 100,
        dragged: false,
    };

    const p1 = {
        x: 600,
        y: 400,
        dragged: false,
    };

    const p2 = {
        x: 400,
        y: 100,
        dragged: false,
    };

    const p3 = {
        x: 100,
        y: 400,
        dragged: false,
    };

    const endpoints = [p0, p1, p2, p3];

    doc.addEventListener('mousedown', (ev) => {
        const x = ev.clientX;
        const y = ev.clientY;
        for (let i = 0; i < endpoints.length; i++) {
            const p = endpoints[i];

            if (
                circlePointCollision(x, y, {
                    x: p.x,
                    y: p.y,
                    radius: 10,
                })
            ) {
                p.dragged = true;
                return;
            }
        }
    });

    doc.addEventListener('mousemove', (ev) => {
        const x = ev.clientX;
        const y = ev.clientY;

        for (let i = 0; i < endpoints.length; i++) {
            const p = endpoints[i];
            if (p.dragged) {
                p.x = x;
                p.y = y;
            }
        }
    });

    doc.addEventListener('mouseup', () => {
        endpoints.forEach((p) => (p.dragged = false));
    });

    function render(): void {
        ctx.clearRect(0, 0, width, height);

        ctx.beginPath();

        ctx.moveTo(p0.x, p0.y);
        ctx.lineTo(p1.x, p1.y);

        ctx.moveTo(p2.x, p2.y);
        ctx.lineTo(p3.x, p3.y);
        ctx.stroke();

        endpoints.forEach((p) => {
            ctx.beginPath();
            ctx.arc(p.x, p.y, 10, 0, degToR(360));
            ctx.fill();
        });

        const intersect = getLineIntersect(p0, p1, p2, p3);

        ctx.beginPath();
        ctx.arc(intersect.x, intersect.y, 20, 0, degToR(360));
        ctx.stroke();

        win.requestAnimationFrame(render);
    }

    render();
}
