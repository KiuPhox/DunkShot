import PlayerDataManager from './PlayerDataManager'

export default class ScoreManager {
    public static curScoreText: Phaser.GameObjects.BitmapText
    public static highScoreText: Phaser.GameObjects.BitmapText
    public static bestScoreText: Phaser.GameObjects.BitmapText

    private static curScore: number
    private static highScore: number

    constructor() {
        this.init()
    }

    private init(): void {
        ScoreManager.curScore = 0
        ScoreManager.highScore = PlayerDataManager.getHighScore()
    }

    public static getScore(): number {
        return this.curScore
    }

    public static updateScore = (score: number) => {
        this.curScore = score

        if (this.curScore > this.highScore) {
            this.highScore = this.curScore

            const playerData = PlayerDataManager.getPlayerData()
            playerData.highScore = this.curScore
            PlayerDataManager.savePlayerData(playerData)

            this.highScoreText.setText(this.highScore.toString())
        }
        this.curScoreText.setText(this.curScore.toString())
    }
}
