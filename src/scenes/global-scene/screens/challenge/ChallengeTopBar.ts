import { GameState } from '../../../../GameState'
import { CANVAS_WIDTH } from '../../../../constant/CanvasSize'
import { CHALLENGES, CHALLENGES_CONFIG } from '../../../../constant/Challenges'
import GameManager from '../../../../manager/GameManager'
import { IScreen } from '../../../../types/screen'

export default class ChallengeTopbar extends Phaser.GameObjects.Container {
    private rect: Phaser.GameObjects.Rectangle
    private title: Phaser.GameObjects.BitmapText

    constructor(s: IScreen) {
        super(s.scene, s.x, s.y)
        s.scene.add.existing(this)

        this.createRect()
        this.createTitle()

        if (GameManager.getCurrentState() === GameState.CHALLENGE_READY) {
            const { name, level } = this.scene.registry.get('challenge')
            this.rect.setAlpha(1).fillColor = CHALLENGES_CONFIG[name as CHALLENGES].color

            this.title.setText(`CHALLENGE ${level}`).setAlpha(1)
        }

        this.add(this.rect)
        this.add(this.title)
    }

    private createRect(): void {
        this.rect = this.scene.add
            .rectangle(0, 0, CANVAS_WIDTH, this.scene.scale.height * 0.07, 0xffffff)
            .setOrigin(0, 0)
            .setAlpha(0)
    }

    private createTitle(): void {
        this.title = this.scene.add
            .bitmapText(
                CANVAS_WIDTH / 2,
                this.scene.scale.height * 0.03,
                'triomphe',
                'CHALLENGE',
                32
            )
            .setAlpha(0)
            .setOrigin(0.5, 0.5)
    }

    destroy(fromScene?: boolean | undefined): void {
        super.destroy(fromScene)
    }
}
