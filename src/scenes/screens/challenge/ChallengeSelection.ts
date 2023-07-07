import FixWidthSizer from 'phaser3-rex-plugins/templates/ui/fixwidthsizer/FixWidthSizer'
import RexUIPlugin from 'phaser3-rex-plugins/templates/ui/ui-plugin.js'
import Button from '../../../objects/Button/Button'
import { GameState } from '../../../GameState'
import { CANVAS_WIDTH } from '../../../constant/CanvasSize'
import { CHALLENGES, CHALLENGES_CONFIG } from '../../../constant/Challenges'
import GameManager from '../../../manager/GameManager'
import PlayerDataManager from '../../../manager/PlayerDataManager'
import { IScreen } from '../../../types/screen'

export default class ChallengeSelection extends Phaser.GameObjects.Container {
    private rexUI: RexUIPlugin
    private backBtn: Button
    private sizer: FixWidthSizer

    constructor(s: IScreen) {
        super(s.scene, s.x, s.y)
        this.scene.add.existing(this)

        this.rexUI = new RexUIPlugin(this.scene, this.scene.plugins, 'rexUI')
        this.createBackButton()
        this.createChallenges()

        this.add(this.backBtn)
        this.add(this.sizer)
        this.add(this.scene.add.image(CANVAS_WIDTH / 2, 20, 'top-ornament').setDepth(-2))
    }

    private createChallenges(): void {
        this.sizer = this.rexUI.add.fixWidthSizer({
            x: CANVAS_WIDTH / 2,
            y: this.scene.scale.height / 2 + 300,
            width: CANVAS_WIDTH / 5,
            height: this.scene.scale.height,
            space: {
                left: 10,
                right: 10,
            },
        })

        const config = {
            padding: {
                top: 10,
                bottom: 10,
            },
        }

        const challenges: CHALLENGES[] = [
            CHALLENGES.TIME,
            CHALLENGES.SCORE,
            CHALLENGES.BOUNCE,
            CHALLENGES.NO_AIM,
        ]

        for (const challenge of challenges) {
            this.sizer.add(
                new Button({
                    x: 0,
                    y: 0,
                    scene: this.scene,
                    texture: challenge,
                    scale: 0.8,
                    pointerUpCallback: () => {
                        const level = PlayerDataManager.getChallengeLevel(challenge) + 1
                        if (level <= CHALLENGES_CONFIG[challenge].levels) {
                            this.scene.registry.set('challenge', { name: challenge, level: level })
                            GameManager.updateGameState(GameState.CHALLENGE_READY, this.scene)
                        }
                    },
                }),
                config
            )
        }

        this.sizer
            .layout()
            .setChildrenInteractive({})
            .on('child.click', (child: Button) => {
                if (child.pointerUpCallback) {
                    child.pointerUpCallback()
                }
            })
    }

    private createBackButton() {
        this.backBtn = new Button({
            scene: this.scene,
            x: CANVAS_WIDTH * 0.06,
            y: this.scene.scale.height * 0.035,
            texture: 'back-btn',
            scale: 0.3,
            pointerUpCallback: () => {
                GameManager.updateGameState(GameState.READY, this.scene)
            },
        })
    }
}