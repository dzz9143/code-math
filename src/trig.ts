export function trig1(ctx: CanvasRenderingContext2D, width: number, height: number): void {
    // push it down & flip
    ctx.translate(0, height / 2);
    ctx.scale(1, -1);
    for (let angle = 0; angle < Math.PI * 2; angle += 0.01) {
        const x = (angle * width) / (Math.PI * 2);
        const y = Math.sin(angle) * 200;
        ctx.fillRect(x, y, 5, 5);
    }
}
