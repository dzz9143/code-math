import { Particle } from './particle';

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
