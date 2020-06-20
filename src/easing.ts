import { randRange, degToR, range } from './utility';

export function easingMoveBall(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    win?: Window,
    doc?: Document,
): void {
    const easing = 0.1;

    const ball = {
        x: 0,
        y: randRange(0, height),
    };

    const target = {
        x: width,
        y: randRange(0, height),
    };

    doc.addEventListener('click', (ev) => {
        ball.x = ev.clientX;
        ball.y = ev.clientY;
    });

    function easeTo(start: number, end: number, easing: number): number {
        return start + (end - start) * easing;
    }

    function update(): void {
        ball.x = easeTo(ball.x, target.x, easing);
        ball.y = easeTo(ball.y, target.y, easing);
    }

    function render(): void {
        ctx.clearRect(0, 0, width, height);

        update();

        ctx.beginPath();
        ctx.arc(ball.x, ball.y, 10, 0, degToR(360));
        ctx.fill();

        ctx.beginPath();
        ctx.arc(target.x, target.y, 10, 0, degToR(360));
        ctx.fill();

        win.requestAnimationFrame(render);
    }

    render();
}

export function chasingMouse(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    win?: Window,
    doc?: Document,
): void {
    const easing = 0.05;

    const balls = [] as any[];

    range(0, 10).forEach(() => {
        balls.push({
            x: 0,
            y: 0,
        });
    });

    const target = {
        x: 0,
        y: 0,
    };

    doc.addEventListener('mousemove', (ev) => {
        target.x = ev.clientX;
        target.y = ev.clientY;
    });

    function easeTo(start: number, end: number, easing: number): number {
        return start + (end - start) * easing;
    }

    function update(): void {
        balls.reduce((target, cur) => {
            cur.x = easeTo(cur.x, target.x, easing);
            cur.y = easeTo(cur.y, target.y, easing);
            return cur;
        }, target);
    }

    function render(): void {
        ctx.clearRect(0, 0, width, height);

        update();

        balls.forEach((b) => {
            ctx.beginPath();
            ctx.arc(b.x, b.y, 10, 0, degToR(360));
            ctx.fill();
        });

        win.requestAnimationFrame(render);
    }

    render();
}
