import Phaser from 'phaser'
import Basket from '../objects/Basket'
import DotLinePlugin from '../plugins/DotLinePlugin'
import Ball from '../objects/Ball'
import ScoreManager from '../manager/ScoreManager'
import SkinManager from '../manager/SkinManager'
import { CANVAS_WIDTH } from '../constant/CanvasSize'
import { Random } from '../utils/Random'
import {
    BOUNCER_CHANCES,
    MINI_WALL_CHANCES,
    MOVEABLE_BASKET_CHANCES,
    SHIELD_CHANCES,
    STAR_CHANCES,
} from '../constant/Level'
import PopUpManager from '../manager/PopupManager'
import MiniWall from '../objects/MiniWall'
import { GameState } from '../GameState'
import GameManager from '../manager/GameManager'
import Bouncer from '../objects/Bouncer'
import PlayerDataManager from '../manager/PlayerDataManager'
import Shield from '../objects/Shield'
import Timer from '../objects/Challenges/Timer'
import SoundManager from '../manager/SoundManager'

export default class GameplayScene extends Phaser.Scene {
    private ball: Ball
    private fakeBall: Phaser.GameObjects.Arc
    private ballSpawnPos: Phaser.Math.Vector2
    private lives: number

    private camera: Phaser.Cameras.Scene2D.Camera

    private baskets: Basket[] = []
    private targetBasket: Basket

    private draggingZone: Phaser.GameObjects.Rectangle
    private deadZone: Phaser.GameObjects.Rectangle

    private walls: Phaser.GameObjects.Rectangle[] = []

    public dotLine: DotLinePlugin

    private curScore: number
    public bounceCount: number
    private previousCombo: number

    private miniWall: MiniWall
    private bouncer: Bouncer
    private shield: Shield

    // Challenge
    private timer: Timer
    private goal: number

    constructor() {
        super('game')
    }

    init() {
        this.dotLine.init()
    }

    create() {
        this.initializeVariables()

        this.createBall()
        this.createObstacles()
        this.createDraggingZone()
        this.createDeadZone()
        this.createWalls()

        this.timer = new Timer(-1, false, () => {
            GameManager.updateGameState(GameState.GAME_OVER, this)
            this.camera.stopFollow()
        })

        this.lives = 0

        if (GameManager.getCurrentState() === GameState.CHALLENGE_READY) {
            const { name } = this.registry.get('challenge')
            if (name === 'no-aim') {
                this.lives = 3
            }
            this.loadChallengeLevel(this.registry.get('challenge'))
        } else {
            this.createBaskets()
        }

        this.baskets.forEach((basket) => {
            basket.emitter.on('onHasBall', this.handleBallTouch)
            basket.emitter.on('onDragEnd', this.handleBasketDragEnd)
        })

        this.configureCamera()
    }

    private initializeVariables() {
        this.curScore = 0
        this.bounceCount = 0
        this.previousCombo = 0
        this.camera = this.cameras.main

        this.sound.setMute(!PlayerDataManager.getPlayerData().settings.sound)

        SkinManager.init()
        PopUpManager.init(this)
    }

