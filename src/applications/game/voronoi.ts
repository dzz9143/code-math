import Delaunator from 'delaunator';
import { degToR } from '../../utility';

type Point = {
    x: number;
    y: number;
};

class Voronoi {
    gridSize: number;
    numOfTriangles: number;
    numOfHalfEdges: number;
    points: Point[];
    centroids: Point[];
    delaunay: Delaunator<any>;

    constructor(gridSize: number) {
        // seed points
        const jitter = 0.5;
        this.points = [];
        this.centroids = [];
        for (let i = 0; i < gridSize; i++) {
            for (let j = 0; j < gridSize; j++) {
                this.points.push({
                    x: i + jitter * (Math.random() - Math.random()),
                    y: j + jitter * (Math.random() - Math.random()),
                });
            }
        }

        this.gridSize = gridSize;

        // create delaunay triangluation
        this.delaunay = Delaunator.from(
            this.points,
            (p) => p.x,
            (p) => p.y,
        );

        this.numOfTriangles = Math.floor(this.delaunay.halfedges.length / 3);
        this.numOfHalfEdges = this.delaunay.halfedges.length;

        for (let tid = 0; tid < this.numOfTriangles; tid++) {
            this.centroids[tid] = this.getCentroidOfTriangle(tid);
        }
    }

    getCentroidOfTriangle(tid: number): Point {
        const eids = this.getEdgeIdsOfTriangle(tid);
        let sumOfX = 0;
        let sumOfY = 0;
        eids.map((eid) => this.getStartPointOfEdge(eid)).forEach((p) => {
            sumOfX += p.x;
            sumOfY += p.y;
        });

        return {
            x: sumOfX / 3,
            y: sumOfY / 3,
        };
    }

    getTriangleIdOfEdge(eid: number): number {
        return Math.floor(eid / 3);
    }

    getEdgeIdsOfTriangle(tid: number): number[] {
        const s = tid * 3;
        return [s, s + 1, s + 2];
    }

    getStartPointOfEdge(eid: number): Point {
        const pid = this.delaunay.triangles[eid];
        if (pid === -1) {
            return null;
        }
        return this.points[pid];
    }

    getOppositeEdge(eid: number): number {
        return this.delaunay.halfedges[eid];
    }

    render(ctx: CanvasRenderingContext2D, width: number, height: number): void {
        ctx.save();
        ctx.scale(width / this.gridSize, height / this.gridSize);

        // render triangles
        // for (let tid = 0; tid < this.numOfTriangles; tid++) {
        //     const edgeIdsOfTriangle = this.getEdgeIdsOfTriangle(tid);
        //     const [p0, p1, p2] = edgeIdsOfTriangle.map((eid) =>
        //         this.getStartPointOfEdge(eid),
        //     );

        //     ctx.beginPath();
        //     ctx.fillStyle = 'hsl(212,20%,50%)';
        //     ctx.moveTo(p0.x, p0.y);
        //     ctx.lineTo(p1.x, p1.y);
        //     ctx.lineTo(p2.x, p2.y);
        //     ctx.lineTo(p0.x, p0.y);
        //     ctx.fill();
        // }

        // render edges
        for (let eid = 0; eid < this.numOfHalfEdges; eid++) {
            if (eid < this.delaunay.halfedges[eid]) {
                const p0 = this.getStartPointOfEdge(eid);
                const p1 = this.getStartPointOfEdge(this.getOppositeEdge(eid));
                ctx.beginPath();
                ctx.strokeStyle = 'rgb(220, 220, 220)';
                ctx.lineWidth = 0.01;
                ctx.moveTo(p0.x, p0.y);
                ctx.lineTo(p1.x, p1.y);
                ctx.stroke();
            }
        }

        // render points
        ctx.fillStyle = 'blue';
        this.points.forEach((p) => {
            ctx.beginPath();
            ctx.arc(p.x, p.y, 0.02, 0, degToR(360));
            ctx.fill();
        });

        // render voronoi cell
        for (let eid = 0; eid < this.numOfHalfEdges; eid++) {
            if (eid < this.delaunay.halfedges[eid]) {
                const p0 = this.centroids[this.getTriangleIdOfEdge(eid)];
                const p1 = this.centroids[
                    this.getTriangleIdOfEdge(this.getOppositeEdge(eid))
                ];

                ctx.beginPath();
                ctx.strokeStyle = 'rgb(100, 100, 100)';
                ctx.lineWidth = 0.02;
                ctx.moveTo(p0.x, p0.y);
                ctx.lineTo(p1.x, p1.y);
                ctx.stroke();
            }
        }

        ctx.fillStyle = 'hsl(0, 50%, 50%)';
        this.centroids.forEach((p) => {
            ctx.beginPath();
            ctx.arc(p.x, p.y, 0.05, 0, degToR(360));
            ctx.fill();
        });

        ctx.restore();
    }
}

