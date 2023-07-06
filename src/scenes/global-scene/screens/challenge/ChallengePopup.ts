import { GameState } from '../../../../GameState'
import { CHALLENGES, CHALLENGES_COLOR } from '../../../../constant/Challenges'
import GameManager from '../../../../manager/GameManager'
import Button from '../../../../objects/Button/Button'
import { IScreen } from '../../../../types/screen'
import String from '../../../../utils/String'

export default class ChallengePopup extends Phaser.GameObjects.Container {
    private challengePopUp: Phaser.GameObjects.Image
    private playButton: Button
    private title: Phaser.GameObjects.BitmapText

    constructor(s: IScreen) {
        super(s.scene, s.x, s.y)
        s.scene.add.existing(this)

        this.createChallengePopUp()
        this.createPlayButton()
        this.createTitle()

        this.add(this.challengePopUp)
        this.add(this.playButton)
        this.add(this.title)

        this.scale = 0.01

        if (GameManager.getCurrentState() === GameState.CHALLENGE_READY) {
            this.scene.tweens.add({
                targets: this,
                scale: 1,
                ease: 'Back.out',
                duration: 300,
            })

            const challenge = String.lastSplit(this.scene.registry.get('challenge'), '-')

            this.title.setText(`CHALLENGE ${challenge[1]}`)
            this.playButton.setTint(CHALLENGES_COLOR[challenge[0] as CHALLENGES])
        }

        GameManager.emitter.on('game-state-changed', this.onGameStateChanged)
    }
    private createTitle(): void {
        this.title = this.scene.add
            .bitmapText(0, -120, 'triomphe', `CHALLENGE`, 32)
            .setOrigin(0.5)
            .setTint(0x8b8b8b)
    }

    private createChallengePopUp(): void {
        this.challengePopUp = this.scene.add.image(0, 0, 'challenge-popup').setScale(0.7)
    }

    private createPlayButton(): void {
        this.playButton = new Button({
            scene: this.scene,
            x: 0,
            y: 50,
            texture: 'blue-btn',
            scale: 0.7,
            pointerUpCallback: () => {
                GameManager.updateGameState(GameState.CHALLENGE_PLAYING, this.scene)
            },
        })
    }

    private onGameStateChanged = (gameState: GameState) => {
        if (gameState === GameState.CHALLENGE_COMPLETE) {
            this.scene.tweens.add({
                targets: this,
                scale: 1,
                ease: 'Back.out',
                duration: 300,
            })
            this.playButton.pointerUpCallback = () => {
                console.log('a')
                GameManager.updateGameState(GameState.CHALLENGES_SELECTION, this.scene)
            }
        } else if (gameState === GameState.CHALLENGE_PLAYING) {
            this.scene.tweens.add({
                targets: this,
                scale: 0,
                ease: 'Quad.out',
                duration: 300,
            })
        }
    }

    destroy(fromScene?: boolean | undefined): void {
        super.destroy(fromScene)
        GameManager.emitter.off('game-state-changed', this.onGameStateChanged)
    }
}
