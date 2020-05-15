import { Vector } from './vector';

export class Particle {
    public position: Vector;
    public velocity: Vector;
    public gravity: Vector;

    constructor(x: number, y: number, speed: number, direction: number, grav = 0) {
        this.position = new Vector(x, y);
        this.velocity = new Vector(0, 0); // problem with 0, 0?

        this.velocity.setLength(speed);
        this.velocity.setAngle(direction);
        this.gravity = new Vector(0, grav);
    }

    public update = (): Particle => {
        this.velocity.addTo(this.gravity);
        this.position.addTo(this.velocity);
        return this;
    };
}
