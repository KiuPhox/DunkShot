import { GameState } from '../GameState'
import Storage from '../Storage'
import { CANVAS_WIDTH } from '../constant/CanvasSize'
import { SETTINGS } from '../constant/Settings'
import GameManager from '../manager/GameManager'
import PlayerDataManager from '../manager/PlayerDataManager'
import StarManager from '../manager/StarManager'
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
        this.createClearDataButton()
        this.createUnlimitedButton()
    }

    private createBackButton() {
        const backBtn = new Button({
            scene: this,
            x: CANVAS_WIDTH * 0.06,
            y: this.scale.height * 0.035,
            texture: 'back-btn',
            scale: 0.3,
            pointerUpCallback: () => {
                const previousState = GameManager.getPreviousState()
                if (
                    previousState === GameState.READY ||
                    previousState === GameState.PAUSE ||
                    previousState === GameState.GAME_OVER
                ) {
                    GameManager.updateGameState(previousState, this)
                }
            },
        })
    }

    private createTexts() {
        this.addText(CANVAS_WIDTH * 0.1, this.scale.height * 0.3, 'SOUNDS')
        this.addText(CANVAS_WIDTH * 0.1, this.scale.height * 0.4, 'VIBRATION')
        this.addText(CANVAS_WIDTH * 0.1, this.scale.height * 0.5, 'NIGHT MODE')
    }

    private addText(x: number, y: number, text: string) {
        this.add.bitmapText(x, y, 'objet', text, 50).setTint(0xc1c1c1).setDepth(-3)
    }

    private createClearDataButton(): void {
        new Button({
            scene: this,
            x: this.scale.height * 0.3,
            y: this.scale.height * 0.7,
            texture: 'cleardata-btn',
            scale: 0.5,
            pointerUpCallback: () => {
                Storage.deleteAll()
            },
        })
    }

    private createUnlimitedButton(): void {
        new Button({
            scene: this,
            x: this.scale.height * 0.3,
            y: this.scale.height * 0.8,
            texture: 'unlimited-btn',
            scale: 0.5,
            pointerUpCallback: () => {
                StarManager.updateStar(99999)
            },
        })
    }

    private createSwitchButtons(): void {
        this.soundBtn = this.createSwitchButton(
            CANVAS_WIDTH * 0.7,
            this.scale.height * 0.3,
            SETTINGS.SOUND
        ).setActive(PlayerDataManager.getPlayerData().settings.sound)

        this.vibrationBtn = this.createSwitchButton(
            CANVAS_WIDTH * 0.7,
            this.scale.height * 0.4,
            SETTINGS.VIBRATION
        ).setActive(PlayerDataManager.getPlayerData().settings.vibration)

        this.nightModeBtn = this.createSwitchButton(
            CANVAS_WIDTH * 0.7,
            this.scale.height * 0.5,
            SETTINGS.NIGHT_MODE
        ).setActive(PlayerDataManager.getPlayerData().settings.nightMode)
    }

    private createSwitchButton(x: number, y: number, key: SETTINGS): SwitchButton {
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
                PlayerDataManager.setSettings(key, switchButton.getActive())
            },
        }).setOrigin(0)

        return switchButton
    }
}
