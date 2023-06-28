import { CANVAS_WIDTH } from '../constant/CanvasSize'
import GameplayScene from '../scenes/GameplayScene'
import { Random } from '../utils/Random'
import Ball from './Ball'
import Star from './Star'

const CIRC_COUNT = 5
const CIRC_POSITION = [
    [0, 50],
    [65, -10],
    [-65, -10],
    [45, 25],
    [-45, 25],
]

const MAX_SHOOT_SPEED = 1800

export default class Basket extends Phaser.GameObjects.Container {
    private centerCirc: Phaser.Physics.Arcade.Sprite
    private otherCirc: Phaser.Physics.Arcade.Sprite[] = []

    private hasBall = false

    private dragStartPos: Phaser.Math.Vector2
    private dragPos: Phaser.Math.Vector2
    private shootVelocity: Phaser.Math.Vector2 = new Phaser.Math.Vector2(0, 0)

    private ball: Ball
    private isAvaliable: boolean

    // Texture
    private basketTopSprite: Phaser.GameObjects.Sprite
    private basketBottomSprite: Phaser.GameObjects.Sprite
    private basketEffectSprite: Phaser.GameObjects.Sprite
    private netSprite: Phaser.GameObjects.Sprite

    // Effect
    public emitter: Phaser.Events.EventEmitter = new Phaser.Events.EventEmitter()

    // Tween
    private moveTween: Phaser.Tweens.Tween

    public star: Star

    constructor(scene: GameplayScene, x: number, y: number, player: Ball) {
        super(scene, x, y)

        this.ball = player

        this.createBasketObjects(scene)
        this.registerOverlapEvent(scene)
        this.registerDragEvents(scene)

        this.isAvaliable = true
    }

    private createBasketObjects(scene: GameplayScene): void {
        this.basketTopSprite = scene.add
            .sprite(this.x, this.y, 'basket', 0)
            .setScale(0.4)
            .setOrigin(0.5, 1.5)
            .setDepth(-3)
        this.basketBottomSprite = scene.add.sprite(0, 0, 'basket', 1).setScale(0.4)
        this.basketEffectSprite = scene.add.sprite(0, 0, 'e3').setScale(0.4).setAlpha(0)
        this.netSprite = scene.add.sprite(0, 25, 'net').setScale(0.4)

        this.centerCirc = scene.physics.add
            .sprite(0, 15, '')
            .setCircle(20)
            .setOffset(-4, -4)
            .setAlpha(0)

        for (let i = 0; i < CIRC_COUNT; i++) {
            this.otherCirc[i] = scene.physics.add
                .sprite(CIRC_POSITION[i][0], CIRC_POSITION[i][1], '')
                .setCircle(6)
                .setOffset(10, 10)
                .setAlpha(0)

            this.add(this.otherCirc[i])
            scene.physics.add.existing(this.otherCirc[i])
            ;(this.otherCirc[i].body as Phaser.Physics.Arcade.Body)
                .setImmovable(true)
                .setBounce(0).moves = false
            if (i === 1 || i === 2) {
                scene.physics.add.collider(this.otherCirc[i], this.ball, () => {
                    if (!this.hasBall) {
                        this.ball.resetCombo()
                    }
                })
            } else {
                scene.physics.add.collider(this.otherCirc[i], this.ball)
            }
        }

        this.add(this.netSprite)
        this.add(this.basketBottomSprite)
        this.add(this.centerCirc)
        this.add(this.basketEffectSprite)

        scene.physics.add.existing(this.centerCirc)
    }

    public createStar(scene: GameplayScene): void {
        if (!this.star) {
            this.star = new Star({ scene: scene, x: 0, y: -70, ball: this.ball }).setScale(0.3)
            this.add(this.star)
        }

        this.star.setAlpha(1)
        this.star.isActive = true
    }

