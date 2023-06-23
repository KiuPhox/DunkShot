import Phaser from 'phaser'
import Basket from '../objects/Basket'
import DotLinePlugin from '../plugins/DotLinePlugin'
import GameManager from '../manager/GameManager'
import { GameState } from '../GameState'
import Ball from '../objects/Ball'
import ScoreManager from '../manager/ScoreManager'
import SkinManager from '../manager/SkinManager'

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
    public hitSound: Phaser.Sound.BaseSound

    private curScore: number

    constructor() {
        super('game')
    }

    init() {
        this.dotLine.init()
    }

    create() {
        const { width, height } = this.scale
        this.curScore = 0

        this.camera = this.cameras.main

        SkinManager.init()

        this.ball = new Ball({
            scene: this,
            x: width * 0.25,
            y: height * 0.25,
            texture: 'ball',
            frame: SkinManager.getCurrentSkin(),
        })
            .setDepth(1)
            .setName('Ball')
            .setCircle(116)
            .setScale(0.15)
            .setDepth(0)
            .setGravityY(1200)
            .setFriction(0)

        // Dragging Zone
        this.draggingZone = this.add
            .rectangle(width * 0.5, height * 0.5, width, height, 0, 0)
            .setInteractive({ draggable: true })

        // Dead Zone
        this.deadZone = this.add.rectangle(width * 0.5, height, width, height * 0.2, 0, 0)
        this.physics.add.existing(this.deadZone)
        this.physics.add.overlap(this.deadZone, this.ball, () => {
            if (GameManager.getCurrentState() === GameState.PLAYING) {
                GameManager.updateGameState(GameState.GAME_OVER)
                this.dieSound.play()
                this.camera.stopFollow()
            }
        })

        // Walls
        const wallPositions = [
            { x: 0, y: height * 0.5 },
            { x: width, y: height * 0.5 },
        ]
        this.walls = wallPositions.map((position) =>
            this.add.rectangle(position.x, position.y, 24, height * 3, 0xc9c9c9)
        )

        this.walls.forEach((wall) => {
            this.physics.add.existing(wall)
            ;(wall.body as Phaser.Physics.Arcade.Body).setImmovable(true).moves = false
            this.physics.add.collider(this.ball, wall)
        })

        this.baskets[0] = new Basket(this, width * 0.25, 400, this.ball)
        this.baskets[1] = new Basket(this, width * 0.8, 350, this.ball)

        this.ball.y = this.baskets[0].y

        this.baskets.forEach((basket) => {
            basket.emitter.on('onHasBall', this.handleBallTouch)
            this.add.existing(basket)
        })

        this.targetBasket = this.baskets[1]

        this.add.existing(this.baskets[0])
        this.add.existing(this.baskets[1])

        this.input.dragDistanceThreshold = 10
        this.camera.startFollow(this.ball, false, 0, 0.01, -width / 4, height / 4)

        this.shootSound = this.sound.add('shoot')
        this.kickSound = this.sound.add('kick')
        this.dieSound = this.sound.add('die')
        this.hitSound = this.sound.add('1')
    }

    private handleBallTouch = (basket: Basket) => {
        if (basket === this.targetBasket) {
            const targetBasketIndex = this.baskets.indexOf(basket)
            const targetBasket = this.baskets[1 - targetBasketIndex]

            // Swap target basket
            this.targetBasket = targetBasket
            targetBasket.y = this.math.integerInRange(basket.y - 150, basket.y - 50)
            // targetBasket.x = this.math.integerInRange(
            //     this.scale.width * 0.2,
            //     this.scale.width * 0.8
            // )
            targetBasket.rotation =
                targetBasketIndex === 1
                    ? this.math.realInRange(0, 0.5)
                    : this.math.realInRange(-0.5, 0)

            // There's a bug on mobile when set this scale to zero
            targetBasket.scale = 0.01

            this.add.tween({
                targets: targetBasket,
                scale: 1,
                duration: 300,
                ease: 'Quad.out',
            })

            this.draggingZone.y = targetBasket.y
            this.deadZone.y = basket.y + 200
            this.walls.forEach((wall) => (wall.y = targetBasket.y))
            this.ball.increaseCombo()
            this.curScore += this.ball.getCombo()
            this.hitSound.play()

            ScoreManager.updateScore(this.curScore)
        }
    }

    update(): void {
        if (this.ball.body) {
            const velocityX = this.ball.body.velocity.x
            if (velocityX > 10) {
                this.ball.rotation += 0.05
            } else if (velocityX < -10) {
                this.ball.rotation -= 0.05
            }
        }
    }
}
