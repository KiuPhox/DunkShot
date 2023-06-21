import Phaser from 'phaser'
import Basket from '../Basket'
import DotLinePlugin from '../plugins/DotLinePlugin'

export default class GameplayScene extends Phaser.Scene {
    private cursors: Phaser.Types.Input.Keyboard.CursorKeys
    private player: Phaser.Physics.Arcade.Sprite
    private math: Phaser.Math.RandomDataGenerator = new Phaser.Math.RandomDataGenerator()

    private camera: Phaser.Cameras.Scene2D.Camera

    private baskets: Basket[] = []
    private targetBasket: Basket

    private draggingZone: Phaser.GameObjects.Rectangle

    private wall1: Phaser.GameObjects.Rectangle
    private wall2: Phaser.GameObjects.Rectangle

    public dotLine: DotLinePlugin
    public shootSound:
        | Phaser.Sound.NoAudioSound
        | Phaser.Sound.HTML5AudioSound
        | Phaser.Sound.WebAudioSound

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

        // Wall
        this.wall1 = this.add.rectangle(0, height * 0.5, 24, height * 3, 0xc9c9c9)
        this.wall2 = this.add.rectangle(width, height * 0.5, 24, height * 3, 0xc9c9c9)

        this.physics.add.existing(this.wall1)
        this.physics.add.existing(this.wall2)
        ;(this.wall1.body as Phaser.Physics.Arcade.Body).setImmovable(true).moves = false
        ;(this.wall2.body as Phaser.Physics.Arcade.Body).setImmovable(true).moves = false

        this.physics.add.collider(this.player, this.wall1)
        this.physics.add.collider(this.player, this.wall2)

        this.baskets[0] = new Basket(this, width * 0.25, 400, this.player)
        this.baskets[1] = new Basket(this, width * 0.8, 350, this.player)

        this.baskets[0].emitter.on('onHasBall', this.handleBallTouch)
        this.baskets[1].emitter.on('onHasBall', this.handleBallTouch)

        this.targetBasket = this.baskets[1]

        this.add.existing(this.baskets[0])
        this.add.existing(this.baskets[1])

        this.input.dragDistanceThreshold = 10
        this.camera.startFollow(this.player, false, 0, 0.01, -width / 4, height / 4)

        this.shootSound = this.sound.add('shoot')
    }

    private handleBallTouch = (basket: Basket) => {
        if (basket === this.targetBasket) {
            const targetBasketIndex = this.baskets.indexOf(basket)

            // Swap target basket
            this.targetBasket = this.baskets[1 - targetBasketIndex]
            this.targetBasket.y = this.math.integerInRange(basket.y - 150, basket.y - 50)

            this.targetBasket.rotation =
                targetBasketIndex === 1
                    ? this.math.realInRange(0, 0.5)
                    : this.math.realInRange(-0.5, 0)
            this.draggingZone.y = this.targetBasket.y
            this.wall1.y = this.targetBasket.y
            this.wall2.y = this.targetBasket.y
        }
    }

    update() {
        //
    }
}
