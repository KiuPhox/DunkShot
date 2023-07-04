import { IPopUp } from '../types/popup'

export default class PopUpManager {
    private static scene: Phaser.Scene

    private static popUpText: Phaser.GameObjects.BitmapText
    private static popUpQueue: IPopUp[] = []

    public static init(scene: Phaser.Scene): void {
        PopUpManager.scene = scene

        PopUpManager.popUpText = scene.add
            .bitmapText(0, 0, 'triomphe', '', 40)
            .setTint(0xfb8b25)
            .setDepth(-3)
            .setOrigin(0.5)
            .setAlpha(0)
    }

    public static create(p: IPopUp): void {
        this.popUpQueue.push(p)
    }

    public static playTweenQueue(x: number, y: number): void {
        const popUp = this.popUpQueue.shift()

        if (popUp) {
            this.popUpText.x = x
            this.popUpText.y = y
            this.popUpText.setText(popUp.text).setTint(popUp.color)

            this.scene.add.tween({
                targets: this.popUpText,
                alpha: { value: 1, duration: 250, yoyo: true },
                y: { value: y - 20, duration: 300, ease: 'Back.out' },
                onComplete: () => {
                    this.playTweenQueue(x, y)
                },
            })
        }
    }
}
