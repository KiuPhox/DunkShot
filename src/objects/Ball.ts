import { SPECIAL_COLOR } from '../constant/SkinColor'
import SkinManager from '../manager/SkinManager'
import GameplayScene from '../scenes/GameplayScene'
import { IBall } from '../types/ball'

const ROTATE_SPEED = 0.02

export default class Ball extends Phaser.Physics.Arcade.Sprite {
    private _scene: Phaser.Scene

    private smokeParticle: Phaser.GameObjects.Particles.ParticleEmitter
    private specialParticle: Phaser.GameObjects.Particles.ParticleEmitter

    private combo: number

    constructor(b: IBall) {
        super(b.scene, b.x, b.y, b.texture, b.frame)

        this._scene = b.scene

        // Effect
        this.addSmokeParticle()
        this.addSpecialParticle()

        this.resetCombo()

        b.scene.add.existing(this)
        b.scene.physics.add.existing(this)

        SkinManager.emitter.on('skin-changed', this.onSkinChanged)
    }

    public shoot(velocity: Phaser.Math.Vector2): void {
        this.setVelocity(velocity.x, velocity.y)
        this.setBounce(0.7)
        this.setGravityY(2000)
        ;(this._scene as GameplayScene).shootSound.play()
    }

    public getCombo(): number {
        return this.combo
    }

    public increaseCombo(): void {
        if (this.combo < 10) {
            this.combo++
        }

        if (this.combo === 3) {
            this.smokeParticle.start()
        }
        if (this.combo >= 4) {
            if (this.combo === 4) {
                this.specialParticle.start()
            }
            const rgb = Phaser.Display.Color.IntegerToRGB(
                SPECIAL_COLOR[SkinManager.getCurrentSkin()][0]
            )
            this._scene.cameras.main.flash(200, rgb.r, rgb.g, rgb.b)
            this._scene.cameras.main.shake(200, 0.003)
        }
    }

    public resetCombo(): void {
        this.combo = 0
        this.specialParticle.stop()
        this.smokeParticle.stop()
    }

    private addSpecialParticle(): void {
        this.specialParticle = this._scene.add.particles(150, 450, 'special', {
            color: SPECIAL_COLOR[SkinManager.getCurrentSkin()],
            colorEase: 'quad.out',
            lifespan: 700,
            angle: { min: 0, max: 360 },
            rotate: { min: 0, max: 360 },
            scale: { start: 0.35, end: 0 },
            speed: { min: 10, max: 30 },
            frequency: 60,
        })

        this.specialParticle.startFollow(this, -150, -450)
        this.specialParticle.setDepth(-4)
    }

    private addSmokeParticle(): void {
        this.smokeParticle = this._scene.add.particles(150, 450, 'circle', {
            color: [0xffffff, 0xf0f0f0, 0x888888],
            alpha: { start: 0.8, end: 0.1, ease: 'sine.out' },
            colorEase: 'quad.out',
            lifespan: 500,
            angle: { min: 0, max: 360 },
            rotate: { min: 0, max: 360 },
            scale: 0.8,
            speed: { min: 50, max: 60 },
            frequency: 60,
        })
        this.smokeParticle.startFollow(this, -150, -450)
        this.smokeParticle.setDepth(-5)
    }

    private onSkinChanged = (skinFrame: number) => {
        this.setFrame(skinFrame)
        this.specialParticle.destroy()
        this.addSpecialParticle()

        if (this.combo < 4) {
            this.specialParticle.stop()
        }
    }

    update(time: number, delta: number): void {
        if (this.body) {
            const velocityX = this.body.velocity.x
            if (velocityX > 10) {
                this.rotation += ROTATE_SPEED * delta
            } else if (velocityX < -10) {
                this.rotation -= ROTATE_SPEED * delta
            }
        }
    }
}
