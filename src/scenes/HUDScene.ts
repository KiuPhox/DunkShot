import { GameState } from '../GameState'
import { CANVAS_WIDTH } from '../constant/CanvasSize'
import GameManager from '../manager/GameManager'
import StarManager from '../manager/StarManager'
import CustomizeScreen from './screens/CustomizeScreen'
import MainMenuScreen from './screens/MainMenuScreen'
import PauseScreen from './screens/PauseScreen'
import ResultScreen from './screens/ResultScreen'
import ScoreScreen from './screens/ScoreScreen'
import SettingsScreen from './screens/SettingsScreen'
import ChallengePopup from './screens/challenge/ChallengePopup'
import ChallengeSelection from './screens/challenge/ChallengeSelection'
import ChallengeTopbar from './screens/challenge/ChallengeTopBar'

export default class HUDScene extends Phaser.Scene {
    private challengeTopbar: ChallengeTopbar
    private challengeSelection: ChallengeSelection
    private challengePopup: ChallengePopup

    private mainMenu: MainMenuScreen
    private result: ResultScreen
    private settings: SettingsScreen
    private pause: PauseScreen
    private customize: CustomizeScreen
    private score: ScoreScreen

    constructor() {
        super('hud')
    }

    create() {
        this.initScreens()
        GameManager.emitter.on('game-state-changed', this.onGameStateChanged)
        this.events.on('shutdown', () => {
            GameManager.emitter.off('game-state-changed', this.onGameStateChanged)
        })
    }

    private initScreens(): void {
        this.challengeTopbar = new ChallengeTopbar({ scene: this })
        this.challengeTopbar.setVisible(GameManager.getCurrentState() === GameState.CHALLENGE_READY)

        this.challengeSelection = new ChallengeSelection({ scene: this })
        this.challengeSelection.setVisible(false)

        this.challengePopup = new ChallengePopup({
            scene: this,
            x: CANVAS_WIDTH / 2,
            y: this.scale.height / 2,
        })

        this.score = new ScoreScreen({ scene: this }).setVisible(
            GameManager.getCurrentState() !== GameState.CHALLENGE_READY
        )
        this.mainMenu = new MainMenuScreen({ scene: this })
        this.result = new ResultScreen({ scene: this })
        this.settings = new SettingsScreen({ scene: this }).setVisible(false)
        this.pause = new PauseScreen({ scene: this }).setVisible(false)
        this.customize = new CustomizeScreen({ scene: this }).setVisible(false)

        new StarManager(this)
    }

    private onGameStateChanged = (gameState: GameState, previousState: GameState) => {
        if (gameState === GameState.PLAYING) {
            this.mainMenu.setVisible(true)
        } else if (gameState === GameState.PAUSE) {
            this.pause.setVisible(true)
            this.mainMenu.setVisible(false)
        } else if (gameState === GameState.SETTINGS) {
            this.mainMenu.setVisible(false)
            this.settings.setVisible(true)
            this.result.setVisible(false)
        } else if (gameState === GameState.CHALLENGES_SELECTION) {
            this.challengeSelection.setVisible(true)
            this.score.setVisible(false)
            this.mainMenu.setVisible(false)
        } else if (gameState === GameState.CHALLENGE_READY) {
            this.challengePopup.setVisible(true)
            this.challengeSelection.setVisible(false)
            this.challengeTopbar.setVisible(true)
        } else if (gameState === GameState.GAME_OVER) {
            this.result.setVisible(true)
            this.mainMenu.setVisible(false)
        } else if (gameState === GameState.CUSTOMIZE) {
            this.customize.setVisible(true)
            this.mainMenu.setVisible(false)
        }

        if (previousState === GameState.SETTINGS) {
            this.settings.setVisible(false)
        } else if (previousState === GameState.PAUSE) {
            this.pause.setVisible(false)
        } else if (previousState === GameState.CUSTOMIZE) {
            this.customize.setVisible(false)
        }
    }

    update(time: number, delta: number): void {
        this.customize.update()
    }
}
