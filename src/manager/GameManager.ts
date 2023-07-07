import { GameState } from '../GameState'

export default class GameManager {
    private static currentState: GameState = GameState.PRELOAD
    private static previousState: GameState = GameState.PRELOAD

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
            case GameState.GAME_OVER:
                this.handleGameOverState(scene)
                break
            case GameState.PAUSE:
                this.handlePauseState(scene)
                break
            case GameState.CUSTOMIZE:
                this.handleCustomizeState(scene)
                break
            case GameState.SETTINGS:
                this.handleSettingsState(scene)
                break
            case GameState.CHALLENGES_SELECTION:
                this.handleChallengesSelectionState(scene)
                break
            case GameState.CHALLENGE_READY:
                this.handleChallengeReadyState(scene)
                break
            case GameState.CHALLENGE_PLAYING:
                this.handleChallengePlayingState(scene)
                break
            case GameState.CHALLENGE_COMPLETE:
                this.handleChallengeComplete(scene)
                break
        }

        this.emitter.emit('game-state-changed', this.currentState, this.previousState)
    }

    private static handleReadyState(scene: Phaser.Scene): void {
        scene.scene.start('game').start('hud')
    }

    private static handlePlayingState(scene: Phaser.Scene): void {
        if (this.previousState === GameState.PAUSE) {
            scene.scene.resume('game')
        }
    }

    private static handleGameOverState(scene: Phaser.Scene): void {
        //
    }

    private static handlePauseState(scene: Phaser.Scene) {
        if (
            this.previousState === GameState.CUSTOMIZE ||
            this.previousState === GameState.SETTINGS
        ) {
            //scene.scene.wake('pause')
        } else if (
            this.previousState === GameState.PLAYING ||
            this.previousState === GameState.CHALLENGE_PLAYING
        ) {
            scene.scene.pause('game')
        }
    }
    private static handleCustomizeState(scene: Phaser.Scene) {
        if (this.previousState === GameState.READY) {
            //scene.scene.stop('game').stop('result').start('customize')
        } else if (this.previousState === GameState.PAUSE) {
            // scene.scene.sleep().launch('customize')
        }
    }

    private static handleSettingsState(scene: Phaser.Scene) {
        if (this.previousState === GameState.GAME_OVER) {
            //
        } else if (this.previousState === GameState.READY) {
            scene.scene.stop('game')
        } else if (this.previousState === GameState.PAUSE) {
            //scene.scene.sleep('pause')
        }
    }

    private static handleChallengesSelectionState(scene: Phaser.Scene) {
        //scene.scene.stop('game').stop('result')
    }

    private static handleChallengeReadyState(scene: Phaser.Scene) {
        //scene.scene.stop('game').start('game').launch('hud')
        scene.scene.start('game').start('hud')
    }

    private static handleChallengePlayingState(scene: Phaser.Scene) {
        if (this.previousState === GameState.PAUSE) {
            scene.scene.resume('game')
        }
    }

    private static handleChallengeComplete(scene: Phaser.Scene) {
        //throw new Error('Method not implemented.')
    }

    public static getCurrentState(): GameState {
        return this.currentState
    }

    public static getPreviousState(): GameState {
        return this.previousState
    }
}
