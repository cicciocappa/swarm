import { Vector2 } from "../utils";
import { width, height } from "../game";
import { Sprite } from "pixi.js";

export class Boid {
    position: Vector2;
    velocity: Vector2;
    acceleration: Vector2;
    maxForce: number;
    maxSpeed: number;
    sprite: Sprite;

    constructor() {
        this.position = new Vector2(Math.random() * width, Math.random() * height);
        this.velocity = Vector2.random2D();
        this.acceleration = new Vector2(0, 0);
        this.maxForce = 0.05;
        this.maxSpeed = 0.1 + 0.9 * Math.random();
        this.velocity.setMag(
            Math.random() * this.maxSpeed * (Math.random() > 0.5 ? 1 : -1)
        );
        this.sprite = Sprite.from('/zombie.png');
        this.sprite.anchor.set(0.5);
    }

    edges(boundaryType: 'Unbound' | 'Bound'): void {
        if (boundaryType === 'Unbound') {
            if (this.position.x > width) this.position.x = 0;
            if (this.position.x < 0) this.position.x = width;
            if (this.position.y > height) this.position.y = 0;
            if (this.position.y < 0) this.position.y = height;
        } else if (boundaryType === 'Bound') {
            if (this.position.x > width || this.position.x < 0) this.velocity.x *= -1;
            if (this.position.y > height || this.position.y < 0) this.velocity.y *= -1;
        }
    }

    flock(boids: Boid[]): void {
        const perceptionRadius = 50 // perceptSlider.value();
        let total = 0;
        const toAlign = new Vector2(0, 0);
        const toGroup = new Vector2(0, 0);
        const toSeperate = new Vector2(0, 0);

        for (const other of boids) {
            const d = this.position.dist(other.position);

            if (other !== this && d < perceptionRadius) {
                // Alignment
                toAlign.add(other.velocity);
                // Cohesion
                toGroup.add(other.position);
                // Separation
                const diff = this.position.copy().sub(other.position);
                diff.div(d * d); // Weight by distance
                toSeperate.add(diff);
                total++;
            }
        }

        if (total > 0) {
            toAlign.div(total).setMag(this.maxSpeed).sub(this.velocity).limit(this.maxForce);
            toGroup.div(total).sub(this.position).setMag(this.maxSpeed * 0.75).sub(this.velocity).limit(this.maxForce);
            toSeperate.div(total).setMag(this.maxSpeed).sub(this.velocity).limit(this.maxForce);
        }

        toAlign.mult(0.25); //alignSlider.value(
        toGroup.mult(0.25);//cohesionSlider.value()
        toSeperate.mult(1.5); // separationSlider.value()

        this.acceleration.add(toAlign);
        this.acceleration.add(toGroup);
        this.acceleration.add(toSeperate);

        // 2. Apply attraction force (after other behaviors)
        const attractionStrength = 1.5; // Adjust this value to control the strength
        const attractionPoint = new Vector2(width / 2, height / 2); // Center of the screen
        this.attractTo(attractionPoint, attractionStrength);

        
    }

    attractTo(point: Vector2, strength: number): void {
        const desired = point.copy().sub(this.position);
        desired.setMag(this.maxSpeed);

        const steer = desired.sub(this.velocity);
        steer.limit(this.maxForce);

        this.acceleration.add(steer.mult(strength));
    }

    update(): void {
        this.position.add(this.velocity);
        this.velocity.add(this.acceleration);
        this.velocity.limit(this.maxSpeed);
        this.acceleration = new Vector2(0, 0); // Reset acceleration
    }

    show(): void { //percept: boolean, graphics: PIXI.Graphics
        /*
        graphics.lineStyle(2, 0xffffff);
        graphics.drawCircle(this.position.x, this.position.y, 2);

        if (percept) {
            graphics.lineStyle(1, 0x00ff00);
            graphics.drawCircle(this.position.x, this.position.y, perceptSlider.value());
        }
            */

        this.sprite.position.x = this.position.x;
        this.sprite.position.y = this.position.y;
        const angle = Math.atan2(this.velocity.y, this.velocity.x);
        this.sprite.rotation += (angle-this.sprite.rotation)/20;
    }
}