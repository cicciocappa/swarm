import { Vector2 } from "../utils";
import { width, height, world } from "../game";
import { Sprite } from "pixi.js";
import { Camera } from "../camera";
import { Player } from "./player";

export class Boid {
    position: Vector2;
    velocity: Vector2;
    acceleration: Vector2;
    maxForce: number;
    maxSpeed: number;
    sprite: Sprite;
    alerted: boolean;
    target: null | Boid | Player;
    normal: number;
    //temp: boolean;

    constructor() {
        this.position = new Vector2(Math.random() * width + 400, Math.random() * height + 400);
        this.velocity = Vector2.random2D();
        this.acceleration = new Vector2(0, 0);
        this.maxForce = 0.05;
        this.maxSpeed = 0.1 + 0.9 * Math.random();
        this.normal = this.maxSpeed;
        this.velocity.setMag(
            Math.random() * this.maxSpeed * (Math.random() > 0.5 ? 1 : -1)
        );
        this.sprite = Sprite.from('/zombie.png');
        this.sprite.anchor.set(0.5);

        this.alerted = false;
        this.target = null;
        //this.temp = false;
    }

    edges(boundaryType: 'Unbound' | 'Bound'): void {
        if (boundaryType === 'Unbound') {
            if (this.position.x > world) this.position.x = 0;
            if (this.position.x < 0) this.position.x = world;
            if (this.position.y > world) this.position.y = 0;
            if (this.position.y < 0) this.position.y = world;
        } else if (boundaryType === 'Bound') {
            if (this.position.x > world || this.position.x < 0) this.velocity.x *= -1;
            if (this.position.y > world || this.position.y < 0) this.velocity.y *= -1;
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
                if(other.alerted && !this.alerted) {
                    this.alerted = true;
                    this.target = other;
                }
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
        toSeperate.mult(1.0); // separationSlider.value()

        this.acceleration.add(toAlign);
        this.acceleration.add(toGroup);
        this.acceleration.add(toSeperate);
        //console.log(attractionPoint);
        if (this.alerted) {
            // 2. Apply attraction force (after other behaviors)
            const attractionStrength = 1.5; // Adjust this value to control the strength
            //const attractionPoint = new Vector2(width / 2, height / 2); // Center of the screen
            this.attractTo(new Vector2(this.target.position.x, this.target.position.y), attractionStrength);
        } else {
            // erratic
            if (Math.random() < 0.001) {
                const k1 = Math.random() - 0.5;
                const k2 = Math.random() - 0.5;
                this.acceleration.x += k1;
                this.acceleration.y += k2;
                //this.temp = true;
            }
        }



    }

    attractTo(point: Vector2, strength: number): void {
        const desired = point.copy().sub(this.position);
        desired.setMag(this.maxSpeed);

        const steer = desired.sub(this.velocity);
        steer.limit(this.maxForce);

        this.acceleration.add(steer.mult(strength));
    }

    update(): void {
        this.maxForce = this.alerted ? 0.05 : 0.1;
        this.maxSpeed = this.alerted ? this.normal * 3: this.normal;
        this.position.add(this.velocity);
        this.velocity.add(this.acceleration);
        this.velocity.limit(this.maxSpeed);
        this.acceleration = new Vector2(0, 0); // Reset acceleration
    }

    show(camera: Camera): void { //percept: boolean, graphics: PIXI.Graphics
        /*
        graphics.lineStyle(2, 0xffffff);
        graphics.drawCircle(this.position.x, this.position.y, 2);

        if (percept) {
            graphics.lineStyle(1, 0x00ff00);
            graphics.drawCircle(this.position.x, this.position.y, perceptSlider.value());
        }
            */

        const { screenX, screenY } = camera.worldToScreen(this.position.x, this.position.y);
        this.sprite.position.x = screenX;
        this.sprite.position.y = screenY;
        const angle = Math.atan2(this.velocity.y, this.velocity.x);
        this.sprite.rotation += (angle - this.sprite.rotation) / 40;

        this.sprite.tint = this.alerted ? 0xff0000 : 0x00ff00;


    }
}