import { Vector } from './vector';

export class Particle {
    public position: Vector;
    public velocity: Vector;
    public gravity: Vector;

    public mass: number;

    constructor(
        x: number,
        y: number,
        speed: number,
        direction: number,
        grav = 0,
        mass = 1,
    ) {
        this.position = new Vector(x, y);
        this.velocity = new Vector(0, 0);
        this.velocity.setLength(speed); // should set Length first
        this.velocity.setAngle(direction);
        this.gravity = new Vector(0, grav);
        this.mass = mass;
    }

    public accelerate = (acc: Vector): Particle => {
        this.velocity.addTo(acc);
        return this;
    };

    public update = (): Particle => {
        this.velocity.addTo(this.gravity);
        this.position.addTo(this.velocity);
        return this;
    };

    public angleTo = (target: Particle): number => {
        return Math.atan2(
            target.position.y - this.position.y,
            target.position.x - this.position.x,
        );
    };

    public distanceTo = (target: Particle): number => {
        const dx = target.position.x - this.position.x;
        const dy = target.position.y - this.position.y;

        return Math.sqrt(dx * dx + dy * dy);
    };

    public gravitateTo = (target: Particle): Particle => {
        const angle = this.angleTo(target);
        const distance = this.distanceTo(target);
        const gravity = new Vector(0, 0);

        gravity.setLength(target.mass / (distance * distance));
        gravity.setAngle(angle);

        this.velocity.addTo(gravity);

        return this;
    };
}
