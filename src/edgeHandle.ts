import { Particle } from './particle';
import { randRange, degToR, range } from './utility';

export function soomthWrapping(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    win?: Window,
): void {
    const centerX = width / 2;
    const centerY = height / 2;

    const r = 40;
    const p = new Particle(
        centerX,
        centerY,
        Math.random() * 5 + 5,
        Math.random() * Math.PI * 2,
    );

    function render(): void {
        p.update();

        if (p.position.x > width + r) {
            p.position.x = -r;
        }

        if (p.position.x < -r) {
            p.position.x = width + r;
        }

        if (p.position.y > height + r) {
            p.position.y = -r;
        }

        if (p.position.y < -r) {
            p.position.y = height + r;
        }

        ctx.clearRect(0, 0, width, height);
        ctx.beginPath();
        ctx.arc(p.position.x, p.position.y, r, 0, Math.PI * 2);
        ctx.fill();

        win.requestAnimationFrame(render);
    }

    render();
}

export function bouncingParticle(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    win?: Window,
): void {
    const centerX = width / 2;
    const centerY = height / 2;

    const r = 40;
    const p = new Particle(
        centerX,
        centerY,
        Math.random() * 5 + 5,
        Math.random() * Math.PI * 2,
    );

    function render(): void {
        p.update();

        if (p.position.x >= width - r) {
            p.position.x = width - r;
            p.velocity.x *= -1;
        }

        if (p.position.x <= r) {
            p.position.x = r;
            p.velocity.x *= -1;
        }

        if (p.position.y >= height - r) {
            p.position.y = height - r;
            p.velocity.y *= -1;
        }

        if (p.position.y <= r) {
            p.position.y = r;
            p.velocity.y *= -1;
        }

        ctx.clearRect(0, 0, width, height);
        ctx.beginPath();
        ctx.arc(p.position.x, p.position.y, r, 0, Math.PI * 2);
        ctx.fill();

        win.requestAnimationFrame(render);
    }

    render();
}

export function droppingBall(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    win?: Window,
): void {
    const centerX = width / 2;
    const centerY = height / 2;

    const r = 20;
    const ball = new Particle(centerX / 5, centerY, randRange(3, 6), degToR(0), 1);
    ball.bounce = -0.9;
    function render(): void {
        ball.update();

        if (ball.position.x >= width - r) {
            ball.position.x = width - r;
            ball.velocity.x *= ball.bounce;
        }

        if (ball.position.x <= r) {
            ball.position.x = r;
            ball.velocity.x *= ball.bounce;
        }

        if (ball.position.y >= height - r) {
            ball.position.y = height - r;
            ball.velocity.y *= ball.bounce;
        }

        if (ball.position.y <= r) {
            ball.position.y = r;
            ball.velocity.y *= ball.bounce;
        }

        ctx.clearRect(0, 0, width, height);
        ctx.beginPath();
        ctx.arc(ball.position.x, ball.position.y, r, 0, Math.PI * 2);
        ctx.fill();

        win.requestAnimationFrame(render);
    }

    render();
}

export function fountain(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    win?: Window,
): void {
    const particles = range(0, 100).map(() => {
        const p = new Particle(
            width / 2,
            height,
            randRange(7, 12),
            randRange(degToR(-85), degToR(-95)),
            0.1,
        );
        p.radius = randRange(4, 10);
        return p;
    });

    function render(): void {
        ctx.clearRect(0, 0, width, height);

        particles.forEach((p) => {
            p.update();

            // recycle particles
            if (p.position.y > height + p.radius) {
                p.position.y = height;
                p.position.x = width / 2;

                p.velocity.setLength(randRange(7, 12));
                p.velocity.setAngle(randRange(degToR(-85), degToR(-95)));
            }

            ctx.beginPath();
            ctx.arc(p.position.x, p.position.y, p.radius, 0, Math.PI * 2);
            ctx.fill();
        });

        win.requestAnimationFrame(render);
    }

    render();
}
