import { GameModeState, GameState } from '../../GameState'
import { CANVAS_WIDTH } from '../../constant/CanvasSize'
import GameManager from '../../manager/GameManager'
import Button from '../../objects/Button/Button'
import { IScreen } from '../../types/screen'

export default class PauseScreen extends Phaser.GameObjects.Container {
    constructor(s: IScreen) {
        super(s.scene, s.x, s.y)
        s.scene.add.existing(this)

        this.add(
            this.scene.add
                .rectangle(
                    CANVAS_WIDTH / 2,
                    s.scene.scale.height / 2,
                    CANVAS_WIDTH,
                    s.scene.scale.height,
                    0xe5e5e5
                )
                .setAlpha(0.8)
        )

        const mainmenuBtn = new Button({
            scene: this.scene,
            x: CANVAS_WIDTH * 0.5,
            y: this.scene.scale.height * 0.35,
            texture: 'mainmenu-btn',
            scale: 0.4,
            pointerUpCallback: () => {
                GameManager.updateGameState(GameState.READY, this.scene)
            },
        })

        const customizeBtn = new Button({
            scene: this.scene,
            x: CANVAS_WIDTH * 0.5,
            y: this.scene.scale.height * 0.45,
            texture: 'customize-btn',
            scale: 0.4,
            pointerUpCallback: () => {
                GameManager.updateGameState(GameState.CUSTOMIZE, this.scene)
            },
        })

        const settingsBtn = new Button({
            scene: this.scene,
            x: CANVAS_WIDTH * 0.5,
            y: this.scene.scale.height * 0.55,
            texture: 'settings-pause-btn',
            scale: 0.4,
            pointerUpCallback: () => {
                GameManager.updateGameState(GameState.SETTINGS, this.scene)
            },
        })

        const resumeBtn = new Button({
            scene: this.scene,
            x: CANVAS_WIDTH * 0.5,
            y: this.scene.scale.height * 0.65,
            texture: 'resume-btn',
            scale: 0.4,
            pointerUpCallback: () => {
                if (GameManager.getGameModeState() === GameModeState.NORMAL) {
                    GameManager.updateGameState(GameState.PLAYING, this.scene)
                } else if (GameManager.getGameModeState() === GameModeState.CHALLENGE) {
                    GameManager.updateGameState(GameState.CHALLENGE_PLAYING, this.scene)
                }
            },
        })

        this.add(settingsBtn)
        this.add(resumeBtn)
        this.add(mainmenuBtn)
        this.add(customizeBtn)
    }
}
