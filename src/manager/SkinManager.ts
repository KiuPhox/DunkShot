import { SPECIAL_COLOR } from '../constant/SkinColor'

export default class SkinManager {
    private static currentSkin: number

    public static emitter: Phaser.Events.EventEmitter

    public static init(): void {
        this.emitter = new Phaser.Events.EventEmitter()

        this.currentSkin = 0

        const temp = localStorage.getItem('currentSkin')
        if (temp !== null) {
            this.currentSkin = parseInt(temp)
        }
    }

    public static changeSkin(skinIndex: number): void {
        this.currentSkin = skinIndex
        localStorage.setItem('currentSkin', skinIndex.toString())
        this.emitter.emit('skin-changed', skinIndex)
    }

    public static getCurrentSkinColors(): number[] {
        return SPECIAL_COLOR[this.currentSkin]
    }

    public static getCurrentSkin(): number {
        return this.currentSkin
    }
}
