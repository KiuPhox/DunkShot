import { GameState } from '../GameState'
import { CANVAS_WIDTH } from '../constant/CanvasSize'
import { CHALLENGES, CHALLENGES_CONFIG } from '../constant/Challenges'
import GameManager from '../manager/GameManager'
import PlayerDataManager from '../manager/PlayerDataManager'
import Button from '../objects/Button/Button'
import RexUIPlugin from 'phaser3-rex-plugins/templates/ui/ui-plugin.js'

export default class ChallengesSelectionScene extends Phaser.Scene {
    private rexUI: RexUIPlugin

    constructor() {
        super('challenges-selection')
    }

    create() {
        this.createBackButton()
        this.createChallenges()
        this.add.image(CANVAS_WIDTH / 2, 20, 'top-ornament').setDepth(-2)
    }
    private createChallenges(): void {
        const sizer = this.rexUI.add.fixWidthSizer({
            x: CANVAS_WIDTH / 2,
            y: this.scale.height / 2 + 100,
            width: CANVAS_WIDTH / 5,
            height: this.scale.height,
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
            sizer.add(
                new Button({
                    x: 0,
                    y: 0,
                    scene: this,
                    texture: challenge,
                    scale: 0.8,
                    pointerUpCallback: () => {
                        const level = PlayerDataManager.getChallengeLevel(challenge) + 1
                        if (level <= CHALLENGES_CONFIG[challenge].levels) {
                            this.registry.set('challenge', { name: challenge, level: level })
                            GameManager.updateGameState(GameState.CHALLENGE_READY, this)
                        }
                    },
                }),
                config
            )
        }

        sizer
            .layout()
            .setChildrenInteractive({})
            .on('child.click', (child: Button) => {
                if (child.pointerUpCallback) {
                    child.pointerUpCallback()
                }
            })
    }

    private createBackButton() {
        const backBtn = new Button({
            scene: this,
            x: CANVAS_WIDTH * 0.06,
            y: this.scale.height * 0.035,
            texture: 'back-btn',
            scale: 0.3,
            pointerUpCallback: () => {
                GameManager.updateGameState(GameState.READY, this)
            },
        })
    }
}