    private createBall(): void {
        this.ball = new Ball({
            scene: this,
            x: CANVAS_WIDTH * 0.26,
            y: this.scale.height * 0.75,
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

        this.ballSpawnPos = new Phaser.Math.Vector2(this.ball.x, this.ball.y)
        this.fakeBall = this.add.circle(CANVAS_WIDTH / 2, this.ball.y, 0)
    }

    private createDraggingZone(): void {
        this.draggingZone = this.add
            .rectangle(
                CANVAS_WIDTH * 0.5,
                this.scale.height * 0.5,
                CANVAS_WIDTH,
                this.scale.height,
                0,
                0
            )
            .setInteractive({ draggable: true })
    }

    private createDeadZone(): void {
        this.deadZone = this.add.rectangle(
            CANVAS_WIDTH * 0.5,
            this.scale.height,
            CANVAS_WIDTH,
            0,
            0,
            0
        )
        this.physics.add.existing(this.deadZone)
        this.physics.add.overlap(this.deadZone, this.ball, () => {
            SoundManager.playGameOverSound(this)
            if (
                GameManager.getCurrentState() === GameState.PLAYING ||
                GameManager.getCurrentState() === GameState.CHALLENGE_PLAYING
            ) {
                if (this.curScore === 0) {
                    this.ball
                        .setPosition(this.ballSpawnPos.x, this.ballSpawnPos.y - 200)
                        .setVelocity(0)
                        .setRotation(0)
                    this.add.tween({
                        targets: this.baskets[0],
                        rotation: 0,
                        duration: 300,
                        ease: 'Back.out',
                    })
                    this.timer.reset()
                    this.timer.setActive(false)
                } else if (this.lives > 1) {
                    this.lives = this.lives - 1
                    this.ball
                        .setPosition(this.ballSpawnPos.x, this.ballSpawnPos.y - 200)
                        .setVelocity(0)
                        .setRotation(0)
                    this.add.tween({
                        targets: this.baskets[0],
                        rotation: 0,
                        duration: 300,
                        ease: 'Back.out',
                    })
                } else {
                    GameManager.updateGameState(GameState.GAME_OVER, this)
                    this.camera.stopFollow()
                }
            }
        })
    }

    private createWalls(): void {
        const wallHitEffect = this.add.image(0, 0, 'e4').setAlpha(0).setScale(0.5)

        const wallPositions = [
            { x: 0, y: this.scale.height * 0.5, origin: { x: 1, y: 0.5 } },
            { x: CANVAS_WIDTH, y: this.scale.height * 0.5, origin: { x: 0, y: 0.5 } },
        ]
        this.walls = wallPositions.map((position) =>
            this.add
                .rectangle(position.x, position.y, 50, this.scale.height * 3, 0xc9c9c9)
                .setOrigin(position.origin.x, position.origin.y)
        )

        this.walls.forEach((wall) => {
            this.physics.add.existing(wall)
            ;(wall.body as Phaser.Physics.Arcade.Body).setImmovable(true).moves = false
            this.physics.add.collider(this.ball, wall, () => {
                SoundManager.playWallHitSound(this)
                wallHitEffect.x = this.ball.x
                wallHitEffect.y = this.ball.y

                wallHitEffect
                    .setTint(SkinManager.getCurrentSkinColors()[0])
                    .setAlpha(0)
                    .setScale(0.5, 0.1)
                    .setFlipX(wallHitEffect.x > CANVAS_WIDTH / 2)

                if (this.ball.body) {
                    this.ball.setVelocity(
                        this.ball.body.velocity.x * 1.1,
                        this.ball.body.velocity.y * 1.1
                    )
                }

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
        this.baskets[0] = new Basket(this, this.ball, CANVAS_WIDTH * 0.26, this.scale.height * 0.73)
        this.baskets[1] = new Basket(this, this.ball, CANVAS_WIDTH * 0.75, this.scale.height * 0.63)

        this.ball.y = this.baskets[0].y
        this.baskets[0].hadBall = true
        this.baskets[0].changeBasketTexture(1)
        this.targetBasket = this.baskets[1]
    }

    private createObstacles(): void {
        this.miniWall = new MiniWall({ scene: this, x: 300, y: 100, ball: this.ball })
            .setActive(false)
            .setScale(0)

        this.bouncer = new Bouncer({ scene: this, x: 300, y: 100, ball: this.ball })
            .setActive(false)
            .setScale(0)

        this.shield = new Shield({ scene: this, x: CANVAS_WIDTH + 200, y: 500, ball: this.ball })
    }

    private loadChallengeLevel(challenge: any) {
        const map = this.make.tilemap({ key: `${challenge.name}-${challenge.level}` })
        const objectLayer = map.getObjectLayer('objects')

        if (!objectLayer) return

        const objects = objectLayer.objects as any[]
        const height = this.scale.height
        const offset = height - map.height * map.tileHeight

        if (challenge.name === 'time') {
            this.timer.setDuration((objectLayer.properties as any)[0].value)
            this.registry.set('goal', this.timer.current.toFixed(2))
        }

        objects.forEach((object) => {
            const x = object.x + object.width / 2
            const y = offset + object.y
            const rotation = Phaser.Math.DegToRad(object.rotation)

            if (object.type === 'basket') {
                const basket = new Basket(this, this.ball, x, y)
                basket.rotation = rotation
                basket.setMoveable(object.properties[0].value, object.properties[1].value)
                this.baskets.push(basket)

                if (object.name === 'targetbasket') {
                    this.targetBasket = basket
                } else if (object.name === 'initialbasket') {
                    basket.hadBall = true
                    basket.changeBasketTexture(1)
                }
            } else if (object.type === 'bouncer') {
                new Bouncer({
                    scene: this,
                    x: x,
                    y: y,
                    ball: this.ball,
                }).setActive(true)
            } else if (object.type === 'miniwall') {
                new MiniWall({
                    scene: this,
                    x: x,
                    y: y,
                    ball: this.ball,
                }).setActive(true)
            } else if (object.type === 'ball') {
                this.ball.x = x
                this.fakeBall.y = y
                this.ball.y = y
                this.ballSpawnPos = new Phaser.Math.Vector2(this.ball.x, this.ball.y)
            }
        })
    }

    private configureCamera(): void {
        this.input.dragDistanceThreshold = 10
        this.camera.scrollY = this.fakeBall.y - this.scale.height * 0.75
        this.camera.startFollow(this.fakeBall, false, 0, 0.01, 0, this.scale.height * 0.25)
    }

    private handleBallTouch = (basket: Basket) => {
        if (basket.hadBall) {
            this.bounceCount = 0
            return
        }

        this.ballSpawnPos = new Phaser.Math.Vector2(basket.x, basket.y)
        this.dotLine.clearNormalLine()

        if (GameManager.getCurrentState() === GameState.PLAYING) {
            this.generateNextBasket(basket)
        } else if (
            this.targetBasket === basket &&
            (GameManager.getCurrentState() === GameState.CHALLENGE_PLAYING ||
                GameManager.getCurrentState() === GameState.CHALLENGE_READY)
        ) {
            const { name, level } = this.registry.get('challenge')

            PlayerDataManager.setChallengeLevel(name, level)
            this.timer.setActive(false)
            GameManager.updateGameState(GameState.CHALLENGE_COMPLETE, this)
        }

        this.deadZone.y = basket.y + 450
        this.walls.forEach((wall) => (wall.y = this.targetBasket.y))

        this.ball.increaseCombo()
        const combo = this.ball.getCombo()

        if (combo >= 4) {
            if (combo === 4) {
                SoundManager.playComboStartSound(this)
            } else {
                SoundManager.playComboHitSound(this)
            }
        }

        const score = Math.min(combo, 10) * (this.bounceCount > 0 ? 2 : 1)
        this.curScore += score
        SoundManager.playNoteSound(this, Math.min(combo, 10))
        ScoreManager.updateScore(this.curScore)

        // Bounce
        if (this.bounceCount > 0) {
            PopUpManager.create({
                text: `Bounce${this.bounceCount > 1 ? ' x' + this.bounceCount : ''}`,
                color: 0x30a2ff,
            })
        }

        // Perfect
        if (this.previousCombo > 0 && combo > this.previousCombo) {
            PopUpManager.create({
                text: `Perfect${combo - 1 > 1 ? ' x' + (combo - 1) : ''}`,
                color: 0xfb8b25,
            })
        }

        this.previousCombo = combo

        // Score
        PopUpManager.create({ text: `+${score}`, color: 0xd0532a })

        PopUpManager.playTweenQueue(basket.x, basket.y - 50)

        this.bounceCount = 0
    }

    private handleBasketDragEnd = (basket: Basket) => {
        if (
            GameManager.getCurrentState() === GameState.CHALLENGE_PLAYING &&
            this.registry.get('challenge').name === 'time'
        ) {
            this.timer.setActive(true)
        }
    }

    private generateNextBasket(basket: Basket): void {
        const targetBasketIndex = this.baskets.indexOf(basket)
        const nextTargetBasket = this.baskets[1 - targetBasketIndex]

        // Swap target basket
        this.targetBasket = nextTargetBasket
        this.targetBasket.changeBasketTexture(0)
        this.targetBasket.hadBall = false

        this.targetBasket.y = Random.Int(basket.y - 450, basket.y - 150)

        if (targetBasketIndex === 0) {
            // Right basket
            this.targetBasket.x = Random.Int(CANVAS_WIDTH * 0.6, CANVAS_WIDTH * 0.8)
            this.targetBasket.rotation = Random.Float(-0.5, 0)
        } else {
            // Left basket
            this.targetBasket.x = Random.Int(CANVAS_WIDTH * 0.2, CANVAS_WIDTH * 0.4)
            this.targetBasket.rotation = Random.Float(0, 0.5)
        }

        if (Random.Percent(STAR_CHANCES)) {
            this.targetBasket.createStar(this)
        }

        // There's a bug on mobile when set this scale to zero
        this.targetBasket.scale = 0.01

        this.add.tween({
            targets: this.targetBasket,
            scale: 1,
            duration: 300,
            ease: 'Back.out',
        })

        this.generateObstacles()
    }

    private generateObstacles(): void {
        this.miniWall.setActive(false).setScale(0)
        this.bouncer.setActive(false).setScale(0)
        this.shield.setScale(0.001).setPosition(CANVAS_WIDTH + 200, 0)

        if (Random.Percent(MOVEABLE_BASKET_CHANCES)) {
            const isHorizontal = Random.Percent(50)
            const dist =
                this.targetBasket.x > CANVAS_WIDTH / 2
                    ? Random.Float(-300, -200)
                    : Random.Float(200, 300)
            if (isHorizontal) {
                this.targetBasket.setMoveable('right', dist)
            } else {
                this.targetBasket.setMoveable('up', dist)
            }
        } else if (Random.Percent(MINI_WALL_CHANCES)) {
            this.miniWall.setActive(true).y = this.targetBasket.y - 50
            this.add.tween({
                targets: this.miniWall,
                scale: 0.65,
                duration: 300,
                ease: 'Back.out',
            })
            this.miniWall.x = this.targetBasket.x + (Random.Percent(50) ? 100 : -100)
        } else if (Random.Percent(BOUNCER_CHANCES)) {
            this.bouncer.setActive(true).y = this.targetBasket.y - 200
            this.bouncer.x = this.targetBasket.x
            this.add.tween({
                targets: this.bouncer,
                scale: 0.35,
                duration: 300,
                ease: 'Back.out',
            })
            this.targetBasket.rotation = 0
        } else if (Random.Percent(SHIELD_CHANCES)) {
            this.shield.setPosition(this.targetBasket.x, this.targetBasket.y)

            this.add.tween({
                targets: this.shield,
                scale: 0.65,
                duration: 300,
                ease: 'Back.out',
            })
            this.targetBasket.rotation = 0
        }
    }

    update(time: number, delta: number): void {
        this.ball.update(time, delta)

        for (const basket of this.baskets) {
            basket.update()
        }
        this.shield.update(time, delta)
        this.draggingZone.y = this.ball.y
        this.fakeBall.y = this.ball.y

        this.timer.tick(delta)
    }
}
