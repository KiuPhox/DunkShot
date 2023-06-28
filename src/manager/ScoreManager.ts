import Storage from '../Storage'
import { CANVAS_HEIGHT, CANVAS_WIDTH } from '../constant/CanvasSize'
import { STORAGE_KEY } from '../constant/StorageKey'

export default class ScoreManager {
    public static curScoreText: Phaser.GameObjects.BitmapText
    public static highScoreText: Phaser.GameObjects.BitmapText
    public static bestScoreText: Phaser.GameObjects.BitmapText

    private static curScore: number
    private static highScore: number

    constructor(scene: Phaser.Scene) {
        this.init()

        this.createCurrentScoreText(scene)
        this.createBestScoreText(scene)
        this.createHighScoreText(scene)
    }

    private init(): void {
        ScoreManager.curScore = 0
        ScoreManager.highScore = 0

        ScoreManager.highScore = Storage.getInt(STORAGE_KEY.HIGH_SCORE)
    }

    private createCurrentScoreText(scene: Phaser.Scene): void {
        ScoreManager.curScoreText = scene.add
            .bitmapText(CANVAS_WIDTH * 0.5, CANVAS_HEIGHT * 0.17, 'objet', '0', 180)
            .setTint(0xc1c1c1)
            .setDepth(-3)
            .setOrigin(0.5)
    }

    private createBestScoreText(scene: Phaser.Scene): void {
        ScoreManager.bestScoreText = scene.add
            .bitmapText(CANVAS_WIDTH * 0.5, CANVAS_HEIGHT * 0.02, 'objet', 'Best Score', 40)
            .setTint(0xfb8b25)
            .setDepth(-3)
            .setOrigin(0.5)
            .setAlpha(0)
    }

    private createHighScoreText(scene: Phaser.Scene): void {
        ScoreManager.highScoreText = scene.add
            .bitmapText(
                CANVAS_WIDTH * 0.5,
                CANVAS_HEIGHT * 0.07,
                'objet',
                Storage.getString(STORAGE_KEY.HIGH_SCORE),
                90
            )
            .setTint(0xfb8b25)
            .setDepth(-3)
            .setOrigin(0.5)
            .setAlpha(0)
    }

    public static updateScore = (score: number) => {
        this.curScore = score

        if (this.curScore > this.highScore) {
            this.highScore = this.curScore
            Storage.setNumber(STORAGE_KEY.HIGH_SCORE, this.highScore)
            this.highScoreText.setText(this.highScore.toString())
        }
        this.curScoreText.setText(this.curScore.toString())
    }
}