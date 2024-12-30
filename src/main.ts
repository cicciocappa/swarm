import './style.css'
import { Game } from './game';

(async () => {
  const game = new Game();
  await game.initialize();
})();
