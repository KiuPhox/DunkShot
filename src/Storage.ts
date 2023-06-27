import { STORAGE_KEY } from './constant/StorageKey'

export default class Storage {
    public static setString(key: STORAGE_KEY, value: string): void {
        try {
            localStorage.setItem(key, value)
        } catch (error) {
            console.error(`Error saving ${key}:`, error)
        }
    }

    public static getString(key: STORAGE_KEY): string {
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

    public static setNumber(key: STORAGE_KEY, value: number): void {
        try {
            localStorage.setItem(key, value.toString())
        } catch (error) {
            console.error(`Error saving ${key}:`, error)
        }
    }

    public static getInt(key: STORAGE_KEY): number {
        try {
            const value = localStorage.getItem(key)
            if (value !== null) {
                return parseInt(value)
            }
        } catch (error) {
            console.error(`Error load ${key}:`, error)
        }
        return 0
    }

    public static getFloat(key: STORAGE_KEY): number {
        try {
            const value = localStorage.getItem(key)
            if (value !== null) {
                return parseFloat(value)
            }
        } catch (error) {
            console.error(`Error load ${key}:`, error)
        }
        return 0
    }

    public static setArray<T>(key: STORAGE_KEY, value: T[]): void {
        try {
            localStorage.setItem(key, JSON.stringify(value))
        } catch (error) {
            console.error('Error saving array:', error)
        }
    }

    public static getArray<T>(key: STORAGE_KEY): T[] {
        try {
            const serializedArray = localStorage.getItem(key)
            if (serializedArray !== null) {
                return JSON.parse(serializedArray)
            }
        } catch (error) {
            console.error('Error retrieving array:', error)
        }
        return []
    }
}
