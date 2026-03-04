type Store = Record<string, any>

export const KEYS = {
    ACTIVITY: "activity_logs"
}

export interface ActivityLog {
    action: string
    user: string
    time: string
}

export function getAll<T>(key: string): T[] {
    if (typeof window === "undefined") return []
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) : []
}

export function saveAll<T>(key: string, data: T[]) {
    if (typeof window === "undefined") return
    localStorage.setItem(key, JSON.stringify(data))
}