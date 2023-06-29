export interface PlayerData {
    highScore: number
    stars: number
    skins: {
        current: number
        unlocked: number[]
    }
    settings: {
        sound: boolean
        vibration: boolean
        nightMode: boolean
    }
}
