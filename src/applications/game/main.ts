import PQ from 'priorityqueuejs';

import { keyCodes } from '../../constant';
import { clamp, randRange } from '../../utility';

type Tile = {
    c: number;
    r: number;
    cost?: number;
    id?: number;
};

class Grid {
    public row: number;
    public col: number;
    public tileSize: number;

    // top left corner position
    public x: number;
    public y: number;

    public top: number;
    public bottom: number;
    public left: number;
    public right: number;

    constructor(row: number, col: number, tileSize: number, x = 0, y = 0) {
        this.row = row;
        this.col = col;
        this.tileSize = tileSize;

        this.x = x;
        this.y = y;

        this.left = this.x;
        this.right = this.x + this.col * this.tileSize;
        this.top = this.y;
        this.bottom = this.y + this.row * this.tileSize;
    }

    public render(ctx: CanvasRenderingContext2D): void {
        ctx.save();
        ctx.strokeStyle = 'rgb(200, 200, 200)';
        ctx.beginPath();

        for (let i = 0; i < this.row; i++) {
            const y = i * this.tileSize;
            ctx.moveTo(this.left, y);
            ctx.lineTo(this.right, y);
        }

        for (let i = 0; i < this.col; i++) {
            const x = i * this.tileSize;
            ctx.moveTo(x, this.top);
            ctx.lineTo(x, this.bottom);
        }
        ctx.stroke();
        ctx.restore();
    }

    private createTile(row: number, col: number): Tile {
        return {
            c: col,
            r: row,
            cost: 0,
            id: row * this.col + col,
        };
    }

    private getTileFromWorldPos(worldX: number, worldY: number): Tile {
        const x = clamp(worldX, this.left, this.right);
        const y = clamp(worldY, this.top, this.bottom);
        const c = Math.floor(x / this.tileSize);
        const r = Math.floor(y / this.tileSize);

        return this.createTile(r, c);
    }

    private getNeighborTiles(cur: Tile): Tile[] {
        const neighborTiles: Tile[] = [];
        if (cur.r - 1 >= 0) {
            neighborTiles.push(this.createTile(cur.r - 1, cur.c));
        }

        if (cur.c + 1 < this.col) {
            neighborTiles.push(this.createTile(cur.r, cur.c + 1));
        }

        if (cur.r + 1 < this.row) {
            neighborTiles.push(this.createTile(cur.r + 1, cur.c));
        }

        if (cur.c - 1 >= 0) {
            neighborTiles.push(this.createTile(cur.r, cur.c - 1));
        }
        return neighborTiles;
    }

    private heuristic(tileA: Tile, tileB: Tile): number {
        const dx = tileA.c - tileB.c;
        const dy = tileA.r - tileB.r;
        return Math.sqrt(dx * dx + dy * dy);
    }

    public findPath(fromX: number, fromY: number, toX: number, toY: number): Tile[] {
        const fromTile = this.getTileFromWorldPos(fromX, fromY);
        const toTile = this.getTileFromWorldPos(toX, toY);

        if (fromTile.id === toTile.id) {
            return [];
        }

        const frontier = new PQ((a: Tile, b: Tile): number => b.cost - a.cost);

        frontier.enq(fromTile);
        const comeFrom = new Map<number, Tile>();
        const costSoFar = {
            [fromTile.id]: 0,
        };

        let found = false;
        while (frontier.size() > 0) {
            const current = frontier.deq();
            if (current.id === toTile.id) {
                // found it
                found = true;
                break;
            }
            const neighborTiles = this.getNeighborTiles(current);
            for (let i = 0; i < neighborTiles.length; i++) {
                const neighborTile = neighborTiles[i];
                const newCost = costSoFar[current.id] + 1;
                if (!costSoFar[neighborTile.id] || newCost < costSoFar[neighborTile.id]) {
                    costSoFar[neighborTile.id] = newCost;
                    const priority = newCost + this.heuristic(toTile, neighborTile);
                    neighborTile.cost = priority;
                    frontier.enq(neighborTile);
                    comeFrom.set(neighborTile.id, current);
                }
            }
        }

        if (!found) {
            return [];
        }
        const tiles = [];
        let id = toTile.id;
        while (comeFrom.get(id) !== fromTile) {
            const nextTile = comeFrom.get(id);
            tiles.push(nextTile);
            id = nextTile.id;
        }

        return tiles;
    }
}

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
}

class UserInput {
    private keyDownMap: any;

    constructor(doc: Document) {
        this.keyDownMap = {};
        doc.addEventListener('keydown', this.keyDownEventListener);
    }

    private keyDownEventListener = (ev: KeyboardEvent): void => {
        const keyCode = ev.keyCode;
        this.keyDownMap[keyCode] = true;
    };

    public clear(): void {
        this.keyDownMap = {};
    }

    public isKeyDown(code: number): boolean {
        return this.keyDownMap[code];
    }
}

class Player extends Square {
    private grid: Grid;
    private speed: number;

    constructor(grid: Grid) {
        super(grid.x, grid.y, 30, 30);
        this.grid = grid;
        this.speed = 15;
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

        this.x = clamp(this.x, this.grid.left, this.grid.right - this.w);
        this.y = clamp(this.y, this.grid.top, this.grid.bottom - this.h);
    }
}

class Enemy extends Square {
    private grid: Grid;
    private player: Player;
    private tiles: Tile[];
    constructor(grid: Grid, player: Player) {
        super(
            grid.x + randRange(grid.left, grid.right),
            grid.y + randRange(grid.top, grid.bottom),
            30,
            30,
        );
        this.grid = grid;
        this.player = player;
        this.color = 'rgb(0, 200, 0)';
        this.tiles = [];
    }

    update(): void {
        this.tiles = this.grid.findPath(this.x, this.y, this.player.x, this.player.y);
    }

    render(ctx: CanvasRenderingContext2D): void {
        super.render(ctx);

        ctx.save();
        ctx.fillStyle = 'rgb(200, 200, 200)';
        this.tiles.forEach((t) => {
            ctx.fillRect(
                this.grid.x + t.c * this.grid.tileSize,
                this.grid.y + t.r * this.grid.tileSize,
                50,
                50,
            );
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
    const newGrid = new Grid(16, 16, 50);
    const newPlayer = new Player(newGrid);
    const newEnemy = new Enemy(newGrid, newPlayer);
    const userInput = new UserInput(doc);

    function update(): void {
        newPlayer.update(userInput);
        newEnemy.update();
        userInput.clear();
    }

    function render(): void {
        ctx.clearRect(0, 0, width, height);
        newGrid.render(ctx);
        newPlayer.render(ctx);
        newEnemy.render(ctx);
    }

    function mainLoop(): void {
        update();
        render();
        win.requestAnimationFrame(mainLoop);
    }

    mainLoop();
}

export default main;
