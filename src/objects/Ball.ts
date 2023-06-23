import GameplayScene from '../scenes/GameplayScene'
import { IBall } from '../types/ball'

export default class Ball extends Phaser.Physics.Arcade.Sprite {
    private _scene: Phaser.Scene

    private smokeParticle: Phaser.GameObjects.Particles.ParticleEmitter
    private specialParticle: Phaser.GameObjects.Particles.ParticleEmitter

    private combo: number

    constructor(b: IBall) {
        super(b.scene, b.x, b.y, b.texture, b.frame)

        this._scene = b.scene

        // Effect
        this.smokeParticle = b.scene.add.particles(150, 450, 'circle', {
            color: [0xffffff, 0xf0f0f0, 0x888888],
            alpha: { start: 0.8, end: 0.1, ease: 'sine.out' },
            colorEase: 'quad.out',
            lifespan: 500,
            angle: { min: 0, max: 360 },
            scale: 0.35,
            speed: { min: 50, max: 60 },
            frequency: 60,
        })

        this.specialParticle = b.scene.add.particles(150, 450, 'special', {
            color: [0xfff323, 0xffca03, 0xff5403],
            colorEase: 'quad.out',
            lifespan: 700,
            angle: { min: 0, max: 360 },
            scale: { start: 0.2, end: 0 },
            speed: { min: 10, max: 20 },
            frequency: 60,
        })

        this.specialParticle.startFollow(this, -150, -450)
        this.smokeParticle.startFollow(this, -150, -450)
        this.specialParticle.stop()
        this.smokeParticle.stop()

        this.combo = 0

        b.scene.add.existing(this)
        b.scene.physics.add.existing(this)
    }

    public shoot(velocity: Phaser.Math.Vector2): void {
        this.setVelocity(velocity.x, velocity.y)
        this.setBounce(0.7)
        this.setGravityY(1200)
        ;(this._scene as GameplayScene).shootSound.play()
    }

    public getCombo(): number {
        return this.combo
    }

    public increaseCombo(): void {
        this.combo++

        if (this.combo === 3) {
            this.smokeParticle.start()
        }
        if (this.combo >= 4) {
            if (this.combo === 4) {
                this.specialParticle.start()
            }
            this._scene.cameras.main.flash(500)
            this._scene.cameras.main.shake(200, 0.002)
        }
    }

    public resetCombo(): void {
        this.combo = 0
        this.specialParticle.stop()
        this.smokeParticle.stop()
    }
}
