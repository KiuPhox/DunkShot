import GameManager from '../GameManager'
import { GameState } from '../GameState'
import Button from '../objects/Button'

export default class MainMenuScene extends Phaser.Scene {
    private pauseBtn: Button
    constructor() {
        super('main-menu')
        GameManager.emitter.on('game-state-changed', this.onGameStateChanged)
    }

    create() {
        const { width, height } = this.scale
        const title = this.add.image(width * 0.5, -height * 0.25, 'title').setScale(0.3)

        const help = this.add.sprite(width * 0.2, height * 0.88, 'help').setScale(0.3)

        help.anims.create({
            key: 'idle',
            frames: this.anims.generateFrameNames('help', {
                start: 0,
                end: 23,
            }),
            frameRate: 32,
            repeat: -1,
        })

        help.play('idle')

        this.pauseBtn = new Button({
            scene: this,
            x: width * 0.1,
            y: height * 0.035,
            texture: 'pause-btn',
            scale: 0.15,
            pointerUpCallback: () => {
                if (GameManager.getGameState() === GameState.PLAYING) {
                    this.scene.sleep().pause('game').launch('pause')
                }
            },
        }).setAlpha(0)

        this.add.tween({
            targets: title,
            y: { value: height * 0.25, duration: 500 },
            ease: 'Quad.out',
        })

        this.input.on('pointerdown', () => {
            if (GameManager.getGameState() === GameState.READY) {
                GameManager.updateGameState(GameState.PLAYING)
                help.stop()
                this.add.tween({
                    targets: [title, help],
                    alpha: { value: 0, duration: 500 },
                    ease: 'Quad.out',
                })

                this.add.tween({
                    targets: this.pauseBtn,
                    alpha: { value: 1, duration: 500 },
                    ease: 'Quad.out',
                })
            }
        })
    }

    private onGameStateChanged = (gameState: GameState) => {
        if (gameState === GameState.GAME_OVER) {
            this.add.tween({
                targets: this.pauseBtn,
                alpha: { value: 0, duration: 500 },
                ease: 'Quad.out',
            })
        }
    }
}
