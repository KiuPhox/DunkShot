export default class DotLinePlugin extends Phaser.Plugins.ScenePlugin {
    private graphics: Phaser.GameObjects.Graphics

    constructor(
        scene: Phaser.Scene,
        pluginManger: Phaser.Plugins.PluginManager,
        pluginKey: string
    ) {
        super(scene, pluginManger, pluginKey)
    }

    public init(): void {
        if (this.scene) {
            this.graphics = this.scene.add.graphics()
        }
    }
    public drawTrajectoryLine(
        position: Phaser.Math.Vector2,
        velocity: Phaser.Math.Vector2,
        gravity: number
    ): void {
        this.graphics.clear()
        for (let i = 0; i < 10; i++) {
            const t = i / 20
            const x = position.x + velocity.x * t
            const y = position.y + velocity.y * t + (gravity * t * t) / 2
            this.graphics.fillStyle(0xf2a63b, 1)
            this.graphics.setDepth(-2)
            this.graphics.fillCircle(x, y, (15 - i) / 2)
        }
    }

    public clear(): void {
        this.graphics.clear()
    }
}
