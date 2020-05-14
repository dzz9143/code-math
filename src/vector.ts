export class Vector {
    private x: number;
    private y: number;
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    getLength(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    setLength(len: number): void {
        const angle = this.getAngle();
        this.x = len * Math.cos(angle);
        this.y = len * Math.sin(angle);
    }

    getAngle(): number {
        return Math.atan2(this.y, this.x);
    }

    setAngle(angle: number): void {
        const length = this.getLength();
        this.x = length * Math.cos(angle);
        this.y = length * Math.sin(angle);
    }

    add(vec: Vector): Vector {
        return new Vector(this.x + vec.x, this.y + vec.y);
    }

    addTo(vec: Vector): Vector {
        this.x += vec.x;
        this.y += vec.y;
        return this;
    }

    substract(vec: Vector): Vector {
        return new Vector(this.x - vec.x, this.y - vec.y);
    }

    substractFrom(vec: Vector): Vector {
        this.x -= vec.x;
        this.y -= vec.y;
        return this;
    }

    multiply(scale: number): Vector {
        return new Vector(this.x * scale, this.y * scale);
    }

    multiplyBy(scale: number): Vector {
        this.x *= scale;
        this.y *= scale;
        return this;
    }
}
