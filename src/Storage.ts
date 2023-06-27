import { STORAGE_KEY } from './constant/StorageKey'

export default class Storage {
    public static save(key: STORAGE_KEY, value: string): void {
        try {
            localStorage.setItem(key, value)
        } catch (error) {
            console.error(`Error saving ${key}:`, error)
        }
    }

    public static load(key: STORAGE_KEY): string {
        try {
            const value = localStorage.getItem(key)
            if (value !== null) {
                return value
            }
        } catch (error) {
            console.error(`Error load ${key}:`, error)
        }
        return '0'
    }
}
