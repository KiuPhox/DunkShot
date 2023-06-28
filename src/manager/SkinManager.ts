import Storage from '../Storage'
import { SPECIAL_EFFECTS } from '../constant/Skin'
import { STORAGE_KEY } from '../constant/StorageKey'

export default class SkinManager {
    private static currentSkin: number
    private static unlockedSkins: number[] = []

    public static emitter: Phaser.Events.EventEmitter

    public static init(): void {
        this.emitter = new Phaser.Events.EventEmitter()

        this.currentSkin = Storage.getInt(STORAGE_KEY.CURRENT_SKIN)
        this.unlockedSkins = Storage.getArray(STORAGE_KEY.UNLOCKED_SKIN)

        if (this.unlockedSkins.length === 0) {
            this.unlockedSkins = [0]
        }
    }

    public static unlockSkin(skin: number): void {
        this.unlockedSkins.push(skin)
        Storage.setArray(STORAGE_KEY.UNLOCKED_SKIN, this.unlockedSkins)
    }

    public static changeSkin(skinIndex: number): void {
        this.currentSkin = skinIndex
        Storage.setNumber(STORAGE_KEY.CURRENT_SKIN, skinIndex)
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
