import Storage from '../Storage'
import { SPECIAL_COLOR } from '../constant/SkinColor'
import { STORAGE_KEY } from '../constant/StorageKey'

export default class SkinManager {
    private static currentSkin: number
    private static unlockedSkins: number[] = []

    public static emitter: Phaser.Events.EventEmitter

    public static init(): void {
        this.emitter = new Phaser.Events.EventEmitter()

        this.currentSkin = Storage.getInt(STORAGE_KEY.CURRENT_SKIN)
        this.unlockedSkins = JSON.parse(Storage.getString(STORAGE_KEY.UNLOCKED_SKIN))
    }

    public static unlockedSkin(skin: number): void {
        this.unlockedSkins.push(skin)
    }

    public static changeSkin(skinIndex: number): void {
        this.currentSkin = skinIndex
        Storage.setNumber(STORAGE_KEY.CURRENT_SKIN, skinIndex)
        this.emitter.emit('skin-changed', skinIndex)
    }

    public static getCurrentSkinColors(): number[] {
        return SPECIAL_COLOR[this.currentSkin]
    }

    public static getCurrentSkin(): number {
        return this.currentSkin
    }
}
