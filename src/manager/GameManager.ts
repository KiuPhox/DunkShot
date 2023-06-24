import { GameState } from '../GameState'

export default class GameManager {
    private static currentState: GameState = GameState.READY
    private static previousState: GameState = GameState.READY

    public static emitter: Phaser.Events.EventEmitter

    public static init(): void {
        this.emitter = new Phaser.Events.EventEmitter()
    }

    public static updateGameState(gameState: GameState): void {
        this.previousState = this.currentState
        this.currentState = gameState

        switch (this.currentState) {
            case GameState.READY:
                this.handleReadyState()
                break
            case GameState.PLAYING:
                this.handlePlayingState()
                break
            case GameState.GAME_OVER:
                this.handleGameOverState()
                break
        }

        this.emitter.emit('game-state-changed', this.currentState)
    }

    private static handleReadyState(): void {
        //
    }

    private static handlePlayingState(): void {
        //
    }

    private static handleGameOverState(): void {
        //
    }

    public static getCurrentState(): GameState {
        return this.currentState
    }

    public static getPreviousState(): GameState {
        return this.previousState
    }
}
