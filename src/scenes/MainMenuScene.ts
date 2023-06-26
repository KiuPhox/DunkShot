import GameManager from '../manager/GameManager'
import { GameState } from '../GameState'
import Button from '../objects/Button'
import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../constant/CanvasSize'
import StarManager from '../manager/StarManager'

export default class MainMenuScene extends Phaser.Scene {
    private pauseBtn: Button
    private customizeBtn: Button

    constructor() {
        super('main-menu')
        GameManager.emitter.on('game-state-changed', this.onGameStateChanged)
    }

    create() {
        const title = this.add
            .image(CANVAS_WIDTH * 0.5, -CANVAS_HEIGHT * 0.25, 'title')
            .setScale(0.5)

        const help = this.add.sprite(CANVAS_WIDTH * 0.2, CANVAS_HEIGHT * 0.88, 'help').setScale(0.6)

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
            x: CANVAS_WIDTH * 0.06,
            y: CANVAS_HEIGHT * 0.035,
            texture: 'pause-btn',
            scale: 0.25,
            pointerUpCallback: () => {
                if (GameManager.getCurrentState() === GameState.PLAYING) {
                    GameManager.updateGameState(GameState.PAUSE)
                    this.scene.sleep().pause('game').launch('pause')
                }
            },
        }).setAlpha(0)

        this.customizeBtn = new Button({
            scene: this,
            x: CANVAS_WIDTH * 0.7,
            y: CANVAS_HEIGHT * 0.85,
            texture: 'customize-mainmenu-btn',
            scale: 0.4,
            pointerDownCallback: () => {
                GameManager.updateGameState(GameState.CUSTOMIZE)
                this.scene.stop('game').stop('result').start('customize')
            },
        })

        this.add.tween({
            targets: title,
            y: { value: CANVAS_HEIGHT * 0.25, duration: 500 },
            ease: 'Quad.out',
        })

        this.input.on('pointerdown', () => {
            if (GameManager.getCurrentState() === GameState.READY) {
                GameManager.updateGameState(GameState.PLAYING)
                help.stop()

                this.add.tween({
                    targets: [title, help, this.customizeBtn],
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

        const starManager = new StarManager(this)
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
