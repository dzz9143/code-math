import { Particle } from './particle2';
import { randRange, degToR, range } from './utility';
import { Vector } from './vector';

export function springsTest1(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    win?: Window,
    doc?: Document,
): void {
    const weight = new Particle(
        randRange(0, width),
        randRange(0, height),
        randRange(10, 20),
        randRange(0, degToR(360)),
    );

    weight.radius = 20;
    weight.friction = 0.9;

    const springPoint = new Particle(randRange(0, width), randRange(0, height), 0, 0);
    const moveSpringPoint = new Particle(randRange(0, width), randRange(0, height), 0, 0);

    moveSpringPoint.radius = 5;
    springPoint.radius = 5;

    const springFactor = 0.1;
    const springLength = 100;

    weight.addSpring(springPoint, springFactor, springLength);
    weight.addSpring(moveSpringPoint, springFactor, springLength);

    doc.addEventListener('mousemove', (ev) => {
        moveSpringPoint.x = ev.clientX;
        moveSpringPoint.y = ev.clientY;
    });

    function render(): void {
        weight.update();
        springPoint.update();
        moveSpringPoint.update();
        ctx.clearRect(0, 0, width, height);

        ctx.beginPath();
        ctx.arc(weight.x, weight.y, weight.radius, 0, degToR(360));
        ctx.fill();

        ctx.beginPath();
        ctx.arc(springPoint.x, springPoint.y, springPoint.radius, 0, degToR(360));
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(
            moveSpringPoint.x,
            moveSpringPoint.y,
            moveSpringPoint.radius,
            0,
            degToR(360),
        );
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(weight.x, weight.y);
        ctx.lineTo(springPoint.x, springPoint.y);

        ctx.moveTo(weight.x, weight.y);
        ctx.lineTo(moveSpringPoint.x, moveSpringPoint.y);
        ctx.stroke();

        win.requestAnimationFrame(render);
    }

    render();
}

export function springsTest2(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    win?: Window,
    doc?: Document,
): void {
    const weight = new Particle(
        randRange(0, width),
        randRange(0, height),
        randRange(10, 20),
        randRange(0, degToR(360)),
    );

    weight.radius = 20;
    weight.friction = 0.9;

    const springPoint01 = new Particle(randRange(0, width), randRange(0, height), 0, 0);
    const springPoint02 = new Particle(randRange(0, width), randRange(0, height), 0, 0);
    const springPoint03 = new Particle(randRange(0, width), randRange(0, height), 0, 0);

    springPoint01.radius = 5;
    springPoint02.radius = 5;
    springPoint03.radius = 5;

    const springFactor = 0.01;
    const springLength = 100;

    weight.addSpring(springPoint01, springFactor, springLength);
    weight.addSpring(springPoint02, springFactor, springLength);
    weight.addSpring(springPoint03, springFactor, springLength);

    doc.addEventListener('mouseup', (ev) => {
        weight.x = ev.clientX;
        weight.y = ev.clientY;

        weight.vx = 0;
        weight.vy = 0;
    });

    function render(): void {
        weight.update();
        springPoint01.update();
        springPoint02.update();
        springPoint03.update();

        ctx.clearRect(0, 0, width, height);

        ctx.beginPath();
        ctx.arc(weight.x, weight.y, weight.radius, 0, degToR(360));
        ctx.fill();

        ctx.beginPath();
        ctx.arc(springPoint01.x, springPoint01.y, springPoint01.radius, 0, degToR(360));
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(springPoint02.x, springPoint02.y, springPoint02.radius, 0, degToR(360));
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(springPoint03.x, springPoint03.y, springPoint03.radius, 0, degToR(360));
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(weight.x, weight.y);
        ctx.lineTo(springPoint01.x, springPoint01.y);

        ctx.moveTo(weight.x, weight.y);
        ctx.lineTo(springPoint02.x, springPoint02.y);

        ctx.moveTo(weight.x, weight.y);
        ctx.lineTo(springPoint03.x, springPoint03.y);

        ctx.stroke();

        win.requestAnimationFrame(render);
    }

    render();
}

export function gravitationTest(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    win?: Window,
    doc?: Document,
): void {
    const sun01 = new Particle(250, 250, 0, 0);
    const sun02 = new Particle(700, 400, 0, 0);
    const sun03 = new Particle(300, 600, 0, 0);

    sun01.radius = 40;
    sun01.mass = 1e4;

    sun02.radius = 50;
    sun02.mass = 1e5;

    sun03.radius = 40;
    sun03.mass = 1e5;

    const emitPoint = new Vector(50, 0);
    const points: Particle[] = [];

    range(0, 100).forEach(() => {
        const p = new Particle(emitPoint.x, emitPoint.y, randRange(10, 50), degToR(75));
        p.radius = 2;
        p.addGravitation(sun01).addGravitation(sun02).addGravitation(sun03);
        points.push(p);
    });

    function render(): void {
        points.forEach((p) => {
            p.update();
            if (p.x > width || p.x < 0 || p.y < 0 || p.y > height) {
                p.x = emitPoint.x;
                p.y = emitPoint.y;
                p.setSpeed(randRange(10, 50));
                p.setDirection(randRange(degToR(75), degToR(85)));
            }
        });

        sun01.update();
        sun02.update();

        ctx.clearRect(0, 0, width, height);

        points.forEach((p) => {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, degToR(360));
            ctx.fill();
        });

        ctx.beginPath();
        ctx.arc(sun01.x, sun01.y, sun01.radius, 0, degToR(360));
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(sun02.x, sun02.y, sun02.radius, 0, degToR(360));
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(sun03.x, sun03.y, sun03.radius, 0, degToR(360));
        ctx.stroke();

        win.requestAnimationFrame(render);
    }

    render();
}
