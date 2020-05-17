import { Particle } from './particle';
import { Vector } from './vector';
import { keyCodes } from './constant';

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

export function movePlane(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    win?: Window,
    doc?: Document,
): void {
    const plane = new Particle(width / 2, height / 2, 0, 0);
    const acc = new Vector(0, 0);

    plane.friction = 0.98;

    // plane head angle
    let angle = 0;

    // state flags
    let turningLeft = false;
    let turningRight = false;
    let thrusting = false;

    doc.addEventListener('keydown', (ev) => {
        switch (ev.keyCode) {
            case keyCodes.KEY_LEFT:
                turningLeft = true;
                break;
            case keyCodes.KEY_RIGHT:
                turningRight = true;
                break;
            case keyCodes.KEY_UP:
                thrusting = true;
                break;
        }
    });

    doc.addEventListener('keyup', (ev) => {
        switch (ev.keyCode) {
            case keyCodes.KEY_LEFT:
                turningLeft = false;
                break;
            case keyCodes.KEY_RIGHT:
                turningRight = false;
                break;
            case keyCodes.KEY_UP:
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

export function galaxy(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    win?: Window,
): void {
    const centerX = width / 2;
    const centerY = height / 2;

    const sun = new Particle(centerX, centerY, 0, 0, 0, 1e4);
    const earth = new Particle(centerX + 200, centerY, 7, Math.PI / 2);

    function render(): void {
        earth.gravitateTo(sun);
        earth.update();

        ctx.clearRect(0, 0, width, height);
        // render sun
        ctx.beginPath();
        ctx.arc(sun.position.x, sun.position.y, 30, 0, Math.PI * 2);
        ctx.fill();

        // render earth
        ctx.beginPath();
        ctx.arc(earth.position.x, earth.position.y, 5, 0, Math.PI * 2);
        ctx.fill();

        win.requestAnimationFrame(render);
    }

    render();
}
