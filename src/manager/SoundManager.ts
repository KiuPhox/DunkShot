export default class SoundManager {
    private static scene: Phaser.Scene

    public static init(scene: Phaser.Scene): void {
        this.scene = scene
    }

    public static playReleaseSound() {
        this.scene.sound.play('release')
    }

    public static playGameOverSound() {
        this.scene.sound.play('game-over', {
            name: 'a',
            start: 0.4,
        })
    }

    public static playWallHitSound() {
        this.scene.sound.play('wall-hit')
    }

    public static playStarSound() {
        this.scene.sound.play('star')
    }

    public static playComboHitSound() {
        this.scene.sound.play('combo-hit')
    }

    public static playComboShootSound() {
        this.scene.sound.play('combo-shoot')
    }

    public static playComboStartSound() {
        this.scene.sound.play('combo-start')
    }

    public static playNoteSound(note: number) {
        this.scene.sound.play(`${note}`)
    }

    public static playTimerBuzzSound() {
        this.scene.sound.play('timer-buzz')
    }
}
