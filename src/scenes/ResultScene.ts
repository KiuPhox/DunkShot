import GameManager from '../manager/GameManager'
import { GameState } from '../GameState'
import Button from '../objects/Button'
import ScoreManager from '../manager/ScoreManager'

export default class ResultScene extends Phaser.Scene {
    private resetBtn: Phaser.GameObjects.Image
    private settingsBtn: Phaser.GameObjects.Image
    private shareBtn: Phaser.GameObjects.Image

    private score: ScoreManager

    private curScore: number
    private highScore: number

    constructor() {
        super('result')
        GameManager.init()
        GameManager.emitter.on('game-state-changed', this.onGameStateChanged)
    }

    create() {
        const { width, height } = this.scale

        this.score = new ScoreManager(this)

        this.resetBtn = new Button({
            scene: this,
            x: width * 0.5,
            y: height * 0.8,
            texture: 'reset-btn',
            scale: 0.23,
            pointerUpCallback: () => {
                GameManager.updateGameState(GameState.READY)
                this.scene.start('result').launch('game').launch('main-menu')
            },
        }).setScale(0)

        this.settingsBtn = new Button({
            scene: this,
            x: width * 0.7,
            y: height * 0.8,
            texture: 'settings-btn',
            scale: 0.23,
        }).setScale(0)

        this.shareBtn = new Button({
            scene: this,
            x: width * 0.3,
            y: height * 0.8,
            texture: 'share-btn',
            scale: 0.23,
        }).setScale(0)
    }

    private showResult(): void {
        this.resetBtn.setScale(0)
        this.settingsBtn.setScale(0)
        this.shareBtn.setScale(0)

        this.add.tween({
            targets: [this.resetBtn, this.settingsBtn, this.shareBtn],
            scale: { value: 0.23, duration: 300 },
            ease: 'Quad.out',
        })

        this.add.tween({
            targets: [ScoreManager.highScoreText, ScoreManager.bestScoreText],
            alpha: { value: 1, duration: 500 },
            ease: 'Quad.out',
        })
    }

    private onGameStateChanged = (gameState: GameState) => {
        if (gameState === GameState.GAME_OVER) {
            this.showResult()
        }
    }
}
