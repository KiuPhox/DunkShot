export default class String {
    public static lastSplit(str: string, delimiter: string): string[] {
        const lastIndex = str.lastIndexOf(delimiter)
        const first = str.slice(0, lastIndex)
        const second = str.slice(lastIndex + 1)
        return [first, second]
    }
}
