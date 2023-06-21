import Phaser from 'phaser'

const AUDIO_NAMES = ['shoot']

export default class Preloader extends Phaser.Scene {
    constructor() {
        super('preloader')
    }

    preload() {
        //
        this.load.on('complete', () => {
            console.log('Loading complete')
        })
        this.load.spritesheet('ball', 'assets/textures/ball-sheet.png', {
            frameWidth: 232,
        })

        this.load.spritesheet('basket', 'assets/textures/basket-sheet.png', {
            frameWidth: 354,
            frameHeight: 113,
        })

        this.load.image('dot', 'assets/textures/dot-sheet.png')
        this.load.image('net', 'assets/textures/net-sheet.png')

        this.loadAudio()
    }

    create() {
        this.scene.start('game')
    }

    private loadAudio(): void {
        for (const audioName in AUDIO_NAMES) {
            this.load.audio(audioName, `assets/audios/${audioName}.ogv`)
        }
    }
}
