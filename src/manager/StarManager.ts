import { GameState } from '../GameState'
import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../constant/CanvasSize'
import GameManager from './GameManager'
import PlayerDataManager from './PlayerDataManager'

export default class StarManager {
    public static curStarText: Phaser.GameObjects.BitmapText

    private static curStar: number

    constructor(scene: Phaser.Scene) {
        StarManager.curStar = PlayerDataManager.getStars()

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

        if (
            GameManager.getPreviousState() === GameState.PAUSE ||
            GameManager.getCurrentState() === GameState.PLAYING
        ) {
            this.curStarText.setText(star.toString())
        }

        const playerData = PlayerDataManager.getPlayerData()
        playerData.stars = star
        PlayerDataManager.savePlayerData(playerData)
    }

    public static increaseStar() {
        this.updateStar(this.curStar + 1)
    }

    public static getCurrentStar(): number {
        return this.curStar
    }
}
