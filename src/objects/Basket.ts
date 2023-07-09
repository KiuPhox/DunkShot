import { GameState } from '../GameState'
import DotLineManager from '../manager/DotLineManager'
import GameManager from '../manager/GameManager'
import ProgressManager from '../manager/ProgressManager'
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
    public hadBall = false

    private dragStartPos: Phaser.Math.Vector2
    private dragPos: Phaser.Math.Vector2
    private shootVelocity: Phaser.Math.Vector2 = new Phaser.Math.Vector2(0, 0)

    private ball: Ball
    private isAvaliable: boolean

    // Texture
    public basketTopSprite: Phaser.GameObjects.Sprite
    private basketBottomSprite: Phaser.GameObjects.Sprite
    private netSprite: Phaser.GameObjects.Sprite

    // Effect
    public emitter: Phaser.Events.EventEmitter = new Phaser.Events.EventEmitter()
    private basketEffectSprite: Phaser.GameObjects.Sprite
    private basketShootEffectSprite: Phaser.GameObjects.Sprite

    // Tween
    private moveTween: Phaser.Tweens.Tween

    public star: Star

    constructor(scene: Phaser.Scene, player: Ball, x?: number, y?: number) {
        super(scene, x, y)

        scene.add.existing(this)
        this.ball = player

        this.createBasketObjects(scene)
        this.registerOverlapEvent(scene)
        this.registerDragEvents(scene)

        this.isAvaliable = true
    }

    private createBasketObjects(scene: Phaser.Scene): void {
        this.basketTopSprite = scene.add
            .sprite(this.x, this.y, 'basket', 0)
            .setScale(0.4)
            .setOrigin(0.5, 1.5)
            .setDepth(-3)
        this.basketBottomSprite = scene.add.sprite(0, 0, 'basket', 1).setScale(0.4)
        this.basketEffectSprite = scene.add.sprite(0, 0, 'e3').setScale(0.4).setAlpha(0)
        this.netSprite = scene.add.sprite(0, 0, 'net').setScale(0.4).setOrigin(0.5, 0)

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
                        ProgressManager.setCombo(0)
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

    public createStar(scene: Phaser.Scene): void {
        if (!this.star) {
            this.star = new Star({ scene: scene, x: 0, y: -70, ball: this.ball }).setScale(0.3)
            this.add(this.star)
        }

        this.star.setAlpha(1)
        this.star.isActive = true
    }

    public setMoveable(direction: string, distance: number): void {
        if (this.moveTween) this.moveTween.destroy()

        const config: Phaser.Types.Tweens.TweenBuilderConfig = {
            targets: this,
            ease: 'Sine.inout',
            duration: 2000,
            yoyo: true,
            repeat: -1,
        }

        const endPoint = new Phaser.Math.Vector2(0, 0)

        if (direction !== 'none') {
            switch (direction) {
                case 'right':
                    config.x = this.x + distance
                    endPoint.x = this.x + distance
                    endPoint.y = this.y
                    break
                case 'left':
                    config.x = this.x - distance
                    endPoint.x = this.x - distance
                    endPoint.y = this.y
                    break
                case 'up':
                    config.y = this.y - distance
                    endPoint.x = this.x
                    endPoint.y = this.y - distance
                    break
                case 'down':
                    config.y = this.y + distance
                    endPoint.x = this.x
                    endPoint.y = this.y + distance
                    break
            }

            this.moveTween = this.scene.add.tween(config)
            DotLineManager.drawLine(new Phaser.Math.Vector2(this.x, this.y), endPoint, 8)

            this.moveTween.play()
        }
    }

    private registerOverlapEvent(scene: Phaser.Scene): void {
        scene.physics.add.overlap(this.centerCirc, this.ball, () => {
            if (!this.hasBall && this.isAvaliable) {
                this.isAvaliable = false
                this.hasBall = true
                this.ball.setBounce(0)
                this.emitter.emit('onHasBall', this)

                if (!this.hadBall) {
                    this.hadBall = true
                    this.changeBasketTexture(1)
                }

                this.animateBasketEffect()
                this.setMoveable('none', 0)
            }
        })
    }

    private registerDragEvents(scene: Phaser.Scene): void {
        scene.input.on('dragstart', (pointer: PointerEvent) => {
            if (
                GameManager.getCurrentState() === GameState.CHALLENGE_READY ||
                GameManager.getCurrentState() === GameState.CHALLENGE_COMPLETE ||
                GameManager.getCurrentState() === GameState.GAME_OVER
            )
                return
            if (this.hasBall) {
                this.dragStartPos = new Phaser.Math.Vector2(pointer.x, pointer.y)
            }
            if (GameManager.getCurrentState() === GameState.READY) {
                GameManager.updateGameState(GameState.PLAYING, this.scene)
            }
        })

        scene.input.on('drag', (pointer: PointerEvent) => {
            if (GameManager.getCurrentState() === GameState.GAME_OVER) return
            if (this.hasBall && this.dragStartPos) {
                this.handleDragMovement(pointer)
            }
        })

        scene.input.on('dragend', () => {
            if (GameManager.getCurrentState() === GameState.GAME_OVER) return
            if (this.hasBall && this.shootVelocity.length() > 100) {
                this.emitter.emit('onDragEnd', this)
                this.hasBall = false

                this.otherCirc[0].y = 50
                scene.add.tween({
                    targets: this.netSprite,
                    scaleY: 0.4,
                    duration: 300,
                    ease: 'Back.out',
                })

                this.ball.shoot(this.shootVelocity)
                DotLineManager.clearTrajectoryLine()
                this.scene.time.delayedCall(300, () => {
                    this.isAvaliable = true
                })

                if (GameManager.getCurrentState() === GameState.CHALLENGE_PLAYING) {
                    scene.add.tween({
                        targets: this,
                        rotation: 0,
                        duration: 300,
                        ease: 'Back.out',
                        delay: 150,
                    })
                }
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

        if (this.shootVelocity.length() > 100) {
            this.rotation = this.shootVelocity.angle() + Math.PI / 2
            this.netSprite.scaleY = (shootSpeed / MAX_SHOOT_SPEED) * 0.25 + 0.4
            this.otherCirc[0].y = (shootSpeed / MAX_SHOOT_SPEED) * 25 + 50
            this.ball.x =
                -Math.cos(this.shootVelocity.angle()) * ((shootSpeed / MAX_SHOOT_SPEED) * 25 + 13) +
                this.x
            this.ball.y =
                -Math.sin(this.shootVelocity.angle()) * ((shootSpeed / MAX_SHOOT_SPEED) * 25 + 13) +
                this.y

            if (this.shootVelocity.length() > 500) {
                if (
                    GameManager.getCurrentState() === GameState.CHALLENGE_PLAYING &&
                    this.scene.registry.get('challenge').name === 'no-aim'
                )
                    return
                DotLineManager.drawTrajectoryLine(
                    new Phaser.Math.Vector2(this.ball.x, this.ball.y),
                    this.shootVelocity,
                    2000,
                    Math.min((this.shootVelocity.length() / MAX_SHOOT_SPEED) * 2, 1)
                )
            }
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
            x: { value: this.x, duration: 200 },
            y: { value: this.y + 25, duration: 100 },
            ease: 'Quad.out',
        })

        this.scene.add.tween({
            targets: this.otherCirc[0],
            y: { value: this.otherCirc[0].y + 15, duration: 100, yoyo: true },
            ease: 'Quad.out',
        })

        this.scene.add.tween({
            targets: this.netSprite,
            scaleY: { value: 0.5, duration: 100 },
            yoyo: true,
            ease: 'Quad.out',
        })
    }

    public changeBasketTexture(frame: number): void {
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
