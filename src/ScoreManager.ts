export default class ScoreManager {
    public static curScoreText: Phaser.GameObjects.BitmapText
    public highScoreText: Phaser.GameObjects.BitmapText

    private static curScore: number
    private static highScore: number

    constructor(scene: Phaser.Scene) {
        const { width, height } = scene.scale

        ScoreManager.curScoreText = scene.add
            .bitmapText(width * 0.5, height * 0.17, 'objet', '0', 90)
            .setTint(0xc1c1c1)
            .setDepth(-3)
            .setOrigin(0.5)

        ScoreManager.curScore = 0
        ScoreManager.highScore = 0
    }

    public static updateScore = (score: number) => {
        this.curScore = score
        this.curScoreText.setText(this.curScore.toString())
        if (this.curScore > this.highScore) {
            this.highScore = this.curScore
        }
    }
}
