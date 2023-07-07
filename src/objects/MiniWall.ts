import ProgressManager from '../manager/ProgressManager'
import { IObstacle } from '../types/obstacle'
import Ball from './Ball'

export default class MiniWall extends Phaser.GameObjects.NineSlice {
    private ball: Ball
    private physic: Phaser.Physics.Arcade.Body

    constructor(w: IObstacle) {
        super(w.scene, w.x, w.y, 'mini-wall', 0, 25, 309, 10, 10, 100, 100)

        this.ball = w.ball

        this.scene.add.existing(this).setScale(0.65)
        this.scene.physics.add.existing(this, false)

        if (this.body) {
            this.physic = this.body as Phaser.Physics.Arcade.Body
            this.physic.immovable = true
        }

        this.scene.physics.add.collider(this.ball, this, () => {
            ProgressManager.setBounce(ProgressManager.getBounce() + 1)
        })
    }

    public setActive(value: boolean): this {
        this.physic.enable = value
        return this
    }
}
