// lib/auth.tsx
// Updated to use real JWT API instead of hardcoded passwords
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiLogin, apiLogout } from './api';
import { useRouter } from 'next/router';

interface AuthUser {
    email: string;
    role: 'admin' | 'employee' | 'client' | 'affiliate';
    roleName?: string;
    permissions?: any[];
    entityId: string;
    name: string;
}

interface AuthContextType {
    user: AuthUser | null;
    login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Restore session from localStorage on page load
        const saved = localStorage.getItem('sh_auth_user');
        if (saved) {
            try { setUser(JSON.parse(saved)); } catch { }
        }
        setIsLoading(false);
    }, []);

    async function login(email: string, password: string): Promise<{ success: boolean; message: string }> {
        try {
            const data = await apiLogin(email, password);
            const authUser: AuthUser = {
                email: data.user.email,
                role: data.user.role,
                roleName: data.user.roleName,
                permissions: data.user.permissions,
                entityId: data.user.entityId,
                name: data.user.name,
            };
            setUser(authUser);
            localStorage.setItem('sh_auth_user', JSON.stringify(authUser));
            return { success: true, message: 'Login successful.' };
        } catch (err: any) {
            return { success: false, message: err.message || 'Login failed.' };
        }
    }

    function logout() {
        setUser(null);
        localStorage.removeItem('sh_auth_user');
        localStorage.removeItem('sh_token');
        apiLogout();
    }

    return (
        <AuthContext.Provider value={{ user, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be inside AuthProvider');
    return ctx;
}

// HOC: Role guard — same as before
export function withAuth(
    Component: React.ComponentType,
    allowedRoles: AuthUser['role'][]
) {
    return function GuardedPage(props: object) {
        const { user, isLoading } = useAuth();
        const [mounted, setMounted] = useState(false);
        const router = useRouter();

        useEffect(() => { setMounted(true); }, []);

        if (!mounted || isLoading) {
            return (
                <div className="min-h-screen flex items-center justify-center" style={{ background: '#0a1628' }}>
                    <div className="text-center">
                        <div className="w-12 h-12 border-2 border-t-transparent border-blue-500 rounded-full animate-spin mx-auto mb-4" />
                        <p className="text-slate-400">Loading...</p>
                    </div>
                </div>
            );
        }

        if (!user) {
            if (typeof window !== 'undefined') window.location.href = '/login';
            return null;
        }

        // Hard role check
        if (!allowedRoles.includes(user.role)) {
            return (
                <div className="min-h-screen flex items-center justify-center" style={{ background: '#0a1628' }}>
                    <div className="text-center glass-card p-10">
                        <div className="text-6xl mb-4">🔒</div>
                        <h1 className="text-2xl font-bold text-white mb-2">Access Denied</h1>
                        <p className="text-slate-400 mb-6">You don&apos;t have permission to view this page.</p>
                        <a href="/" className="btn-glow">Go Home</a>
                    </div>
                </div>
            );
        }

        // Granular permission check for admin panel paths (unless they are Super Admin)
        if (router.pathname.startsWith('/admin') && user.role !== 'admin') {
            const isSuperAdmin = user.permissions?.some(p => p.path === '*' && p.canView);
            if (!isSuperAdmin) {
                const pathParts = router.pathname.split('/');
                const baseRoute = pathParts.length > 2 ? `/${pathParts[1]}/${pathParts[2]}` : router.pathname; // /admin/clients/[id] -> /admin/clients
                
                const hasAccess = user.permissions?.some(p => p.path === baseRoute && p.canView);
                if (!hasAccess && baseRoute !== '/admin') { // Let everyone see dashboard if they got past role check
                    return (
                        <div className="min-h-screen flex items-center justify-center" style={{ background: '#0a1628' }}>
                            <div className="text-center glass-card p-10">
                                <div className="text-6xl mb-4">🛡️</div>
                                <h1 className="text-2xl font-bold text-white mb-2">Restricted Area</h1>
                                <p className="text-slate-400 mb-6">Your role ({user.roleName}) does not have view access for this section.</p>
                                <a href="/admin" className="btn-glow">Go back</a>
                            </div>
                        </div>
                    );
                }
            }
        }

        return <Component {...props} />;
    };
}
