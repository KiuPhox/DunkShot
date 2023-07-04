import GameManager from '../manager/GameManager'
import { GameState } from '../GameState'
import Button from '../objects/Button/Button'
import { CANVAS_WIDTH } from '../constant/CanvasSize'
import StarManager from '../manager/StarManager'

export default class MainMenuScene extends Phaser.Scene {
    private pauseBtn: Button
    private customizeBtn: Button
    private challengesBtn: Button
    private settingsBtn: Button

    private logo: Phaser.GameObjects.Image
    private help: Phaser.GameObjects.Sprite

    constructor() {
        super('main-menu')
        GameManager.emitter.on('game-state-changed', this.onGameStateChanged)
    }

    create() {
        this.createLogo()
        this.createHelpAnimation()
        this.createPauseButton()
        this.createSettingsButton()
        this.createCustomizeButton()
        this.createChallengesButton()
        this.setupInputEvents()
        new StarManager(this)
    }

    private createLogo() {
        this.logo = this.add
            .image(CANVAS_WIDTH * 0.5, -this.scale.height * 0.25, 'logo')
            .setScale(0.85)

        this.tweens.add({
            targets: this.logo,
            y: { value: this.scale.height * 0.25, duration: 500 },
            ease: 'Quad.out',
        })
    }

    private createHelpAnimation() {
        this.help = this.add
            .sprite(CANVAS_WIDTH * 0.2, this.scale.height * 0.88, 'help')
            .setScale(0.6)

        this.help.anims.create({
            key: 'idle',
            frames: this.anims.generateFrameNames('help', {
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
            scene: this,
            x: CANVAS_WIDTH * 0.06,
            y: this.scale.height * 0.035,
            texture: 'pause-btn',
            scale: 0.25,
            pointerUpCallback: this.handlePauseButtonClick,
        }).setAlpha(0)
    }

    private createSettingsButton() {
        this.settingsBtn = new Button({
            scene: this,
            x: CANVAS_WIDTH * 0.06,
            y: this.scale.height * 0.035,
            texture: 'settings-mainmenu-btn',
            scale: 1,
            pointerDownCallback: this.handleSettingsButtonClick,
        })
    }

    private createCustomizeButton() {
        this.customizeBtn = new Button({
            scene: this,
            x: CANVAS_WIDTH * 0.55,
            y: this.scale.height * 0.85,
            texture: 'customize-mainmenu-btn',
            scale: 0.75,
            pointerDownCallback: this.handleCustomizeButtonClick,
        })
    }

    private createChallengesButton() {
        this.challengesBtn = new Button({
            scene: this,
            x: CANVAS_WIDTH * 0.8,
            y: this.scale.height * 0.85,
            texture: 'challenges-btn',
            scale: 0.75,
            pointerDownCallback: this.handleChallengesButtonClick,
        })
    }

    private setupInputEvents() {
        this.input.on('pointerdown', () => {
            if (GameManager.getCurrentState() === GameState.READY) {
                GameManager.updateGameState(GameState.PLAYING, this)
                this.handleGameStart()
            }
        })
    }

    private handlePauseButtonClick = () => {
        if (GameManager.getCurrentState() === GameState.PLAYING) {
            GameManager.updateGameState(GameState.PAUSE, this)
        }
    }

    private handleCustomizeButtonClick = () => {
        GameManager.updateGameState(GameState.CUSTOMIZE, this)
    }

    private handleChallengesButtonClick = () => {
        GameManager.updateGameState(GameState.CHALLENGES_SELECTION, this)
    }

    private handleSettingsButtonClick = () => {
        GameManager.updateGameState(GameState.SETTINGS, this)
    }

    private handleGameStart() {
        this.tweens.add({
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

        this.tweens.add({
            targets: this.pauseBtn,
            alpha: { value: 1, duration: 500 },
            ease: 'Quad.out',
        })

        this.help.stop()
    }

    private onGameStateChanged = (gameState: GameState) => {
        if (gameState === GameState.GAME_OVER) {
            this.tweens.add({
                targets: this.pauseBtn,
                alpha: { value: 0, duration: 500 },
                ease: 'Quad.out',
            })
        }
    }
}
