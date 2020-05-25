export interface ParticleInitProps {
    mass?: number;
    grav?: number;
    radius?: number;
    friction?: number;
}

export interface Spring {
    point: Particle;
    k: number;
    length: number;
}

export class Particle {
    public x = 0;
    public y = 0;

    public vx = 0;
    public vy = 0;

    public mass = 1;
    public friction = 1;

    public gravity: number;
    public radius: number;

    // spring & gravities

    public springs: Spring[] = [];
    public gravitations: Particle[] = [];

    constructor(x: number, y: number, speed = 0, direction = 0, grav = 0) {
        this.x = x;
        this.y = y;

        this.vx = speed * Math.cos(direction);
        this.vy = speed * Math.sin(direction);

        this.gravity = grav;
    }

    public addSpring = (point: Particle, k: number, length = 0): Particle => {
        // should not add same point twice
        this.removeSpring(point);
        this.springs.push({
            point,
            k,
            length,
        });
        return this;
    };

    public removeSpring = (point: Particle): Particle => {
        const idx = this.springs.findIndex((s) => s.point === point);
        if (idx !== -1) {
            this.springs.splice(idx, 1);
        }

        return this;
    };

    public addGravitation = (point: Particle): Particle => {
        // should not add same point twice
        this.removeGravitation(point);
        this.gravitations.push(point);
        return this;
    };

    public removeGravitation = (point: Particle): Particle => {
        const idx = this.gravitations.findIndex((p) => p === point);
        if (idx !== -1) {
            this.gravitations.splice(idx, 1);
        }

        return this;
    };

    public getDirection = (): number => {
        return Math.atan2(this.vy, this.vx);
    };

    public getSpeed = (): number => {
        return Math.sqrt(this.vx * this.vx + this.vy * this.vy);
    };

    public setDirection = (angle: number): Particle => {
        const speed = this.getSpeed();
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;

        return this;
    };

    public setSpeed = (speed: number): Particle => {
        const angle = this.getDirection();
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;

        return this;
    };

    public accelerateBy = (x: number, y: number): Particle => {
        this.vx += x;
        this.vy += y;
        return this;
    };

    public update = (): Particle => {
        this.handleSprings();
        this.handleGravitations();

        this.vx *= this.friction;
        this.vy *= this.friction;

        this.vy += this.gravity;

        this.x += this.vx;
        this.y += this.vy;

        return this;
    };

    public angleTo = (target: Particle): number => {
        return Math.atan2(target.y - this.y, target.x - this.x);
    };

    public distanceTo = (target: Particle): number => {
        const dx = target.x - this.x;
        const dy = target.y - this.y;

        return Math.sqrt(dx * dx + dy * dy);
    };

    public gravitateTo = (target: Particle): Particle => {
        const angle = this.angleTo(target);
        const distance = this.distanceTo(target);

        const gravForce = target.mass / (distance * distance);
        const gravX = Math.cos(angle) * gravForce;
        const gravY = Math.sin(angle) * gravForce;

        this.accelerateBy(gravX, gravY);
        return this;
    };

    public springTo = (
        springPoint: Particle,
        springFactor: number,
        springLengh = 0,
    ): Particle => {
        const dx = springPoint.x - this.x;
        const dy = springPoint.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const springForce = (distance - springLengh) * springFactor;

        const springX = (dx / distance) * springForce;
        const springY = (dy / distance) * springForce;
        this.accelerateBy(springX, springY);

        return this;
    };

    private handleSprings = (): Particle => {
        this.springs.forEach((s) => {
            this.springTo(s.point, s.k, s.length);
        });

        return this;
    };

    private handleGravitations = (): Particle => {
        this.gravitations.forEach((p) => {
            this.gravitateTo(p);
        });

        return this;
    };
}
