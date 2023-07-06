export default class SoundManager {
    public static playReleaseSound(scene: Phaser.Scene) {
        scene.sound.play('release')
    }

    public static playGameOverSound(scene: Phaser.Scene) {
        scene.sound.play('game-over', {
            name: 'a',
            start: 0.4,
        })
    }

    public static playWallHitSound(scene: Phaser.Scene) {
        scene.sound.play('wall-hit')
    }

    public static playStarSound(scene: Phaser.Scene) {
        scene.sound.play('star')
    }

    public static playComboHitSound(scene: Phaser.Scene) {
        scene.sound.play('combo-hit')
    }

    public static playComboShootSound(scene: Phaser.Scene) {
        scene.sound.play('combo-shoot')
    }

    public static playComboStartSound(scene: Phaser.Scene) {
        scene.sound.play('combo-start')
    }

    public static playNoteSound(scene: Phaser.Scene, note: number) {
        scene.sound.play(`${note}`)
    }
}
