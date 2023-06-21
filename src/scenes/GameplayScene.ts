import Phaser from 'phaser'
import Basket from '../Basket'
import DotLinePlugin from '../plugins/DotLinePlugin'

export default class GameplayScene extends Phaser.Scene {
    private cursors: Phaser.Types.Input.Keyboard.CursorKeys
    private player: Phaser.Physics.Arcade.Sprite
    private math: Phaser.Math.RandomDataGenerator
    private baskets: Basket[] = []

    public dotLine: DotLinePlugin

    constructor() {
        super('game')
    }

    init() {
        this.dotLine.init()
    }

    create() {
        const { width, height } = this.scale

        this.player = this.physics.add
            .sprite(width * 0.5, height * 0.5, 'ball', 0)
            .setDepth(1)
            .setName('Ball')
            .setCircle(116)
            .setScale(0.15)
            .setDepth(-1)
            .setCollideWorldBounds(true)
            .setGravityY(1200)
            .setFriction(1)

        // Dragging Zone
        this.add
            .rectangle(width * 0.5, height * 0.5, width, height, 0, 0)
            .setInteractive({ draggable: true })

        this.baskets[0] = new Basket(this, width * 0.5, 500, this.player)
        this.baskets[1] = new Basket(this, width * 0.2, 200, this.player)
        this.baskets[2] = new Basket(this, width * 0.8, 300, this.player)

        this.add.existing(this.baskets[0])
        this.add.existing(this.baskets[1])
        this.add.existing(this.baskets[2])

        this.input.dragDistanceThreshold = 10
    }

    update() {
        for (let i = 0; i < this.baskets.length; i++) {
            this.baskets[i].update()
        }
    }
}
