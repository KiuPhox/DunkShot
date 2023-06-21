import GameplayScene from './scenes/GameplayScene'

const MAX_SHOOT_FORCE = 1000

export default class Basket extends Phaser.GameObjects.Container {
    private bottomCirc: Phaser.Physics.Arcade.Sprite
    private leftCirc: Phaser.Physics.Arcade.Sprite
    private rightCirc: Phaser.Physics.Arcade.Sprite

    private hasBall = false

    private dragStartPos: Phaser.Math.Vector2
    private dragPos: Phaser.Math.Vector2
    private shootVelocity: Phaser.Math.Vector2 = new Phaser.Math.Vector2(0, 0)

    private player: Phaser.Physics.Arcade.Sprite

    constructor(scene: GameplayScene, x: number, y: number, player: Phaser.Physics.Arcade.Sprite) {
        super(scene, x, y)

        this.player = player

        const basketSprite = scene.add.sprite(0, 0, 'basket', 0).setScale(0.22)
        const netSprite = scene.add.sprite(0, 15, 'net').setScale(0.22)
        const graphics = scene.add.graphics()
        const shootLine = new Phaser.Geom.Line()

        this.bottomCirc = scene.physics.add
            .sprite(0, 30, '')
            .setCircle(5)
            .setOffset(10, 10)
            .setAlpha(0)

        this.leftCirc = scene.physics.add
            .sprite(30, 0, '')
            .setCircle(5)
            .setOffset(10, 10)
            .setAlpha(0)

        this.rightCirc = scene.physics.add
            .sprite(-30, 0, '')
            .setCircle(5)
            .setOffset(10, 10)
            .setAlpha(0)

        this.add(netSprite)
        this.add(basketSprite)
        this.add(this.bottomCirc)
        this.add(this.leftCirc)
        this.add(this.rightCirc)

        scene.physics.add.existing(this.bottomCirc)
        scene.physics.add.existing(this.leftCirc)
        scene.physics.add.existing(this.rightCirc)
        ;(this.bottomCirc.body as Phaser.Physics.Arcade.Body)
            .setImmovable(true)
            .setBounce(0).moves = false
        ;(this.leftCirc.body as Phaser.Physics.Arcade.Body).setImmovable(true).setBounce(0).moves =
            false
        ;(this.rightCirc.body as Phaser.Physics.Arcade.Body).setImmovable(true).setBounce(0).moves =
            false

        scene.physics.add.collider(this.bottomCirc, player, () => {
            this.hasBall = true
            player.setVelocity(0)
            player.setBounce(0)
            player.setGravityY(0)
        })

        scene.physics.add.collider(this.leftCirc, player)
        scene.physics.add.collider(this.rightCirc, player)

        scene.input.on('dragstart', (pointer: PointerEvent) => {
            if (this.hasBall) {
                this.dragStartPos = new Phaser.Math.Vector2(pointer.x, pointer.y)

                shootLine.setTo(x, y, x, y)

                graphics.clear()
                graphics.lineStyle(4, 0xf2a63b)
                graphics.strokeLineShape(shootLine)
            }
        })

        scene.input.on('drag', (pointer: PointerEvent) => {
            if (this.hasBall && this.dragStartPos) {
                this.dragPos = new Phaser.Math.Vector2(pointer.x, pointer.y)

                this.shootVelocity = new Phaser.Math.Vector2(
                    (this.dragStartPos.x - this.dragPos.x) * 10,
                    (this.dragStartPos.y - this.dragPos.y) * 10
                )

                if (this.shootVelocity.length() > 10) {
                    this.rotation = this.shootVelocity.angle() + Math.PI / 2
                    Phaser.Math.RotateAroundDistance(this.player, this.x, this.y, 0, 2)
                }

                shootLine.x2 = (this.dragPos.x - this.dragStartPos.x) * 3 + x
                shootLine.y2 = (this.dragPos.y - this.dragStartPos.y) * 3 + y

                Phaser.Geom.Line.RotateAroundPoint(shootLine, shootLine.getPointA(), Math.PI)
                scene.dotLine.draw(shootLine)
            }
        })

        scene.input.on('dragend', () => {
            if (this.hasBall && this.shootVelocity.length() > 100) {
                graphics.clear()
                this.hasBall = false

                const shootForce =
                    this.shootVelocity.length() > MAX_SHOOT_FORCE
                        ? MAX_SHOOT_FORCE
                        : this.shootVelocity.length()
                this.shootVelocity.normalize()
                player.setVelocity(
                    this.shootVelocity.x * shootForce,
                    this.shootVelocity.y * shootForce
                )
                player.setBounce(0.5)
                player.setGravityY(1200)
                scene.dotLine.clear()
            }
        })
    }

    public update(): void {
        super.update()
    }

    public plot(velocity: Phaser.Math.Vector2, steps: number): Phaser.Math.Vector2[] {
        const results: Phaser.Math.Vector2[] = []
        for (let i = 0; i < steps; i++) {
            //
        }
        return results
    }
}
