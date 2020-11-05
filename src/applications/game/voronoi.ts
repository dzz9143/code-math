import Delaunator from 'delaunator';
import SimplexNoise from 'simplex-noise';
import PQ from 'priorityqueuejs';
// import { randRange } from 'src/utility';
import { Vector } from '../../vector';

function distance(x1: number, y1: number, x2: number, y2: number): number {
    const dx = x1 - x2;
    const dy = y1 - y2;

    return Math.sqrt(dx * dx + dy * dy);
}

const keyCodes = {
    KEY_LEFT: 37,
    KEY_UP: 38,
    KEY_RIGHT: 39,
    KEY_DOWN: 40,
    KEY_A: 65,
    KEY_S: 83,
    KEY_D: 68,
    KEY_W: 87,
};

type Point = {
    x: number;
    y: number;
};

type Position = {
    x: number;
    y: number;
};

type Cell = {
    pid: number;
    points: Point[];
};

type Region = {
    pid: number;
    position: Position;
};

type Vec2D = {
    x: number;
    y: number;
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

class Square {
    public x: number;
    public y: number;
    public w: number;
    public h: number;
    public color: string;
    constructor(x: number, y: number, w: number, h: number) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;

        this.color = 'rgb(255, 255, 255)';
    }

    render(ctx: CanvasRenderingContext2D): void {
        ctx.save();

        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.w, this.h);

        ctx.restore();
    }

    public getCenterPos(): Position {
        return {
            x: this.x + this.w / 2,
            y: this.y + this.h / 2,
        };
    }
}

class UserInput {
    private keyDownMap: any;
    private mouseClick: MouseEvent;

    constructor(doc: Document) {
        this.keyDownMap = {};
        doc.addEventListener('keydown', this.keyDownEventListener);
        doc.addEventListener('click', this.clickEventListener);
    }

    private clickEventListener = (ev: MouseEvent): void => {
        this.mouseClick = ev;
    };

    private keyDownEventListener = (ev: KeyboardEvent): void => {
        const keyCode = ev.keyCode;
        this.keyDownMap[keyCode] = true;
    };

    public clear(): void {
        this.keyDownMap = {};
        this.mouseClick = null;
    }

    public getMouseClick(): MouseEvent {
        return this.mouseClick;
    }

    public isKeyDown(code: number): boolean {
        return this.keyDownMap[code];
    }
}

class Player extends Square {
    private speed: number;

    constructor() {
        super(0, 0, 10, 10);
        this.speed = 30;
        this.color = 'rgb(200, 0, 0)';
    }

    public update(userInput: UserInput): void {
        if (userInput.isKeyDown(keyCodes.KEY_D)) {
            this.x += this.speed;
        }

        if (userInput.isKeyDown(keyCodes.KEY_A)) {
            this.x -= this.speed;
        }

        if (userInput.isKeyDown(keyCodes.KEY_W)) {
            this.y -= this.speed;
        }

        if (userInput.isKeyDown(keyCodes.KEY_S)) {
            this.y += this.speed;
        }
    }
}

class Enemy extends Square {
    private speed: number;
    private map: Voronoi;
    private vol: Vector;

    private targetRegion: Region;
    private nextRegion: Region;

    constructor(map: Voronoi) {
        super(0, 0, 10, 10);

        this.map = map;
        this.speed = 5;
        this.color = 'rgb(0, 200, 0)';

        this.vol = new Vector(0, 0);

        this.targetRegion = null;
        this.nextRegion = null;
    }

    public setTarget(target: Position): void {
        this.targetRegion = this.map.getNearestRegionFromWorldPos(target.x, target.y);
        this.nextRegion = null;
    }

