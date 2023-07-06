import Phaser from 'phaser'
import { CANVAS_WIDTH } from '../constant/CanvasSize'
import { CHALLENGES, CHALLENGES_CONFIG } from '../constant/Challenges'

export default class PreloadScene extends Phaser.Scene {
    constructor() {
        super('preload')
    }

    preload() {
        const progress = this.add.graphics()

        const progressText = this.add
            .text(CANVAS_WIDTH * 0.5, this.scale.height * 0.45, '0%', {
                fontFamily: 'AkzidenzGrotesk',
                fontSize: '36px',
                color: '#f2a63b',
            })
            .setOrigin()

        this.load.on('progress', (value: number) => {
            progress.clear()
            progress.fillStyle(0xf2a63b, 1)
            progress.fillRect(0, this.scale.height * 0.5, CANVAS_WIDTH * value, 30)
            progressText.setText(Math.round(value * 100).toString() + '%')
        })

        this.load.on('complete', () => {
            progress.destroy()
            this.scene.start('game').launch('result').launch('hud')
            console.log('Loading complete')
        })

        this.load.spritesheet('ball', 'assets/textures/balls-atlas.png', {
            frameWidth: 210,
            frameHeight: 210,
        })

        this.load.spritesheet('basket', 'assets/textures/basket-sheet.png', {
            frameWidth: 354,
            frameHeight: 56.5,
        })

        this.load.spritesheet('help', 'assets/textures/help-sheet.png', {
            frameWidth: 215,
            frameHeight: 1960 / 6,
        })

        this.load.spritesheet('tail', 'assets/textures/tails-atlas.png', {
            frameWidth: 261,
            frameHeight: 261,
        })

        this.load.image('net', 'assets/textures/net.png')
        this.load.image('logo', 'assets/textures/logo.png')
        this.load.image('star', 'assets/textures/star.png')
        this.load.image('mini-wall', 'assets/textures/obstacles/miniwall.png')
        this.load.image('bouncer', 'assets/textures/obstacles/bouncer.png')
        this.load.image('shield', 'assets/textures/obstacles/shield_2.png')

        // Shop
        this.load.image('item', 'assets/textures/shop/item.png')
        this.load.image('shop-line', 'assets/textures/shop/shop-line.png')
        this.load.image('top-ornament', 'assets/textures/shop/top-ornament.png')

        // Buttons
        this.load.image('reset-btn', 'assets/textures/btnreset.png')
        this.load.image('settings-btn', 'assets/textures/btnsettings.png')
        this.load.image('settings-mainmenu-btn', 'assets/textures/btnsettings-mainmenu.png')
        this.load.image('settings-pause-btn', 'assets/textures/btnsettings-pause.png')
        this.load.image('share-btn', 'assets/textures/btnshare.png')
        this.load.image('pause-btn', 'assets/textures/btnpause.png')
        this.load.image('resume-btn', 'assets/textures/btnresume.png')
        this.load.image('mainmenu-btn', 'assets/textures/btnmainmenu.png')
        this.load.image('customize-mainmenu-btn', 'assets/textures/btncustomize-mainmenu.png')
        this.load.image('customize-btn', 'assets/textures/btncustomize.png')
        this.load.image('challenges-btn', 'assets/textures/btnchallenges.png')
        this.load.image('back-btn', 'assets/textures/btnback.png')
        this.load.image('cleardata-btn', 'assets/textures/btncleardata.png')
        this.load.image('unlimited-btn', 'assets/textures/btnunlimited.png')

        this.load.spritesheet('rounded-btn', 'assets/textures/btnrounded-sheet.png', {
            frameHeight: 122,
            frameWidth: 224,
        })

        this.load.image('time', 'assets/textures/challenges/time.png')
        this.load.image('score', 'assets/textures/challenges/score.png')
        this.load.image('bounce', 'assets/textures/challenges/bounce.png')
        this.load.image('no-aim', 'assets/textures/challenges/no-aim.png')
        this.load.image('challenge-popup', 'assets/textures/challenges/popup.png')
        this.load.image('challenge-btn', 'assets/textures/challenges/btn.png')
        this.load.image('challenge-popup-bg', 'assets/textures/challenges/bg.png')

        // Effects
        this.load.image('e3', 'assets/textures/e3.png')
        this.load.image('e4', 'assets/textures/e4.png')
        this.load.image('circle', 'assets/textures/circle.png')

        this.load.bitmapFont('triomphe', 'assets/fonts/triomphe.png', 'assets/fonts/triomphe.xml')

        this.loadAudio()
        this.loadChallengeLevels()
    }

    private loadAudio(): void {
        for (let i = 1; i <= 10; i++) {
            this.load.audio(i.toString(), `assets/audios/notes/${i}.mp3`)
        }

        this.load.audio('star', `assets/audios/star.mp3`)
        this.load.audio('wall-hit', `assets/audios/wall-hit.mp3`)
        this.load.audio('combo-start', `assets/audios/combo-start.mp3`)
        this.load.audio('combo-shoot', `assets/audios/combo-shoot.mp3`)
        this.load.audio('combo-hit', `assets/audios/combo-hit.mp3`)
        this.load.audio('release', `assets/audios/release.mp3`)
        this.load.audio('game-over', `assets/audios/game-over.mp3`)
    }

    private loadChallengeLevels(): void {
        for (let i = 1; i <= CHALLENGES_CONFIG[CHALLENGES.TIME].levels; i++) {
            this.load.tilemapTiledJSON(`time-${i}`, `assets/challenges/time/${i}.json`)
        }

        for (let i = 1; i <= CHALLENGES_CONFIG[CHALLENGES.SCORE].levels; i++) {
            this.load.tilemapTiledJSON(`score-${i}`, `assets/challenges/score/${i}.json`)
        }

        for (let i = 1; i <= CHALLENGES_CONFIG[CHALLENGES.BOUNCE].levels; i++) {
            this.load.tilemapTiledJSON(`bounce-${i}`, `assets/challenges/bounce/${i}.json`)
        }

        for (let i = 1; i <= CHALLENGES_CONFIG[CHALLENGES.NO_AIM].levels; i++) {
            this.load.tilemapTiledJSON(`no-aim-${i}`, `assets/challenges/no-aim/${i}.json`)
        }
    }
}
