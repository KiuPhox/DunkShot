import ScrollablePanel from 'phaser3-rex-plugins/templates/ui/scrollablepanel/ScrollablePanel'
import { GameState } from '../../GameState'
import { CANVAS_WIDTH } from '../../constant/CanvasSize'
import GameManager from '../../manager/GameManager'
import SkinManager from '../../manager/SkinManager'
import StarManager from '../../manager/StarManager'
import Button from '../../objects/Button/Button'
import { IScreen } from '../../types/screen'
import RexUIPlugin from 'phaser3-rex-plugins/templates/ui/ui-plugin.js'
import FixWidthSizer from 'phaser3-rex-plugins/templates/ui/fixwidthsizer/FixWidthSizer'

const ROWS = 4
const COLUMNS = 29

export default class CustomizeScreen extends Phaser.GameObjects.Container {
    private skins: Button[] = []

    private selectedCirc: Phaser.GameObjects.Ellipse

    private skinsPanel: ScrollablePanel
    private sizer: FixWidthSizer

    private rexUI: RexUIPlugin

    constructor(s: IScreen) {
        super(s.scene, s.x, s.y)
        s.scene.add.existing(this)

        this.add(
            this.scene.add.rectangle(
                CANVAS_WIDTH / 2,
                s.scene.scale.height / 2,
                CANVAS_WIDTH,
                s.scene.scale.height,
                0xe5e5e5
            )
        )

        this.rexUI = new RexUIPlugin(this.scene, this.scene.plugins, 'rexUI')

        this.selectedCirc = this.scene.add.ellipse(200, 200, 140, 140, 0xffd93d, 1)

        this.createSkinsPanel()

        this.add(this.skinsPanel)

        this.add(this.scene.add.rectangle(CANVAS_WIDTH / 2, 100, CANVAS_WIDTH, 200, 0xe5e5e5))

        this.add(this.scene.add.image(CANVAS_WIDTH / 2, 20, 'top-ornament'))
        this.add(
            this.scene.add
                .image(CANVAS_WIDTH / 2, 200, 'shop-line')
                .setScale(1.15, 1)
                .setTint(0x8b8b8b)
        )

        this.add(this.sizer)

        this.createBackButton()
    }

    private createSkinsPanel(): void {
        this.skinsPanel = this.rexUI.add
            .scrollablePanel({
                x: CANVAS_WIDTH / 2,
                y: this.scene.scale.height / 2 + 100,
                width: CANVAS_WIDTH,
                height: this.scene.scale.height - 200,
                //background: this.rexUI.add.roundRectangle(0, 0, 2, 2, 10, 0xe5e5e5),
                scrollMode: 'v',
                panel: {
                    child: this.createGrid(),
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

        this.scene.tweens.addCounter({
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
    }

    private createGrid() {
        const buttonScale = 0.56
        const unlockedSkins = SkinManager.getUnlockedSkins()

        this.skins = []

        this.sizer = this.rexUI.add.fixWidthSizer({
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

        this.add(this.selectedCirc)

        for (let i = 0; i < ROWS * COLUMNS; i++) {
            let b: Button
            if (unlockedSkins.indexOf(i) === -1) {
                b = new Button({
                    scene: this.scene,
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
                            this.selectedCirc.x = this.skins[i].x
                            this.selectedCirc.y = this.skins[i].y
                        }
                    },
                })
                this.skins.push(b)
            } else {
                this.skins.push(
                    (b = new Button({
                        scene: this.scene,
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
            this.add(b)
            this.sizer.add(b)
        }

        return this.sizer
    }

    private createBackButton() {
        this.add(
            new Button({
                scene: this.scene,
                x: CANVAS_WIDTH * 0.06,
                y: this.scene.scale.height * 0.035,
                texture: 'back-btn',
                scale: 0.3,
                pointerUpCallback: () => {
                    if (
                        GameManager.getPreviousState() === GameState.READY ||
                        GameManager.getPreviousState() === GameState.PAUSE
                    ) {
                        GameManager.updateGameState(GameManager.getPreviousState(), this.scene)
                    }
                },
            })
        )
    }

    update(): void {
        this.selectedCirc.x = this.skins[SkinManager.getCurrentSkin()].x
        this.selectedCirc.y = this.skins[SkinManager.getCurrentSkin()].y
    }
}
