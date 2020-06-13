import { randRange, degToR, map } from './utility';

export function rectInSpace(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    win?: Window,
    doc?: Document,
): void {
    const fl = 300;

    ctx.translate(width / 2, height / 2);

    const shapes: any[] = [];

    for (let i = 0; i < 100; i++) {
        shapes.push({
            x: randRange(-1000, 1000),
            y: randRange(-1000, 1000),
            z: randRange(100, 5000),
        });
    }

    function render(): void {
        ctx.clearRect(-width / 2, -height / 2, width, height);

        shapes.forEach((shape) => {
            ctx.save();

            const perspective = fl / (fl + shape.z);

            ctx.scale(perspective, perspective);
            ctx.translate(shape.x, shape.y);

            ctx.fillRect(shape.x, shape.y, 200, 100);

            ctx.restore();

            shape.z -= 5;

            if (shape.z < 0) {
                shape.z = randRange(100, 2000);
            }
        });

        win.requestAnimationFrame(render);
    }

    render();
}

export function lineInSpace(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    win?: Window,
    doc?: Document,
): void {
    const fl = 300;

    ctx.translate(width / 2, height / 2);

    const lines: any[] = [];

    for (let i = 0; i < 300; i++) {
        lines.push({
            x: randRange(-4000, 4000),
            y: randRange(-4000, 4000),
            z: randRange(100, 10000),
            length: randRange(1000, 2000),
            speed: randRange(50, 150),
        });
    }

    function render(): void {
        ctx.clearRect(-width / 2, -height / 2, width, height);

        lines.forEach((line) => {
            const p1 = line.z < 0 ? 1 : fl / (fl + line.z);
            const p2 = fl / (fl + line.z + line.length);
            ctx.beginPath();
            ctx.moveTo(line.x * p1, line.y * p1);
            ctx.lineTo(line.x * p2, line.y * p2);
            ctx.stroke();

            line.z -= line.speed;
            if (line.z < -line.length) {
                line.z = 10000;
            }
        });

        win.requestAnimationFrame(render);
    }

    render();
}

export function carouselRect(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    win?: Window,
    doc?: Document,
): void {
    const fl = 300;

    ctx.translate(width / 2, height / 2);

    const rects: any[] = [];
    const num = 10;
    const centerZ = 600;
    const radius = 400;
    const baseY = 0;

    let baseAngle = 0;
    let rotationSpeed = 0;
    let yOffset = 0;

    for (let i = 0; i < num; i++) {
        rects.push({
            angle: degToR((360 / num) * i),
            w: 200,
            h: 100,
            color: `rgb(${randRange(0, 255)}, ${randRange(0, 255)}, ${randRange(
                0,
                255,
            )})`,
        });
    }

    doc.addEventListener('mousemove', (ev) => {
        const clientX = ev.clientX;
        const clientY = ev.clientY;
        rotationSpeed = map(clientX, 0, width, 0.05, -0.05);
        yOffset = map(clientY, 0, height, -300, 300);
    });

    function zsort(a: any, b: any): number {
        const az = centerZ + Math.cos(a.angle + baseAngle) * radius;
        const bz = centerZ + Math.cos(b.angle + baseAngle) * radius;
        return bz - az;
    }

    function render(): void {
        ctx.clearRect(-width / 2, -height / 2, width, height);

        rects.sort(zsort);

        rects.forEach((rect) => {
            const x = Math.sin(rect.angle + baseAngle) * radius;
            const z = centerZ + Math.cos(rect.angle + baseAngle) * radius;
            const p = fl / (fl + z);
            const y = baseY + yOffset;

            ctx.save();
            ctx.fillStyle = rect.color;
            ctx.scale(p, p);
            ctx.translate(x, y);
            ctx.beginPath();
            ctx.rect(-rect.w / 2, -rect.h / 2, rect.w, rect.h);
            ctx.fill();
            ctx.restore();
        });

        baseAngle += rotationSpeed;

        win.requestAnimationFrame(render);
    }

    render();
}

