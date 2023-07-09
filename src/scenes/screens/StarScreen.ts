import { GameState } from '../../GameState'
import { CANVAS_WIDTH } from '../../constant/CanvasSize'
import GameManager from '../../manager/GameManager'
import StarManager from '../../manager/StarManager'
import { IScreen } from '../../types/screen'

export default class StarScreen extends Phaser.GameObjects.Container {
    private starText: Phaser.GameObjects.BitmapText
    private starIcon: Phaser.GameObjects.Image

    constructor(s: IScreen) {
        super(s.scene, s.x, s.y)
        s.scene.add.existing(this)

        this.createStarIcon()
        this.createStarText()

        this.add(this.starIcon)
        this.add(this.starText)

        StarManager.emitter.on('star-updated', this.handleStarUpdated)
        GameManager.emitter.on('game-state-changed', this.handleGameState)
    }

    private createStarText() {
        this.starText = this.scene.add
            .bitmapText(
                CANVAS_WIDTH * 0.9,
                this.scene.scale.height * 0.035,
                'triomphe',
                StarManager.getCurrentStar().toString(),
                36
            )
            .setTint(0xfb8b25)
            .setDepth(-3)
            .setOrigin(0, 0.7)
    }

    private createStarIcon() {
        this.starIcon = this.scene.add
            .image(CANVAS_WIDTH * 0.85, this.scene.scale.height * 0.035, 'star')
            .setScale(0.3)
    }

    private handleStarUpdated = (star: number) => {
        this.starText.setText(star.toString())
    }

    private handleGameState = (gameState: GameState) => {
        if (gameState === GameState.CUSTOMIZE) {
            this.starText.setTint(0xffffff)
        } else if (gameState === GameState.PLAYING || gameState === GameState.PAUSE) {
            this.starText.setTint(0xfb8b25)
        }
    }
}
