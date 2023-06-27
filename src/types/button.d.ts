export type IButton = {
    scene: Phaser.Scene
    x: number
    y: number
    texture: string
    scale: number
    pointerDownCallback?: () => void
    pointerUpCallback?: () => void
    frame?: string | number | undefined
}

export type ISwitchButton = {
    scene: Phaser.Scene
    x: number
    y: number
    textureOn: string
    textureOff: string
    frameOn?: number
    frameOff?: number
    scale: number
    pointerDownCallback?: () => void
    pointerUpCallback?: () => void
}
