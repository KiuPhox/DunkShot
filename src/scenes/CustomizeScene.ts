import GameManager from '../manager/GameManager'
import { GameState } from '../GameState'
import Button from '../objects/Button/Button'
import SkinManager from '../manager/SkinManager'
import { CANVAS_HEIGHT, CANVAS_WIDTH } from '../constant/CanvasSize'
import StarManager from '../manager/StarManager'

const ROWS = 4
const COLUMNS = 29

export default class CustomizeScene extends Phaser.Scene {
    private skins: Button[] = []

    private selectedCirc: Phaser.GameObjects.Ellipse

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

        this.selectedCirc = this.add.ellipse(200, 200, 140, 140, 0xffd93d).setDepth(-4)

        this.selectedCirc.x = this.skins[SkinManager.getCurrentSkin()].x
        this.selectedCirc.y = this.skins[SkinManager.getCurrentSkin()].y

        this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
            this.isPointerDown = true
            this.lastPointerPos.x = pointer.x
            this.lastPointerPos.y = pointer.y
        })

        this.input.on('pointerup', (pointer: Phaser.Input.Pointer) => {
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
        const buttonScale = 0.56
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
                            console.log('a')
                            SkinManager.changeSkin(i)
                            this.selectedCirc.x = this.skins[i].x
                            this.selectedCirc.y = this.skins[i].y
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
                            this.selectedCirc.x = this.skins[i].x
                            this.selectedCirc.y = this.skins[i].y
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
