import GameManager from '../GameManager'
import { GameState } from '../GameState'
import ScoreManager from '../ScoreManager'

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

        this.resetBtn = this.add
            .image(width * 0.5, height * 0.8, 'reset-btn')
            .setScale(0)
            .setInteractive()

        this.resetBtn.on('pointerdown', () => {
            this.resetBtn.setScale(0.2)
        })

        this.resetBtn.on('pointerup', () => {
            GameManager.updateGameState(GameState.READY)
            this.scene.start('result').launch('game').launch('main-menu')
        })

        this.settingsBtn = this.add.image(width * 0.7, height * 0.8, 'settings-btn').setScale(0)

        this.shareBtn = this.add.image(width * 0.3, height * 0.8, 'share-btn').setScale(0)
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

        // GameManager.updateGameState(GameState.READY)
        // this.scene.start('result').launch('game').launch('main-menu')
    }

    private onGameStateChanged = (gameState: GameState) => {
        if (gameState === GameState.GAME_OVER) {
            this.showResult()
        }
    }
}
