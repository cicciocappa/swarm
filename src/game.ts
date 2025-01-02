// Assuming you have a PIXI.Application instance called app
// and an array of zombies and a player
import { Application, Assets, Sprite, Ticker } from 'pixi.js';
import { Player } from './entities/player';
import { Zombie } from './entities/zombie';
import { setupInput } from './keyboard';
import { Boid } from './entities/boid';
import { QuadTree, Rectangle, Circle, Point, Vector2, Att } from './utils';

export const width: number = 1024;
export const height: number = 640;

export class Game {
    private app: Application | null = null;
    //private entities: (Zombie | Player)[] = [];
    private flock: Boid[] = [];
  


    async initialize(): Promise<void> {
        setupInput();
        const elem: HTMLDivElement = document.querySelector("div") as HTMLDivElement;
        elem.addEventListener("mousedown", this.setAttraction);
        elem.addEventListener("mouseup", this.removeAttraction);
        this.app = new Application();
        await this.app.init({ background: '#1099bb', resizeTo: elem, });
        elem.appendChild(this.app.canvas);
        // for now, we have only 2 images, so we load them directly
        //await Assets.init({manifest: "public/manifest.json"});
        //const assets = await Assets.loadBundle('game-screen');
        await Assets.load('/player.png');
        await Assets.load('/zombie.png');
        this.init();
        this.app.ticker.add(ticker => this.gameLoop(ticker.deltaTime));
    }

    setAttraction(ev: MouseEvent) {
        Att.active = true;
        Att.x = ev.offsetX;
        Att.y = ev.offsetY;
        console.log(Att);
    }

    removeAttraction(){
        Att.active = false;
    }

    init() {

        for (let i = 0; i < 100; i++) {
            const boid = new Boid()
            this.flock.push(boid);
            this.app?.stage.addChild(boid.sprite);
        }

        /*
        const player = new Player();
        this.entities.push(player);
        this.app?.stage.addChild(player.sprite);
        for (let i = 0; i < 1; i++) {
            const speed = Math.random();
            const agility = Math.random();
            const erratic = Math.random();
            const awareness = Math.random();
            const zombie = new Zombie(speed, agility, erratic, awareness);
            this.entities.push(zombie);
            this.app?.stage.addChild(zombie.sprite);
        }
            */

    }


    private gameLoop(delta: number): void {
        // Update game logic
        //this.entities.forEach(entity => entity.update(delta));


        // Make quadtree
        let boundary = new Rectangle(width / 2, height / 2, width, height);
        /*
        for (let i = 0; i < qtreeCapacity.length; i++) {
            if (qtreeCapacity[i].checked) {
                var capacity = qtreeCapacity[i].value;
            }
        }
            */
        let capacity = 8;
        let qtree = new QuadTree(boundary, capacity);

        for (let boid of this.flock) {
            let point = new Point(boid.position.x, boid.position.y, boid);
            qtree.insert(point);
        }
        /*
        if (showQtree) {
            qtree.show();
        }
          

        for (i = 0; i < bounding.length; i++) {
            if (bounding[i].checked) {
                var bounding_value = bounding[i].value;
            }
        }
              */

        let bounding_value = "Bound";
        // flock
        for (let boid of this.flock) {
            if (true) {
                let range = new Circle(boid.position.x, boid.position.y, 50);
                let points = qtree.query(range);
                let newFlock = [];
                for (let point of points) {
                    newFlock.push(point.userData);
                }
                boid.edges("Bound");
                boid.flock(newFlock, this.attractionPoint);
                boid.update();
                boid.show();
            } else {
                boid.edges("Bound");
                boid.flock(this.flock, this.attractionPoint);
                boid.update();
                boid.show();
            }
        }
        qtree.clear();



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