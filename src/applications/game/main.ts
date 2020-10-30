import { Particle } from '../../particle';
import { keyCodes } from '../../constant';
import { Vector } from '../../vector';
import { degToR, randRange } from '../../utility';
import { Point } from '../../types';
import PQ from 'priorityqueuejs';

type PointWithCost = {
    id: number;
    cost: number;
};

function main(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    win?: Window,
    doc?: Document,
): void {
    const gridWidth = 16;
    const gridHeight = 16;
    const gridSize = 50;
    // const halfGridSize = gridSize / 2;
    let path: number[];

    const player = {
        gridx: 0,
        gridy: 0,
    };

    const toPoint = {
        gridx: Math.floor(randRange(0, gridWidth)),
        gridy: Math.floor(randRange(0, gridHeight)),
    };

    function getPointId(point: Point) {
        return point.y * gridWidth + point.x;
    }

    function getNeighborIds(currentId: number): number[] {
        const currentX = currentId % gridWidth;
        const currentY = Math.floor(currentId / gridWidth);

        const neighborIds = [];

        if (currentY - 1 >= 0) {
            neighborIds.push(
                getPointId({
                    x: currentX,
                    y: currentY - 1,
                }),
            );
        }

        if (currentX + 1 < gridWidth) {
            neighborIds.push(
                getPointId({
                    x: currentX + 1,
                    y: currentY,
                }),
            );
        }

        if (currentY + 1 < gridHeight) {
            neighborIds.push(
                getPointId({
                    x: currentX,
                    y: currentY + 1,
                }),
            );
        }

        if (currentX - 1 >= 0) {
            neighborIds.push(
                getPointId({
                    x: currentX - 1,
                    y: currentY,
                }),
            );
        }

        return neighborIds;
    }

    function heuristic(goal: number, current: number): number {
        const srcX = goal % gridWidth;
        const srcY = Math.floor(goal / gridWidth);

        const targetX = current % gridWidth;
        const targetY = Math.floor(goal / gridWidth);

        const dx = targetX - srcX;
        const dy = targetY - srcY;
        return Math.sqrt(dx * dx + dy * dy);
    }

    function findPath(fromPoint: Point, toPoint: Point): number[] {
        const frontier = new PQ((a: PointWithCost, b: PointWithCost) => b.cost - a.cost);
        const fromPointId = getPointId(fromPoint);

        const toPointId = getPointId(toPoint);
        frontier.enq({ id: fromPointId, cost: 0 });
        const comeFrom = {
            [fromPointId]: -1,
        };
        const costSoFar = {
            [fromPointId]: 0,
        };

        while (frontier.size() > 0) {
            const current = frontier.deq();
            if (current.id === toPointId) {
                // found it
                break;
            }
            const neighborIds = getNeighborIds(current.id);
            for (let i = 0; i < neighborIds.length; i++) {
                const nextNeighbor = neighborIds[i];
                const newCost = costSoFar[current.id] + 1;
                if (!costSoFar[nextNeighbor] || newCost < costSoFar[nextNeighbor]) {
                    costSoFar[nextNeighbor] = newCost;
                    const priority = newCost + heuristic(toPointId, nextNeighbor);
                    frontier.enq({ id: nextNeighbor, cost: priority });
                    comeFrom[nextNeighbor] = current.id;
                }
            }
        }

        const path = [];
        let i = toPointId;
        while (comeFrom[i] != fromPointId) {
            path.push(comeFrom[i]);
            i = comeFrom[i];
        }

        return path;
    }

    doc.addEventListener('mousemove', (ev) => {
        player.gridx = Math.floor(ev.clientX / gridSize);
        player.gridy = Math.floor(ev.clientY / gridSize);

        path = findPath(
            { x: player.gridx, y: player.gridy },
            {
                x: toPoint.gridx,
                y: toPoint.gridy,
            },
        );

        console.log('path:', path);
    });

    // function update(): void {}

    function render(): void {
        ctx.clearRect(0, 0, width, height);

        // draw grid
        ctx.save();
        for (let i = 0; i < gridHeight; i++) {
            const y = i * gridSize;
            for (let j = 0; j < gridWidth; j++) {
                const x = j * gridSize;
                ctx.rect(x, y, gridSize, gridSize);
                ctx.stroke();
            }
        }
        ctx.restore();

        console.log('player:', player);

        // draw player
        ctx.save();
        ctx.fillStyle = 'rgb(200, 0, 0)';
        ctx.fillRect(
            player.gridx * gridSize,
            player.gridy * gridSize,
            gridSize,
            gridSize,
        );
        ctx.restore();

        // draw toPoint
        ctx.save();
        ctx.fillStyle = 'rgb(0, 200, 0)';
        ctx.fillRect(
            toPoint.gridx * gridSize,
            toPoint.gridy * gridSize,
            gridSize,
            gridSize,
        );
        ctx.restore();

        if (path && path.length > 0) {
            ctx.save();
            ctx.fillStyle = 'rgb(0, 0, 200)';
            for (let i = 0; i < path.length; i++) {
                const p = path[i];
                const x = p % gridWidth;
                const y = Math.floor(p / gridWidth);

                ctx.fillRect(x * gridSize, y * gridSize, gridSize, gridSize);
            }
            ctx.restore();
        }
    }

    function mainLoop(): void {
        // update();
        render();

        win.requestAnimationFrame(mainLoop);
    }

    mainLoop();
}

export default main;
