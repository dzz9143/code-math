import { degToR, distance, circlePointCollision, circleCollision } from './utility';

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
