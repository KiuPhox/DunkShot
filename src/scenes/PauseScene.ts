import GameManager from '../GameManager'
import { GameState } from '../GameState'
import Button from '../objects/Button'

export default class PauseScene extends Phaser.Scene {
    constructor() {
        super('pause')
    }

    create() {
        const { width, height } = this.scale
        const resumeBtn = new Button({
            scene: this,
            x: width * 0.5,
            y: height * 0.55,
            texture: 'resume-btn',
            scale: 0.22,
            pointerUpCallback: () => {
                this.scene.stop().resume('game').wake('main-menu')
            },
        })

        const mainmenuBtn = new Button({
            scene: this,
            x: width * 0.5,
            y: height * 0.45,
            texture: 'mainmenu-btn',
            scale: 0.22,
            pointerUpCallback: () => {
                GameManager.updateGameState(GameState.READY)
                this.scene.start('result').launch('game').launch('main-menu')
            },
        })
    }
}
