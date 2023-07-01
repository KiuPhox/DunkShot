import GameManager from '../manager/GameManager'
import { GameState } from '../GameState'
import Button from '../objects/Button/Button'
import SkinManager from '../manager/SkinManager'
import { CANVAS_HEIGHT, CANVAS_WIDTH } from '../constant/CanvasSize'
import StarManager from '../manager/StarManager'
import RexUIPlugin from 'phaser3-rex-plugins/templates/ui/ui-plugin.js'
import ScrollablePanel from 'phaser3-rex-plugins/templates/ui/scrollablepanel/ScrollablePanel'

const ROWS = 4
const COLUMNS = 29

export default class CustomizeScene extends Phaser.Scene {
    private skins: Button[] = []

    private selectedCirc: Phaser.GameObjects.Ellipse

    private skinsPanel: ScrollablePanel

    private rexUI: RexUIPlugin

    constructor() {
        super('customize')
    }

    create() {
        this.createBackButton()
        this.createSkinsPanel()

        this.add.image(CANVAS_WIDTH / 2, 20, 'top-ornament').setDepth(-2)
        this.add
            .image(CANVAS_WIDTH / 2, 200, 'shop-line')
            .setScale(1.15, 1)
            .setTint(0x8b8b8b)
        this.add.rectangle(CANVAS_WIDTH / 2, 100, CANVAS_WIDTH, 200, 0xe5e5e5).setDepth(-3)
        this.selectedCirc = this.add.ellipse(200, 200, 140, 140, 0xffd93d).setDepth(-4)
    }

    private createSkinsPanel(): void {
        this.skinsPanel = this.rexUI.add
            .scrollablePanel({
                x: CANVAS_WIDTH / 2,
                y: CANVAS_HEIGHT / 2 + 100,
                width: CANVAS_WIDTH,
                height: CANVAS_HEIGHT - 200,
                background: this.rexUI.add.roundRectangle(0, 0, 2, 2, 10, 0xe5e5e5).setDepth(-5),
                scrollMode: 'v',
                panel: {
                    child: this.createGrid(this),
                },
                mouseWheelScroller: {
                    focus: false,
                    speed: 0.5,
                },
                space: {
                    left: 10,
                    right: 10,
                },
            })
            .layout()

        const scroll = this.skinsPanel

        this.tweens.addCounter({
            from: this.skinsPanel.childOY,
            to:
                this.skinsPanel.childOY +
                this.skinsPanel.centerY -
                this.skins[SkinManager.getCurrentSkin()].y,
            duration: 500,
            ease: 'Quad.out',
            onUpdate: function (tween: Phaser.Tweens.Tween) {
                scroll.childOY = tween.getValue()
            },
        })

        this.skinsPanel.setChildrenInteractive({}).on('child.click', (child: Button) => {
            if (child.pointerDownCallback) {
                child.pointerDownCallback()
            }
        })

        // this.skinsPanel.setVisible(false)
    }

    private createGrid(scene: CustomizeScene) {
        const buttonScale = 0.56
        const unlockedSkins = SkinManager.getUnlockedSkins()

        this.skins = []

        const sizer = scene.rexUI.add.fixWidthSizer({
            space: {
                left: 3,
                right: 3,
                top: 20,
                bottom: 20,
                item: 16,
                line: 16,
            },
            align: 'center',
        })

        for (let i = 0; i < ROWS * COLUMNS; i++) {
            let b: Button
            if (unlockedSkins.indexOf(i) === -1) {
                b = new Button({
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
                    (b = new Button({
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
                    }))
                )
            }

            sizer.add(b)
        }

        return sizer
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

    update(): void {
        this.selectedCirc.x = this.skins[SkinManager.getCurrentSkin()].x
        this.selectedCirc.y = this.skins[SkinManager.getCurrentSkin()].y
    }
}