export function spiralDots(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    win?: Window,
    doc?: Document,
): void {
    const fl = 300;

    ctx.translate(width / 2, height / 2);

    const dots: any[] = [];
    const num = 1000;
    const centerZ = 600;
    const radius = 500;

    let baseAngle = 0;
    let rotationSpeed = 0;
    let yOffset = 0;

    for (let i = 0; i < num; i++) {
        dots.push({
            angle: degToR(10) * i,
            y: -1500 + 10 * i,
            color: `rgb(${randRange(0, 255)}, ${randRange(0, 255)}, ${randRange(
                0,
                255,
            )})`,
        });
    }

    doc.addEventListener('mousemove', (ev) => {
        const clientX = ev.clientX;
        const clientY = ev.clientY;
        rotationSpeed = map(clientX, 0, width, 0.05, -0.05);
        yOffset = map(clientY, 0, height, -300, 300);
    });

    function zsort(a: any, b: any): number {
        const az = centerZ + Math.cos(a.angle + baseAngle) * radius;
        const bz = centerZ + Math.cos(b.angle + baseAngle) * radius;
        return bz - az;
    }

    function render(): void {
        ctx.clearRect(-width / 2, -height / 2, width, height);

        dots.sort(zsort);

        dots.forEach((dot) => {
            const x = Math.sin(dot.angle + baseAngle) * radius;
            const z = centerZ + Math.cos(dot.angle + baseAngle) * radius;
            const p = fl / (fl + z);
            const y = dot.y + yOffset;

            ctx.save();
            ctx.fillStyle = dot.color;
            ctx.scale(p, p);
            ctx.translate(x, y);
            ctx.beginPath();
            ctx.arc(0, 0, 10, 0, degToR(360));
            ctx.fill();
            ctx.restore();
        });

        baseAngle += rotationSpeed;

        win.requestAnimationFrame(render);
    }

    render();
}

export function insideSpiralDots(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    win?: Window,
    doc?: Document,
): void {
    const fl = 300;

    ctx.translate(width / 2, height / 2);

    const dots: any[] = [];
    const num = 1000;
    const centerZ = -300;
    const radius = width / 2;

    let baseAngle = 0;
    let rotationSpeed = 0;
    let yOffset = 0;

    for (let i = 0; i < num; i++) {
        dots.push({
            angle: degToR(20) * i,
            y: -1500 + 20 * i,
            color: `rgb(${randRange(0, 255)}, ${randRange(0, 255)}, ${randRange(
                0,
                255,
            )})`,
        });
    }

    doc.addEventListener('mousemove', (ev) => {
        const clientX = ev.clientX;
        const clientY = ev.clientY;
        rotationSpeed = map(clientX, 0, width, 0.05, -0.05);
        yOffset = map(clientY, 0, height, -300, 300);
    });

    function zsort(a: any, b: any): number {
        const az = centerZ + Math.cos(a.angle + baseAngle) * radius;
        const bz = centerZ + Math.cos(b.angle + baseAngle) * radius;
        return bz - az;
    }

    function render(): void {
        ctx.clearRect(-width / 2, -height / 2, width, height);

        dots.sort(zsort);

        dots.forEach((dot) => {
            const x = Math.sin(dot.angle + baseAngle) * radius;
            const z = centerZ + Math.cos(dot.angle + baseAngle) * radius;
            if (z < 0) return;
            const p = fl / (fl + z);
            const y = dot.y + yOffset;

            ctx.save();
            ctx.fillStyle = dot.color;
            ctx.scale(p, p);
            ctx.translate(x, y);
            ctx.beginPath();
            ctx.arc(0, 0, 10, 0, degToR(360));
            ctx.fill();
            ctx.restore();
        });

        baseAngle += rotationSpeed;

        win.requestAnimationFrame(render);
    }

    render();
}

export function weirdSpiralMesh(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    win?: Window,
    doc?: Document,
): void {
    const fl = 300;

    ctx.translate(width / 2, height / 2);

    const points: any[] = [];
    const num = 1000;
    const centerZ = 600;
    const radius = 400;

    let baseAngle = 0;
    let rotationSpeed = 0;
    let yOffset = 0;

    for (let i = 0; i < num; i++) {
        points.push({
            angle: degToR(20) * i,
            y: -1500 + 20 * i + randRange(0, 200),
        });
    }

    doc.addEventListener('mousemove', (ev) => {
        const clientX = ev.clientX;
        const clientY = ev.clientY;
        rotationSpeed = map(clientX, 0, width, 0.05, -0.05);
        yOffset = map(clientY, 0, height, -300, 300);
    });

    function render(): void {
        ctx.clearRect(-width / 2, -height / 2, width, height);

        ctx.beginPath();

        let i = 0;
        points.forEach((point) => {
            const x = Math.sin(point.angle + baseAngle) * radius;
            const z = centerZ + Math.cos(point.angle + baseAngle) * radius;
            const p = fl / (fl + z);
            const y = point.y + yOffset;

            ctx.save();
            ctx.scale(p, p);
            ctx.translate(x, y);

            if (i === 0) {
                ctx.moveTo(0, 0);
            } else {
                ctx.lineTo(0, 0);
            }

            ctx.restore();
            i++;
        });

        ctx.stroke();

        baseAngle += rotationSpeed;

        win.requestAnimationFrame(render);
    }

    render();
}
