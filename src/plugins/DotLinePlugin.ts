import { CANVAS_WIDTH } from '../constant/CanvasSize'

const INITIAL_DOT_COUNT = 10
const FIRST_SIZE = 15
const LAST_SIZE = 5

export default class DotLinePlugin extends Phaser.Plugins.ScenePlugin {
    private trajectoryLineGraphics: Phaser.GameObjects.Graphics
    private normalLineGraphics: Phaser.GameObjects.Graphics

    constructor(
        scene: Phaser.Scene,
        pluginManger: Phaser.Plugins.PluginManager,
        pluginKey: string
    ) {
        super(scene, pluginManger, pluginKey)
    }

    public init(): void {
        if (this.scene) {
            this.trajectoryLineGraphics = this.scene.add.graphics()
            this.normalLineGraphics = this.scene.add.graphics()
        }
    }

    public drawLine(
        pointA: Phaser.Math.Vector2,
        pointB: Phaser.Math.Vector2,
        dotCount?: number
    ): void {
        this.normalLineGraphics.clear()

        const count = dotCount ? dotCount : INITIAL_DOT_COUNT
        for (let i = 0; i < count; i++) {
            const x = ((pointB.x - pointA.x) / count) * i + pointA.x
            const y = ((pointB.y - pointA.y) / count) * i + pointA.y

            this.normalLineGraphics.fillStyle(0xc9c9c9, 1)
            this.normalLineGraphics.setDepth(-4)
            this.normalLineGraphics.fillCircle(x, y, 7)
        }
    }

    public drawTrajectoryLine(
        position: Phaser.Math.Vector2,
        velocity: Phaser.Math.Vector2,
        gravity: number
    ): void {
        this.trajectoryLineGraphics.clear()

        for (let i = 0; i <= INITIAL_DOT_COUNT; i++) {
            const t = i / 20
            let x = position.x + velocity.x * t
            const y = position.y + velocity.y * t + (gravity * t * t) / 2
            if (x < 0) x = -x
            else if (x > CANVAS_WIDTH) x = CANVAS_WIDTH - (x - CANVAS_WIDTH)

            this.trajectoryLineGraphics.fillStyle(0xf2a63b, 1)
            this.trajectoryLineGraphics.setDepth(-2)
            this.trajectoryLineGraphics.fillCircle(x, y, FIRST_SIZE / (i + 1) + LAST_SIZE)
        }
    }

    public clearTrajectoryLine(): void {
        this.trajectoryLineGraphics.clear()
    }

    public clearNormalLine(): void {
        this.normalLineGraphics.clear()
    }
}
