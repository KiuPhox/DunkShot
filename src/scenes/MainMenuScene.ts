import GameManager from '../manager/GameManager'
import { GameState } from '../GameState'
import Button from '../objects/Button/Button'
import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../constant/CanvasSize'
import StarManager from '../manager/StarManager'

export default class MainMenuScene extends Phaser.Scene {
    private pauseBtn: Button
    private customizeBtn: Button
    private settingsBtn: Button

    private title: Phaser.GameObjects.Image
    private help: Phaser.GameObjects.Sprite

    constructor() {
        super('main-menu')
        GameManager.emitter.on('game-state-changed', this.onGameStateChanged)
    }

    create() {
        this.createTitle()
        this.createHelpAnimation()
        this.createPauseButton()
        this.createSettingsButton()
        this.createCustomizeButton()
        this.setupInputEvents()
        new StarManager(this)
    }

    private createTitle() {
        this.title = this.add
            .image(CANVAS_WIDTH * 0.5, -CANVAS_HEIGHT * 0.25, 'title')
            .setScale(0.5)

        this.tweens.add({
            targets: this.title,
            y: { value: CANVAS_HEIGHT * 0.25, duration: 500 },
            ease: 'Quad.out',
        })
    }

    private createHelpAnimation() {
        this.help = this.add.sprite(CANVAS_WIDTH * 0.2, CANVAS_HEIGHT * 0.88, 'help').setScale(0.6)

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
            y: CANVAS_HEIGHT * 0.035,
            texture: 'pause-btn',
            scale: 0.25,
            pointerUpCallback: this.handlePauseButtonClick,
        }).setAlpha(0)
    }

    private createSettingsButton() {
        this.settingsBtn = new Button({
            scene: this,
            x: CANVAS_WIDTH * 0.06,
            y: CANVAS_HEIGHT * 0.035,
            texture: 'settings-mainmenu-btn',
            scale: 1,
            pointerDownCallback: this.handleSettingsButtonClick,
        })
    }

    private createCustomizeButton() {
        this.customizeBtn = new Button({
            scene: this,
            x: CANVAS_WIDTH * 0.7,
            y: CANVAS_HEIGHT * 0.85,
            texture: 'customize-mainmenu-btn',
            scale: 0.4,
            pointerDownCallback: this.handleCustomizeButtonClick,
        })
    }

    private setupInputEvents() {
        this.input.on('pointerdown', () => {
            if (GameManager.getCurrentState() === GameState.READY) {
                GameManager.updateGameState(GameState.PLAYING)
                this.handleGameStart()
            }
        })
    }

    private handlePauseButtonClick = () => {
        if (GameManager.getCurrentState() === GameState.PLAYING) {
            GameManager.updateGameState(GameState.PAUSE)
            this.scene.sleep().pause('game').launch('pause')
        }
    }

    private handleCustomizeButtonClick = () => {
        GameManager.updateGameState(GameState.CUSTOMIZE)
        this.scene.stop('game').stop('result').start('customize')
    }

    private handleSettingsButtonClick = () => {
        GameManager.updateGameState(GameState.SETTINGS)
        this.scene.stop('game').stop('result').start('settings')
    }

    private handleGameStart() {
        this.tweens.add({
            targets: [this.title, this.help, this.customizeBtn, this.settingsBtn],
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
