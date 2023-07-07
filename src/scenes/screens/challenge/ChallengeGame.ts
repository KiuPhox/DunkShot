import { GameState } from '../../../GameState'
import { CANVAS_WIDTH } from '../../../constant/CanvasSize'
import { CHALLENGES } from '../../../constant/Challenges'
import GameManager from '../../../manager/GameManager'
import PlayerDataManager from '../../../manager/PlayerDataManager'
import PopUpManager from '../../../manager/PopupManager'
import ProgressManager from '../../../manager/ProgressManager'
import ScoreManager from '../../../manager/ScoreManager'
import SoundManager from '../../../manager/SoundManager'
import Ball from '../../../objects/Ball'
import Basket from '../../../objects/Basket'
import Bouncer from '../../../objects/Bouncer'
import Timer from '../../../objects/Challenges/Timer'
import MiniWall from '../../../objects/MiniWall'
import { IScreen } from '../../../types/screen'

export default class ChallengeGame extends Phaser.GameObjects.Container {
    private ball: Ball
    private ballSpawnPos: Phaser.Math.Vector2
    private lives: number

    private camera: Phaser.Cameras.Scene2D.Camera

    private baskets: Basket[]
    private targetBasket: Basket

    private deadZone: Phaser.GameObjects.Rectangle

    // Challenge
    private timer: Timer
    private goals: number

    constructor(s: IScreen, ball: Ball) {
        super(s.scene, s.x, s.y)
        s.scene.add.existing(this)

        this.ball = ball

        this.initializeVariables()
        this.createDeadZone()

        this.add(this.deadZone)
    }

    private initializeVariables(): void {
        this.camera = this.scene.cameras.main
        this.lives = 1
        this.baskets = []

        this.timer = new Timer(-1, false, () => {
            if (GameManager.getCurrentState() !== GameState.CHALLENGE_COMPLETE) {
                GameManager.updateGameState(GameState.GAME_OVER, this.scene)
                this.camera.stopFollow()
            }
        })

        const { name } = this.scene.registry.get('challenge')
        if (name === 'no-aim') {
            this.lives = 3
        }
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
            SoundManager.playGameOverSound()
            if (GameManager.getCurrentState() === GameState.CHALLENGE_PLAYING) {
                if (ScoreManager.getScore() === 0) {
                    this.ball
                        .setPosition(this.ballSpawnPos.x, this.ballSpawnPos.y - 200)
                        .setVelocity(0)
                        .setRotation(0)
                    this.timer.reset()
                    this.timer.setActive(false)
                } else if (this.lives > 1) {
                    this.lives = this.lives - 1
                    this.ball
                        .setPosition(this.ballSpawnPos.x, this.ballSpawnPos.y - 200)
                        .setVelocity(0)
                        .setRotation(0)
                } else {
                    GameManager.updateGameState(GameState.GAME_OVER, this.scene)
                    this.camera.stopFollow()
                }
            }
        })
    }

    public loadChallengeLevel(challenge: any) {
        const map = this.scene.make.tilemap({ key: `${challenge.name}-${challenge.level}` })
        const objectLayer = map.getObjectLayer('objects')

        if (!objectLayer) return

        const objects = objectLayer.objects as any[]
        const height = this.scene.scale.height
        const offset = height - map.height * map.tileHeight

        if (challenge.name === 'time') {
            this.timer.setDuration((objectLayer.properties as any)[0].value)
            this.scene.registry.set('goal', this.timer.current.toFixed(2))
        }

        objects.forEach((object) => {
            const x = object.x + object.width / 2
            const y = offset + object.y
            const rotation = Phaser.Math.DegToRad(object.rotation)

            if (object.type === 'basket') {
                const basket = new Basket(this.scene, this.ball, x, y)
                basket.rotation = rotation
                basket.setMoveable(object.properties[0].value, object.properties[1].value)

                if (object.name === 'targetbasket') {
                    this.targetBasket = basket
                } else if (object.name === 'initialbasket') {
                    basket.hadBall = true
                    basket.changeBasketTexture(1)
                }
                this.add(basket)
                this.baskets.push(basket)
                basket.emitter.on('onDragEnd', () => {
                    if (this.scene.registry.get('challenge').name === 'time') {
                        this.timer.setActive(true)
                    }
                })
                basket.emitter.on('onHasBall', this.handleBallTouch)
            } else if (object.type === 'bouncer') {
                this.add(
                    new Bouncer({
                        scene: this.scene,
                        x: x,
                        y: y,
                        ball: this.ball,
                    }).setActive(true)
                )
            } else if (object.type === 'miniwall') {
                this.add(
                    new MiniWall({
                        scene: this.scene,
                        x: x,
                        y: y,
                        ball: this.ball,
                    }).setActive(true)
                )
            } else if (object.type === 'ball') {
                this.ball.x = x
                this.ball.y = y
                this.ballSpawnPos = new Phaser.Math.Vector2(this.ball.x, this.ball.y)
            }
        })
    }

    private handleBallTouch = (basket: Basket) => {
        if (basket.hadBall) {
            ProgressManager.setBounce(0)
            return
        }

        this.ballSpawnPos = new Phaser.Math.Vector2(basket.x, basket.y)

        if (basket === this.targetBasket) {
            this.timer.setActive(false)
            GameManager.updateGameState(GameState.CHALLENGE_COMPLETE, this.scene)
            const { name, level } = this.scene.registry.get('challenge')
            PlayerDataManager.setChallengeLevel(name as CHALLENGES, level)
        }

        this.deadZone.y = basket.y + 450

        ProgressManager.setCombo(ProgressManager.getCombo() + 1)
        ProgressManager.handlePopup()

        const score =
            Math.min(ProgressManager.getCombo(), 10) * (ProgressManager.getBounce() > 0 ? 2 : 1)
        SoundManager.playNoteSound(Math.min(ProgressManager.getCombo(), 10))
        ScoreManager.updateScore(ScoreManager.getScore() + score)

        PopUpManager.create({ text: `+${score}`, color: 0xd0532a })
        PopUpManager.playTweenQueue(basket.x, basket.y - 50)
    }

    destroy(fromScene?: boolean | undefined): void {
        super.destroy(fromScene)
        this.timer.setActive(false)
    }

    update(time: number, delta: number): void {
        this.baskets.forEach((basket) => {
            basket.update()
        })
        this.timer.tick(delta)
    }
}
