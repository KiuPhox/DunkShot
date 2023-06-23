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
