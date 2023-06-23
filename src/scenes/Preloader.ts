import Phaser from 'phaser'

const AUDIO_NAMES = ['shoot', 'kick', 'die', '1']

export default class Preloader extends Phaser.Scene {
    constructor() {
        super('preloader')
    }

    preload() {
        const progress = this.add.graphics()

        const { width, height } = this.scale

        this.load.on('progress', (value: number) => {
            progress.clear()
            progress.fillStyle(0xf2a63b, 1)
            progress.fillRect(0, height * 0.5, width * value, 30)
        })

        this.load.on('complete', () => {
            progress.destroy()
            console.log('Loading complete')
        })
        this.load.spritesheet('ball', 'assets/textures/ball-sheet.png', {
            frameWidth: 232,
        })

        this.load.spritesheet('basket', 'assets/textures/basket-sheet.png', {
            frameWidth: 354,
            frameHeight: 56.5,
        })

        this.load.image('dot', 'assets/textures/dot-sheet.png')
        this.load.image('net', 'assets/textures/net-sheet.png')
        this.load.image('title', 'assets/textures/title-sheet.png')
        this.load.image('reset-btn', 'assets/textures/btnreset-sheet.png')
        this.load.image('settings-btn', 'assets/textures/btnsettings-sheet.png')
        this.load.image('share-btn', 'assets/textures/btnshare-sheet.png')
        this.load.image('e3', 'assets/textures/e3-sheet.png')

        this.load.bitmapFont(
            'objet',
            'assets/fonts/objet-extrabold.png',
            'assets/fonts/objet-extrabold.xml'
        )

        this.loadAudio()
    }

    create() {
        this.scene.start('game').launch('result').launch('main-menu')
    }

    private loadAudio(): void {
        for (const audioName of AUDIO_NAMES) {
            this.load.audio(audioName, `assets/audios/${audioName}.ogg`)
        }
    }
}
