import GameManager from '../manager/GameManager'
import { GameState } from '../GameState'
import Button from '../objects/Button'
import SkinManager from '../manager/SkinManager'
import { CANVAS_HEIGHT, CANVAS_WIDTH } from '../constant/CanvasSize'

const ROWS = 4
const COLUMNS = 4

export default class CustomizeScene extends Phaser.Scene {
    private skins: Button[] = []

    constructor() {
        super('customize')
    }

    create() {
        this.createBackButton()
        this.createSkinButtons()
    }

    private createBackButton() {
        const backBtn = new Button({
            scene: this,
            x: CANVAS_WIDTH * 0.05,
            y: CANVAS_HEIGHT * 0.05,
            texture: 'back-btn',
            scale: 0.3,
            pointerUpCallback: () => {
                if (GameManager.getPreviousState() === GameState.READY) {
                    GameManager.updateGameState(GameState.READY)
                    this.scene.start('result').launch('game').launch('main-menu')
                } else if (GameManager.getPreviousState() === GameState.PAUSE) {
                    GameManager.updateGameState(GameState.PAUSE)
                    this.scene.stop().wake('pause')
                }
            },
        })
    }

    private createSkinButtons() {
        const buttonScale = 0.55

        this.skins = []
        for (let i = 0; i < ROWS * COLUMNS; i++) {
            this.skins.push(
                new Button({
                    scene: this,
                    x: 0,
                    y: 0,
                    texture: 'ball',
                    frame: i,
                    scale: buttonScale,
                    pointerDownCallback: () => {
                        SkinManager.changeSkin(i)
                    },
                })
            )

            Phaser.Actions.GridAlign(this.skins, {
                width: 4,
                height: 4,
                cellWidth: CANVAS_WIDTH / 4.5,
                cellHeight: CANVAS_WIDTH / 4.5,
                x: 0,
                y: CANVAS_HEIGHT / 4,
            })
        }

        // for (let i = 0; i < COLUMNS; i++) {
        //     for (let j = 0; j < ROWS; j++) {
        //         const button = new Button({
        //             scene: this,
        //             x: (CANVAS_WIDTH * i) / 4.5 + startX,
        //             y: (CANVAS_HEIGHT * j) / 8 + startY,
        //             texture: 'ball',
        //             frame: i + j * COLUMNS,
        //             scale: buttonScale,
        //             pointerDownCallback: () => {
        //                 SkinManager.changeSkin(i + j * COLUMNS)
        //             },
        //         })
        //     }
        // }
    }
}
