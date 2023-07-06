import ChallengeTopbar from '../../scenes/global-scene/screens/challenge/ChallengeTopBar'

export default class Timer {
    private duration: number
    private onCompleteCallback: (() => void) | undefined
    private active: boolean

    public current: number

    constructor(duration: number, active: boolean, onCompleteCallback?: () => void) {
        this.duration = duration
        this.current = duration
        this.active = active
        this.onCompleteCallback = onCompleteCallback
    }

    public setDuration(duration: number): void {
        this.duration = duration
        this.current = duration
    }

    public setActive(active: boolean): void {
        this.active = active
    }

    public tick(delta: number): void {
        if (this.active && this.current >= 0) {
            this.current -= delta / 1000
            ChallengeTopbar.setGoal(this.current.toFixed(2))

            if (this.current <= 0 && this.onCompleteCallback) {
                ChallengeTopbar.setGoal('0.00')
                this.onCompleteCallback()
            }
        }
    }

    public reset(): void {
        this.current = this.duration
    }
}
