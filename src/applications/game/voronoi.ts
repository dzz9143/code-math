import Delaunator from 'delaunator';
import SimplexNoise from 'simplex-noise';
import { distance, map } from '../../utility';

type Point = {
    x: number;
    y: number;
};

type Cell = {
    pid: number;
    points: Point[];
};

type InitOptions = {
    row: number;
    col: number;
    x: number;
    y: number;
    width: number;
    height: number;
    renderOptions?: {
        mesh: boolean;
    };
};

class Voronoi {
    numOfTriangles: number;
    numOfHalfEdges: number;
    xScale: number;
    yScale: number;
    points: Point[];
    centroids: Point[];
    elevation: number[];
    moisture: number[];
    delaunay: Delaunator<Point>;
    options: InitOptions;

    connections: Map<number, number[]>;

    // for test
    selectPids: Set<number>;

    constructor(options: InitOptions) {
        this.options = options;

        this.points = [];
        this.centroids = [];
        this.elevation = [];
        this.moisture = [];
        this.xScale = this.options.width / this.options.col;
        this.yScale = this.options.height / this.options.row;

        // for selection
        this.selectPids = new Set<number>();

        // generate seed points
        const jitter = 0.5;
        for (let r = 0; r < this.options.row; r++) {
            for (let c = 0; c < this.options.col; c++) {
                this.points.push({
                    x: c + jitter * (Math.random() - Math.random()),
                    y: r + jitter * (Math.random() - Math.random()),
                });
            }
        }

        // create delaunay triangluation
        this.delaunay = Delaunator.from(
            this.points,
            (p) => p.x,
            (p) => p.y,
        );

        this.numOfTriangles = Math.floor(this.delaunay.halfedges.length / 3);
        this.numOfHalfEdges = this.delaunay.halfedges.length;

        // calculate the centroid of each triangle
        for (let tid = 0; tid < this.numOfTriangles; tid++) {
            this.centroids[tid] = this.getCentroidOfTriangle(tid);
        }

        // save all edges
        this.connections = new Map<number, number[]>();
        for (let eid = 0; eid < this.numOfHalfEdges; eid++) {
            const startPid = this.delaunay.triangles[eid];
            const endPid = this.delaunay.triangles[this.delaunay.halfedges[eid]];
            if (this.connections.has(startPid)) {
                this.connections.get(startPid).push(endPid);
            } else {
                this.connections.set(startPid, [endPid]);
            }
        }

        // generate noise
        const waveLength = 0.5;
        const noise = new SimplexNoise();

        // meat of the algorithm
        this.points.forEach((p, idx) => {
            const nx = p.x / this.options.col - 0.5;
            const ny = p.y / this.options.row - 0.5;

            let e = (1 + noise.noise2D(nx / waveLength, ny / waveLength)) / 2;
            // const d = 2 * Math.max(Math.abs(nx), Math.abs(ny));
            const d = Math.abs(nx) + Math.abs(ny);
            e = (1 + e - d) / 2;
            this.elevation[idx] = e;
            // this.moisture[idx] =
            //     (1 + noise.noise2D(nx / waveLength, ny / waveLength)) / 2;
        });
    }

    private getEdgeIdsAroundPoint(startEid: number): number[] {
        const result = [];
        let incoming = startEid;
        do {
            result.push(incoming);
            const outgoing = this.getNextEdgeId(incoming);
            incoming = this.getOppositeEdge(outgoing);
        } while (incoming !== -1 && incoming !== startEid);
        return result;
    }

    // get pid & points of a voronoi cell (region)
    private getVoronoiCells(): Cell[] {
        const result = [];
        const seen = new Set();
        for (let eid = 0; eid < this.numOfHalfEdges; eid++) {
            const pid = this.getEndPointOfEdge(eid);
            if (!seen.has(pid)) {
                seen.add(pid);
                const eids = this.getEdgeIdsAroundPoint(eid);
                const tids = eids.map((eid) => this.getTriangleIdOfEdge(eid));
                result.push({
                    pid: this.delaunay.triangles[this.getNextEdgeId(eid)],
                    points: tids.map((tid) => this.centroids[tid]),
                });
            }
        }
        return result;
    }

    // calculate color based on elevation & moisture for each point(region, cell)
    private getBiomeColor(pid: number): string {
        const e = this.elevation[pid];
        const step = Math.floor(e / 0.1);
        const r = 50 + 20 * step;

        return `rgb(${r}, ${r}, ${r})`;

        // let e = (this.elevation[pid] - 0.5) * 2,
        //     m = this.moisture[pid];
        // let r = 0,
        //     g = 0,
        //     b = 0;
        // if (e < 0.0) {
        //     r = 48 + 48 * e;
        //     g = 64 + 64 * e;
        //     b = 127 + 127 * e;
        // } else {
        //     m = m * (1 - e);
        //     e = e ** 4; // tweaks
        //     r = 210 - 100 * m;
        //     g = 185 - 45 * m;
        //     b = 139 - 45 * m;
        //     (r = 255 * e + r * (1 - e)),
        //         (g = 255 * e + g * (1 - e)),
        //         (b = 255 * e + b * (1 - e));
        // }
        // return `rgb(${r | 0}, ${g | 0}, ${b | 0})`;
    }

