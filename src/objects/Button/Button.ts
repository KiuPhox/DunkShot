import { IButton } from '../../types/button'

export default class Button extends Phaser.GameObjects.Image {
    public pointerDownCallback?: () => void
    public pointerUpCallback?: () => void

    private defaultScale: number

    private isDown: boolean

    constructor(b: IButton) {
        super(b.scene, b.x, b.y, b.texture, b.frame)
        this.setInteractive()

        this.pointerDownCallback = b.pointerDownCallback
        this.pointerUpCallback = b.pointerUpCallback

        this.on('pointerdown', this.onPointerDown)
        this.on('pointerup', this.onPointerUp)
        this.on('pointerout', this.onPointerOut)

        this.defaultScale = b.scale
        this.setScale(b.scale)

        this.isDown = false

        b.scene.add.existing(this)
    }

    private onPointerDown() {
        this.setScale(this.defaultScale * 0.9)
        this.isDown = true
        if (this.pointerDownCallback !== undefined) {
            this.pointerDownCallback()
        }
    }

    private onPointerUp() {
        this.setScale(this.defaultScale)
        if (this.isDown) {
            this.isDown = false
            if (this.pointerUpCallback !== undefined) {
                this.pointerUpCallback()
            }
        }
    }

    private onPointerOut() {
        this.setScale(this.defaultScale)
    }
}
