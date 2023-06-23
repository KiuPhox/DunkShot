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
            scale: 0.2,
            pointerUpCallback: () => {
                GameManager.updateGameState(GameState.READY)
                this.scene.start('result').launch('game').launch('main-menu')
            },
        })

        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                const ballSkin = new Button({
                    scene: this,
                    x: (width * i) / 4.5 + 60,
                    y: (height * j) / 8 + 200,
                    texture: 'ball',
                    frame: i + j * 4,
                    scale: 0.3,
                    pointerDownCallback: () => {
                        SkinManager.changeSkin(i + j * 4)
                    },
                })
            }
        }
    }
}
