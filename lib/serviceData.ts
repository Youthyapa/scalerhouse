// lib/serviceData.ts
import { CORE_SERVICES } from './serviceData.core';
import { NEW_SERVICES } from './serviceData.new';

export const ALL_SERVICES = [...CORE_SERVICES, ...NEW_SERVICES];

export function getServiceBySlug(slug: string) {
    return ALL_SERVICES.find((s) => s.slug === slug);
}
