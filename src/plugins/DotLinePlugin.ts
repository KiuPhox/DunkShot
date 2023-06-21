export default class DotLinePlugin extends Phaser.Plugins.ScenePlugin {
    private dotGroup: Phaser.GameObjects.Group

    constructor(
        scene: Phaser.Scene,
        pluginManger: Phaser.Plugins.PluginManager,
        pluginKey: string
    ) {
        super(scene, pluginManger, pluginKey)
    }

    public init(): void {
        if (this.scene) {
            this.dotGroup = this.scene.add.group({ key: 'dot', frameQuantity: 12 }).setDepth(-2)
            Phaser.Actions.Spread(this.dotGroup.getChildren(), 'scale', 0.2, 0.3)
        }
    }

    public draw(line: Phaser.Geom.Line): void {
        Phaser.Actions.SetAlpha(this.dotGroup.getChildren(), 1)
        Phaser.Actions.PlaceOnLine(this.dotGroup.getChildren(), line)
    }

    public clear(): void {
        Phaser.Actions.SetAlpha(this.dotGroup.getChildren(), 0)
    }
}
