import { GameState } from '../GameState'
import { CANVAS_WIDTH } from '../constant/CanvasSize'
import GameManager from '../manager/GameManager'
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

        const challenge_names = ['time', 'score', 'bounce', 'no-aim']

        for (const name of challenge_names) {
            sizer.add(
                new Button({
                    x: 0,
                    y: 0,
                    scene: this,
                    texture: name,
                    scale: 0.8,
                    pointerUpCallback: () => {
                        //
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
                if (
                    GameManager.getPreviousState() === GameState.READY ||
                    GameManager.getPreviousState() === GameState.PAUSE
                ) {
                    GameManager.updateGameState(GameManager.getPreviousState(), this)
                }
            },
        })
    }
}
