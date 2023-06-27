import { GameState } from '../GameState'
import Storage from '../Storage'
import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../constant/CanvasSize'
import { STORAGE_KEY } from '../constant/StorageKey'
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
        this.createBackButton()
        this.createTexts()
        this.createSwitchButtons()
    }

    private createBackButton() {
        const backBtn = new Button({
            scene: this,
            x: CANVAS_WIDTH * 0.06,
            y: CANVAS_HEIGHT * 0.035,
            texture: 'back-btn',
            scale: 0.3,
            pointerUpCallback: () => {
                const previousState = GameManager.getPreviousState()

                switch (previousState) {
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
                        break
                }
            },
        })
    }

    private createTexts() {
        this.addText(CANVAS_WIDTH * 0.1, CANVAS_HEIGHT * 0.4, 'SOUNDS')
        this.addText(CANVAS_WIDTH * 0.1, CANVAS_HEIGHT * 0.5, 'VIBRATION')
        this.addText(CANVAS_WIDTH * 0.1, CANVAS_HEIGHT * 0.6, 'NIGHT MODE')
    }

    private addText(x: number, y: number, text: string) {
        this.add.bitmapText(x, y, 'objet', text, 50).setTint(0xc1c1c1).setDepth(-3)
    }

    private createSwitchButtons() {
        this.soundBtn = this.createSwitchButton(
            CANVAS_WIDTH * 0.7,
            CANVAS_HEIGHT * 0.4,
            STORAGE_KEY.SOUND
        ).setActive(Storage.getString(STORAGE_KEY.SOUND) === 'true')

        this.vibrationBtn = this.createSwitchButton(
            CANVAS_WIDTH * 0.7,
            CANVAS_HEIGHT * 0.5,
            STORAGE_KEY.VIBRATION
        ).setActive(Storage.getString(STORAGE_KEY.VIBRATION) === 'true')

        this.nightModeBtn = this.createSwitchButton(
            CANVAS_WIDTH * 0.7,
            CANVAS_HEIGHT * 0.6,
            STORAGE_KEY.NIGHT_MODE
        ).setActive(Storage.getString(STORAGE_KEY.NIGHT_MODE) === 'true')
    }

    private createSwitchButton(x: number, y: number, key: STORAGE_KEY): SwitchButton {
        const switchButton = new SwitchButton({
            scene: this,
            x: x,
            y: y,
            textureOn: 'rounded-btn',
            frameOn: 0,
            textureOff: 'rounded-btn',
            frameOff: 1,
            scale: 0.5,
            pointerUpCallback: () => {
                switchButton.toggle()
                Storage.setString(key, `${switchButton.getActive()}`)
            },
        }).setOrigin(0)

        return switchButton
    }
}
