import { Particle } from '../../particle';
import { keyCodes } from '../../constant';
import { Vector } from '../../vector';
import { degToR } from '../../utility';

function main(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    win?: Window,
    doc?: Document,
): void {
    // init state
    let goingUp = false;
    let goingDown = false;
    let goingLeft = false;
    let goingRight = false;

    // init objects
    const player = new Particle(width / 2, height / 2, 0, 0, 0);
    player.radius = 10;
    player.friction = 0.88;
    const playerMoveForce = 3;
    const playerMaxSpeed = 6;

    let playerPointAngle = 0;

    // handle input
    doc.addEventListener('mousemove', (ev) => {
        const dy = ev.clientY - player.position.y;
        const dx = ev.clientX - player.position.x;
        playerPointAngle = Math.atan2(dy, dx);
    });

    doc.addEventListener('keydown', (ev) => {
        console.log('keyCode:', ev.keyCode);
        switch (ev.keyCode) {
            case keyCodes.KEY_W:
                goingUp = true;
                break;
            case keyCodes.KEY_S:
                goingDown = true;
                break;
            case keyCodes.KEY_A:
                goingLeft = true;
                break;
            case keyCodes.KEY_D:
                goingRight = true;
                break;
        }
    });

    doc.addEventListener('keyup', (ev) => {
        switch (ev.keyCode) {
            case keyCodes.KEY_W:
                goingUp = false;
                break;
            case keyCodes.KEY_S:
                goingDown = false;
                break;
            case keyCodes.KEY_A:
                goingLeft = false;
                break;
            case keyCodes.KEY_D:
                goingRight = false;
                break;
        }
    });

    function update(): void {
        const acc = new Vector(0, 0);
        const moved = goingDown || goingLeft || goingRight || goingUp;
        if (goingUp) {
            acc.y = -1;
        }

        if (goingDown) {
            acc.y = 1;
        }

        if (goingLeft) {
            acc.x = -1;
        }

        if (goingRight) {
            acc.x = 1;
        }
        if (moved) {
            acc.setLength(playerMoveForce);
            player.velocity.addTo(acc);
            if (player.velocity.getLength() > playerMaxSpeed) {
                player.velocity.setLength(playerMaxSpeed);
            }
        }
        player.update();

        // limit position
        if (player.position.x + player.radius > width) {
            player.position.x = width - player.radius;
        }

        if (player.position.x - player.radius < 0) {
            player.position.x = player.radius;
        }

        if (player.position.y + player.radius > height) {
            player.position.y = height - player.radius;
        }

        if (player.position.y - player.radius < 0) {
            player.position.y = player.radius;
        }
    }

    function render(): void {
        ctx.clearRect(0, 0, width, height);

        ctx.save();

        ctx.translate(player.position.x, player.position.y);
        ctx.rotate(playerPointAngle);

        // draw circle
        ctx.beginPath();
        ctx.arc(0, 0, player.radius, 0, degToR(360));
        ctx.stroke();

        // draw arrow
        ctx.beginPath();
        ctx.moveTo(player.radius + 10, 0);
        ctx.lineTo(player.radius, 8);
        ctx.moveTo(player.radius + 10, 0);
        ctx.lineTo(player.radius, -8);
        ctx.stroke();

        ctx.restore();
    }

    function mainLoop(): void {
        update();
        render();

        win.requestAnimationFrame(mainLoop);
    }

    mainLoop();
}

export default main;
