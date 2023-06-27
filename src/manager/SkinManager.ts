import Storage from '../Storage'
import { SPECIAL_COLOR } from '../constant/SkinColor'
import { STORAGE_KEY } from '../constant/StorageKey'

export default class SkinManager {
    private static currentSkin: number

    public static emitter: Phaser.Events.EventEmitter

    public static init(): void {
        this.emitter = new Phaser.Events.EventEmitter()

        this.currentSkin = parseInt(Storage.load(STORAGE_KEY.CURRENT_SKIN))
    }

    public static changeSkin(skinIndex: number): void {
        this.currentSkin = skinIndex
        Storage.save(STORAGE_KEY.CURRENT_SKIN, skinIndex.toString())
        this.emitter.emit('skin-changed', skinIndex)
    }

    public static getCurrentSkinColors(): number[] {
        return SPECIAL_COLOR[this.currentSkin]
    }

    public static getCurrentSkin(): number {
        return this.currentSkin
    }
}
