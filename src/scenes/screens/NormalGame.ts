import { GameState } from '../../GameState'
import { CANVAS_WIDTH } from '../../constant/CanvasSize'
import {
    STAR_CHANCES,
    MOVEABLE_BASKET_CHANCES,
    MINI_WALL_CHANCES,
    BOUNCER_CHANCES,
    SHIELD_CHANCES,
} from '../../constant/Level'
import GameManager from '../../manager/GameManager'
import ScoreManager from '../../manager/ScoreManager'
import SoundManager from '../../manager/SoundManager'
import Ball from '../../objects/Ball'
import Basket from '../../objects/Basket'
import Bouncer from '../../objects/Bouncer'
import MiniWall from '../../objects/MiniWall'
import Shield from '../../objects/Shield'
import DotLineManager from '../../manager/DotLineManager'
import { IScreen } from '../../types/screen'
import { Random } from '../../utils/Random'
import ProgressManager from '../../manager/ProgressManager'
import PopUpManager from '../../manager/PopupManager'

export default class NormalGame extends Phaser.GameObjects.Container {
    private ball: Ball
    private ballSpawnPos: Phaser.Math.Vector2

    private camera: Phaser.Cameras.Scene2D.Camera

    private baskets: Basket[] = []
    private targetBasket: Basket

    private deadZone: Phaser.GameObjects.Rectangle

    private miniWall: MiniWall
    private bouncer: Bouncer
    private shield: Shield

    constructor(s: IScreen, ball: Ball) {
        super(s.scene, s.x, s.y)
        s.scene.add.existing(this)

        this.ball = ball
        this.ballSpawnPos = new Phaser.Math.Vector2(this.ball.x, this.ball.y)
        this.camera = this.scene.cameras.main

        this.createObstacles()
        this.createDeadZone()
        this.createBaskets()

        this.add(this.baskets)
        this.add([this.baskets[0].basketTopSprite, this.baskets[1].basketTopSprite])
        this.add([this.bouncer, this.miniWall, this.shield])
        this.add(this.deadZone)
    }

    private createDeadZone(): void {
        this.deadZone = this.scene.add.rectangle(
            CANVAS_WIDTH * 0.5,
            this.scene.scale.height,
            CANVAS_WIDTH,
            0,
            0,
            0
        )
        this.scene.physics.add.existing(this.deadZone)
        this.scene.physics.add.overlap(this.deadZone, this.ball, () => {
            if (GameManager.getCurrentState() === GameState.PLAYING) {
                SoundManager.playGameOverSound()
                if (ScoreManager.getScore() === 0) {
                    this.ball
                        .setPosition(this.ballSpawnPos.x, this.ballSpawnPos.y - 200)
                        .setVelocity(0)
                        .setRotation(0)
                    this.scene.add.tween({
                        targets: this.baskets[0],
                        rotation: 0,
                        duration: 300,
                        ease: 'Back.out',
                    })
                } else {
                    GameManager.updateGameState(GameState.GAME_OVER, this.scene)
                    this.camera.stopFollow()
                }
            }
        })
    }

    private createBaskets(): void {
        this.baskets[0] = new Basket(
            this.scene,
            this.ball,
            CANVAS_WIDTH * 0.26,
            this.scene.scale.height * 0.73
        )
        this.baskets[1] = new Basket(
            this.scene,
            this.ball,
            CANVAS_WIDTH * 0.75,
            this.scene.scale.height * 0.63
        )

        this.ball.y = this.baskets[0].y
        this.baskets[0].hadBall = true
        this.baskets[0].changeBasketTexture(1)
        this.targetBasket = this.baskets[1]

        this.baskets.forEach((basket) => {
            basket.emitter.on('onHasBall', this.handleBallTouch)
        })
    }

    private createObstacles(): void {
        this.miniWall = new MiniWall({ scene: this.scene, x: 300, y: 100, ball: this.ball })
            .setActive(false)
            .setScale(0)

        this.bouncer = new Bouncer({ scene: this.scene, x: 300, y: 100, ball: this.ball })
            .setActive(false)
            .setScale(0)

        this.shield = new Shield({
            scene: this.scene,
            x: CANVAS_WIDTH + 200,
            y: 500,
            ball: this.ball,
        })
    }

    private handleBallTouch = (basket: Basket) => {
        if (basket.hadBall) {
            ProgressManager.setBounce(0)
            return
        }

        DotLineManager.clearNormalLine()

        this.generateNextBasket(basket)

        this.deadZone.y = basket.y + 450

        ProgressManager.setCombo(ProgressManager.getCombo() + 1)
        ProgressManager.handlePopup()

        const score =
            Math.min(ProgressManager.getCombo(), 10) * (ProgressManager.getBounce() > 0 ? 2 : 1)
        SoundManager.playNoteSound(Math.min(ProgressManager.getCombo(), 10))
        ScoreManager.updateScore(ScoreManager.getScore() + score)

        PopUpManager.create({ text: `+${score}`, color: 0xd0532a })
        PopUpManager.playTweenQueue(basket.x, basket.y - 50)

        ProgressManager.setBounce(0)
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
            this.targetBasket.createStar(this.scene)
        }

        // There's a bug on mobile when set this scale to zero
        this.targetBasket.scale = 0.01

        this.scene.add.tween({
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
            this.scene.add.tween({
                targets: this.miniWall,
                scale: 0.65,
                duration: 300,
                ease: 'Back.out',
            })
            this.miniWall.x = this.targetBasket.x + (Random.Percent(50) ? 100 : -100)
        } else if (Random.Percent(BOUNCER_CHANCES)) {
            this.bouncer.setActive(true).y = this.targetBasket.y - 200
            this.bouncer.x = this.targetBasket.x
            this.scene.add.tween({
                targets: this.bouncer,
                scale: 0.35,
                duration: 300,
                ease: 'Back.out',
            })
            this.targetBasket.rotation = 0
        } else if (Random.Percent(SHIELD_CHANCES)) {
            this.shield.setPosition(this.targetBasket.x, this.targetBasket.y)

            this.scene.add.tween({
                targets: this.shield,
                scale: 0.65,
                duration: 300,
                ease: 'Back.out',
            })
            this.targetBasket.rotation = 0
        }
    }

    update(time: number, delta: number): void {
        for (const basket of this.baskets) {
            basket.update()
        }
        this.shield.update(time, delta)
    }
}
