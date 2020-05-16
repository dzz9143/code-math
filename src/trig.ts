export function trig1(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
): void {
    // push it down & flip
    ctx.translate(0, height / 2);
    ctx.scale(1, -1);
    for (let angle = 0; angle < Math.PI * 2; angle += 0.01) {
        const x = (angle * width) / (Math.PI * 2);
        const y = Math.sin(angle) * 200;
        ctx.fillRect(x, y, 5, 5);
    }
}

export function trig2(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    win?: Window,
): void {
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

export function circle(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    win?: Window,
): void {
    const centerX = width / 2;
    const centerY = height / 2;

    let angle = 0;
    const speed = 0.02;
    const r = 200;

    function render(): void {
        const x = centerX + Math.cos(angle) * r;
        const y = centerY + Math.sin(angle) * r;

        ctx.clearRect(0, 0, width, height);
        ctx.beginPath();
        ctx.arc(x, y, 20, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();

        // try draw 3 tails
        for (let i = 0; i < 3; i++) {
            const tailAngle = angle - (i + 1) * 0.5;
            if (tailAngle > 0) {
                const x = centerX + Math.cos(tailAngle) * r;
                const y = centerY + Math.sin(tailAngle) * r;

                ctx.beginPath();
                ctx.arc(x, y, 10, 0, Math.PI * 2);
                ctx.fill();
                ctx.closePath();
            }
        }

        angle += speed;
        win.requestAnimationFrame(render);
    }

    render();
}

export function ellipse(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    win?: Window,
): void {
    const centerX = width / 2;
    const centerY = height / 2;

    let angle = 0;
    const speed = 0.02;
    const xR = 400;
    const yR = 200;

    function render(): void {
        const x = centerX + Math.cos(angle) * xR;
        const y = centerY + Math.sin(angle) * yR;

        ctx.clearRect(0, 0, width, height);
        ctx.beginPath();
        ctx.arc(x, y, 20, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();

        // try draw 3 tails
        for (let i = 0; i < 10; i++) {
            const tailAngle = angle - (i + 1) * 0.5;
            if (tailAngle > 0) {
                const x = centerX + Math.cos(tailAngle) * xR;
                const y = centerY + Math.sin(tailAngle) * yR;

                ctx.beginPath();
                ctx.arc(x, y, 10, 0, Math.PI * 2);
                ctx.fill();
                ctx.closePath();
            }
        }

        angle += speed;
        win.requestAnimationFrame(render);
    }

    render();
}

export function lissajousCurve(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    win?: Window,
): void {
    const centerX = width / 2;
    const centerY = height / 2;

    let xAngle = 0;
    let yAngle = 0;
    const ySpeed = 0.1;
    const xSpeed = 0.131;
    const xR = 400;
    const yR = 200;

    function render(): void {
        const x = centerX + Math.cos(xAngle) * xR;
        const y = centerY + Math.sin(yAngle) * yR;

        ctx.clearRect(0, 0, width, height);
        ctx.beginPath();
        ctx.arc(x, y, 20, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();

        xAngle += xSpeed;
        yAngle += ySpeed;
        win.requestAnimationFrame(render);
    }

    render();
}

function randRange(left: number, right: number): number {
    return left + (right - left) * Math.random();
}

class Circle {
    private centerX: number;
    private centerY: number;
    private xR: number;
    private yR: number;
    private xAngle: number;
    private yAngle: number;
    private xSpeed: number;
    private ySpeed: number;

    constructor(x: number, y: number) {
        this.centerX = x;
        this.centerY = y;

        this.xR = randRange(200, 400);
        this.xAngle = randRange(0, Math.PI / 4);
        this.xSpeed = randRange(0.1, 0.2);
        this.yR = randRange(200, 400);
        this.yAngle = randRange(0, Math.PI / 4);
        this.ySpeed = randRange(0.1, 0.2);
    }

    public render(ctx: CanvasRenderingContext2D): void {
        const x = this.centerX + Math.cos(this.xAngle) * this.xR;
        const y = this.centerY + Math.sin(this.yAngle) * this.yR;
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();

        this.xAngle += this.xSpeed;
        this.yAngle += this.ySpeed;
    }
}

export function chaosCircles(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    win?: Window,
): void {
    const centerX = width / 2;
    const centerY = height / 2;

    const circles: Circle[] = [];

    for (let i = 0; i < 50; i++) {
        circles.push(new Circle(centerX, centerY));
    }

    function render(): void {
        ctx.clearRect(0, 0, width, height);

        circles.forEach((c) => {
            c.render(ctx);
        });

        win.requestAnimationFrame(render);
    }

    render();
}

export function arrow(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    win?: Window,
    doc?: Document,
): void {
    const arrowX = width / 2;
    const arrowY = height / 2;
    let dx = 0;
    let dy = 0;
    let angle = 0;

    function render(): void {
        ctx.clearRect(0, 0, width, height);

        ctx.save();

        ctx.translate(arrowX, arrowY);
        ctx.rotate(angle);

        // draw arrow
        ctx.beginPath();
        ctx.moveTo(20, 0);
        ctx.lineTo(-20, 0);
        ctx.moveTo(20, 0);
        ctx.lineTo(10, 10);
        ctx.moveTo(20, 0);
        ctx.lineTo(10, -10);
        ctx.stroke();

        ctx.restore();

        win.requestAnimationFrame(render);
    }

    doc.addEventListener('mousemove', (event) => {
        dx = event.clientX - arrowX;
        dy = event.clientY - arrowY;
        angle = Math.atan2(dy, dx);
    });

    render();
}
