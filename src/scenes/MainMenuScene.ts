export default class MainMenuScene extends Phaser.Scene {
    constructor() {
        super('main-menu')
    }

    create() {
        const { width, height } = this.scale
        const title = this.add.image(width * 0.5, -height * 0.25, 'title').setScale(0.3)

        this.add.tween({
            targets: title,
            y: { value: height * 0.25, duration: 500 },
            ease: 'Quad.out',
        })

        const scoreText = this.add
            .bitmapText(width * 0.5, height * 0.17, 'objet', '0', 90)
            .setTint(0xc1c1c1)
            .setDepth(-3)
            .setOrigin(0.5)
    }
}
