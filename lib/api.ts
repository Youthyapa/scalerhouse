// lib/api.ts
// Frontend fetch helpers — replaces localStorage store.ts calls
// All functions call Next.js API routes and handle JWT token

function getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('sh_token');
}

async function apiFetch<T>(
    path: string,
    options: RequestInit = {}
): Promise<T> {
    const token = getToken();
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers || {}),
    };

    const res = await fetch(path, { ...options, headers });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'API error');
    return data as T;
}

// ─── Auth ────────────────────────────────────────────────────────────────────
export async function apiLogin(email: string, password: string) {
    const data = await apiFetch<{ token: string; user: any }>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
    });
    if (typeof window !== 'undefined') {
        localStorage.setItem('sh_token', data.token);
        localStorage.setItem('sh_auth_user', JSON.stringify(data.user));
    }
    return data;
}

export function apiLogout() {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('sh_token');
        localStorage.removeItem('sh_auth_user');
    }
    return fetch('/api/auth/logout', { method: 'GET' });
}

// ─── Leads ──────────────────────────────────────────────────────────────────
export const apiGetLeads = () => apiFetch<any[]>('/api/leads');
export const apiGetLead = (id: string) => apiFetch<any>(`/api/leads/${id}`);
export const apiCreateLead = (data: any) => apiFetch<any>('/api/leads', { method: 'POST', body: JSON.stringify(data) });
export const apiUpdateLead = (id: string, data: any) => apiFetch<any>(`/api/leads/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const apiDeleteLead = (id: string) => apiFetch<any>(`/api/leads/${id}`, { method: 'DELETE' });

// ─── Clients ─────────────────────────────────────────────────────────────────
export const apiGetClients = () => apiFetch<any[]>('/api/clients');
export const apiGetClient = (id: string) => apiFetch<any>(`/api/clients/${id}`);
export const apiCreateClient = (data: any) => apiFetch<any>('/api/clients', { method: 'POST', body: JSON.stringify(data) });
export const apiUpdateClient = (id: string, data: any) => apiFetch<any>(`/api/clients/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const apiDeleteClient = (id: string) => apiFetch<any>(`/api/clients/${id}`, { method: 'DELETE' });

// ─── Employees ───────────────────────────────────────────────────────────────
export const apiGetEmployees = () => apiFetch<any[]>('/api/employees');
export const apiGetEmployee = (id: string) => apiFetch<any>(`/api/employees/${id}`);
export const apiCreateEmployee = (data: any) => apiFetch<any>('/api/employees', { method: 'POST', body: JSON.stringify(data) });
export const apiUpdateEmployee = (id: string, data: any) => apiFetch<any>(`/api/employees/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const apiDeleteEmployee = (id: string) => apiFetch<any>(`/api/employees/${id}`, { method: 'DELETE' });

// ─── Affiliates ──────────────────────────────────────────────────────────────
export const apiGetAffiliates = () => apiFetch<any[]>('/api/affiliates');
export const apiGetAffiliate = (id: string) => apiFetch<any>(`/api/affiliates/${id}`);
export const apiCreateAffiliate = (data: any) => apiFetch<any>('/api/affiliates', { method: 'POST', body: JSON.stringify(data) });
export const apiUpdateAffiliate = (id: string, data: any) => apiFetch<any>(`/api/affiliates/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const apiDeleteAffiliate = (id: string) => apiFetch<any>(`/api/affiliates/${id}`, { method: 'DELETE' });
export const apiRegisterAffiliate = (data: any) => apiFetch<any>('/api/affiliates/register', { method: 'POST', body: JSON.stringify(data) });

// ─── Tickets ─────────────────────────────────────────────────────────────────
export const apiGetTickets = () => apiFetch<any[]>('/api/tickets');
export const apiGetTicket = (id: string) => apiFetch<any>(`/api/tickets/${id}`);
export const apiCreateTicket = (data: any) => apiFetch<any>('/api/tickets', { method: 'POST', body: JSON.stringify(data) });
export const apiUpdateTicket = (id: string, data: any) => apiFetch<any>(`/api/tickets/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const apiDeleteTicket = (id: string) => apiFetch<any>(`/api/tickets/${id}`, { method: 'DELETE' });

// ─── Blog ─────────────────────────────────────────────────────────────────────
export const apiGetBlog = (all = false) => apiFetch<any[]>(`/api/blog${all ? '?all=true' : ''}`);
export const apiGetBlogPost = (id: string) => apiFetch<any>(`/api/blog/${id}`);
export const apiCreateBlogPost = (data: any) => apiFetch<any>('/api/blog', { method: 'POST', body: JSON.stringify(data) });
export const apiUpdateBlogPost = (id: string, data: any) => apiFetch<any>(`/api/blog/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const apiDeleteBlogPost = (id: string) => apiFetch<any>(`/api/blog/${id}`, { method: 'DELETE' });

// ─── Offers ──────────────────────────────────────────────────────────────────
export const apiGetOffers = (all = false) => apiFetch<any[]>(`/api/offers${all ? '?all=true' : ''}`);
export const apiCreateOffer = (data: any) => apiFetch<any>('/api/offers', { method: 'POST', body: JSON.stringify(data) });
export const apiUpdateOffer = (id: string, data: any) => apiFetch<any>(`/api/offers/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const apiDeleteOffer = (id: string) => apiFetch<any>(`/api/offers/${id}`, { method: 'DELETE' });

// ─── Proposals ───────────────────────────────────────────────────────────────
export const apiGetProposals = () => apiFetch<any[]>('/api/proposals');
export const apiCreateProposal = (data: any) => apiFetch<any>('/api/proposals', { method: 'POST', body: JSON.stringify(data) });
export const apiUpdateProposal = (id: string, data: any) => apiFetch<any>(`/api/proposals/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const apiDeleteProposal = (id: string) => apiFetch<any>(`/api/proposals/${id}`, { method: 'DELETE' });

// ─── Careers ─────────────────────────────────────────────────────────────────
export const apiGetCareers = (all = false) => apiFetch<any[]>(`/api/careers${all ? '?all=true' : ''}`);
export const apiCreateCareer = (data: any) => apiFetch<any>('/api/careers', { method: 'POST', body: JSON.stringify(data) });
export const apiUpdateCareer = (id: string, data: any) => apiFetch<any>(`/api/careers/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const apiDeleteCareer = (id: string) => apiFetch<any>(`/api/careers/${id}`, { method: 'DELETE' });

// ─── Contact ─────────────────────────────────────────────────────────────────
export const apiSubmitContact = (data: any) => apiFetch<any>('/api/contact', { method: 'POST', body: JSON.stringify(data) });

// ─── ID generator (same format as before) ────────────────────────────────────
export function genId(): string {
    return 'sh_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}
