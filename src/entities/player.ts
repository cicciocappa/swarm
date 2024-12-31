import { Application, Point, Sprite } from 'pixi.js';
import { isKeyPressed } from '../keyboard';

export class Player {
  position: Point;
  sprite: Sprite;
  velocity: number;
  reqVelocity: number;
  direction: number;
  // Add other properties as needed

  constructor() {
    this.position = new Point(100, 100);
    this.sprite = Sprite.from('/player.png');
    this.sprite.anchor.set(0.5);
    this.velocity = 0;
    this.reqVelocity = 0;
    this.direction = 0;
  }

  // Add methods for player movement and behavior
  update(deltaTime: number) {

    if (isKeyPressed("ArrowUp")) {
      this.reqVelocity = isKeyPressed("Shift")?4:2;
    } else {
      this.reqVelocity = 0;
    }
    
    if (isKeyPressed("ArrowLeft")) {
      this.direction -= 0.08;
    }
    if (isKeyPressed("ArrowRight")) {
      this.direction += 0.08;
    }

    this.velocity += (this.reqVelocity - this.velocity)/10;

    this.position.x += this.velocity * Math.cos(this.direction);
    this.position.y += this.velocity * Math.sin(this.direction);
    this.sprite.position = this.position;
    this.sprite.rotation = this.direction;
  }
}