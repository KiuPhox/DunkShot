import Phaser from 'phaser'
import DotLineManager from '../manager/DotLineManager'
import Ball from '../objects/Ball'
import SkinManager from '../manager/SkinManager'
import { CANVAS_WIDTH } from '../constant/CanvasSize'

import PopUpManager from '../manager/PopupManager'
import { GameState } from '../GameState'
import GameManager from '../manager/GameManager'
import PlayerDataManager from '../manager/PlayerDataManager'
import SoundManager from '../manager/SoundManager'
import NormalGame from './screens/NormalGame'
import ChallengeGame from './screens/challenge/ChallengeGame'
import ProgressManager from '../manager/ProgressManager'
import ScoreManager from '../manager/ScoreManager'
import StarManager from '../manager/StarManager'

export default class GameScene extends Phaser.Scene {
    private ball: Ball
    private fakeBall: Phaser.GameObjects.Arc
    private camera: Phaser.Cameras.Scene2D.Camera
    private draggingZone: Phaser.GameObjects.Rectangle
    private walls: Phaser.GameObjects.Rectangle[] = []

    private gameScreen: NormalGame
    private challenge: ChallengeGame

    constructor() {
        super('game')
    }

    init() {
        DotLineManager.init(this)
        SkinManager.init()
        PopUpManager.init(this)
        SoundManager.init(this)
        ProgressManager.init()
        ScoreManager.init()
        StarManager.init()
    }

    create() {
        this.createBall()

        if (GameManager.getCurrentState() === GameState.READY) {
            this.gameScreen = new NormalGame({ scene: this }, this.ball)
        } else if (GameManager.getCurrentState() === GameState.CHALLENGE_READY) {
            this.challenge = new ChallengeGame({ scene: this }, this.ball)
            this.challenge.loadChallengeLevel(this.registry.get('challenge'))
        }

        this.initializeVariables()
        this.createDraggingZone()
        this.createWalls()
        this.configureCamera()
    }

    private initializeVariables() {
        this.camera = this.cameras.main
        this.sound.setMute(!PlayerDataManager.getPlayerData().settings.sound)
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
                SoundManager.playWallHitSound()
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

                ProgressManager.setBounce(ProgressManager.getBounce() + 1)
            })
        })
    }

    private configureCamera(): void {
        this.input.dragDistanceThreshold = 10
        this.camera.scrollY = this.fakeBall.y - this.scale.height * 0.75
        this.camera.startFollow(this.fakeBall, false, 0, 0.01, 0, this.scale.height * 0.25)
    }

    update(time: number, delta: number): void {
        if (this.gameScreen) this.gameScreen.update(time, delta)
        if (this.challenge) this.challenge.update(time, delta)
        this.ball.update(time, delta)
        this.draggingZone.y = this.ball.y
        this.fakeBall.y = this.ball.y
        this.walls[0].y = this.ball.y
        this.walls[1].y = this.ball.y
    }
}
