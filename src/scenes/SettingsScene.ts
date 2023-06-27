import { GameState } from '../GameState'
import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../constant/CanvasSize'
import GameManager from '../manager/GameManager'
import Button from '../objects/Button/Button'
import SwitchButton from '../objects/Button/SwitchButton'

export default class SettingsScene extends Phaser.Scene {
    private soundBtn: SwitchButton
    private vibrationBtn: SwitchButton
    private nightModeBtn: SwitchButton

    constructor() {
        super('settings')
    }

    create() {
        const backBtn = new Button({
            scene: this,
            x: CANVAS_WIDTH * 0.06,
            y: CANVAS_HEIGHT * 0.035,
            texture: 'back-btn',
            scale: 0.3,
            pointerUpCallback: () => {
                switch (GameManager.getPreviousState()) {
                    case GameState.READY:
                        GameManager.updateGameState(GameState.READY)
                        this.scene.start('result').launch('game').launch('main-menu')
                        break
                    case GameState.PAUSE:
                        GameManager.updateGameState(GameState.PAUSE)
                        this.scene.stop().wake('pause')
                        break
                    case GameState.GAME_OVER:
                        GameManager.updateGameState(GameState.GAME_OVER)
                        this.scene.stop().wake('result')
                }
            },
        })

        this.add
            .bitmapText(CANVAS_WIDTH * 0.1, CANVAS_HEIGHT * 0.4, 'objet', 'SOUNDS', 50)
            .setTint(0xc1c1c1)
            .setDepth(-3)

        this.add
            .bitmapText(CANVAS_WIDTH * 0.1, CANVAS_HEIGHT * 0.5, 'objet', 'VIBRATION', 50)
            .setTint(0xc1c1c1)
            .setDepth(-3)

        this.add
            .bitmapText(CANVAS_WIDTH * 0.1, CANVAS_HEIGHT * 0.6, 'objet', 'NIGHT MODE', 50)
            .setTint(0xc1c1c1)
            .setDepth(-3)

        this.soundBtn = new SwitchButton({
            scene: this,
            x: CANVAS_WIDTH * 0.7,
            y: CANVAS_HEIGHT * 0.4,
            textureOn: 'rounded-btn',
            frameOn: 0,
            textureOff: 'rounded-btn',
            frameOff: 1,
            scale: 0.5,
            pointerUpCallback: () => {
                this.soundBtn.toggle()
            },
        }).setOrigin(0)

        this.vibrationBtn = new SwitchButton({
            scene: this,
            x: CANVAS_WIDTH * 0.7,
            y: CANVAS_HEIGHT * 0.5,
            textureOn: 'rounded-btn',
            frameOn: 0,
            textureOff: 'rounded-btn',
            frameOff: 1,
            scale: 0.5,
            pointerUpCallback: () => {
                this.vibrationBtn.toggle()
            },
        }).setOrigin(0)

        this.nightModeBtn = new SwitchButton({
            scene: this,
            x: CANVAS_WIDTH * 0.7,
            y: CANVAS_HEIGHT * 0.6,
            textureOn: 'rounded-btn',
            frameOn: 0,
            textureOff: 'rounded-btn',
            frameOff: 1,
            scale: 0.5,
            pointerUpCallback: () => {
                this.nightModeBtn.toggle()
            },
        }).setOrigin(0)
    }
}
