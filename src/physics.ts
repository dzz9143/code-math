import { Particle } from './particle';
import { Vector } from './vector';

export function fireWork(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    win?: Window,
): void {
    const centerX = width / 2;
    const centerY = height / 2;
    const particles: Particle[] = [];
    for (let i = 0; i < 100; i++) {
        particles.push(
            new Particle(
                centerX,
                centerY / 4,
                2 + Math.random() * 5,
                Math.random() * Math.PI * 2,
                0.5,
            ),
        );
    }

    function render(): void {
        ctx.clearRect(0, 0, width, height);

        particles.forEach((p) => {
            p.update();

            ctx.beginPath();
            ctx.arc(p.position.x, p.position.y, 10, 0, Math.PI * 2);
            ctx.fill();
            ctx.closePath();
        });

        win.requestAnimationFrame(render);
    }

    render();
}

const KEY_UP = 38;
// const KEY_DOWN = 40;
const KEY_LEFT = 37;
const KEY_RIGHT = 39;

export function movePlane(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    win?: Window,
    doc?: Document,
): void {
    const plane = new Particle(width / 2, height / 2, 0, 0);
    const acc = new Vector(0, 0);

    // plane head angle
    let angle = 0;

    // state flags
    let turningLeft = false;
    let turningRight = false;
    let thrusting = false;

    doc.addEventListener('keydown', (ev) => {
        switch (ev.keyCode) {
            case KEY_LEFT:
                turningLeft = true;
                break;
            case KEY_RIGHT:
                turningRight = true;
                break;
            case KEY_UP:
                thrusting = true;
                break;
        }
    });

    doc.addEventListener('keyup', (ev) => {
        switch (ev.keyCode) {
            case KEY_LEFT:
                turningLeft = false;
                break;
            case KEY_RIGHT:
                turningRight = false;
                break;
            case KEY_UP:
                thrusting = false;
                break;
        }
    });

    function render(): void {
        // update
        if (turningLeft) {
            angle -= 0.1;
        }

        if (turningRight) {
            angle += 0.1;
        }

        acc.setAngle(angle);

        if (thrusting) {
            acc.setLength(0.05);
        } else {
            acc.setLength(0);
        }

        plane.accelerate(acc);
        plane.update();

        // limit within the window
        if (plane.position.x > width) {
            plane.position.x = 0;
        }

        if (plane.position.x < 0) {
            plane.position.x = width;
        }

        if (plane.position.y > height) {
            plane.position.y = 0;
        }

        if (plane.position.y < 0) {
            plane.position.y = height;
        }

        // render
        ctx.clearRect(0, 0, width, height);
        ctx.save();

        ctx.translate(plane.position.x, plane.position.y);
        ctx.rotate(angle);

        ctx.beginPath();
        ctx.moveTo(10, 0);
        ctx.lineTo(0, 5);
        ctx.lineTo(0, -5);
        ctx.lineTo(10, 0);

        if (thrusting) {
            ctx.moveTo(0, 0);
            ctx.lineTo(-5, 0);
        }

        ctx.stroke();
        ctx.restore();

        win.requestAnimationFrame(render);
    }

    render();
}
