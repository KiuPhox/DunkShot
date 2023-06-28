import GameManager from '../manager/GameManager'
import { GameState } from '../GameState'
import Button from '../objects/Button/Button'
import SkinManager from '../manager/SkinManager'
import { CANVAS_HEIGHT, CANVAS_WIDTH } from '../constant/CanvasSize'
import StarManager from '../manager/StarManager'

const ROWS = 4
const COLUMNS = 19

export default class CustomizeScene extends Phaser.Scene {
    private skins: Button[] = []

    private isPointerDown: boolean
    private lastPointerPos: Phaser.Math.Vector2

    constructor() {
        super('customize')

        this.isPointerDown = false
        this.lastPointerPos = new Phaser.Math.Vector2(0, 0)
    }

    create() {
        this.createBackButton()
        this.createSkinButtons()

        this.input.on('pointerdown', () => {
            this.isPointerDown = true
        })

        this.input.on('pointerup', () => {
            this.isPointerDown = false
        })
        this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
            if (this.isPointerDown) {
                this.cameras.main.scrollY += this.lastPointerPos.y - pointer.y
            }

            this.lastPointerPos.x = pointer.x
            this.lastPointerPos.y = pointer.y
        })
    }

    private createBackButton() {
        const backBtn = new Button({
            scene: this,
            x: CANVAS_WIDTH * 0.06,
            y: CANVAS_HEIGHT * 0.035,
            texture: 'back-btn',
            scale: 0.3,
            pointerUpCallback: () => {
                if (
                    GameManager.getPreviousState() === GameState.READY ||
                    GameManager.getPreviousState() === GameState.PAUSE
                ) {
                    GameManager.updateGameState(GameManager.getPreviousState(), this)
                }
            },
        })
    }

    private createSkinButtons() {
        const buttonScale = 0.55
        const unlockedSkins = SkinManager.getUnlockedSkins()

        this.skins = []
        for (let i = 0; i < ROWS * COLUMNS; i++) {
            if (unlockedSkins.indexOf(i) === -1) {
                const b = new Button({
                    scene: this,
                    x: 0,
                    y: 0,
                    texture: 'item',
                    scale: buttonScale,
                    pointerDownCallback: () => {
                        if (unlockedSkins.indexOf(i) === -1) {
                            if (StarManager.getCurrentStar() > 100) {
                                StarManager.updateStar(StarManager.getCurrentStar() - 100)
                                SkinManager.unlockSkin(i)
                                b.setTexture('ball', i)
                            }
                        } else {
                            SkinManager.changeSkin(i)
                        }
                    },
                })
                this.skins.push(b)
            } else {
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
            }

            Phaser.Actions.GridAlign(this.skins, {
                width: ROWS,
                height: COLUMNS,
                cellWidth: CANVAS_WIDTH / 4.5,
                cellHeight: CANVAS_WIDTH / 4.5,
                x: 0,
                y: 0,
            })
        }
    }
}
