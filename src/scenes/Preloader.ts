import Phaser from 'phaser'

const AUDIO_NAMES = ['shoot', 'kick', 'die', '1']

export default class Preloader extends Phaser.Scene {
    constructor() {
        super('preloader')
    }

    preload() {
        const { width, height } = this.scale
        const progress = this.add.graphics()

        const progressText = this.add
            .text(width * 0.5, height * 0.45, '0%', {
                fontFamily: 'AkzidenzGrotesk',
                fontSize: '36px',
                color: '#f2a63b',
            })
            .setOrigin()

        this.load.on('progress', (value: number) => {
            progress.clear()
            progress.fillStyle(0xf2a63b, 1)
            progress.fillRect(0, height * 0.5, width * value, 30)
            progressText.setText(Math.round(value * 100).toString() + '%')
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

        this.load.spritesheet('help', 'assets/textures/help-sheet.png', {
            frameWidth: 215,
            frameHeight: 1960 / 6,
        })

        this.load.image('dot', 'assets/textures/dot-sheet.png')
        this.load.image('net', 'assets/textures/net-sheet.png')
        this.load.image('title', 'assets/textures/title-sheet.png')

        // Buttons
        this.load.image('reset-btn', 'assets/textures/btnreset-sheet.png')
        this.load.image('settings-btn', 'assets/textures/btnsettings-sheet.png')
        this.load.image('share-btn', 'assets/textures/btnshare-sheet.png')
        this.load.image('pause-btn', 'assets/textures/btnpause-sheet.png')
        this.load.image('resume-btn', 'assets/textures/btnresume-sheet.png')
        this.load.image('mainmenu-btn', 'assets/textures/btnmainmenu-sheet.png')

        // Effects
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
