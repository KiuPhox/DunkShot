import GameManager from '../manager/GameManager'
import { GameState } from '../GameState'
import Button from '../objects/Button'
import SkinManager from '../manager/SkinManager'

export default class CustomizeScene extends Phaser.Scene {
    constructor() {
        super('customize')
    }

    create() {
        const { width, height } = this.scale
        const backBtn = new Button({
            scene: this,
            x: width * 0.1,
            y: height * 0.05,
            texture: 'back-btn',
            scale: 0.4,
            pointerUpCallback: () => {
                if (GameManager.getPreviousState() === GameState.READY) {
                    GameManager.updateGameState(GameState.READY)
                    this.scene.start('result').launch('game').launch('main-menu')
                } else if (GameManager.getPreviousState() === GameState.PAUSE) {
                    GameManager.updateGameState(GameState.PAUSE)
                    this.scene.stop().wake('pause')
                }
            },
        })

        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                const ballSkin = new Button({
                    scene: this,
                    x: (width * i) / 4.5 + 120,
                    y: (height * j) / 8 + 300,
                    texture: 'ball',
                    frame: i + j * 4,
                    scale: 0.55,
                    pointerDownCallback: () => {
                        SkinManager.changeSkin(i + j * 4)
                    },
                })
            }
        }
    }
}
