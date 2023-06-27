import GameManager from '../manager/GameManager'
import { GameState } from '../GameState'
import Button from '../objects/Button/Button'
import { CANVAS_HEIGHT, CANVAS_WIDTH } from '../constant/CanvasSize'

export default class PauseScene extends Phaser.Scene {
    constructor() {
        super('pause')
    }

    create() {
        const mainmenuBtn = new Button({
            scene: this,
            x: CANVAS_WIDTH * 0.5,
            y: CANVAS_HEIGHT * 0.35,
            texture: 'mainmenu-btn',
            scale: 0.4,
            pointerUpCallback: () => {
                GameManager.updateGameState(GameState.READY)
                this.scene.start('result').launch('game').launch('main-menu')
            },
        })

        const customizeBtn = new Button({
            scene: this,
            x: CANVAS_WIDTH * 0.5,
            y: CANVAS_HEIGHT * 0.45,
            texture: 'customize-btn',
            scale: 0.4,
            pointerUpCallback: () => {
                GameManager.updateGameState(GameState.CUSTOMIZE)
                this.scene.launch('customize').sleep('pause')
            },
        })

        const settingsBtn = new Button({
            scene: this,
            x: CANVAS_WIDTH * 0.5,
            y: CANVAS_HEIGHT * 0.55,
            texture: 'settings-pause-btn',
            scale: 0.4,
            pointerUpCallback: () => {
                GameManager.updateGameState(GameState.CUSTOMIZE)
                this.scene.launch('settings').sleep('pause')
            },
        })

        const resumeBtn = new Button({
            scene: this,
            x: CANVAS_WIDTH * 0.5,
            y: CANVAS_HEIGHT * 0.65,
            texture: 'resume-btn',
            scale: 0.4,
            pointerUpCallback: () => {
                GameManager.updateGameState(GameState.PLAYING)
                this.scene.stop().resume('game').wake('main-menu')
            },
        })
    }
}
