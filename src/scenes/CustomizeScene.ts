import GameManager from '../manager/GameManager'
import { GameState } from '../GameState'
import Button from '../objects/Button/Button'
import SkinManager from '../manager/SkinManager'
import { CANVAS_HEIGHT, CANVAS_WIDTH } from '../constant/CanvasSize'
import StarManager from '../manager/StarManager'

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
            x: CANVAS_WIDTH * 0.06,
            y: CANVAS_HEIGHT * 0.035,
            texture: 'back-btn',
            scale: 0.3,
            pointerUpCallback: () => {
                switch (GameManager.getPreviousState()) {
                    case GameState.READY:
                        GameManager.updateGameState(GameState.READY)
                        this.scene.start('result').launch('game').launch('main-menu')
                        break
                    case GameState.PAUSE:
                        GameManager.updateGameState(GameState.PAUSE)
                        this.scene.stop().wake('pause')
                        break
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
                width: 4,
                height: 4,
                cellWidth: CANVAS_WIDTH / 4.5,
                cellHeight: CANVAS_WIDTH / 4.5,
                x: 0,
                y: CANVAS_HEIGHT / 4,
            })
        }
    }
}
