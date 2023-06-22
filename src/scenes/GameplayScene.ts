import Phaser from 'phaser'
import Basket from '../objects/Basket'
import DotLinePlugin from '../plugins/DotLinePlugin'

export default class GameplayScene extends Phaser.Scene {
    private player: Phaser.Physics.Arcade.Sprite
    private math: Phaser.Math.RandomDataGenerator = new Phaser.Math.RandomDataGenerator()

    private camera: Phaser.Cameras.Scene2D.Camera

    private baskets: Basket[] = []
    private targetBasket: Basket

    private draggingZone: Phaser.GameObjects.Rectangle

    private walls: Phaser.GameObjects.Rectangle[] = []

    private scoreText: Phaser.GameObjects.BitmapText

    public dotLine: DotLinePlugin

    public shootSound: Phaser.Sound.BaseSound
    public kickSound: Phaser.Sound.BaseSound

    constructor() {
        super('game')
    }

    init() {
        this.dotLine.init()
    }

    create() {
        const { width, height } = this.scale
        this.camera = this.cameras.main

        this.player = this.physics.add
            .sprite(width * 0.25, height * 0.5, 'ball', 0)
            .setDepth(1)
            .setName('Ball')
            .setCircle(116)
            .setScale(0.15)
            .setDepth(-1)
            .setGravityY(1200)
            .setFriction(0)

        // Dragging Zone
        this.draggingZone = this.add
            .rectangle(width * 0.5, height * 0.5, width, height, 0, 0)
            .setInteractive({ draggable: true })

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
            this.physics.add.collider(this.player, wall)
        })

        this.baskets[0] = new Basket(this, width * 0.25, 400, this.player)
        this.baskets[1] = new Basket(this, width * 0.8, 350, this.player)

        this.baskets.forEach((basket) => {
            basket.emitter.on('onHasBall', this.handleBallTouch)
            this.add.existing(basket)
        })

        this.targetBasket = this.baskets[1]

        this.add.existing(this.baskets[0])
        this.add.existing(this.baskets[1])

        this.input.dragDistanceThreshold = 10
        this.camera.startFollow(this.player, false, 0, 0.01, -width / 4, height / 4)

        this.shootSound = this.sound.add('shoot')
        this.kickSound = this.sound.add('kick')
    }

    private handleBallTouch = (basket: Basket) => {
        if (basket === this.targetBasket) {
            const targetBasketIndex = this.baskets.indexOf(basket)
            const targetBasket = this.baskets[1 - targetBasketIndex]

            // Swap target basket
            this.targetBasket = targetBasket
            targetBasket.y = this.math.integerInRange(basket.y - 150, basket.y - 50)
            targetBasket.rotation =
                targetBasketIndex === 1
                    ? this.math.realInRange(0, 0.5)
                    : this.math.realInRange(-0.5, 0)

            this.draggingZone.y = targetBasket.y
            this.walls.forEach((wall) => (wall.y = targetBasket.y))
        }
    }
}
