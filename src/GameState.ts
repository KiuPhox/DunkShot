export enum GameState {
    PRELOAD = 'PRELOAD',
    READY = 'ready',
    PLAYING = 'playing',
    GAME_OVER = 'game_over',
    PAUSE = 'pause',
    CUSTOMIZE = 'customize',
    CHALLENGES_SELECTION = 'challenges-selection',
    CHALLENGE_READY = 'challenge-ready',
    CHALLENGE_PLAYING = 'challenge-playing',
    CHALLENGE_COMPLETE = 'challenge-complete',
    SETTINGS = 'settings',
}

export enum GameModeState {
    NORMAL,
    CHALLENGE,
}
