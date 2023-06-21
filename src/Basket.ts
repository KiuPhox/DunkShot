import GameplayScene from './scenes/GameplayScene'

const MAX_SHOOT_FORCE = 1000

const CIRC_COUNT = 5
const CIRC_POSITION = [
    [0, 30],
    [32, 0],
    [-32, 0],
    [20, 20],
    [-20, 20],
]

export default class Basket extends Phaser.GameObjects.Container {
    private centerCirc: Phaser.Physics.Arcade.Sprite
    private otherCirc: Phaser.Physics.Arcade.Sprite[] = []

    private hasBall = false

    private dragStartPos: Phaser.Math.Vector2
    private dragPos: Phaser.Math.Vector2
    private shootVelocity: Phaser.Math.Vector2 = new Phaser.Math.Vector2(0, 0)

    private player: Phaser.Physics.Arcade.Sprite

    public emitter: Phaser.Events.EventEmitter = new Phaser.Events.EventEmitter()

    constructor(scene: GameplayScene, x: number, y: number, player: Phaser.Physics.Arcade.Sprite) {
        super(scene, x, y)

        this.player = player

        const basketSprite = scene.add.sprite(0, 0, 'basket', 0).setScale(0.22)
        const netSprite = scene.add.sprite(0, 15, 'net').setScale(0.22)
        const graphics = scene.add.graphics()
        const shootLine = new Phaser.Geom.Line()

        this.centerCirc = scene.physics.add
            .sprite(0, 20, '')
            .setCircle(4)
            .setOffset(12, 12)
            .setAlpha(0)

        for (let i = 0; i < CIRC_COUNT; i++) {
            this.otherCirc[i] = scene.physics.add
                .sprite(CIRC_POSITION[i][0], CIRC_POSITION[i][1], '')
                .setCircle(4)
                .setOffset(12, 12)
                .setAlpha(0)

            this.add(this.otherCirc[i])
            scene.physics.add.existing(this.otherCirc[i])
            ;(this.otherCirc[i].body as Phaser.Physics.Arcade.Body)
                .setImmovable(true)
                .setBounce(0).moves = false
            scene.physics.add.collider(this.otherCirc[i], player)
        }

        this.add(netSprite)
        this.add(basketSprite)
        this.add(this.centerCirc)

        scene.physics.add.existing(this.centerCirc)

        scene.physics.add.overlap(this.centerCirc, player, () => {
            if (!this.hasBall) {
                this.hasBall = true
                player.setBounce(0)
                this.emitter.emit('onHasBall', this)
            }
        })

        scene.input.on('dragstart', (pointer: PointerEvent) => {
            if (this.hasBall) {
                this.dragStartPos = new Phaser.Math.Vector2(pointer.x, pointer.y)
                shootLine.setTo(this.x, this.y, this.x, this.y)
                graphics.clear()
                graphics.lineStyle(4, 0xf2a63b)
                graphics.strokeLineShape(shootLine)
            }
        })

        scene.input.on('drag', (pointer: PointerEvent) => {
            if (this.hasBall && this.dragStartPos) {
                player.setGravityY(0)
                player.setVelocity(0)
                this.dragPos = new Phaser.Math.Vector2(pointer.x, pointer.y)

                this.shootVelocity = new Phaser.Math.Vector2(
                    (this.dragStartPos.x - this.dragPos.x) * 7,
                    (this.dragStartPos.y - this.dragPos.y) * 7
                )

                if (this.shootVelocity.length() > 10) {
                    this.rotation = this.shootVelocity.angle() + Math.PI / 2
                    Phaser.Math.RotateAroundDistance(this.player, this.x, this.y, 0, 2)
                }

                shootLine.x2 = (this.dragPos.x - this.dragStartPos.x) * 2 + this.x
                shootLine.y2 = (this.dragPos.y - this.dragStartPos.y) * 2 + this.y

                Phaser.Geom.Line.RotateAroundPoint(shootLine, shootLine.getPointA(), Math.PI)
                scene.dotLine.drawTrajectoryLine(
                    new Phaser.Math.Vector2(player.x, player.y),
                    this.shootVelocity,
                    1200
                )
            }
        })

        scene.input.on('dragend', () => {
            if (this.hasBall && this.shootVelocity.length() > 100) {
                graphics.clear()
                this.hasBall = false

                player.setVelocity(this.shootVelocity.x, this.shootVelocity.y)
                player.setBounce(0.5)
                player.setGravityY(1200)
                scene.shootSound.play()
                scene.dotLine.clear()
            }
        })
    }
}
