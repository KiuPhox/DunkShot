import PopUpManager from './PopupManager'
import SoundManager from './SoundManager'

export default class ProgressManager {
    private static bounce: number
    private static perfect: number

    private static previousCombo: number
    private static combo: number

    public static emitter: Phaser.Events.EventEmitter

    public static init() {
        this.bounce = 0
        this.perfect = 0
        this.combo = 0

        this.emitter = new Phaser.Events.EventEmitter()
    }

    public static getBounce(): number {
        return this.bounce
    }

    public static setBounce(bounce: number): void {
        this.bounce = bounce
    }

    public static getCombo(): number {
        return this.combo
    }

    public static setCombo(combo: number): void {
        this.combo = combo
        this.emitter.emit('combo-changed', combo)
    }

    public static handlePopup(): void {
        const combo = ProgressManager.getCombo()

        if (combo >= 4) {
            if (combo === 4) {
                SoundManager.playComboStartSound()
            } else {
                SoundManager.playComboHitSound()
            }
        }

        // Bounce
        if (ProgressManager.getBounce() > 0) {
            PopUpManager.create({
                text: `Bounce${
                    ProgressManager.getBounce() > 1 ? ' x' + ProgressManager.getBounce() : ''
                }`,
                color: 0x30a2ff,
            })
        }

        // Perfect
        if (this.previousCombo > 0 && combo > this.previousCombo) {
            PopUpManager.create({
                text: `Perfect${combo - 1 > 1 ? ' x' + (combo - 1) : ''}`,
                color: 0xfb8b25,
            })
        }

        this.previousCombo = combo

        // Score
        // PopUpManager.create({ text: `+${score}`, color: 0xd0532a })
        // PopUpManager.playTweenQueue(basket.x, basket.y - 50)
        ProgressManager.setBounce(0)
    }
}