    public setMoveable(moveable: boolean): void {
        if (this.moveTween) this.moveTween.destroy()

        const dist = this.x > CANVAS_WIDTH / 2 ? Random.Float(-300, -200) : Random.Float(200, 300)

        const isHorizontal = Random.Percent(50)

        if (isHorizontal) {
            this.moveTween = this.scene.add.tween({
                targets: this,
                x: this.x + dist,
                ease: 'Sine.easeInOut',
                duration: 2000,
                yoyo: true,
                repeat: -1,
            })
        } else {
            this.moveTween = this.scene.add.tween({
                targets: this,
                y: this.y + dist,
                ease: 'Sine.easeInOut',
                duration: 2000,
                yoyo: true,
                repeat: -1,
            })
        }

        if (moveable) {
            if (isHorizontal) {
                (this.scene as GameplayScene).dotLine.drawLine(
                    new Phaser.Math.Vector2(this.x, this.y),
                    new Phaser.Math.Vector2(this.x + dist, this.y),
                    8
                )
            } else {
                (this.scene as GameplayScene).dotLine.drawLine(
                    new Phaser.Math.Vector2(this.x, this.y),
                    new Phaser.Math.Vector2(this.x, this.y + dist),
                    8
                )
            }

            this.moveTween.play()
        } else {
            this.moveTween.pause()
        }
    }

    private registerOverlapEvent(scene: GameplayScene): void {
        scene.physics.add.overlap(this.centerCirc, this.ball, () => {
            if (!this.hasBall && this.isAvaliable) {
                this.isAvaliable = false
                this.hasBall = true
                this.ball.setBounce(0)
                this.emitter.emit('onHasBall', this)
                this.changeBasketTexture(1)
                this.animateBasketEffect()
                this.setMoveable(false)
            }
        })
    }

    private registerDragEvents(scene: GameplayScene): void {
        scene.input.on('dragstart', (pointer: PointerEvent) => {
            if (this.hasBall) {
                this.dragStartPos = new Phaser.Math.Vector2(pointer.x, pointer.y)
            }
        })

        scene.input.on('drag', (pointer: PointerEvent) => {
            if (this.hasBall && this.dragStartPos) {
                this.handleDragMovement(pointer)

                scene.dotLine.drawTrajectoryLine(
                    new Phaser.Math.Vector2(this.ball.x, this.ball.y),
                    this.shootVelocity,
                    2000
                )
            }
        })

        scene.input.on('dragend', () => {
            if (this.hasBall && this.shootVelocity.length() > 100) {
                this.hasBall = false

                this.ball.shoot(this.shootVelocity)
                scene.dotLine.clearTrajectoryLine()
                this.changeBasketTexture(0)
                this.scene.time.delayedCall(300, () => {
                    this.isAvaliable = true
                })
            }
        })
    }

    private handleDragMovement(pointer: PointerEvent): void {
        this.ball.setGravityY(0)
        this.ball.setVelocity(0)
        this.dragPos = new Phaser.Math.Vector2(pointer.x, pointer.y)

        this.shootVelocity = new Phaser.Math.Vector2(
            (this.dragStartPos.x - this.dragPos.x) * 7,
            (this.dragStartPos.y - this.dragPos.y) * 7
        )

        const shootSpeed = Math.min(this.shootVelocity.length(), MAX_SHOOT_SPEED)

        this.shootVelocity = new Phaser.Math.Vector2(
            shootSpeed * Math.cos(this.shootVelocity.angle()),
            shootSpeed * Math.sin(this.shootVelocity.angle())
        )

        if (this.shootVelocity.length() > 10) {
            this.rotation = this.shootVelocity.angle() + Math.PI / 2

            Phaser.Math.RotateAroundDistance(this.ball, this.x, this.y, 0, 2)
        }
    }

    private animateBasketEffect(): void {
        this.basketEffectSprite.setAlpha(1).setScale(0.2)
        this.scene.add.tween({
            targets: this,
            rotation: { value: 0, duration: 300 },
            ease: 'Back.out',
        })

        this.scene.add.tween({
            targets: this.basketEffectSprite,
            alpha: { value: 0, duration: 300 },
            scale: { value: 1, duration: 300 },
            ease: 'Quad.out',
        })

        this.scene.add.tween({
            targets: this.ball,
            y: { value: this.y + 23, duration: 150 },
            yolo: true,
            ease: 'Quad.out',
        })

        this.scene.add.tween({
            targets: this.netSprite,
            scaleY: { value: 0.5, duration: 150 },
            yoyo: true,
            ease: 'Quad.out',
        })
    }

    private changeBasketTexture(frame: number): void {
        this.basketTopSprite.setTexture('basket', frame * 2)
        this.basketBottomSprite.setTexture('basket', frame * 2 + 1)
    }

    update(): void {
        this.basketTopSprite.rotation = this.rotation
        this.basketTopSprite.x = this.x
        this.basketTopSprite.y = this.y
        this.basketTopSprite.setScale(this.scale * 0.4)
    }
}
