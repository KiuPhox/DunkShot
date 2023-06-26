import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../constant/CanvasSize'

export default class StarManager {
    public static curStarText: Phaser.GameObjects.BitmapText

    private static curStar: number

    constructor(scene: Phaser.Scene) {
        StarManager.curStar = 0

        const starStr = localStorage.getItem('star')
        if (starStr !== null) {
            StarManager.curStar = parseInt(starStr)
        }

        StarManager.curStarText = scene.add
            .bitmapText(
                CANVAS_WIDTH * 0.88,
                CANVAS_HEIGHT * 0.05,
                'objet',
                StarManager.curStar.toString(),
                36
            )
            .setTint(0xfb8b25)
            .setDepth(-3)
            .setOrigin(0, 0.5)

        scene.physics.add.sprite(CANVAS_WIDTH * 0.83, CANVAS_HEIGHT * 0.05, 'star').setScale(0.3)
    }

    public static updateStar(star: number) {
        this.curStar = star
        this.curStarText.setText(star.toString())
        localStorage.setItem('star', star.toString())
    }

    public static increaseStar() {
        this.updateStar(this.curStar + 1)
    }

    public static getCurrentStar(): number {
        return this.curStar
    }
}
