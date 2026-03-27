// lib/employeeNav.ts
// Dynamic navigation for the Employee Portal.
// Tabs are shown/hidden based on the RBAC permissions assigned by admin to the employee's role.
//
// PERMISSION MAPPING (admin path → employee portal section):
//   /admin/leads    → My Leads    (/employee/leads)
//   /admin/clients  → My Clients  (/employee/clients)
//   /admin/tickets  → Tickets     (/employee/tickets)
//
// Dashboard is ALWAYS visible regardless of permissions.
// Future sections (attendance, payslips) can be added here without touching page files.

import { useAuth } from './auth';

export interface NavItem {
    href: string;
    label: string;
    icon: string;
    /** Admin permission path required to see this tab (undefined = always visible) */
    requiredPermission?: string;
}

// Full catalogue of employee portal sections
const ALL_EMPLOYEE_NAV: NavItem[] = [
    { href: '/employee',          label: 'Dashboard',  icon: '📊' },      // Always visible
    { href: '/employee/leads',    label: 'My Leads',   icon: '🎯', requiredPermission: '/admin/leads' },
    { href: '/employee/clients',  label: 'My Clients', icon: '🏢', requiredPermission: '/admin/clients' },
    { href: '/employee/tickets',  label: 'Tickets',    icon: '🎫', requiredPermission: '/admin/tickets' },
    // Future: { href: '/employee/attendance', label: 'Attendance', icon: '🗓️', requiredPermission: '/admin/attendance' },
    // Future: { href: '/employee/payslips',   label: 'Payslips',   icon: '💰', requiredPermission: '/admin/payslips' },
];

/**
 * Returns the nav items the current employee is allowed to see.
 * Admin users bypass all permission checks and see every tab.
 */
export function useEmployeeNav(): NavItem[] {
    const { user } = useAuth();

    // Admin can always see everything in every portal
    if (!user || user.role === 'admin') return ALL_EMPLOYEE_NAV;

    return ALL_EMPLOYEE_NAV.filter(item => {
        // No permission required → always show (e.g. Dashboard)
        if (!item.requiredPermission) return true;

        // No permissions assigned yet → show nothing (safe default)
        if (!user.permissions || user.permissions.length === 0) return false;

        return user.permissions.some(
            p => (p.path === '*' || p.path === item.requiredPermission) && p.canView
        );
    });
}

/**
 * Checks if the current user has canView access for a specific admin permission path.
 * Use this in individual page components to guard page-level access.
 */
export function useEmployeePermission(adminPath: string): boolean {
    const { user } = useAuth();
    if (!user) return false;
    if (user.role === 'admin') return true;
    if (!user.permissions || user.permissions.length === 0) return false;
    return user.permissions.some(p => (p.path === '*' || p.path === adminPath) && p.canView);
}
