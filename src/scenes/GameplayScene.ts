import Phaser from 'phaser'
import Basket from '../objects/Basket'
import DotLinePlugin from '../plugins/DotLinePlugin'
import GameManager from '../manager/GameManager'
import { GameState } from '../GameState'
import Ball from '../objects/Ball'
import ScoreManager from '../manager/ScoreManager'
import SkinManager from '../manager/SkinManager'
import { CANVAS_HEIGHT, CANVAS_WIDTH } from '../constant/CanvasSize'
import { Random } from '../utils/Random'
import { MOVEABLE_BASKET_CHANCES, STAR_CHANCES } from '../constant/Level'

export default class GameplayScene extends Phaser.Scene {
    private ball: Ball
    private math: Phaser.Math.RandomDataGenerator = new Phaser.Math.RandomDataGenerator()

    private camera: Phaser.Cameras.Scene2D.Camera

    private baskets: Basket[] = []
    private targetBasket: Basket

    private draggingZone: Phaser.GameObjects.Rectangle
    private deadZone: Phaser.GameObjects.Rectangle

    private walls: Phaser.GameObjects.Rectangle[] = []

    public dotLine: DotLinePlugin

    public shootSound: Phaser.Sound.BaseSound
    public kickSound: Phaser.Sound.BaseSound
    public dieSound: Phaser.Sound.BaseSound
    public pointSounds: Phaser.Sound.BaseSound[] = []
    public wallHitSound: Phaser.Sound.BaseSound
    public starSound: Phaser.Sound.BaseSound

    private curScore: number

    constructor() {
        super('game')
    }

    init() {
        this.dotLine.init()
    }

    create() {
        this.curScore = 0

        this.camera = this.cameras.main

        SkinManager.init()

        this.ball = new Ball({
            scene: this,
            x: CANVAS_WIDTH * 0.25,
            y: CANVAS_HEIGHT * 0.25,
            texture: 'ball',
            frame: SkinManager.getCurrentSkin(),
        })
            .setDepth(1)
            .setName('Ball')
            .setCircle(116)
            .setScale(0.27)
            .setDepth(0)
            .setGravityY(1200)
            .setFriction(0)

        // Dragging Zone
        this.draggingZone = this.add
            .rectangle(CANVAS_WIDTH * 0.5, CANVAS_HEIGHT * 0.5, CANVAS_WIDTH, CANVAS_HEIGHT, 0, 0)
            .setInteractive({ draggable: true })

        // Dead Zone
        this.deadZone = this.add.rectangle(
            CANVAS_WIDTH * 0.5,
            CANVAS_HEIGHT,
            CANVAS_WIDTH,
            CANVAS_HEIGHT * 0.2,
            0,
            0
        )
        this.physics.add.existing(this.deadZone)
        this.physics.add.overlap(this.deadZone, this.ball, () => {
            if (GameManager.getCurrentState() === GameState.PLAYING) {
                GameManager.updateGameState(GameState.GAME_OVER)
                this.dieSound.play()
                this.camera.stopFollow()
            }
        })

        this.shootSound = this.sound.add('shoot')
        this.kickSound = this.sound.add('kick')
        this.dieSound = this.sound.add('die')
        this.wallHitSound = this.sound.add('wall-hit')
        this.starSound = this.sound.add('star')

        for (let i = 1; i <= 10; i++) {
            this.pointSounds[i - 1] = this.sound.add(i.toString())
        }

        // Walls
        const wallHitEffect = this.add.image(0, 0, 'e4').setAlpha(0).setScale(0.5)

        const wallPositions = [
            { x: 0, y: CANVAS_HEIGHT * 0.5, origin: { x: 1, y: 0.5 } },
            { x: CANVAS_WIDTH, y: CANVAS_HEIGHT * 0.5, origin: { x: 0, y: 0.5 } },
        ]
        this.walls = wallPositions.map((position) =>
            this.add
                .rectangle(position.x, position.y, 50, CANVAS_HEIGHT * 3, 0xc9c9c9)
                .setOrigin(position.origin.x, position.origin.y)
        )

        this.walls.forEach((wall) => {
            this.physics.add.existing(wall)
            ;(wall.body as Phaser.Physics.Arcade.Body).setImmovable(true).moves = false
            this.physics.add.collider(this.ball, wall, () => {
                this.wallHitSound.play()
                wallHitEffect.x = this.ball.x
                wallHitEffect.y = this.ball.y

                wallHitEffect
                    .setTint(SkinManager.getCurrentSkinColors()[0])
                    .setAlpha(0)
                    .setScale(0.5, 0.1)
                    .setFlipX(wallHitEffect.x > CANVAS_WIDTH / 2)

                this.add.tween({
                    targets: wallHitEffect,
                    alpha: { value: 1, duration: 100, yoyo: true },
                    scaleY: { value: 2, duration: 200 },
                    easing: 'Quad.out',
                    onComplete: () => {
                        wallHitEffect.setAlpha(0)
                    },
                })
            })
        })

        this.baskets[0] = new Basket(this, CANVAS_WIDTH * 0.25, 400, this.ball)
        this.baskets[1] = new Basket(this, CANVAS_WIDTH * 0.8, 350, this.ball)

        this.ball.y = this.baskets[0].y

        this.baskets.forEach((basket) => {
            basket.emitter.on('onHasBall', this.handleBallTouch)
            this.add.existing(basket)
        })

        this.targetBasket = this.baskets[1]

        this.add.existing(this.baskets[0])
        this.add.existing(this.baskets[1])

        this.input.dragDistanceThreshold = 10
        this.camera.startFollow(this.ball, false, 0, 0.01, -CANVAS_WIDTH / 4, CANVAS_HEIGHT / 4)
    }