function main(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    win?: Window,
    doc?: Document,
): void {
    // const gridSize = 10;
    // const jitter = 0.5;

    // const points: any[] = [];
    // for (let x = 0; x <= gridSize; x++) {
    //     for (let y = 0; y <= gridSize; y++) {
    //         points.push({
    //             x: x + jitter * (Math.random() - Math.random()),
    //             y: y + jitter * (Math.random() - Math.random()),
    //         });
    //     }
    // }

    // const delaunay = Delaunator.from(
    //     points,
    //     (p) => p.x,
    //     (p) => p.y,
    // );

    // console.log('delaunay:', delaunay);

    // function calculateCentroids(points: any, delaunay: any) {
    //     const numTriangles = delaunay.halfedges.length / 3;
    //     const centroids = [];
    //     for (let t = 0; t < numTriangles; t++) {
    //         let sumOfX = 0,
    //             sumOfY = 0;
    //         for (let i = 0; i < 3; i++) {
    //             const s = 3 * t + i;
    //             const p = points[delaunay.triangles[s]];
    //             sumOfX += p.x;
    //             sumOfY += p.y;
    //         }
    //         centroids[t] = { x: sumOfX / 3, y: sumOfY / 3 };
    //     }
    //     return centroids;
    // }

    // const map = {
    //     points,
    //     numRegions: points.length,
    //     numTriangles: delaunay.halfedges.length / 3,
    //     numEdges: delaunay.halfedges.length,
    //     halfedges: delaunay.halfedges,
    //     triangles: delaunay.triangles,
    //     centers: calculateCentroids(points, delaunay),
    // };

    // function triangleOfEdge(e: any): number {
    //     return Math.floor(e / 3);
    // }
    // function nextHalfedge(e: any): number {
    //     return e % 3 === 2 ? e - 2 : e + 1;
    // }
    // function drawCellBoundaries(ctx: CanvasRenderingContext2D, map: any) {
    //     const { points, triangles, halfedges } = map;
    //     ctx.save();
    //     ctx.scale(width / gridSize, height / gridSize);
    //     ctx.lineWidth = 0.02;
    //     ctx.strokeStyle = 'black';
    //     for (let e = 0; e < triangles.length; e++) {
    //         if (e > halfedges[e]) {
    //             const p = points[triangles[e]];
    //             const q = points[triangles[nextHalfedge(e)]];
    //             if (p && q) {
    //                 ctx.beginPath();
    //                 ctx.moveTo(p.x, p.y);
    //                 ctx.lineTo(q.x, q.y);
    //                 ctx.stroke();
    //             }
    //         }
    //     }
    //     ctx.restore();
    // }

    const voronoi = new Voronoi(15);

    function render(): void {
        ctx.clearRect(0, 0, width, height);
        voronoi.render(ctx, width, height);
        // ctx.restore();
        // ctx.save();
        // ctx.scale(width / gridSize, height / gridSize);
        // ctx.fillStyle = 'hsl(0, 50%, 50%)';
        // for (const { x, y } of points) {
        //     ctx.beginPath();
        //     ctx.arc(x, y, 0.1, 0, 2 * Math.PI);
        //     ctx.fill();
        // }
        // ctx.restore();
        // ctx.save();
        // ctx.scale(width / gridSize, height / gridSize);
        // ctx.lineWidth = 0.02;
        // ctx.strokeStyle = 'black';
        // const p0 = points[delaunay.triangles[0]];
        // const p1 = points[delaunay.triangles[1]];
        // const p2 = points[delaunay.triangles[2]];
        // const p3 = points[delaunay.triangles[3]];
        // const p4 = points[delaunay.triangles[4]];
        // const p5 = points[delaunay.triangles[5]];
        // console.log(p0, p1, p2);
        // ctx.beginPath();
        // ctx.moveTo(p0.x, p0.y);
        // ctx.lineTo(p1.x, p1.y);
        // ctx.lineTo(p2.x, p2.y);
        // ctx.lineTo(p0.x, p0.y);
        // ctx.moveTo(p3.x, p3.y);
        // ctx.lineTo(p4.x, p4.y);
        // ctx.lineTo(p5.x, p5.y);
        // ctx.stroke();
        // ctx.restore();
        // drawCellBoundaries(ctx, map);
    }

    function mainLoop(): void {
        render();
        win.requestAnimationFrame(mainLoop);
    }

    mainLoop();
}

export default main;
