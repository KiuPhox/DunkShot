import { GameModeState, GameState } from '../GameState'

export default class GameManager {
    private static currentState: GameState = GameState.PRELOAD
    private static previousState: GameState = GameState.PRELOAD
    private static gameModeState: GameModeState = GameModeState.NORMAL

    public static emitter: Phaser.Events.EventEmitter

    public static init(): void {
        this.emitter = new Phaser.Events.EventEmitter()
    }

    public static updateGameState(gameState: GameState, scene: Phaser.Scene): void {
        if (this.currentState === gameState) return
        this.previousState = this.currentState
        this.currentState = gameState

        switch (this.currentState) {
            case GameState.READY:
                this.handleReadyState(scene)
                break
            case GameState.PLAYING:
                this.handlePlayingState(scene)
                break
            case GameState.PAUSE:
                this.handlePauseState(scene)
                break
            case GameState.SETTINGS:
                this.handleSettingsState(scene)
                break
            case GameState.CHALLENGE_READY:
                this.handleChallengeReadyState(scene)
                break
            case GameState.CHALLENGE_PLAYING:
                this.handleChallengePlayingState(scene)
                break
        }

        this.emitter.emit('game-state-changed', this.currentState, this.previousState)
    }

    private static handleReadyState(scene: Phaser.Scene): void {
        scene.scene.start('game').start('hud')
    }

    private static handlePlayingState(scene: Phaser.Scene): void {
        this.gameModeState = GameModeState.NORMAL
        if (this.previousState === GameState.PAUSE) {
            scene.scene.resume('game')
        }
    }

    private static handlePauseState(scene: Phaser.Scene) {
        if (
            this.previousState === GameState.PLAYING ||
            this.previousState === GameState.CHALLENGE_PLAYING
        ) {
            scene.scene.pause('game')
        }
    }

    private static handleSettingsState(scene: Phaser.Scene) {
        if (this.previousState === GameState.READY) {
            scene.scene.stop('game')
        }
    }

    private static handleChallengeReadyState(scene: Phaser.Scene) {
        scene.scene.start('game').start('hud')
    }

    private static handleChallengePlayingState(scene: Phaser.Scene) {
        this.gameModeState = GameModeState.CHALLENGE
        if (this.previousState === GameState.PAUSE) {
            scene.scene.resume('game')
        }
    }

    public static getCurrentState(): GameState {
        return this.currentState
    }

    public static getPreviousState(): GameState {
        return this.previousState
    }

    public static getGameModeState(): GameModeState {
        return this.gameModeState
    }
}
