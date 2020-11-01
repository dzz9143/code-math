import Delaunator from 'delaunator';

function main(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    win?: Window,
    doc?: Document,
): void {
    const gridSize = 15;
    const jitter = 0.5;

    const points: any[] = [];
    for (let x = 0; x <= gridSize; x++) {
        for (let y = 0; y <= gridSize; y++) {
            points.push({
                x: x + jitter * (Math.random() - Math.random()),
                y: y + jitter * (Math.random() - Math.random()),
            });
        }
    }

    const delaunay = Delaunator.from(
        points,
        (p) => p.x,
        (p) => p.y,
    );

    console.log('delaunay:', delaunay);

    function calculateCentroids(points: any, delaunay: any) {
        const numTriangles = delaunay.halfedges.length / 3;
        const centroids = [];
        for (let t = 0; t < numTriangles; t++) {
            let sumOfX = 0,
                sumOfY = 0;
            for (let i = 0; i < 3; i++) {
                const s = 3 * t + i;
                const p = points[delaunay.triangles[s]];
                sumOfX += p.x;
                sumOfY += p.y;
            }
            centroids[t] = { x: sumOfX / 3, y: sumOfY / 3 };
        }
        return centroids;
    }

    const map = {
        points,
        numRegions: points.length,
        numTriangles: delaunay.halfedges.length / 3,
        numEdges: delaunay.halfedges.length,
        halfedges: delaunay.halfedges,
        triangles: delaunay.triangles,
        centers: calculateCentroids(points, delaunay),
    };
    function triangleOfEdge(e: any): number {
        return Math.floor(e / 3);
    }
    function nextHalfedge(e: any): number {
        return e % 3 === 2 ? e - 2 : e + 1;
    }
    function drawCellBoundaries(ctx: CanvasRenderingContext2D, map: any) {
        const { points, triangles, halfedges } = map;
        ctx.save();
        ctx.scale(width / gridSize, height / gridSize);
        ctx.lineWidth = 0.02;
        ctx.strokeStyle = 'black';
        for (let e = 0; e < triangles.length; e++) {
            if (e > halfedges[e]) {
                const p = points[triangles[e]];
                const q = points[triangles[nextHalfedge(e)]];
                if (p && q) {
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(q.x, q.y);
                    ctx.stroke();
                }
            }
        }
        ctx.restore();
    }

    function render(): void {
        ctx.clearRect(0, 0, width, height);
        ctx.save();

        ctx.scale(width / gridSize, height / gridSize);
        ctx.fillStyle = 'hsl(0, 50%, 50%)';
        for (const { x, y } of points) {
            ctx.beginPath();
            ctx.arc(x, y, 0.1, 0, 2 * Math.PI);
            ctx.fill();
        }

        ctx.restore();

        drawCellBoundaries(ctx, map);
    }

    function mainLoop(): void {
        render();
        win.requestAnimationFrame(mainLoop);
    }

    mainLoop();
}

export default main;
