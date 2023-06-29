import { SPECIAL_EFFECTS } from '../constant/Skin'
import PlayerDataManager from './PlayerDataManager'

export default class SkinManager {
    private static currentSkin: number
    private static unlockedSkins: number[] = []

    public static emitter: Phaser.Events.EventEmitter

    public static init(): void {
        this.emitter = new Phaser.Events.EventEmitter()
        this.currentSkin = PlayerDataManager.getCurrentSkin()
        this.unlockedSkins = PlayerDataManager.getUnlockedSkins()

        if (this.unlockedSkins.length === 0) {
            this.unlockedSkins = [0]
        }
    }

    public static unlockSkin(skin: number): void {
        this.unlockedSkins.push(skin)

        const playerData = PlayerDataManager.getPlayerData()
        playerData.skins.unlocked = this.unlockedSkins
        PlayerDataManager.savePlayerData(playerData)
    }

    public static changeSkin(skinIndex: number): void {
        this.currentSkin = skinIndex

        const playerData = PlayerDataManager.getPlayerData()
        playerData.skins.current = skinIndex
        PlayerDataManager.savePlayerData(playerData)

        this.emitter.emit('skin-changed', skinIndex)
    }

    public static getCurrentSkinColors(): number[] {
        return SPECIAL_EFFECTS[this.currentSkin].colors
    }

    public static getCurrentSkin(): number {
        return this.currentSkin
    }

    public static getUnlockedSkins(): number[] {
        return this.unlockedSkins
    }
}
