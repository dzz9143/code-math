import { Particle } from './particle';

export function moveParticle(
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
                centerY,
                1 + Math.random() * 4,
                Math.random() * Math.PI * 2,
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
