import { SPECIAL_EFFECTS } from '../constant/Skin'
import PlayerDataManager from '../manager/PlayerDataManager'
import SkinManager from '../manager/SkinManager'
import GameplayScene from '../scenes/GameScene'
import { IBall } from '../types/ball'
import { Color } from '../utils/Color'

const ROTATE_SPEED = 0.00003

export default class Ball extends Phaser.Physics.Arcade.Sprite {
    private _scene: Phaser.Scene

    private smokeParticle: Phaser.GameObjects.Particles.ParticleEmitter
    private specialParticle: Phaser.GameObjects.Particles.ParticleEmitter
    private fireDustParticle: Phaser.GameObjects.Particles.ParticleEmitter

    private combo: number

    constructor(b: IBall) {
        super(b.scene, b.x, b.y, b.texture, b.frame)

        this._scene = b.scene

        // Effect
        this.addSmokeParticle()
        this.addSpecialParticle()
        this.addFireDustParticle()

        this.resetCombo()

        b.scene.add.existing(this)
        b.scene.physics.add.existing(this)

        SkinManager.emitter.on('skin-changed', this.onSkinChanged)
    }

    public shoot(velocity: Phaser.Math.Vector2): void {
        this.setVelocity(velocity.x, velocity.y)
        this.setBounce(0.7)
        this.setGravityY(2000)
        ;(this._scene as GameplayScene).releaseSound.play()

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
                this.fireDustParticle.start()
                this.specialParticle.start()
            }

            if (PlayerDataManager.getPlayerData().settings.vibration) window.navigator.vibrate(300)

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
            0,
            0,
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

        this.specialParticle.startFollow(this)
        this.specialParticle.setDepth(-4)
    }

    private addFireDustParticle(): void {
        const colors = [0xfff323, 0xffca03, 0xff5403]
        this.fireDustParticle = this._scene.add.particles(0, 0, 'circle', {
            color: colors,
            alpha: { start: 1, end: 0, ease: 'Quad.in' },
            angle: { min: -135, max: -45 },
            colorEase: 'quad.out',
            lifespan: 600,
            scale: { start: 0.3, end: 0.5, ease: 'Quad.in' },
            speed: { min: 100, max: 150 },
            duration: 500,
            frequency: 80,
        })

        this.fireDustParticle.stop()
        this.fireDustParticle.startFollow(this, 0, -20)
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

        this.smokeParticle = this._scene.add.particles(0, 0, 'circle', {
            color: colors,
            alpha: { start: 0.8, end: 0, ease: 'sine.out' },
            colorEase: 'quad.out',
            lifespan: 1000,
            angle: { min: 0, max: 360 },
            rotate: { min: 0, max: 360 },
            scale: { start: 0.6, end: 0.8, ease: 'quad.out' },
            speed: { min: 50, max: 60 },
            frequency: 60,
        })
        this.smokeParticle.startFollow(this)
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
