import Ball from '../objects/Ball'

export type IObstacle = {
    scene: Phaser.Scene
    x: number
    y: number
    ball: Ball
}
