import { Boid } from "./entities/boid";

 

export class Point {
    x: number;
    y: number;
    userData: Boid;

    constructor(x: number, y: number, userData: any) {
        this.x = x;
        this.y = y;
        this.userData = userData;
    }
}

export class Rectangle {
    x: number;
    y: number;
    w: number;
    h: number;

    constructor(x: number, y: number, w: number, h: number) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }

    contains(point: Point): boolean {
        return (
            point.x >= this.x - this.w &&
            point.x <= this.x + this.w &&
            point.y >= this.y - this.h &&
            point.y <= this.y + this.h
        );
    }

    intersects(range: Rectangle): boolean {
        return !(
            range.x - range.w > this.x + this.w ||
            range.x + range.w < this.x - this.w ||
            range.y - range.h > this.y + this.h ||
            range.y + range.h < this.y - this.h
        );
    }
}

export class Circle {
    x: number;
    y: number;
    r: number;
    rSquared: number;

    constructor(x: number, y: number, r: number) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.rSquared = this.r * this.r;
    }

    contains(point: Point): boolean {
        let d = Math.pow(point.x - this.x, 2) + Math.pow(point.y - this.y, 2);
        return d <= this.rSquared;
    }

    intersects(range: Rectangle): boolean {
        const xDist = Math.abs(range.x - this.x);
        const yDist = Math.abs(range.y - this.y);

        const r = this.r;
        const w = range.w;
        const h = range.h;

        const edges = Math.pow(xDist - w, 2) + Math.pow(yDist - h, 2);

        if (xDist > r + w || yDist > r + h) return false;
        if (xDist <= w || yDist <= h) return true;

        return edges <= this.rSquared;
    }
}

export class QuadTree {
    boundary: Rectangle;
    capacity: number;
    points: Point[];
    divided: boolean;
    northEast: QuadTree | null;
    northWest: QuadTree | null;
    southEast: QuadTree | null;
    southWest: QuadTree | null;

    constructor(boundary: Rectangle, capacity: number) {
        this.boundary = boundary;
        this.capacity = capacity;
        this.points = [];
        this.divided = false;
        this.northEast = null;
        this.northWest = null;
        this.southEast = null;
        this.southWest = null;
    }

    clear(): void {
        this.divided = false;
        this.points = [];
        this.northEast = null;
        this.northWest = null;
        this.southEast = null;
        this.southWest = null;
    }

    subdivide(): void {
        const x = this.boundary.x;
        const y = this.boundary.y;
        const w = this.boundary.w;
        const h = this.boundary.h;

        const ne = new Rectangle(x + w / 2, y - h / 2, w / 2, h / 2);
        this.northEast = new QuadTree(ne, this.capacity);

        const nw = new Rectangle(x - w / 2, y - h / 2, w / 2, h / 2);
        this.northWest = new QuadTree(nw, this.capacity);

        const se = new Rectangle(x + w / 2, y + h / 2, w / 2, h / 2);
        this.southEast = new QuadTree(se, this.capacity);

        const sw = new Rectangle(x - w / 2, y + h / 2, w / 2, h / 2);
        this.southWest = new QuadTree(sw, this.capacity);

        this.divided = true;
    }

    insert(point: Point): boolean {
        if (!this.boundary.contains(point)) {
            return false;
        }

        if (this.points.length < this.capacity) {
            this.points.push(point);
            return true;
        } else {
            if (!this.divided) {
                this.subdivide();
            }
            if (this.northEast!.insert(point)) {
                return true;
            } else if (this.northWest!.insert(point)) {
                return true;
            } else if (this.southEast!.insert(point)) {
                return true;
            } else if (this.southWest!.insert(point)) {
                return true;
            }
        }
        return false;
    }

    query(range: Rectangle | Circle, found: Point[] = []): Point[] {
        if (!this.boundary.intersects(range as Rectangle)) {
            return found;
        } else {
            for (const p of this.points) {
                if (range.contains(p)) {
                    found.push(p);
                }
            }
            if (this.divided) {
                this.northWest!.query(range, found);
                this.northEast!.query(range, found);
                this.southWest!.query(range, found);
                this.southEast!.query(range, found);
            }
        }
        return found;
    }

    show(): void {
        stroke(80);
        strokeWeight(0.5);
        noFill();
        rectMode(CENTER);
        rect(
            this.boundary.x,
            this.boundary.y,
            this.boundary.w * 2,
            this.boundary.h * 2
        );
        if (this.divided) {
            this.northWest!.show();
            this.northEast!.show();
            this.southWest!.show();
            this.southEast!.show();
        }
    }
}

export class Vector2 {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x || 0;
        this.y = y || 0;
    }

    // Add another vector to this vector
    add(v: Vector2): Vector2 {
        this.x += v.x;
        this.y += v.y;
        return this;
    }

    // Subtract another vector from this vector
    sub(v: Vector2): Vector2 {
        this.x -= v.x;
        this.y -= v.y;
        return this;
    }

    // Multiply this vector by a scalar
    mult(n: number): Vector2 {
        this.x *= n;
        this.y *= n;
        return this;
    }

    // Divide this vector by a scalar
    div(n: number): Vector2 {
        this.x /= n;
        this.y /= n;
        return this;
    }

    // Calculate the magnitude (length) of the vector
    mag(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    // Set the magnitude of the vector
    setMag(n: number): Vector2 {
        return this.normalize().mult(n);
    }

    // Normalize the vector (set its magnitude to 1)
    normalize(): Vector2 {
        const mag = this.mag();
        if (mag !== 0) {
            this.div(mag);
        }
        return this;
    }

    // Limit the magnitude of the vector
    limit(max: number): Vector2 {
        if (this.mag() > max) {
            this.setMag(max);
        }
        return this;
    }

    // Calculate the Euclidean distance between this vector and another
    dist(v: Vector2): number {
        return Math.sqrt((this.x - v.x) ** 2 + (this.y - v.y) ** 2);
    }

    // Create a copy of this vector
    copy(): Vector2 {
        return new Vector2(this.x, this.y);
    }

    // Generate a random 2D vector
    static random2D(): Vector2 {
        const angle = Math.random() * Math.PI * 2;
        return new Vector2(Math.cos(angle), Math.sin(angle));
    }
}