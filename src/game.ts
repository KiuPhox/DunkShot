import Phaser from 'phaser'
import Preloader from './scenes/Preloader'
import GameplayScene from './scenes/GameplayScene'
import DotLinePlugin from './plugins/DotLinePlugin'
import MainMenuScene from './scenes/MainMenuScene'

const config = {
    type: Phaser.WEBGL,
    physics: {
        default: 'arcade',
        arcade: {
            // debug: true,
            gravity: { y: 0 },
        },
    },
    scale: {
        width: window.innerHeight / 1.7,
        height: window.innerHeight,
        parent: 'phaser-game',
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    plugins: {
        scene: [
            {
                key: 'DotLinePlugin',
                plugin: DotLinePlugin,
                start: true,
                mapping: 'dotLine',
            },
        ],
    },
    backgroundColor: '0xe5e5e5',
    scene: [Preloader, GameplayScene, MainMenuScene],
}

export default new Phaser.Game(config)
