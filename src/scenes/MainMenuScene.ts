import GameManager from '../GameManager'
import { GameState } from '../GameState'

export default class MainMenuScene extends Phaser.Scene {
    constructor() {
        super('main-menu')
    }

    create() {
        const { width, height } = this.scale
        const title = this.add.image(width * 0.5, -height * 0.25, 'title').setScale(0.3)

        this.add.tween({
            targets: title,
            y: { value: height * 0.25, duration: 500 },
            ease: 'Quad.out',
        })

        this.input.on('pointerdown', () => {
            if (GameManager.getGameState() === GameState.READY) {
                GameManager.updateGameState(GameState.PLAYING)
                this.add.tween({
                    targets: title,
                    alpha: { value: 0, duration: 500 },
                    ease: 'Quad.out',
                })
            }
        })
    }
}