    private getCentroidOfTriangle(tid: number): Point {
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

    private getTriangleIdOfEdge(eid: number): number {
        return Math.floor(eid / 3);
    }

    private getEdgeIdsOfTriangle(tid: number): number[] {
        const s = tid * 3;
        return [s, s + 1, s + 2];
    }

    private getStartPointOfEdge(eid: number): Point {
        const pid = this.delaunay.triangles[eid];
        if (pid === -1) {
            return null;
        }
        return this.points[pid];
    }

    private getEndPointOfEdge(eid: number): Point {
        const pid = this.delaunay.triangles[this.getOppositeEdge(eid)];
        if (pid === -1) {
            return null;
        }

        return this.points[pid];
    }

    private getOppositeEdge(eid: number): number {
        return this.delaunay.halfedges[eid];
    }

    private getNextEdgeId(eid: number): number {
        return eid % 3 === 2 ? eid - 2 : eid + 1;
    }

    public render(ctx: CanvasRenderingContext2D): void {
        ctx.save();
        ctx.scale(this.xScale, this.yScale);

        if (this.options.renderOptions && this.options.renderOptions.mesh) {
            // render edges
            for (let eid = 0; eid < this.numOfHalfEdges; eid++) {
                if (eid < this.delaunay.halfedges[eid]) {
                    const p0 = this.getStartPointOfEdge(eid);
                    const p1 = this.getStartPointOfEdge(this.getOppositeEdge(eid));
                    ctx.beginPath();
                    ctx.strokeStyle = 'rgb(20, 20, 20)';
                    ctx.lineWidth = 0.01;
                    ctx.moveTo(p0.x, p0.y);
                    ctx.lineTo(p1.x, p1.y);
                    ctx.stroke();
                }
            }

            // render points
            ctx.fillStyle = 'rgb(0, 0, 0)';
            this.points.forEach((p) => {
                ctx.beginPath();
                ctx.arc(p.x, p.y, 0.02, 0, Math.PI * 2);
                ctx.fill();
            });

            // render voronoi edges
            for (let eid = 0; eid < this.numOfHalfEdges; eid++) {
                if (eid < this.delaunay.halfedges[eid]) {
                    const p0 = this.centroids[this.getTriangleIdOfEdge(eid)];
                    const p1 = this.centroids[
                        this.getTriangleIdOfEdge(this.getOppositeEdge(eid))
                    ];

                    ctx.beginPath();
                    ctx.strokeStyle = 'blue';
                    ctx.lineWidth = 0.02;
                    ctx.moveTo(p0.x, p0.y);
                    ctx.lineTo(p1.x, p1.y);
                    ctx.stroke();
                }
            }

            // render centroids
            ctx.fillStyle = 'red';
            this.centroids.forEach((p) => {
                ctx.beginPath();
                ctx.arc(p.x, p.y, 0.05, 0, Math.PI * 2);
                ctx.fill();
            });
        }

        // render each regions (aka cells)
        const cells = this.getVoronoiCells();

        cells.forEach(({ points, pid }) => {
            ctx.beginPath();
            if (this.selectPids.has(pid)) {
                ctx.fillStyle = 'red';
            } else {
                ctx.fillStyle = this.getBiomeColor(pid);
            }
            const p0 = points[0];
            ctx.moveTo(p0.x, p0.y);
            for (let i = 1; i < points.length; i++) {
                const p = points[i];
                ctx.lineTo(p.x, p.y);
            }
            ctx.lineTo(p0.x, p0.y);

            ctx.fill();
        });

        ctx.restore();
    }

    public getRegionFromWorldPos(worldX: number, worldY: number): void {
        const x = worldX / this.xScale;
        const y = worldY / this.yScale;

        let min = 1000;
        let selectPid = -1;
        this.points.forEach((p, idx) => {
            const d = distance(x, y, p.x, p.y);
            if (d < min) {
                min = d;
                selectPid = idx;
            }
        });

        if (selectPid) {
            this.selectPids.clear();
            this.selectPids.add(selectPid);
            const connectPids = this.connections.get(selectPid);
            if (connectPids) {
                connectPids.forEach((p) => this.selectPids.add(p));
            }
        }
    }
}

function main(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    win?: Window,
    doc?: Document,
): void {
    const voronoi = new Voronoi({
        x: 0,
        y: 0,
        width: 640,
        height: 640,
        col: 32,
        row: 32,
    });

    doc.addEventListener('click', (e) => {
        voronoi.getRegionFromWorldPos(e.clientX, e.clientY);
    });

    function render(): void {
        ctx.clearRect(0, 0, width, height);
        voronoi.render(ctx);
    }

    function mainLoop(): void {
        render();
        win.requestAnimationFrame(mainLoop);
    }

    mainLoop();
}

export default main;
