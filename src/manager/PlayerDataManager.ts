import Storage from '../Storage'
import { CHALLENGES } from '../constant/Challenges'
import { SETTINGS } from '../constant/Settings'
import { STORAGE_KEY } from '../constant/StorageKey'
import { PlayerData } from '../types/player-data'

const INITIAL_PLAYER_DATA: PlayerData = {
    highScore: 0,
    stars: 0,
    settings: {
        sound: true,
        vibration: false,
        nightMode: false,
    },
    skins: {
        current: 0,
        unlocked: [0],
    },
    challenges: {
        time: 0,
        score: 0,
        bounce: 0,
        noAim: 0,
    },
}

export default class PlayerDataManager {
    public static getPlayerData(): PlayerData {
        try {
            const playerData = Storage.load<PlayerData>(STORAGE_KEY.PLAYER_DATA)
            if (playerData) {
                return playerData
            }
        } catch (error) {
            console.error('Error retrieving player high score:', error)
        }

        return INITIAL_PLAYER_DATA
    }

    public static savePlayerData(playerData: PlayerData): void {
        Storage.save(STORAGE_KEY.PLAYER_DATA, playerData)
    }

    public static getStars(): number {
        return this.getPlayerData().stars
    }

    public static getHighScore(): number {
        return this.getPlayerData().highScore
    }

    public static getCurrentSkin(): number {
        return this.getPlayerData().skins.current
    }

    public static getUnlockedSkins(): number[] {
        return this.getPlayerData().skins.unlocked
    }

    public static setSettings(setting: SETTINGS, value: boolean): void {
        const playerData = this.getPlayerData()

        switch (setting) {
            case SETTINGS.SOUND:
                playerData.settings.sound = value
                break
            case SETTINGS.VIBRATION:
                playerData.settings.vibration = value
                break
            case SETTINGS.NIGHT_MODE:
                playerData.settings.nightMode = value
                break
        }

        this.savePlayerData(playerData)
    }

    public static setChallengeLevel(challenge: CHALLENGES, value: number): void {
        const playerData = this.getPlayerData()

        switch (challenge) {
            case CHALLENGES.TIME:
                playerData.challenges.time = value
                break
            case CHALLENGES.SCORE:
                playerData.challenges.score = value
                break
            case CHALLENGES.BOUNCE:
                playerData.challenges.bounce = value
                break
            case CHALLENGES.NO_AIM:
                playerData.challenges.noAim = value
                break
        }

        this.savePlayerData(playerData)
    }

    public static getChallengeLevel(challenge: CHALLENGES): number {
        const playerData = this.getPlayerData()

        switch (challenge) {
            case CHALLENGES.TIME:
                return playerData.challenges.time
            case CHALLENGES.SCORE:
                return playerData.challenges.score
            case CHALLENGES.BOUNCE:
                return playerData.challenges.bounce
            case CHALLENGES.NO_AIM:
                return playerData.challenges.noAim
        }
    }
}
