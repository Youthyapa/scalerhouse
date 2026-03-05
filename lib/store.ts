// lib/store.ts
// Temporary shim to fix build errors from remaining components that import store.ts
// These should eventually be refactored to use lib/api.ts or database directly

export const KEYS = {
    LEAD: 'sh_leads',
    LEADS: 'sh_leads',
    CLIENT: 'sh_clients',
    CLIENTS: 'sh_clients',
    AFFILIATE: 'sh_affiliates',
    AFFILIATES: 'sh_affiliates',
    EMPLOYEE: 'sh_employees',
    EMPLOYEES: 'sh_employees',
    ACTIVITY: 'sh_activity',
    ACTIVITIES: 'sh_activity',
    TICKET: 'sh_tickets',
    TICKETS: 'sh_tickets',
    SERVICE: 'sh_services',
    SERVICES: 'sh_services',
    PROPOSAL: 'sh_proposals',
    PROPOSALS: 'sh_proposals',
    OFFER: 'sh_offers',
    OFFERS: 'sh_offers',
    CAREER: 'sh_careers',
    CAREERS: 'sh_careers',
    BLOG: 'sh_blog',
    BLOGS: 'sh_blog',
    SETTINGS: 'sh_settings',
    SERVICE_PACKAGES: 'sh_service_packages'
};

// Exporting types as any to satisfy TypeScript during build
export type Lead = { id: string;[key: string]: any };
export type Client = { id: string;[key: string]: any };
export type Affiliate = { id: string;[key: string]: any };
export type Employee = { id: string;[key: string]: any };
export type ActivityLog = { id: string;[key: string]: any };
export type Ticket = { id: string;[key: string]: any };
export type ServicePackage = { id: string;[key: string]: any };
export type Proposal = { id: string;[key: string]: any };
export type Offer = { id: string;[key: string]: any };
export type Career = { id: string;[key: string]: any };
export type BlogPost = { id: string;[key: string]: any };

export function getAll<T>(key: string): T[] {
    if (typeof window === 'undefined') return [];
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : [];
    } catch {
        return [];
    }
}

export function saveAll<T>(key: string, data: T[]) {
    if (typeof window !== 'undefined') {
        localStorage.setItem(key, JSON.stringify(data));
    }
}

export function addItem<T>(key: string, item: T) {
    const list = getAll<T>(key);
    list.push(item);
    saveAll(key, list);
}

export function updateItem<T extends { id: string }>(key: string, id: string, data: Partial<T>) {
    const list = getAll<T>(key);
    const index = list.findIndex(i => i.id === id);
    if (index > -1) {
        list[index] = { ...list[index], ...data };
        saveAll(key, list);
    }
}

export function deleteItem<T extends { id: string }>(key: string, id: string) {
    const list = getAll<T>(key);
    saveAll(key, list.filter(i => i.id !== id));
}

export function genId(): string {
    return 'sh_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

export function logActivity(message: string, actor: string) {
    const log = { id: genId(), message, actor, timestamp: Date.now() };
    addItem(KEYS.ACTIVITY, log);
}