import { SPECIAL_EFFECTS } from '../constant/Skin'
import SkinManager from '../manager/SkinManager'
import GameplayScene from '../scenes/GameplayScene'
import { IBall } from '../types/ball'
import { Color } from '../utils/Color'

const ROTATE_SPEED = 0.00003

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

        if (this.combo > 3) {
            (this._scene as GameplayScene).comboShootSound.play()
        }
    }

    public getCombo(): number {
        return this.combo
    }

    public increaseCombo(): void {
        this.combo++

        if (this.combo === 3) {
            this.smokeParticle.destroy()
            this.addSmokeParticle()
        }

        if (this.combo >= 4) {
            if (this.combo === 4) {
                this.smokeParticle.destroy()
                this.addSmokeParticle()
                this.specialParticle.start()
            }
            const rgb = Color.HexToRRB(SkinManager.getCurrentSkinColors()[0])

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
        this.specialParticle = this._scene.add.particles(
            150,
            450,
            SPECIAL_EFFECTS[SkinManager.getCurrentSkin()].texure,
            {
                color: SkinManager.getCurrentSkinColors(),
                colorEase: 'quad.out',
                lifespan: 700,
                angle: { min: 0, max: 360 },
                rotate: { min: 0, max: 360 },
                scale: { start: 0.35, end: 0 },
                speed: { min: 10, max: 30 },
                frequency: 40,
                frame: SPECIAL_EFFECTS[SkinManager.getCurrentSkin()].frame,
            }
        )

        this.specialParticle.startFollow(this, -150, -450)
        this.specialParticle.setDepth(-4)
    }

    private addSmokeParticle(): void {
        const hex = SkinManager.getCurrentSkinColors()[2]
        const rgb = Color.HexToRRB(hex)
        const colors =
            this.combo === 3
                ? [0xffffff, 0xf0f0f0, 0x888888]
                : [
                      Color.RGBtoHex(Color.Shade(rgb, 0.4)),
                      Color.RGBtoHex(Color.Shade(rgb, 0.5)),
                      Color.RGBtoHex(Color.Shade(rgb, 0.6)),
                  ]

        this.smokeParticle = this._scene.add.particles(150, 450, 'circle', {
            color: colors,
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
        this.smokeParticle.destroy()
        this.addSmokeParticle()
        this.addSpecialParticle()

        if (this.combo < 3) {
            this.smokeParticle.stop()
        }

        if (this.combo < 4) {
            this.specialParticle.stop()
        }
    }

    update(time: number, delta: number): void {
        if (this.body) {
            const velocityX = this.body.velocity.x
            if (velocityX > 10) {
                this.rotation += ROTATE_SPEED * Math.max(600, this.body.velocity.length()) * delta
            } else if (velocityX < -10) {
                this.rotation -= ROTATE_SPEED * Math.max(600, this.body.velocity.length()) * delta
            }
        }
    }
}
