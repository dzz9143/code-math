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

export function trig2(ctx: CanvasRenderingContext2D, width: number, height: number, win?: Window): void {
    const centerY = height / 2;

    const baseY = centerY;
    const offsetY = height * 0.4;
    const baseAlpha = 0.5;
    const offsetAlpha = 0.5;
    const baseR = 50;
    const offsetR = 20;
    const startValue = 0;
    const increValue = 0.1;
    let value = startValue;

    function render(): void {
        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = 'rgb(0, 0,0)';
        // a circle move up and down
        let x = width / 5;
        let y = baseY + Math.sin(value) * offsetY;

        ctx.beginPath();
        ctx.arc(x, y, 50, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();

        // a circle bump and shrink
        x = (2 * width) / 5;
        y = centerY;
        const r = baseR + Math.sin(value) * offsetR;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();

        // a circle light & dark
        const alpha = baseAlpha + Math.sin(value) * offsetAlpha;
        ctx.fillStyle = `rgba(0, 0, 0, ${alpha})`;
        x = (3 * width) / 5;
        y = centerY;
        ctx.beginPath();
        ctx.arc(x, y, 50, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();

        // incre value
        value += increValue;

        // start next loop
        win.requestAnimationFrame(render);
    }

    render();
}
