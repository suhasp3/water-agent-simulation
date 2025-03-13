import { Start } from './scenes/Start.js';

const config = {
    type: Phaser.AUTO,
    title: 'Water Agents Simulation',
    description: '',
    parent: 'game-container',
    width: 1280,
    height: 720,
    pixelArt: true,
    scene: [
        Start
    ],
    physics: {       // ✅ Enable Arcade Physics
        default: 'arcade',
        arcade: { debug: true }
    },
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
}
new Phaser.Game(config);
            