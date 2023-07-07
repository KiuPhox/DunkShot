import { GameState } from '../../../GameState'
import { CHALLENGES_CONFIG, CHALLENGES } from '../../../constant/Challenges'
import GameManager from '../../../manager/GameManager'
import Button from '../../../objects/Button/Button'
import { IScreen } from '../../../types/screen'

export default class ChallengePopup extends Phaser.GameObjects.Container {
    private challengePopUp: Phaser.GameObjects.Image
    private bg: Phaser.GameObjects.Image
    private title: Phaser.GameObjects.BitmapText
    private description: Phaser.GameObjects.BitmapText

    private button: Button
    private textButton: Phaser.GameObjects.BitmapText

    constructor(s: IScreen) {
        super(s.scene, s.x, s.y)
        s.scene.add.existing(this)

        this.createChallengePopUp()
        this.createButton()
        this.createTitle()
        this.createDescription()
        this.createBackground()

        this.add(this.challengePopUp)
        this.add(this.button)
        this.add(this.textButton)
        this.add(this.bg)
        this.add(this.title)
        this.add(this.description)

        this.scale = 0.01

        if (GameManager.getCurrentState() === GameState.CHALLENGE_READY) {
            this.scene.tweens.add({
                targets: this,
                scale: 1,
                ease: 'Back.out',
                duration: 300,
            })

            const { name, level } = this.scene.registry.get('challenge')

            this.description.setText(CHALLENGES_CONFIG[name as CHALLENGES].description)
            this.title.setText(`CHALLENGE ${level}`)

            const color = CHALLENGES_CONFIG[name as CHALLENGES].color

            this.bg.setTint(color)
            this.button.setTint(color)
        }

        GameManager.emitter.on('game-state-changed', this.onGameStateChanged)
    }
    private createBackground(): void {
        this.bg = this.scene.add.image(0, -40, 'challenge-popup-bg').setScale(0.7)
    }

    private createDescription(): void {
        this.description = this.scene.add.bitmapText(0, -50, 'triomphe', ``, 28).setOrigin(0.5)
    }

    private createTitle(): void {
        this.title = this.scene.add
            .bitmapText(0, -135, 'triomphe', `CHALLENGE`, 32)
            .setOrigin(0.5)
            .setTint(0x8b8b8b)
    }

    private createChallengePopUp(): void {
        this.challengePopUp = this.scene.add.image(0, 0, 'challenge-popup').setScale(0.7)
    }

    private createButton(): void {
        this.button = new Button({
            scene: this.scene,
            x: 0,
            y: 90,
            texture: 'challenge-btn',
            scale: 0.7,
            pointerUpCallback: () => {
                GameManager.updateGameState(GameState.CHALLENGE_PLAYING, this.scene)
            },
        })

        this.textButton = this.scene.add.bitmapText(0, 80, 'triomphe', `PLAY`, 28).setOrigin(0.5)
    }

    private onGameStateChanged = (gameState: GameState) => {
        if (gameState === GameState.CHALLENGE_COMPLETE) {
            this.scene.tweens.add({
                targets: this,
                scale: 1,
                ease: 'Back.out',
                duration: 300,
            })
            this.textButton.setText('BACK')
            this.button.pointerUpCallback = () => {
                GameManager.updateGameState(GameState.CHALLENGES_SELECTION, this.scene)
            }
        } else if (gameState === GameState.CHALLENGE_PLAYING) {
            this.scene.tweens.add({
                targets: this,
                scale: 0,
                ease: 'Quad.out',
                duration: 300,
            })
        } else if (gameState === GameState.CHALLENGE_READY) {
            this.scene.tweens.add({
                targets: this,
                scale: 1,
                ease: 'Back.out',
                duration: 300,
            })

            const { name, level } = this.scene.registry.get('challenge')

            this.description.setText(CHALLENGES_CONFIG[name as CHALLENGES].description)
            this.title.setText(`CHALLENGE ${level}`)

            const color = CHALLENGES_CONFIG[name as CHALLENGES].color

            this.bg.setTint(color)
            this.button.setTint(color)
        }
    }

    destroy(fromScene?: boolean | undefined): void {
        super.destroy(fromScene)
        GameManager.emitter.off('game-state-changed', this.onGameStateChanged)
    }
}
