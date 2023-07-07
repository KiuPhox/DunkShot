import ProgressManager from '../manager/ProgressManager'
import { IObstacle } from '../types/obstacle'
import Ball from './Ball'

const BOUNCE_FORCE = 1.5

export default class Bouncer extends Phaser.Physics.Arcade.Sprite {
    private ball: Ball
    private defaultScale: number

    constructor(o: IObstacle) {
        super(o.scene, o.x, o.y, 'bouncer')

        this.ball = o.ball
        this.scene.add.existing(this).setScale(0.35)
        this.scene.physics.add.existing(this, false)
        this.defaultScale = this.scale
        this.setCircle(100)

        if (this.body) {
            this.body.immovable = true
        }

        this.scene.physics.add.collider(this.ball, this, () => {
            ProgressManager.setBounce(ProgressManager.getBounce() + 1)

            if (this.ball.body) {
                this.ball.setVelocity(
                    this.ball.body.velocity.x * BOUNCE_FORCE,
                    this.ball.body.velocity.y * BOUNCE_FORCE
                )

                this.scale = this.defaultScale
                this.scene.add.tween({
                    targets: this,
                    scale: this.defaultScale * 1.1,
                    duration: 50,
                    yoyo: true,
                    ease: 'Quad.out',
                })
            }
        })
    }

    public setActive(value: boolean): this {
        if (this.body) {
            this.body.enable = value
        }

        return this
    }
}
