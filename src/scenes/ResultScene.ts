import GameManager from '../manager/GameManager'
import { GameState } from '../GameState'
import Button from '../objects/Button/Button'
import ScoreManager from '../manager/ScoreManager'
import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../constant/CanvasSize'

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
        this.score = new ScoreManager(this)
        this.shareBtn = new Button({
            scene: this,
            x: CANVAS_WIDTH * 0.28,
            y: CANVAS_HEIGHT * 0.8,
            texture: 'share-btn',
            scale: 0.4,
        }).setScale(0)

        this.resetBtn = new Button({
            scene: this,
            x: CANVAS_WIDTH * 0.5,
            y: CANVAS_HEIGHT * 0.8,
            texture: 'reset-btn',
            scale: 0.4,
            pointerUpCallback: () => {
                GameManager.updateGameState(GameState.READY, this)
            },
        }).setScale(0)

        this.settingsBtn = new Button({
            scene: this,
            x: CANVAS_WIDTH * 0.72,
            y: CANVAS_HEIGHT * 0.8,
            texture: 'settings-btn',
            scale: 0.4,
            pointerUpCallback: () => {
                GameManager.updateGameState(GameState.SETTINGS, this)
            },
        }).setScale(0)
    }

    private showResult(): void {
        this.resetBtn.setScale(0)
        this.settingsBtn.setScale(0)
        this.shareBtn.setScale(0)

        this.add.tween({
            targets: [this.resetBtn, this.settingsBtn, this.shareBtn],
            scale: { value: 0.4, duration: 300 },
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
