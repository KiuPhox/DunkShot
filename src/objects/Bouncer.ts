import GameplayScene from '../scenes/GameplayScene'
import { IObstacle } from '../types/obstacle'
import Ball from './Ball'

const BOUNCE_FORCE = 2

export default class Bouncer extends Phaser.Physics.Arcade.Sprite {
    private ball: Ball

    constructor(o: IObstacle) {
        super(o.scene, o.x, o.y, 'bouncer')

        this.ball = o.ball
        this.scene.add.existing(this).setScale(0.65)
        this.scene.physics.add.existing(this, false)

        if (this.body) {
            this.body.immovable = true
        }

        this.scene.physics.add.collider(this.ball, this, () => {
            (this.scene as GameplayScene).bounceCount++

            if (this.ball.body) {
                this.ball.setVelocity(
                    this.ball.body.velocity.x * BOUNCE_FORCE,
                    this.ball.body.velocity.y * BOUNCE_FORCE
                )
                this.scene.add.tween({
                    targets: this,
                    scale: this.scale * 1.1,
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
