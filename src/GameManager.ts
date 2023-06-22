import { GameState } from './GameState'

export default class GameManager {
    private static gameState: GameState = GameState.READY

    public static emitter: Phaser.Events.EventEmitter

    public static init(): void {
        this.emitter = new Phaser.Events.EventEmitter()
    }

    public static updateGameState(gameState: GameState): void {
        this.gameState = gameState

        switch (this.gameState) {
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

        this.emitter.emit('game-state-changed', this.gameState)
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

    public static getGameState(): GameState {
        return this.gameState
    }
}
