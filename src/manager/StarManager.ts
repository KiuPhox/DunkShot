import { GameState } from '../GameState'
import Storage from '../Storage'
import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../constant/CanvasSize'
import { STORAGE_KEY } from '../constant/StorageKey'
import GameManager from './GameManager'

export default class StarManager {
    public static curStarText: Phaser.GameObjects.BitmapText

    private static curStar: number

    constructor(scene: Phaser.Scene) {
        StarManager.curStar = Storage.getInt(STORAGE_KEY.STAR)

        StarManager.curStarText = scene.add
            .bitmapText(
                CANVAS_WIDTH * 0.88,
                CANVAS_HEIGHT * 0.05,
                'objet',
                Storage.getString(STORAGE_KEY.STAR),
                36
            )
            .setTint(0xfb8b25)
            .setDepth(-3)
            .setOrigin(0, 0.5)

        scene.physics.add.sprite(CANVAS_WIDTH * 0.83, CANVAS_HEIGHT * 0.05, 'star').setScale(0.3)
    }

    public static updateStar(star: number) {
        this.curStar = star

        if (
            GameManager.getPreviousState() === GameState.PAUSE ||
            GameManager.getCurrentState() === GameState.PLAYING
        ) {
            this.curStarText.setText(star.toString())
        }

        Storage.setNumber(STORAGE_KEY.STAR, star)
    }

    public static increaseStar() {
        this.updateStar(this.curStar + 1)
    }

    public static getCurrentStar(): number {
        return this.curStar
    }
}
