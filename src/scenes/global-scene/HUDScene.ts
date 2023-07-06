import { CANVAS_WIDTH } from '../../constant/CanvasSize'
import StarManager from '../../manager/StarManager'
import MainMenuScreen from './screens/MainMenuScreen'
import ChallengePopup from './screens/challenge/ChallengePopup'
import ChallengeTopbar from './screens/challenge/ChallengeTopBar'

export default class HUDScene extends Phaser.Scene {
    constructor() {
        super('hud')
    }

    create() {
        new ChallengeTopbar({ scene: this })
        new MainMenuScreen({ scene: this })
        new ChallengePopup({ scene: this, x: CANVAS_WIDTH / 2, y: this.scale.height / 2 })

        new StarManager(this)
    }
}
