import { Application, Point, Sprite } from 'pixi.js';

export class Player {
    position: Point;
    sprite: Sprite;
    // Add other properties as needed
  
    constructor() {
      this.position = new Point(100, 100);
      this.sprite = Sprite.from('public/player.png');
    }
  
    // Add methods for player movement and behavior
    update(deltaTime: number) {
      
    }
  }