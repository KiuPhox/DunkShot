import Phaser from 'phaser'
import PreloadScene from './scenes/PreloadScene'
import GameplayScene from './scenes/GameplayScene'
import DotLinePlugin from './plugins/DotLinePlugin'
import MainMenuScene from './scenes/MainMenuScene'
import ResultScene from './scenes/ResultScene'
import PauseScene from './scenes/PauseScene'
import CustomizeScene from './scenes/CustomizeScene'
import SettingsScene from './scenes/SettingsScene'
import ChallengesSelectionScene from './scenes/ChallengesSelectionScene'
import { CANVAS_HEIGHT, CANVAS_WIDTH } from './constant/CanvasSize'
import UIPlugin from 'phaser3-rex-plugins/templates/ui/ui-plugin.js'

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
        height:
            window.innerHeight > window.innerWidth
                ? (CANVAS_WIDTH * window.innerHeight) / window.innerWidth
                : CANVAS_HEIGHT,
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
            {
                key: 'rexUI',
                plugin: UIPlugin,
                mapping: 'rexUI',
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
        ChallengesSelectionScene,
        SettingsScene,
        PauseScene,
    ],
}

export default new Phaser.Game(config)
