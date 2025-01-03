import { Application, Point, Sprite } from 'pixi.js';
import { isKeyPressed } from '../keyboard';
import { world, width, height } from '../game';
import { Camera } from '../camera';

export class Player {
  position: Point;
  
  sprite: Sprite;
  velocity: number;
  reqVelocity: number;
  direction: number;
  camera: Camera;
  // Add other properties as needed

  constructor() {
    this.position = new Point(100, 100);
    this.camera = new Camera(1024, 640, 8192, 8192);
    this.sprite = Sprite.from('/player.png');
    this.sprite.anchor.set(0.5);
    this.velocity = 0;
    this.reqVelocity = 0;
    this.direction = 0;
  }

  // Add methods for player movement and behavior
  update(deltaTime: number) {

    if (isKeyPressed("ArrowUp")) {
      this.reqVelocity = isKeyPressed("Shift") ? 4 : 2;
    } else {
      this.reqVelocity = 0;
    }

    if (isKeyPressed("ArrowLeft")) {
      this.direction -= 0.08;
    }
    if (isKeyPressed("ArrowRight")) {
      this.direction += 0.08;
    }

    this.velocity += (this.reqVelocity - this.velocity) / 10;

    this.position.x += this.velocity * Math.cos(this.direction);
    this.position.y += this.velocity * Math.sin(this.direction);
    this.position.x = Math.max(0, Math.min(this.position.x, world));
    this.position.y = Math.max(0, Math.min(this.position.y, world));
    this.camera.update(this.position.x, this.position.y);
    const {screenX, screenY} = this.camera.worldToScreen(this.position.x, this.position.y);
    this.sprite.position.x = screenX;
    this.sprite.position.y = screenY;
    this.sprite.rotation = this.direction;
  }

  updateCamera() {
    const threshold = 64;
    const positionLeft = this.position.x - this.camera.x;
    const positionRight = this.position.x - this.camera.x;
    const positionTop = this.position.y - this.camera.y;
    const positionBottom = this.position.y - this.camera.y;

    // Determine if the this.camera should move
    if (positionLeft < threshold) {
      this.camera.x = this.position.x - threshold;
    }
    if (positionRight > width - threshold) {
      this.camera.x = this.position.x - (width - threshold);
    }
    if (positionTop < threshold) {
      this.camera.y = this.position.y - threshold;
    }
    if (positionBottom > height - threshold) {
      this.camera.y = this.position.y - (height - threshold);
    }

    // Ensure the this.camera doesn't go beyond the game world boundaries
    const worldWidth = 800; // Replace with your game world width
    const worldHeight = 600; // Replace with your game world height
    this.camera.x = Math.max(0, Math.min(this.camera.x, worldWidth - width));
    this.camera.y = Math.max(0, Math.min(this.camera.y, worldHeight - height));
  }

}