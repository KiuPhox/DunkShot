import { GameState } from '../../GameState'
import { CANVAS_WIDTH } from '../../constant/CanvasSize'
import GameManager from '../../manager/GameManager'
import Button from '../../objects/Button/Button'
import { IScreen } from '../../types/screen'

export default class MainMenuScreen extends Phaser.GameObjects.Container {
    private pauseBtn: Button
    private customizeBtn: Button
    private challengesBtn: Button
    private settingsBtn: Button

    private logo: Phaser.GameObjects.Image
    private help: Phaser.GameObjects.Sprite

    constructor(s: IScreen) {
        super(s.scene, s.x, s.y)
        s.scene.add.existing(this)

        this.createLogo()
        this.createHelpAnimation()
        this.createPauseButton()
        this.createSettingsButton()
        this.createCustomizeButton()
        this.createChallengesButton()

        this.add(this.logo)
        this.add(this.help)
        this.add(this.pauseBtn)
        this.add(this.customizeBtn)
        this.add(this.challengesBtn)
        this.add(this.settingsBtn)

        if (GameManager.getCurrentState() === GameState.CHALLENGE_READY) {
            this.logo.alpha = 0
            this.customizeBtn.alpha = 0
            this.challengesBtn.alpha = 0
            this.help.alpha = 0
            this.settingsBtn.alpha = 0
            this.pauseBtn.setTint(0xffffff).setAlpha(1)
        } else if (GameManager.getCurrentState() === GameState.READY) {
            this.scene.tweens.add({
                targets: this.logo,
                y: { value: this.scene.scale.height * 0.25, duration: 500 },
                ease: 'Quad.out',
            })
        }
        GameManager.emitter.on('game-state-changed', this.onGameStateChanged)
    }

    private createLogo() {
        this.logo = this.scene.add
            .image(CANVAS_WIDTH * 0.5, -this.scene.scale.height * 0.25, 'logo')
            .setScale(0.85)
    }

    private createHelpAnimation() {
        this.help = this.scene.add
            .sprite(CANVAS_WIDTH * 0.2, this.scene.scale.height * 0.88, 'help')
            .setScale(0.6)

        this.help.anims.create({
            key: 'idle',
            frames: this.scene.anims.generateFrameNames('help', {
                start: 0,
                end: 23,
            }),
            frameRate: 32,
            repeat: -1,
        })

        this.help.play('idle')
    }

    private createPauseButton() {
        this.pauseBtn = new Button({
            scene: this.scene,
            x: CANVAS_WIDTH * 0.06,
            y: this.scene.scale.height * 0.035,
            texture: 'pause-btn',
            scale: 1,
            pointerUpCallback: this.handlePauseButtonClick,
        })
            .setAlpha(0)
            .setTint(0x8b8b8b)
    }

    private createSettingsButton() {
        this.settingsBtn = new Button({
            scene: this.scene,
            x: CANVAS_WIDTH * 0.06,
            y: this.scene.scale.height * 0.035,
            texture: 'settings-mainmenu-btn',
            scale: 1,
            pointerUpCallback: this.handleSettingsButtonClick,
        })
    }

    private createCustomizeButton() {
        this.customizeBtn = new Button({
            scene: this.scene,
            x: CANVAS_WIDTH * 0.55,
            y: this.scene.scale.height * 0.85,
            texture: 'customize-mainmenu-btn',
            scale: 0.75,
            pointerUpCallback: this.handleCustomizeButtonClick,
        })
    }

    private createChallengesButton() {
        this.challengesBtn = new Button({
            scene: this.scene,
            x: CANVAS_WIDTH * 0.8,
            y: this.scene.scale.height * 0.85,
            texture: 'challenges-btn',
            scale: 0.75,
            pointerUpCallback: this.handleChallengesButtonClick,
        })
    }

    private handlePauseButtonClick = () => {
        if (
            GameManager.getCurrentState() === GameState.PLAYING ||
            GameManager.getCurrentState() === GameState.CHALLENGE_PLAYING
        ) {
            GameManager.emitter.off('game-state-changed', this.onGameStateChanged)
            GameManager.updateGameState(GameState.PAUSE, this.scene)
        }
    }

    private handleChallengesButtonClick = () => {
        GameManager.updateGameState(GameState.CHALLENGES_SELECTION, this.scene)
    }

    private handleCustomizeButtonClick = () => {
        GameManager.updateGameState(GameState.CUSTOMIZE, this.scene)
    }

    private handleSettingsButtonClick = () => {
        GameManager.updateGameState(GameState.SETTINGS, this.scene)
    }

    private onGameStateChanged = (gameState: GameState) => {
        if (gameState === GameState.READY) {
            this.logo.alpha = 1
            this.customizeBtn.alpha = 1
            this.challengesBtn.alpha = 1
            this.help.alpha = 1
            this.settingsBtn.alpha = 1
            this.scene.tweens.add({
                targets: this.logo,
                y: { value: this.scene.scale.height * 0.25, duration: 500 },
                ease: 'Quad.out',
            })
        } else if (gameState === GameState.GAME_OVER) {
            this.scene.tweens.add({
                targets: this.pauseBtn,
                alpha: { value: 0, duration: 500 },
                ease: 'Quad.out',
            })
        } else if (gameState === GameState.PLAYING) {
            this.scene.tweens.add({
                targets: [
                    this.logo,
                    this.help,
                    this.customizeBtn,
                    this.settingsBtn,
                    this.challengesBtn,
                ],
                alpha: { value: 0, duration: 500 },
                ease: 'Quad.out',
            })

            this.scene.tweens.add({
                targets: this.pauseBtn,
                alpha: { value: 1, duration: 500 },
                ease: 'Quad.out',
            })

            this.help.stop()
        }
    }

    destroy(fromScene?: boolean | undefined): void {
        super.destroy(fromScene)
        GameManager.emitter.off('game-state-changed', this.onGameStateChanged)
    }
}
