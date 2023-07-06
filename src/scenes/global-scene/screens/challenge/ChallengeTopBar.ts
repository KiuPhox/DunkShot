import { GameState } from '../../../../GameState'
import { CANVAS_WIDTH } from '../../../../constant/CanvasSize'
import { CHALLENGES_COLOR, CHALLENGES } from '../../../../constant/Challenges'
import GameManager from '../../../../manager/GameManager'
import { IScreen } from '../../../../types/screen'
import String from '../../../../utils/String'

export default class ChallengeTopbar extends Phaser.GameObjects.Container {
    private rect: Phaser.GameObjects.Rectangle

    constructor(s: IScreen) {
        super(s.scene, s.x, s.y)
        s.scene.add.existing(this)

        this.rect = s.scene.add
            .rectangle(0, 0, CANVAS_WIDTH, 70, 0xffffff)
            .setOrigin(0, 0)
            .setAlpha(0)

        if (GameManager.getCurrentState() === GameState.CHALLENGE_READY) {
            this.rect.setAlpha(1).fillColor =
                CHALLENGES_COLOR[
                    String.lastSplit(this.scene.registry.get('challenge'), '-')[0] as CHALLENGES
                ]
        }
    }

    destroy(fromScene?: boolean | undefined): void {
        super.destroy(fromScene)
    }
}
