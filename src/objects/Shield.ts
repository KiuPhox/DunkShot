import { IObstacle } from '../types/obstacle'
import Ball from './Ball'

const COLLIDER_COUNTS = 12
const FILL_ANGLES = [[-Math.PI / 2, Math.PI / 2]]
const ROTATE_SPEED = 0.0015

export default class Shield extends Phaser.GameObjects.Container {
    private shieldSprite: Phaser.GameObjects.Sprite

    private radius: number

    private ball: Ball

    constructor(o: IObstacle) {
        super(o.scene, o.x, o.y)
        o.scene.add.existing(this)
        this.ball = o.ball

        this.createSprite(o.scene)
        this.createCollider(o.scene)
    }

    private createSprite(scene: Phaser.Scene) {
        this.shieldSprite = scene.add.sprite(0, 0, 'shield').setScale(1)
        this.radius = this.shieldSprite.displayWidth / 2 - 15
        this.add(this.shieldSprite)
    }

    private createCollider(scene: Phaser.Scene): void {
        for (let i = 0; i < FILL_ANGLES.length; i++) {
            const angleStep = (FILL_ANGLES[i][1] - FILL_ANGLES[i][0]) / (COLLIDER_COUNTS - 1)
            for (let j = 0; j < COLLIDER_COUNTS; j++) {
                const x = this.radius * Math.cos(angleStep * j + FILL_ANGLES[i][0])
                const y = this.radius * Math.sin(angleStep * j + FILL_ANGLES[i][0])

                const collider = scene.physics.add
                    .sprite(x, y, '')
                    .setCircle(10)
                    .setOffset(10, 10)
                    .setAlpha(0)
                this.add(collider)
                scene.physics.add.existing(collider)
                ;(collider.body as Phaser.Physics.Arcade.Body)
                    .setImmovable(true)
                    .setBounce(0).moves = false
                scene.physics.add.collider(collider, this.ball)
            }
        }
    }
    update(time: number, delta: number): void {
        this.rotation += delta * ROTATE_SPEED
    }
}
