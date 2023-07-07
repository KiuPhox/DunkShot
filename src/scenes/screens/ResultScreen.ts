import { GameState } from '../../GameState'
import { CANVAS_WIDTH } from '../../constant/CanvasSize'
import GameManager from '../../manager/GameManager'
import ScoreManager from '../../manager/ScoreManager'
import Button from '../../objects/Button/Button'
import { IScreen } from '../../types/screen'

export default class ResultScreen extends Phaser.GameObjects.Container {
    private resetBtn: Phaser.GameObjects.Image
    private settingsBtn: Phaser.GameObjects.Image
    private shareBtn: Phaser.GameObjects.Image

    constructor(s: IScreen) {
        super(s.scene, s.x, s.y)
        s.scene.add.existing(this)

        new ScoreManager()
        this.shareBtn = new Button({
            scene: this.scene,
            x: CANVAS_WIDTH * 0.28,
            y: this.scene.scale.height * 0.8,
            texture: 'share-btn',
            scale: 0.4,
        }).setScale(0)

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

        this.add(this.shareBtn)
        this.add(this.resetBtn)
        this.add(this.settingsBtn)

        GameManager.emitter.on('game-state-changed', this.onGameStateChanged)
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
            targets: [ScoreManager.highScoreText, ScoreManager.bestScoreText],
            alpha: { value: 1, duration: 500 },
            ease: 'Quad.out',
        })
    }

    private onGameStateChanged = (currentState: GameState) => {
        if (currentState === GameState.GAME_OVER) {
            this.showResult()
        }
    }

    destroy(fromScene?: boolean | undefined): void {
        super.destroy(fromScene)
        GameManager.emitter.off('game-state-changed', this.onGameStateChanged)
    }
}