    public update(): void {
        if (!this.targetRegion) {
            this.vol.setLength(0);
            return;
        }
        const centerPos = this.getCenterPos();
        const nearRegion = this.map.getNearestRegionFromWorldPos(
            centerPos.x,
            centerPos.y,
        );
        if (!this.nextRegion) {
            const regions = this.map.findPath(nearRegion.pid, this.targetRegion.pid);
            if (regions && regions.length > 0) {
                this.nextRegion = regions[regions.length - 1];
            }
        } else {
            const d = distance(
                nearRegion.position.x,
                nearRegion.position.y,
                centerPos.x,
                centerPos.y,
            );

            if (d < 3) {
                const regions = this.map.findPath(nearRegion.pid, this.targetRegion.pid);
                if (regions && regions.length > 0) {
                    this.nextRegion = regions[regions.length - 1];
                }
            }
        }

        if (this.nextRegion) {
            this.vol.x = this.nextRegion.position.x - centerPos.x;
            this.vol.y = this.nextRegion.position.y - centerPos.y;
            this.vol.setLength(this.speed);
        }

        this.x += this.vol.x;
        this.y += this.vol.y;
    }
}

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
        // const jitter = 0;
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
            if (!endPid) {
                console.log('startPid ', startPid, 'does not have end pid');
            }
            if (endPid) {
                if (this.connections.has(startPid)) {
                    this.connections.get(startPid).push(endPid);
                } else {
                    this.connections.set(startPid, [endPid]);
                }
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
            this.moisture[idx] =
                (1 + noise.noise2D(nx / waveLength, ny / waveLength)) / 2;
        });
    }

    public isRegionAvailable(pid: number): boolean {
        return this.elevation[pid] >= 0.5;
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
        // const step = Math.floor(e / 0.1);
        if (e > 0.5) {
            return 'rgb(200, 200, 200)';
        } else {
            // const r = 50 + 20 * step;
            if (e > 0.45) {
                return '#1b338d';
            } else if (e > 0.35) {
                return '#f796b9';
            } else if (e > 0.25) {
                return '#7bcfed';
            } else {
                return '#813ea2';
            }
            // return `rgb(${r},  ${r}, ${r})`;
        }

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

    public transferMapPosToWorldPos(pos: Position): Position {
        return {
            x: pos.x * this.xScale,
            y: pos.y * this.yScale,
        };
    }

    public getNearestRegionFromWorldPos(worldX: number, worldY: number): Region {
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

        if (selectPid < 0) {
            return null;
        }

        return {
            pid: selectPid,
            position: this.transferMapPosToWorldPos(this.points[selectPid]),
        };
    }

    public getNeighborRegions(worldX: number, worldY: number): Region[] {
        const nearestRegion = this.getNearestRegionFromWorldPos(worldX, worldY);

        if (!nearestRegion) {
            return [];
        }

        const neighborPids = this.connections.get(nearestRegion.pid);

        return neighborPids.map((p) => {
            return {
                pid: p,
                position: this.transferMapPosToWorldPos(this.points[p]),
            };
        });
    }

    public distanceBetweenPids(aPid: number, bPid: number): number {
        const a = this.points[aPid];
        const b = this.points[bPid];

        return distance(a.x, a.y, b.x, b.y);
    }

    public findPath(fromPid: number, toPid: number): Region[] {
        if (fromPid === toPid) {
            return [];
        }

        type Pid = number;
        type Entry = {
            pid: number;
            cost: number;
        };
        const frontier = new PQ<Entry>((a, b): number => b.cost - a.cost);
        const cameFrom = new Map<Pid, Pid>();
        const costSoFar = new Map<Pid, number>();

        frontier.enq({ pid: fromPid, cost: 0 });
        costSoFar.set(fromPid, 0);

        let found = false;
        while (frontier.size() > 0) {
            const cur = frontier.deq();
            if (cur.pid === toPid) {
                found = true;
                break;
            }

            const neighborPids = this.connections.get(cur.pid);
            neighborPids
                .filter((pid) => this.elevation[pid] > 0.5)
                .forEach((neighborPid) => {
                    const newCost =
                        costSoFar.get(cur.pid) +
                        this.distanceBetweenPids(cur.pid, neighborPid);
                    if (
                        !costSoFar.has(neighborPid) ||
                        newCost < costSoFar.get(neighborPid)
                    ) {
                        costSoFar.set(neighborPid, newCost);
                        const priority =
                            newCost + this.distanceBetweenPids(neighborPid, toPid);
                        frontier.enq({
                            pid: neighborPid,
                            cost: priority,
                        });
                        cameFrom.set(neighborPid, cur.pid);
                    }
                });
        }

        if (!found) {
            return [];
        }

        const pids = [];
        let pid = toPid;
        while (cameFrom.get(pid) !== fromPid) {
            const nextPid = cameFrom.get(pid);
            pids.push(nextPid);
            pid = nextPid;
        }

        return pids.map((pid) => {
            return {
                pid,
                position: this.transferMapPosToWorldPos(this.points[pid]),
            };
        });
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
        col: 56,
        row: 56,
    });

    const player = new Player();
    const enemy = new Enemy(voronoi);
    enemy.x = width / 2;
    enemy.y = height / 2;
    const userInput = new UserInput(doc);

    let region: Region = null;
    let regions: Region[] = null;
    doc.addEventListener('click', (e) => {
        region = voronoi.getNearestRegionFromWorldPos(e.clientX, e.clientY);
        enemy.setTarget({
            x: e.clientX,
            y: e.clientY,
        });
        const r = voronoi.getNearestRegionFromWorldPos(0, 0);
        regions = voronoi.findPath(r.pid, region.pid);
    });

    function update(): void {
        player.update(userInput);
        enemy.update();
        userInput.clear();
    }

    function render(): void {
        ctx.clearRect(0, 0, width, height);
        voronoi.render(ctx);
        player.render(ctx);
        enemy.render(ctx);

        if (region) {
            ctx.beginPath();
            ctx.fillStyle = 'red';
            ctx.arc(region.position.x, region.position.y, 2, 0, Math.PI * 2);
            ctx.fill();
        }

        if (regions) {
            regions.forEach((r) => {
                ctx.beginPath();
                ctx.fillStyle = 'blue';
                ctx.arc(r.position.x, r.position.y, 2, 0, Math.PI * 2);
                ctx.fill();
            });
        }
    }

    function mainLoop(): void {
        update();
        render();
        win.requestAnimationFrame(mainLoop);
    }

    mainLoop();
}

export default main;
