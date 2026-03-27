// components/layout/DashboardLayout.tsx
import { useState, useEffect, ReactNode } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { LogOut, Menu, X, Bell } from 'lucide-react';
import { useAuth } from '../../lib/auth';

interface NavItem {
    href: string;
    label: string;
    icon: ReactNode;
}

interface Props {
    navItems: NavItem[];
    children: ReactNode;
    title: string;
    roleBadge?: string;
    roleBadgeClass?: string;
}

export default function DashboardLayout({ navItems, children, title, roleBadge, roleBadgeClass = 'badge-blue' }: Props) {
    const { user, logout } = useAuth();
    const router = useRouter();
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleLogout = () => {
        logout();
        router.push('/login');
    };

    return (
        <div className="flex min-h-screen bg-[#0a1628]">
            {/* Sidebar */}
            <aside className={`sidebar ${mobileOpen ? 'open' : ''} transition-transform duration-300 flex flex-col`}>
                {/* Brand + User */}
                <div className="p-5 border-b border-white/5 shrink-0">
                    <Link href="/" className="flex items-center gap-2.5 -my-6 relative -left-3">
                        <img src="/logo.png" alt="ScalerHouse Logo" className="h-auto w-[160px] object-contain" />
                    </Link>
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center text-white text-xs font-bold">
                            {user?.name?.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                            <p className="text-white text-xs font-medium">{user?.name}</p>
                            <span className={`badge ${roleBadgeClass} text-[10px]`}>{roleBadge || user?.role}</span>
                        </div>
                    </div>
                </div>

                {/* Scrollable Nav – scrollbar hidden */}
                <nav className="flex-1 overflow-y-auto py-4" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                    {navItems.filter(item => {
                        if (user?.role === 'admin') return true;
                        if (!user?.permissions) return false;
                        if (item.href === '/admin') return true; // Everyone who can login can see dashboard base
                        const isSuperAdmin = user.permissions.some(p => p.path === '*' && p.canView);
                        if (isSuperAdmin) return true;
                        
                        const perm = user.permissions.find(p => p.path === item.href);
                        return perm ? perm.canView : false;
                    }).map((item) => {
                        const active = item.href === '/admin'
                            ? router.pathname === '/admin'
                            : router.pathname === item.href || router.pathname.startsWith(item.href + '/');
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setMobileOpen(false)}
                                className={`sidebar-link ${active ? 'active' : ''}`}
                            >
                                <span className="text-lg">{item.icon}</span>
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Logout — pinned at bottom */}
                <div className="shrink-0 p-4 border-t border-white/5">
                    <button onClick={handleLogout} className="sidebar-link w-full text-red-400 hover:bg-red-900/20 hover:text-red-400 hover:border-red-400">
                        <LogOut size={16} /> <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="dash-content flex-1">
                {/* Top Bar */}
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden text-slate-400 hover:text-white">
                            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
                        </button>
                        <div>
                            <h1 className="font-syne font-bold text-xl text-white">{title}</h1>
                            <p className="text-slate-500 text-xs">{new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="relative p-2 rounded-lg glass-card text-slate-400 hover:text-white">
                            <Bell size={18} />
                            <div className="absolute top-1 right-1 w-2 h-2 bg-cyan-400 rounded-full" />
                        </button>
                        <button onClick={handleLogout} className="flex items-center gap-2 text-slate-400 hover:text-red-400 text-sm transition-colors">
                            <LogOut size={15} /> Logout
                        </button>
                    </div>
                </div>
                {children}
            </main>
        </div>
    );
}
