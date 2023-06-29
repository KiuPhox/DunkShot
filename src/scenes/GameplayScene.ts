import Phaser from 'phaser'
import Basket from '../objects/Basket'
import DotLinePlugin from '../plugins/DotLinePlugin'
import Ball from '../objects/Ball'
import ScoreManager from '../manager/ScoreManager'
import SkinManager from '../manager/SkinManager'
import { CANVAS_HEIGHT, CANVAS_WIDTH } from '../constant/CanvasSize'
import { Random } from '../utils/Random'
import { MINI_WALL_CHANCES, MOVEABLE_BASKET_CHANCES, STAR_CHANCES } from '../constant/Level'
import PopUpManager from '../manager/PopUpManager'
import MiniWall from '../objects/MiniWall'
import { GameState } from '../GameState'
import GameManager from '../manager/GameManager'
import Storage from '../Storage'
import { STORAGE_KEY } from '../constant/StorageKey'
import Bouncer from '../objects/Bouncer'

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
    public comboHitSound: Phaser.Sound.BaseSound
    public comboStartSound: Phaser.Sound.BaseSound
    public comboShootSound: Phaser.Sound.BaseSound

    private curScore: number
    public bounceCount: number
    private previousCombo: number

    private miniWall: MiniWall
    private bouncer: Bouncer

    constructor() {
        super('game')
    }

    init() {
        this.dotLine.init()
    }

    create() {
        this.initializeVariables()

        this.createBall()
        this.createDraggingZone()
        this.createDeadZone()
        this.createWalls()
        this.createBaskets()
        this.createObstacles()

        this.configureCamera()
    }

    private initializeVariables() {
        this.curScore = 0
        this.bounceCount = 0
        this.previousCombo = 0
        this.camera = this.cameras.main
        this.dotLine.init()

        this.shootSound = this.sound.add('shoot')
        this.kickSound = this.sound.add('kick')
        this.dieSound = this.sound.add('die')
        this.wallHitSound = this.sound.add('wall-hit')
        this.starSound = this.sound.add('star')
        this.comboHitSound = this.sound.add('combo-hit')
        this.comboShootSound = this.sound.add('combo-shoot')
        this.comboStartSound = this.sound.add('combo-start')

        for (let i = 1; i <= 10; i++) {
            this.pointSounds[i - 1] = this.sound.add(i.toString())
        }

        this.sound.setMute(Storage.getString(STORAGE_KEY.SOUND) === 'false')

        SkinManager.init()
        PopUpManager.init(this)
    }

    private createBall(): void {
        this.ball = new Ball({
            scene: this,
            x: CANVAS_WIDTH * 0.25,
            y: CANVAS_HEIGHT * 0.25,
            texture: 'ball',
            frame: SkinManager.getCurrentSkin(),
        })
            .setDepth(1)
            .setName('Ball')
            .setCircle(100)
            .setScale(0.32)
            .setDepth(0)
            .setGravityY(1200)
            .setFriction(0)
    }

    private createDraggingZone(): void {
        this.draggingZone = this.add
            .rectangle(CANVAS_WIDTH * 0.5, CANVAS_HEIGHT * 0.5, CANVAS_WIDTH, CANVAS_HEIGHT, 0, 0)
            .setInteractive({ draggable: true })
    }

    private createDeadZone(): void {
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
                GameManager.updateGameState(GameState.GAME_OVER, this)
                this.dieSound.play()
                this.camera.stopFollow()
            }
        })
    }

    private createWalls(): void {
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

                this.bounceCount++
            })
        })
    }

    private createBaskets(): void {
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
    }

    private configureCamera(): void {
        this.input.dragDistanceThreshold = 10
        this.camera.startFollow(this.ball, false, 0, 0.01, -CANVAS_WIDTH / 4, CANVAS_HEIGHT / 4)
    }

    private createObstacles(): void {
        this.miniWall = new MiniWall({ scene: this, x: 300, y: 100, ball: this.ball })
            .setActive(false)
            .setScale(0)

        this.bouncer = new Bouncer({ scene: this, x: 300, y: 100, ball: this.ball })
            .setActive(false)
            .setScale(0)
            .setCircle(100)
    }

    private handleBallTouch = (basket: Basket) => {
        if (basket === this.targetBasket) {
            this.dotLine.clearNormalLine()

            this.generateNextBasket(basket)

            this.draggingZone.y = this.targetBasket.y
            this.deadZone.y = basket.y + 450
            this.walls.forEach((wall) => (wall.y = this.targetBasket.y))

            this.ball.increaseCombo()
            const combo = this.ball.getCombo()

            if (combo === 4) {
                this.comboStartSound.play()
            } else if (combo > 4) {
                this.comboHitSound.play()
            }

            this.curScore += combo
            this.pointSounds[combo - 1].play()

            ScoreManager.updateScore(this.curScore)

            // Pop Up

            // Bounce
            if (this.bounceCount > 1) {
                PopUpManager.create({ text: `Bounce x${this.bounceCount}`, color: 0x30a2ff })
            } else if (this.bounceCount === 1) {
                PopUpManager.create({ text: `Bounce`, color: 0x30a2ff })
            }

            // Air
            if (this.previousCombo > 0 && combo > this.previousCombo) {
                PopUpManager.create({ text: `Perfect`, color: 0xfb8b25 })
            }

            this.previousCombo = combo

            // Score
            PopUpManager.create({ text: `+${combo}`, color: 0xd0532a })

            PopUpManager.playTweenQueue(basket.x, basket.y - 50)
        }
        this.bounceCount = 0
    }

    private generateNextBasket(basket: Basket): void {
        const targetBasketIndex = this.baskets.indexOf(basket)
        const nextTargetBasket = this.baskets[1 - targetBasketIndex]

        // Swap target basket
        this.targetBasket = nextTargetBasket

        this.targetBasket.y = this.math.integerInRange(basket.y - 450, basket.y - 150)

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

        this.miniWall.setActive(false).setScale(0)

        if (Random.Percent(MOVEABLE_BASKET_CHANCES)) {
            this.targetBasket.setMoveable(true)
        } else if (Random.Percent(MINI_WALL_CHANCES)) {
            this.miniWall.setActive(true).y = this.targetBasket.y - 50
            this.add.tween({
                targets: this.miniWall,
                scale: 0.65,
                duration: 300,
                ease: 'Back.out',
            })
            this.miniWall.x = this.targetBasket.x + (Random.Percent(50) ? 100 : -100)
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
        this.ball.update(time, delta)
        this.baskets[0].update()
        this.baskets[1].update()
    }
}
