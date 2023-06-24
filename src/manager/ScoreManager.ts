export default class ScoreManager {
    public static curScoreText: Phaser.GameObjects.BitmapText
    public static highScoreText: Phaser.GameObjects.BitmapText
    public static bestScoreText: Phaser.GameObjects.BitmapText

    private static curScore: number
    private static highScore: number

    constructor(scene: Phaser.Scene) {
        const { width, height } = scene.scale

        ScoreManager.curScore = 0
        ScoreManager.highScore = 0

        const highScoreStr = localStorage.getItem('highScore')
        if (highScoreStr !== null) {
            ScoreManager.highScore = parseInt(highScoreStr)
        }

        ScoreManager.curScoreText = scene.add
            .bitmapText(width * 0.5, height * 0.17, 'objet', '0', 200)
            .setTint(0xc1c1c1)
            .setDepth(-3)
            .setOrigin(0.5)

        ScoreManager.bestScoreText = scene.add
            .bitmapText(width * 0.5, height * 0.02, 'objet', 'Best Score', 50)
            .setTint(0xfb8b25)
            .setDepth(-3)
            .setOrigin(0.5)
            .setAlpha(0)

        ScoreManager.highScoreText = scene.add
            .bitmapText(
                width * 0.5,
                height * 0.07,
                'objet',
                localStorage.getItem('highScore')?.toString(),
                100
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
            localStorage.setItem('highScore', this.highScore.toString())
            this.highScoreText.setText(this.highScore.toString())
        }
        this.curScoreText.setText(this.curScore.toString())
    }
}
