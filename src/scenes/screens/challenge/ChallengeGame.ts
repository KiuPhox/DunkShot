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
import ChallengeTopbar from './ChallengeTopBar'

export default class ChallengeGame extends Phaser.GameObjects.Container {
    private ball: Ball
    private ballSpawnPos: Phaser.Math.Vector2
    private attempts: number

    private camera: Phaser.Cameras.Scene2D.Camera

    private initialBasket: Basket
    private baskets: Basket[]
    private targetBasket: Basket

    private deadZone: Phaser.GameObjects.Rectangle

    // Challenge
    private timer: Timer

    private currentGoal: number
    private goal: number

    private mode: CHALLENGES
    private currentHoops: number

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
        this.attempts = 1
        this.baskets = []
        this.currentHoops = 0
        this.currentGoal = 0

        const { name } = this.scene.registry.get('challenge')
        this.mode = name as CHALLENGES

        this.timer = new Timer(-1, false, () => {
            if (GameManager.getCurrentState() !== GameState.CHALLENGE_COMPLETE) {
                SoundManager.playTimerBuzzSound()
                GameManager.updateGameState(GameState.GAME_OVER, this.scene)
                this.camera.stopFollow()
            }
        })

        if (this.mode === CHALLENGES.NO_AIM) {
            this.attempts = 3
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
            if (GameManager.getCurrentState() === GameState.CHALLENGE_PLAYING) {
                SoundManager.playGameOverSound()
                if (ScoreManager.getScore() === 0) {
                    this.ball
                        .setPosition(this.ballSpawnPos.x, this.ballSpawnPos.y - 200)
                        .setVelocity(0)
                        .setRotation(0)

                    if (this.mode === CHALLENGES.TIME) {
                        this.timer.setActive(false)
                        this.timer.reset()
                    }
                } else if (this.attempts > 1) {
                    this.attempts = this.attempts - 1
                    ChallengeTopbar.setAttempts(this.attempts)
                    this.ball
                        .setPosition(this.ballSpawnPos.x, this.ballSpawnPos.y - 200)
                        .setVelocity(0)
                        .setRotation(0)
                } else {
                    ChallengeTopbar.setAttempts(0)
                    this.timer.setActive(false)
                    this.camera.stopFollow()
                    GameManager.updateGameState(GameState.GAME_OVER, this.scene)
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
        this.goal = (objectLayer.properties as any)[0].value

        if (this.mode === CHALLENGES.TIME) {
            this.timer.setDuration(this.goal)
        }

        this.scene.registry.set('goal', `0/${this.goal}`)

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
                    this.initialBasket = basket
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
            if (
                this.mode === CHALLENGES.TIME &&
                this.currentHoops === 0 &&
                basket === this.initialBasket
            ) {
                this.timer.reset()
                this.timer.setActive(false)
            }
            ProgressManager.setBounce(0)
            return
        }

        this.currentHoops++

        this.ballSpawnPos = new Phaser.Math.Vector2(basket.x, basket.y)

        this.deadZone.y = basket.y + 500

        ProgressManager.setCombo(ProgressManager.getCombo() + 1)
        ProgressManager.handlePopup()

        const score =
            Math.min(ProgressManager.getCombo(), 10) * (ProgressManager.getBounce() > 0 ? 2 : 1)
        SoundManager.playNoteSound(Math.min(ProgressManager.getCombo(), 10))
        ScoreManager.updateScore(ScoreManager.getScore() + score)

        PopUpManager.create({ text: `+${score}`, color: 0xd0532a })
        PopUpManager.playTweenQueue(basket.x, basket.y - 50)

        switch (this.mode) {
            case CHALLENGES.SCORE:
                this.currentGoal += score
                break
            case CHALLENGES.BOUNCE:
                this.currentGoal += ProgressManager.getBounce()
                break
            case CHALLENGES.NO_AIM:
                this.currentGoal += 1
                break
        }

        if (this.mode !== CHALLENGES.TIME)
            ChallengeTopbar.setGoal(`${this.currentGoal}/${this.goal}`)

        ProgressManager.setBounce(0)

        if (basket === this.targetBasket) {
            this.timer.setActive(false)

            if (this.mode === CHALLENGES.TIME || this.currentGoal >= this.goal) {
                GameManager.updateGameState(GameState.CHALLENGE_COMPLETE, this.scene)
                const { level } = this.scene.registry.get('challenge')
                PlayerDataManager.setChallengeLevel(this.mode, level)
            } else {
                SoundManager.playGameOverSound()
                GameManager.updateGameState(GameState.GAME_OVER, this.scene)
            }
        }
    }

    destroy(fromScene?: boolean | undefined): void {
        super.destroy(fromScene)
        this.timer.setActive(false)
    }

    update(time: number, delta: number): void {
        this.baskets.forEach((basket) => {
            basket.update()
        })

        if (this.mode === CHALLENGES.TIME) {
            this.timer.tick(delta)
        }
    }
}
