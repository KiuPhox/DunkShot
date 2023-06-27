import { ISwitchButton } from '../../types/button'
import Button from './Button'

export default class SwitchButton extends Button {
    private s: ISwitchButton

    private isOn: boolean

    constructor(s: ISwitchButton) {
        super({
            scene: s.scene,
            x: s.x,
            y: s.y,
            texture: s.textureOn,
            frame: s.frameOn,
            scale: s.scale,
            pointerUpCallback: s.pointerUpCallback,
            pointerDownCallback: s.pointerDownCallback,
        })
        this.isOn = true
        this.s = s
    }

    public setActive(value: boolean): this {
        this.isOn = value
        if (value) {
            this.setTexture(this.s.textureOn, this.s.frameOn)
        } else {
            this.setTexture(this.s.textureOff, this.s.frameOff)
        }
        return this
    }

    public toggle(): void {
        this.setActive(!this.isOn)
    }

    public getActive(): boolean {
        return this.isOn
    }
}
