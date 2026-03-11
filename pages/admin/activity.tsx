// pages/admin/activity.tsx – Admin Activity Log
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { withAuth } from '../../lib/auth';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { getAll, saveAll, KEYS, ActivityLog } from '../../lib/store';
import toast from 'react-hot-toast';
import { adminNav } from '../../lib/adminNav';



function ActivityPage() {
    const [logs, setLogs] = useState<ActivityLog[]>([]);

    useEffect(() => { setLogs(getAll<ActivityLog>(KEYS.ACTIVITY)); }, []);

    const clearLogs = () => {
        if (!confirm('Clear all activity logs?')) return;
        saveAll(KEYS.ACTIVITY, []);
        setLogs([]);
        toast.success('Logs cleared');
    };

    return (
        <DashboardLayout navItems={adminNav} title="Activity Log" roleBadge="Super Admin" roleBadgeClass="badge-red">
            <Head><title>Activity Log – Admin | ScalerHouse</title></Head>

            <div className="flex justify-between items-center mb-5">
                <p className="text-slate-400 text-sm">{logs.length} events logged</p>
                {logs.length > 0 && (
                    <button onClick={clearLogs} className="btn-outline !py-2 !px-4 !text-sm !border-red-500/30 !text-red-400 hover:!bg-red-900/20">Clear All</button>
                )}
            </div>

            <div className="glass-card p-5">
                {logs.length === 0 ? (
                    <div className="text-center text-slate-500 py-16">No activity yet. Start using the platform to generate logs!</div>
                ) : (
                    <div className="space-y-3">
                        {logs.map((log, i) => (
                            <div key={log.id} className={`flex gap-4 items-start pb-3 ${i < logs.length - 1 ? 'border-b border-white/5' : ''}`}>
                                <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2 shrink-0 animate-pulse-slow" />
                                <div className="flex-1">
                                    <p className="text-slate-200 text-sm">{log.message}</p>
                                    <div className="flex gap-3 mt-1">
                                        <span className="badge badge-blue text-xs">{log.actor}</span>
                                        <span className="text-slate-600 text-xs">{new Date(log.timestamp).toLocaleString('en-IN')}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}

export default withAuth(ActivityPage, ['admin']);
