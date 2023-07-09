import PlayerDataManager from './PlayerDataManager'

export default class StarManager {
    private static currentStar: number

    public static emitter: Phaser.Events.EventEmitter

    public static init() {
        this.currentStar = PlayerDataManager.getStars()
        this.emitter = new Phaser.Events.EventEmitter()
    }

    public static updateStar(star: number) {
        this.currentStar = star
        this.emitter.emit('star-updated', star)

        const playerData = PlayerDataManager.getPlayerData()
        playerData.stars = star
        PlayerDataManager.savePlayerData(playerData)
    }

    public static increaseStar() {
        this.updateStar(this.currentStar + 1)
    }

    public static getCurrentStar(): number {
        return this.currentStar
    }
}
