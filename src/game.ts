import Phaser from 'phaser'
import PreloadScene from './scenes/PreloadScene'
import GameplayScene from './scenes/GameplayScene'
import DotLinePlugin from './plugins/DotLinePlugin'
import MainMenuScene from './scenes/MainMenuScene'
import ResultScene from './scenes/ResultScene'
import PauseScene from './scenes/PauseScene'
import CustomizeScene from './scenes/CustomizeScene'
import SettingsScene from './scenes/SettingsScene'
import { CANVAS_HEIGHT, CANVAS_WIDTH } from './constant/CanvasSize'

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
        width: CANVAS_WIDTH,
        height: CANVAS_HEIGHT,
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
    roundPixels: true,
    backgroundColor: '0xe5e5e5',
    scene: [
        PreloadScene,
        GameplayScene,
        ResultScene,
        MainMenuScene,
        CustomizeScene,
        SettingsScene,
        PauseScene,
    ],
}

export default new Phaser.Game(config)
