import { Point, Sprite } from 'pixi.js';
import { Player } from './player';

export class Zombie {
  // Stats
  speed: number;
  agility: number;
  erratic: number;
  awareness: number;

  // Properties
  position: Point;
  velocity: Point;
  direction: number;
  target: Zombie | Player | null;
  sprite: Sprite;

  // Current state
  state: 'wandering' | 'following';

  // Desired values
  desiredVelocity: Point;
  desiredDirection: number;

  constructor(speed: number, agility: number, erratic: number, awareness: number) {
    this.speed = speed;
    this.agility = agility;
    this.erratic = erratic;
    this.awareness = awareness;

    this.position = new Point(Math.random()*800+100, Math.random()*400);
    this.velocity = new Point(0, 0);
    this.direction = 0;
    this.target = null;
    this.state = 'wandering';
    this.desiredVelocity = new Point(0,0);
    this.desiredDirection = 0;

    this.sprite = Sprite.from('/zombie.png');
    this.sprite.anchor.set(0.5);
  }

  // Update function called every frame
  update(deltaTime: number) {
    if (this.state === 'wandering') {
      this.wanderingBehavior(deltaTime);
    } else if (this.state === 'following') {
      this.followingBehavior(deltaTime);
    }

    // Update position based on velocity
    this.position.x += this.velocity.x * deltaTime;
    this.position.y += this.velocity.y * deltaTime;
    this.sprite.position = this.position;
    this.sprite.rotation = this.direction * Math.PI/180;
  }

  // Wandering behavior
  wanderingBehavior(deltaTime: number) {
    
    // Check if we should randomly change direction or velocity based on erratic value
    if (Math.random() < this.erratic * deltaTime) {
      this.desiredDirection = Math.random() * 360;
      this.desiredVelocity = new Point(
        this.speed * 0.5 * Math.cos(this.desiredDirection),
        this.speed * 0.5 * Math.sin(this.desiredDirection)
      );
    }

    // Smoothly transition to desired direction and velocity based on agility
    this.smoothTransition(deltaTime);
  }

  // Following behavior
  followingBehavior(deltaTime: number) {
    if (this.target === null) {
      this.state = 'wandering';
      return;
    }

    // Calculate direction towards target
    const dx = this.target.position.x - this.position.x;
    const dy = this.target.position.y - this.position.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance === 0) {
      return;
    }

    this.desiredDirection = Math.atan2(dy, dx) * 180 / Math.PI;
    this.desiredVelocity = new Point(
      this.speed * Math.cos(this.desiredDirection * Math.PI / 180),
      this.speed * Math.sin(this.desiredDirection * Math.PI / 180)
    );

    // Smoothly transition to desired direction and velocity based on agility
    this.smoothTransition(deltaTime);

    // Check if we should stop following based on erratic value
    if (Math.random() < this.erratic * deltaTime) {
      this.state = 'wandering';
      this.target = null;
    }
  }

  // Smoothly transition to desired direction and velocity
  smoothTransition(deltaTime: number) {
    // Interpolate velocity
    this.velocity.x += (this.desiredVelocity.x - this.velocity.x) * this.agility * deltaTime;
    this.velocity.y += (this.desiredVelocity.y - this.velocity.y) * this.agility * deltaTime;

    // Interpolate direction
    const angleDelta = this.desiredDirection - this.direction;
    let angleDeltaNormalized = (angleDelta + 180) % 360 - 180; // Normalize to -180 to 180
    this.direction += angleDeltaNormalized * this.agility * deltaTime;
    this.direction = this.direction % 360;
  }

  // Detect targets (player or other zombies in following state)
  detectTargets(zombies: Zombie[], player: Player) {
    // Reset target if not following
    if (this.state !== 'following') {
      this.target = null;
    }

    // Check for player within awareness radius
    const dx = player.position.x - this.position.x;
    const dy = player.position.y - this.position.y;
    const distanceToPlayer = Math.sqrt(dx * dx + dy * dy);
    if (distanceToPlayer < this.awareness && this.state !== 'following') {
      this.target = player;
      this.state = 'following';
    }

    // Check for other zombies in following state within awareness radius
    for (const zombie of zombies) {
      if (zombie !== this && zombie.state === 'following') {
        const dx = zombie.position.x - this.position.x;
        const dy = zombie.position.y - this.position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < this.awareness && this.state !== 'following') {
          this.target = zombie;
          this.state = 'following';
          break;
        }
      }
    }
  }
}