import { GameModeState, GameState } from '../../GameState'
import { CANVAS_WIDTH } from '../../constant/CanvasSize'
import GameManager from '../../manager/GameManager'
import PlayerDataManager from '../../manager/PlayerDataManager'
import ScoreManager from '../../manager/ScoreManager'
import Button from '../../objects/Button/Button'
import { IScreen } from '../../types/screen'

export default class ResultScreen extends Phaser.GameObjects.Container {
    private resetBtn: Phaser.GameObjects.Image
    private settingsBtn: Phaser.GameObjects.Image
    private shareBtn: Phaser.GameObjects.Image

    private curScoreText: Phaser.GameObjects.BitmapText
    private highScoreText: Phaser.GameObjects.BitmapText
    private bestScoreText: Phaser.GameObjects.BitmapText

    constructor(s: IScreen) {
        super(s.scene, s.x, s.y)
        s.scene.add.existing(this)

        this.createCurrentScoreText()
        this.createBestScoreText()
        this.createHighScoreText()
        this.createShareBtn()
        this.createResetBtn()
        this.createSettingsBtn()

        this.add(this.curScoreText)
        this.add(this.bestScoreText)
        this.add(this.highScoreText)
        this.add(this.shareBtn)
        this.add(this.resetBtn)
        this.add(this.settingsBtn)

        if (GameManager.getCurrentState() === GameState.CHALLENGE_READY) {
            this.curScoreText.setVisible(false)
            this.highScoreText.setVisible(false)
            this.bestScoreText.setVisible(false)
        }

        ScoreManager.emitter.on('high-score-updated', this.handleHighScoreUpdated)
        ScoreManager.emitter.on('score-updated', this.handleScoreUpdated)
        GameManager.emitter.on('game-state-changed', this.onGameStateChanged)
    }

    private createShareBtn(): void {
        this.shareBtn = new Button({
            scene: this.scene,
            x: CANVAS_WIDTH * 0.28,
            y: this.scene.scale.height * 0.8,
            texture: 'share-btn',
            scale: 0.4,
        }).setScale(0)
    }

    private createResetBtn(): void {
        this.resetBtn = new Button({
            scene: this.scene,
            x: CANVAS_WIDTH * 0.5,
            y: this.scene.scale.height * 0.8,
            texture: 'reset-btn',
            scale: 0.4,
            pointerUpCallback: () => {
                GameManager.updateGameState(GameState.READY, this.scene)
            },
        }).setScale(0)
    }

    private createSettingsBtn(): void {
        this.settingsBtn = new Button({
            scene: this.scene,
            x: CANVAS_WIDTH * 0.72,
            y: this.scene.scale.height * 0.8,
            texture: 'settings-btn',
            scale: 0.4,
            pointerUpCallback: () => {
                GameManager.updateGameState(GameState.SETTINGS, this.scene)
            },
        }).setScale(0)
    }

    private showResult(): void {
        this.resetBtn.setScale(0)
        this.settingsBtn.setScale(0)
        this.shareBtn.setScale(0)

        this.scene.add.tween({
            targets: [this.resetBtn, this.settingsBtn, this.shareBtn],
            scale: { value: 0.4, duration: 300 },
            ease: 'Quad.out',
        })

        this.scene.add.tween({
            targets: [this.highScoreText, this.bestScoreText],
            alpha: { value: 1, duration: 500 },
            ease: 'Quad.out',
        })
    }

    private createCurrentScoreText(): void {
        this.curScoreText = this.scene.add
            .bitmapText(CANVAS_WIDTH * 0.5, this.scene.scale.height * 0.17, 'triomphe', '0', 180)
            .setTint(0xc1c1c1)
            .setDepth(-3)
            .setOrigin(0.5)
    }

    private createBestScoreText(): void {
        this.bestScoreText = this.scene.add
            .bitmapText(
                CANVAS_WIDTH * 0.5,
                this.scene.scale.height * 0.02,
                'triomphe',
                'Best Score',
                40
            )
            .setTint(0xfb8b25)
            .setDepth(-3)
            .setOrigin(0.5)
            .setAlpha(0)
    }

    private createHighScoreText(): void {
        this.highScoreText = this.scene.add
            .bitmapText(
                CANVAS_WIDTH * 0.5,
                this.scene.scale.height * 0.07,
                'triomphe',
                PlayerDataManager.getHighScore().toString(),
                90
            )
            .setTint(0xfb8b25)
            .setDepth(-3)
            .setOrigin(0.5)
            .setAlpha(0)
    }

    private handleHighScoreUpdated = (highScore: number) => {
        this.highScoreText.setText(highScore.toString())
    }

    private handleScoreUpdated = (score: number) => {
        this.curScoreText.setText(score.toString())
    }

    private onGameStateChanged = (currentState: GameState) => {
        if (
            currentState === GameState.GAME_OVER &&
            GameManager.getGameModeState() === GameModeState.NORMAL
        ) {
            this.showResult()
        } else if (currentState === GameState.CHALLENGES_SELECTION) {
            this.curScoreText.setVisible(false)
        }
    }

    destroy(fromScene?: boolean | undefined): void {
        super.destroy(fromScene)
        GameManager.emitter.off('game-state-changed', this.onGameStateChanged)
    }
}
