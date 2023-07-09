import { GameState } from '../../../GameState'
import { CANVAS_WIDTH } from '../../../constant/CanvasSize'
import { CHALLENGES_CONFIG, CHALLENGES } from '../../../constant/Challenges'
import GameManager from '../../../manager/GameManager'
import { IScreen } from '../../../types/screen'
import RexUIPlugin from 'phaser3-rex-plugins/templates/ui/ui-plugin.js'
import FixWidthSizer from 'phaser3-rex-plugins/templates/ui/fixwidthsizer/FixWidthSizer'

export default class ChallengeTopbar extends Phaser.GameObjects.Container {
    private rect: Phaser.GameObjects.Rectangle
    private title: Phaser.GameObjects.BitmapText
    private icon: Phaser.GameObjects.Image
    private static goal: Phaser.GameObjects.BitmapText

    // No aim
    private static attemptSizer: FixWidthSizer
    private static attemptImages: Phaser.GameObjects.Image[]

    private rexUI: RexUIPlugin

    constructor(s: IScreen) {
        super(s.scene, s.x, s.y)
        s.scene.add.existing(this)
        this.rexUI = new RexUIPlugin(s.scene, s.scene.plugins, 'hud')

        this.createRect()
        this.createTitle()
        this.createIcon()
        this.createGoal()
        this.createAttemptSizer()

        this.add(this.rect)
        this.add(this.title)
        this.add(this.icon)
        this.add(ChallengeTopbar.goal)
        this.add(ChallengeTopbar.attemptSizer)

        if (GameManager.getCurrentState() === GameState.CHALLENGE_READY) {
            const { name, level } = this.scene.registry.get('challenge')
            this.rect.fillColor = CHALLENGES_CONFIG[name as CHALLENGES].color

            this.title.setText(`CHALLENGE ${level}`)

            if (name === 'no-aim') {
                ChallengeTopbar.goal.setAlpha(0).setOrigin(0.5)
                this.icon.setAlpha(0)
            } else if (name === 'time') {
                ChallengeTopbar.attemptSizer.setAlpha(0)
                ChallengeTopbar.goal.setOrigin(0.5)
                this.icon.setAlpha(0)
            } else {
                this.icon.setTexture(`${name}-icon`)
                ChallengeTopbar.attemptSizer.setAlpha(0)
                ChallengeTopbar.goal.setText(this.scene.registry.get('goal')).setOrigin(0, 0.5)
            }
        }

        GameManager.emitter.on('game-state-changed', this.onGameStateChanged)
    }

    private createRect(): void {
        this.rect = this.scene.add
            .rectangle(0, 0, CANVAS_WIDTH, this.scene.scale.height * 0.07, 0xffffff)
            .setOrigin(0, 0)
    }

    private createTitle(): void {
        this.title = this.scene.add
            .bitmapText(
                CANVAS_WIDTH * 0.11,
                this.scene.scale.height * 0.031,
                'triomphe',
                'CHALLENGE',
                20
            )
            .setOrigin(0, 0.5)
    }

    private createIcon() {
        this.icon = this.scene.add
            .image(CANVAS_WIDTH / 2 - 30, this.scene.scale.height * 0.032, 'score-icon')
            .setScale(0.5)
    }

    private createGoal(): void {
        ChallengeTopbar.goal = this.scene.add
            .bitmapText(CANVAS_WIDTH / 2, this.scene.scale.height * 0.027, 'triomphe', '', 32)
            .setOrigin(0.5)
    }

    private createAttemptSizer(): void {
        ChallengeTopbar.attemptImages = []
        ChallengeTopbar.attemptSizer = this.rexUI.add.fixWidthSizer({
            x: CANVAS_WIDTH / 2,
            y: this.scene.scale.height * 0.034,
            width: CANVAS_WIDTH,
            align: 'center',
        })

        for (let i = 0; i < 3; i++) {
            const image = this.scene.add.image(0, 0, 'attempt-active').setScale(0.7)
            ChallengeTopbar.attemptSizer.add(image, {
                padding: {
                    left: 5,
                    right: 5,
                },
            })
            ChallengeTopbar.attemptImages.push(image)
        }

        ChallengeTopbar.attemptSizer.layout()
    }

    public static setGoal(goal: string): void {
        ChallengeTopbar.goal.setText(goal)
    }

    public static setAttempts(attempts: number): void {
        this.attemptImages[attempts].setTexture('attempt-inactive')
    }

    private onGameStateChanged = (gameState: GameState) => {
        if (gameState === GameState.CHALLENGE_READY) {
            const { name, level } = this.scene.registry.get('challenge')
            this.rect.fillColor = CHALLENGES_CONFIG[name as CHALLENGES].color

            this.title.setText(`CHALLENGE ${level}`)
            if (name !== 'no-aim') {
                ChallengeTopbar.goal.setText(this.scene.registry.get('goal'))
            } else {
                ChallengeTopbar.goal.setAlpha(0)
            }
        }
    }

    destroy(fromScene?: boolean | undefined): void {
        super.destroy(fromScene)
        GameManager.emitter.off('game-state-changed', this.onGameStateChanged)
    }
}
