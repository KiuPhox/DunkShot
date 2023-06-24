import GameManager from '../manager/GameManager'
import { GameState } from '../GameState'
import Button from '../objects/Button'

export default class PauseScene extends Phaser.Scene {
    constructor() {
        super('pause')
    }

    create() {
        const { width, height } = this.scale

        const mainmenuBtn = new Button({
            scene: this,
            x: width * 0.5,
            y: height * 0.45,
            texture: 'mainmenu-btn',
            scale: 0.5,
            pointerUpCallback: () => {
                GameManager.updateGameState(GameState.READY)
                this.scene.start('result').launch('game').launch('main-menu')
            },
        })

        const customizeBtn = new Button({
            scene: this,
            x: width * 0.5,
            y: height * 0.55,
            texture: 'customize-btn',
            scale: 0.5,
            pointerUpCallback: () => {
                GameManager.updateGameState(GameState.CUSTOMIZE)
                this.scene.launch('customize').sleep('pause')
            },
        })

        const resumeBtn = new Button({
            scene: this,
            x: width * 0.5,
            y: height * 0.65,
            texture: 'resume-btn',
            scale: 0.5,
            pointerUpCallback: () => {
                GameManager.updateGameState(GameState.PLAYING)
                this.scene.stop().resume('game').wake('main-menu')
            },
        })
    }
}
