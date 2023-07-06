import StarManager from '../manager/StarManager'
import GameplayScene from '../scenes/GameScene'
import { IStar } from '../types/star'
import Ball from './Ball'

export default class Star extends Phaser.Physics.Arcade.Sprite {
    private ball: Ball
    public isActive: boolean

    constructor(s: IStar) {
        super(s.scene, s.x, s.y, 'star')
        this.isActive = true

        if (s.ball) {
            this.ball = s.ball

            this.scene.physics.add.existing(this)
            this.scene.physics.add.overlap(this.ball, this, () => {
                if (this.isActive) {
                    this.isActive = false
                    ;(this.scene as GameplayScene).starSound.play()

                    StarManager.increaseStar()

                    this.scene.add.tween({
                        targets: this,
                        scale: { value: 0 },
                        duration: 300,
                        ease: 'Back.in',
                        onComplete: () => {
                            this.scale = 0.3
                            this.alpha = 0
                        },
                    })
                }
            })
        }
    }
}
