// Assuming you have a PIXI.Application instance called app
// and an array of zombies and a player
import { Application, Assets, Point, Sprite, Ticker } from 'pixi.js';
import { Player } from './entities/player';
import { Zombie } from './entities/zombie';
import { setupInput } from './keyboard';

export class Game {
    private app: Application | null = null;
    private entities: (Zombie | Player)[] = [];

    async initialize(): Promise<void> {
        setupInput();
        const elem: HTMLDivElement = document.querySelector("div") as HTMLDivElement ; 
        this.app = new Application();
        await this.app.init({ background: '#1099bb', resizeTo: elem, });
        elem.appendChild(this.app.canvas);
        // for now, we have only 2 images, so we load them directly
        //await Assets.init({manifest: "public/manifest.json"});
        //const assets = await Assets.loadBundle('game-screen');
        await Assets.load('public/player.png');
        this.init();
    }

    init(){
        const player = new Player();
        this.entities.push(player);
        this.app?.stage.addChild(player.sprite);
        for (let i=0;i<32; i++){
            //const zombie = new Zombie(this.app); 
            //this.entities.push(zombie);
        }
        
    }
    private setupGameLoop(): void {
        if (this.app) {
          this.app.ticker.add(ticker => this.gameLoop(ticker.deltaTime));
        }
      }
    
      private gameLoop(delta: number): void {
        // Update game logic
        this.entities.forEach(entity => entity.update(delta));
      }
    
}

/*

export function init() {
    // Create a sprite for each zombie
    for (const zombie of zombies) {
        const zombieSprite = PIXI.Sprite.from('zombie.png');
        zombieSprite.x = zombie.position.x;
        zombieSprite.y = zombie.position.y;
        zombieSprite.rotation = zombie.direction * Math.PI / 180;
        app.stage.addChild(zombieSprite);
        zombie.sprite = zombieSprite;
    }

    // Create player sprite
    const playerSprite = PIXI.Sprite.from('player.png');
    playerSprite.x = player.position.x;
    playerSprite.y = player.position.y;
    app.stage.addChild(playerSprite);
    player.sprite = playerSprite;
}

export function gameLoop() {
    const deltaTime = app.ticker.deltaMS / 1000; // Delta time in seconds

    // Update zombies
    for (const zombie of zombies) {
        // Detect targets before updating behavior
        zombie.detectTargets(zombies, player);
        zombie.update(deltaTime);
    }

    // Update player (if necessary)

    // Render sprites based on positions
    for (const zombie of zombies) {
        zombie.sprite.x = zombie.position.x;
        zombie.sprite.y = zombie.position.y;
        zombie.sprite.rotation = zombie.direction * Math.PI / 180;
    }

    // Render player sprite
    player.sprite.x = player.position.x;
    player.sprite.y = player.position.y;
}

*/