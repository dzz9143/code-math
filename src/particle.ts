import { Vector } from './vector';

export class Particle {
    public position: Vector;
    public velocity: Vector;

    constructor(x: number, y: number, speed: number, direction: number) {
        this.position = new Vector(x, y);
        this.velocity = new Vector(0, 0); // problem with 0, 0?

        this.velocity.setLength(speed);
        this.velocity.setAngle(direction);
    }

    public update = (): Particle => {
        this.position.addTo(this.velocity);
        return this;
    };
}
