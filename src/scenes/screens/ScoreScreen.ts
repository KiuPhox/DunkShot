import { CANVAS_WIDTH } from '../../constant/CanvasSize'
import PlayerDataManager from '../../manager/PlayerDataManager'
import ScoreManager from '../../manager/ScoreManager'
import { IScreen } from '../../types/screen'

export default class ScoreScreen extends Phaser.GameObjects.Container {
    constructor(s: IScreen) {
        super(s.scene, s.x, s.y)
        s.scene.add.existing(this)

        this.createCurrentScoreText(s.scene)
        this.createBestScoreText(s.scene)
        this.createHighScoreText(s.scene)

        this.add(ScoreManager.curScoreText)
        this.add(ScoreManager.bestScoreText)
        this.add(ScoreManager.highScoreText)
    }

    private createCurrentScoreText(scene: Phaser.Scene): void {
        ScoreManager.curScoreText = scene.add
            .bitmapText(CANVAS_WIDTH * 0.5, scene.scale.height * 0.17, 'triomphe', '0', 180)
            .setTint(0xc1c1c1)
            .setDepth(-3)
            .setOrigin(0.5)
    }

    private createBestScoreText(scene: Phaser.Scene): void {
        ScoreManager.bestScoreText = scene.add
            .bitmapText(CANVAS_WIDTH * 0.5, scene.scale.height * 0.02, 'triomphe', 'Best Score', 40)
            .setTint(0xfb8b25)
            .setDepth(-3)
            .setOrigin(0.5)
            .setAlpha(0)
    }

    private createHighScoreText(scene: Phaser.Scene): void {
        ScoreManager.highScoreText = scene.add
            .bitmapText(
                CANVAS_WIDTH * 0.5,
                scene.scale.height * 0.07,
                'triomphe',
                PlayerDataManager.getHighScore().toString(),
                90
            )
            .setTint(0xfb8b25)
            .setDepth(-3)
            .setOrigin(0.5)
            .setAlpha(0)
    }
}
