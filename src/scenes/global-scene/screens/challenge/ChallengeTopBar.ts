import { GameState } from '../../../../GameState'
import { CANVAS_WIDTH } from '../../../../constant/CanvasSize'
import { CHALLENGES, CHALLENGES_CONFIG } from '../../../../constant/Challenges'
import GameManager from '../../../../manager/GameManager'
import { IScreen } from '../../../../types/screen'

export default class ChallengeTopbar extends Phaser.GameObjects.Container {
    private rect: Phaser.GameObjects.Rectangle
    private title: Phaser.GameObjects.BitmapText
    private static goal: Phaser.GameObjects.BitmapText

    constructor(s: IScreen) {
        super(s.scene, s.x, s.y)
        s.scene.add.existing(this)

        this.createRect()
        this.createTitle()
        this.createGoal()

        if (GameManager.getCurrentState() === GameState.CHALLENGE_READY) {
            const { name, level } = this.scene.registry.get('challenge')
            this.rect.setAlpha(1).fillColor = CHALLENGES_CONFIG[name as CHALLENGES].color

            this.title.setText(`CHALLENGE ${level}`).setAlpha(1)
            if (name !== 'no-aim')
                ChallengeTopbar.goal.setText(this.scene.registry.get('goal')).setAlpha(1)
        }

        this.add(this.rect)
        this.add(this.title)
        this.add(ChallengeTopbar.goal)
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
                CANVAS_WIDTH * 0.1,
                this.scene.scale.height * 0.031,
                'triomphe',
                'CHALLENGE',
                20
            )
            .setAlpha(0)
            .setOrigin(0, 0.5)
    }

    createGoal() {
        ChallengeTopbar.goal = this.scene.add
            .bitmapText(
                CANVAS_WIDTH / 2,
                this.scene.scale.height * 0.027,
                'triomphe',
                'CHALLENGE',
                32
            )
            .setAlpha(0)
            .setOrigin(0.5)
    }

    destroy(fromScene?: boolean | undefined): void {
        super.destroy(fromScene)
    }

    public static setGoal(goal: string): void {
        ChallengeTopbar.goal.setText(goal)
    }
}