    private handleBallTouch = (basket: Basket) => {
        if (basket === this.targetBasket) {
            this.generateNextBasket(basket)

            this.draggingZone.y = this.targetBasket.y
            this.deadZone.y = basket.y + 450
            this.walls.forEach((wall) => (wall.y = this.targetBasket.y))

            this.ball.increaseCombo()
            this.curScore += this.ball.getCombo()
            this.pointSounds[this.ball.getCombo() - 1].play()

            ScoreManager.updateScore(this.curScore)
        }
    }

    private generateNextBasket(basket: Basket): void {
        const targetBasketIndex = this.baskets.indexOf(basket)
        const nextTargetBasket = this.baskets[1 - targetBasketIndex]

        // Swap target basket
        this.targetBasket = nextTargetBasket

        this.targetBasket.y = this.math.integerInRange(basket.y - 400, basket.y - 100)

        if (targetBasketIndex === 0) {
            // Right basket
            this.targetBasket.x = this.math.integerInRange(CANVAS_WIDTH * 0.6, CANVAS_WIDTH * 0.8)
            this.targetBasket.rotation = this.math.realInRange(-0.5, 0)
        } else {
            // Left basket
            this.targetBasket.x = this.math.integerInRange(CANVAS_WIDTH * 0.2, CANVAS_WIDTH * 0.4)
            this.targetBasket.rotation = this.math.realInRange(0, 0.5)
        }

        if (Random.Percent(STAR_CHANCES)) {
            this.targetBasket.createStar(this)
        }

        if (Random.Percent(MOVEABLE_BASKET_CHANCES)) {
            this.targetBasket.setMoveable(true)
        }

        // There's a bug on mobile when set this scale to zero
        this.targetBasket.scale = 0.01

        this.add.tween({
            targets: this.targetBasket,
            scale: 1,
            duration: 300,
            ease: 'Back.out',
        })
    }

    update(time: number, delta: number): void {
        if (this.ball.body) {
            const velocityX = this.ball.body.velocity.x
            if (velocityX > 10) {
                this.ball.rotation += 0.01 * delta
            } else if (velocityX < -10) {
                this.ball.rotation -= 0.01 * delta
            }
        }
    }

    // update(delta: number): void {
    //     if (this.ball.body) {
    //         const velocityX = this.ball.body.velocity.x
    //         if (velocityX > 10) {
    //             this.ball.rotation += 0.05
    //         } else if (velocityX < -10) {
    //             this.ball.rotation -= 0.05
    //         }
    //     }
    // }
}
