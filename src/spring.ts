import { Particle } from './particle';
import { randRange, degToR } from './utility';

export function simpleSpring(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    win?: Window,
): void {
    const ball1 = new Particle(
        randRange(0, width),
        randRange(0, height),
        50,
        randRange(0, degToR(360)),
    );

    ball1.friction = 0.9;
    ball1.radius = 20;

    const ball2 = new Particle(
        randRange(0, width),
        randRange(0, height),
        50,
        randRange(0, degToR(360)),
    );

    ball2.friction = 0.9;
    ball2.radius = 20;

    const springPoint = new Particle(width / 2, height / 2, 0, 0);

    const springFactor = 0.1;

    function render(): void {
        // spring force
        const springForce1 = springPoint.position.substract(ball1.position);
        springForce1.multiplyBy(springFactor);
        ball1.velocity.addTo(springForce1);
        ball1.update();

        const springForce2 = springPoint.position.substract(ball2.position);
        springForce2.multiplyBy(springFactor);
        ball2.velocity.addTo(springForce2);
        ball2.update();

        ctx.clearRect(0, 0, width, height);

        // spring point
        ctx.beginPath();
        ctx.arc(springPoint.position.x, springPoint.position.y, 4, 0, degToR(360));
        ctx.fill();

        // move ball1
        ctx.beginPath();
        ctx.arc(ball1.position.x, ball1.position.y, ball1.radius, 0, degToR(360));
        ctx.stroke();

        // move ball2
        ctx.beginPath();
        ctx.arc(ball2.position.x, ball2.position.y, ball2.radius, 0, degToR(360));
        ctx.stroke();

        // line between
        ctx.beginPath();
        ctx.moveTo(springPoint.position.x, springPoint.position.y);
        ctx.lineTo(ball1.position.x, ball1.position.y);
        ctx.moveTo(springPoint.position.x, springPoint.position.y);
        ctx.lineTo(ball2.position.x, ball2.position.y);
        ctx.stroke();

        win.requestAnimationFrame(render);
    }

    render();
}

export function simpleMoveSpring(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    win?: Window,
    doc?: Document,
): void {
    const ball1 = new Particle(
        randRange(0, width),
        randRange(0, height),
        50,
        randRange(0, degToR(360)),
    );

    ball1.friction = 0.9;
    ball1.radius = 20;

    const ball2 = new Particle(
        randRange(0, width),
        randRange(0, height),
        50,
        randRange(0, degToR(360)),
    );

    ball2.friction = 0.9;
    ball2.radius = 20;

    const springPoint = new Particle(width / 2, height / 2, 0, 0);

    const springFactor = 0.1;

    doc.addEventListener('mousemove', (ev) => {
        springPoint.position.x = ev.clientX;
        springPoint.position.y = ev.clientY;
    });

    function render(): void {
        // spring force
        const springForce1 = springPoint.position.substract(ball1.position);
        springForce1.multiplyBy(springFactor);
        ball1.velocity.addTo(springForce1);
        ball1.update();

        const springForce2 = springPoint.position.substract(ball2.position);
        springForce2.multiplyBy(springFactor);
        ball2.velocity.addTo(springForce2);
        ball2.update();

        ctx.clearRect(0, 0, width, height);

        // spring point
        ctx.beginPath();
        ctx.arc(springPoint.position.x, springPoint.position.y, 4, 0, degToR(360));
        ctx.fill();

        // move ball1
        ctx.beginPath();
        ctx.arc(ball1.position.x, ball1.position.y, ball1.radius, 0, degToR(360));
        ctx.stroke();

        // move ball2
        ctx.beginPath();
        ctx.arc(ball2.position.x, ball2.position.y, ball2.radius, 0, degToR(360));
        ctx.stroke();

        // line between
        ctx.beginPath();
        ctx.moveTo(springPoint.position.x, springPoint.position.y);
        ctx.lineTo(ball1.position.x, ball1.position.y);
        ctx.moveTo(springPoint.position.x, springPoint.position.y);
        ctx.lineTo(ball2.position.x, ball2.position.y);
        ctx.stroke();

        win.requestAnimationFrame(render);
    }

    render();
}
