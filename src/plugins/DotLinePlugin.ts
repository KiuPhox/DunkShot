import { CANVAS_WIDTH } from '../constant/CanvasSize'

const DOT_COUNT = 10
const FIRST_SIZE = 15
const LAST_SIZE = 5

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

    public drawLine(pointA: Phaser.Math.Vector2, pointB: Phaser.Math.Vector2): void {
        for (let i = 0; i <= DOT_COUNT; i++) {
            const x = ((pointB.x - pointA.x) / DOT_COUNT) * i
            const y = ((pointB.y - pointA.y) / DOT_COUNT) * i
            this.graphics.fillStyle(0xf2a63b, 1)
            this.graphics.setDepth(-2)
            this.graphics.fillCircle(x, y, LAST_SIZE)
        }
    }

    public drawTrajectoryLine(
        position: Phaser.Math.Vector2,
        velocity: Phaser.Math.Vector2,
        gravity: number
    ): void {
        this.graphics.clear()
        for (let i = 0; i <= DOT_COUNT; i++) {
            const t = i / 20
            let x = position.x + velocity.x * t
            const y = position.y + velocity.y * t + (gravity * t * t) / 2
            if (x < 0) x = -x
            else if (x > CANVAS_WIDTH) x = CANVAS_WIDTH - (x - CANVAS_WIDTH)
            this.graphics.fillStyle(0xf2a63b, 1)
            this.graphics.setDepth(-2)
            this.graphics.fillCircle(x, y, FIRST_SIZE / (i + 1) + LAST_SIZE)
        }
    }

    public clear(): void {
        this.graphics.clear()
    }
}
