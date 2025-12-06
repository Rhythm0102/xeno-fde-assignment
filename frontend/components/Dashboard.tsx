"use client";

import { useEffect, useState } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, ShoppingBag, DollarSign, RefreshCw, TrendingUp } from 'lucide-react';
import { CustomTooltip } from './CustomTooltip';
import { ThemeToggle } from './ThemeProvider';
import { StatCard } from './StatCard';
import { Section } from './Section';

interface Stats {
    customers: number;
    orders: number;
    products: number;
    revenue: string;
}

interface OrderByDate {
    date: string;
    count: number;
}

interface Customer {
    id: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    totalSpent?: string;
    ordersCount?: number;
}

export default function Dashboard({ tenantId }: { tenantId: string }) {
    const [stats, setStats] = useState<Stats | null>(null);
    const [ordersByDate, setOrdersByDate] = useState<OrderByDate[]>([]);
    const [topCustomers, setTopCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(false);
    const [ingesting, setIngesting] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [statsRes, ordersRes, customersRes] = await Promise.all([
                axios.get(`http://localhost:4000/insights/stats?tenantId=${tenantId}`),
                axios.get(`http://localhost:4000/insights/orders-by-date?tenantId=${tenantId}`),
                axios.get(`http://localhost:4000/insights/top-customers?tenantId=${tenantId}`),
            ]);
            setStats(statsRes.data || null);
            setOrdersByDate(ordersRes.data || []);
            setTopCustomers(customersRes.data || []);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (tenantId) fetchData();
    }, [tenantId]);

    const handleIngest = async () => {
        setIngesting(true);
        try {
            await Promise.all([
                axios.post('http://localhost:4000/ingest/products', { tenantId }),
                axios.post('http://localhost:4000/ingest/customers', { tenantId }),
                axios.post('http://localhost:4000/ingest/orders', { tenantId }),
            ]);
            fetchData();
            alert('Ingestion started/completed!');
        } catch (error) {
            console.error('Ingestion failed:', error);
            alert('Ingestion failed. Check console.');
        } finally {
            setIngesting(false);
        }
    };

    if (!stats) return (
        <div className="min-h-screen flex items-center justify-center">
            <div>Loading dashboard...</div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[var(--bg-primary)]">
            <header className="border-b border-[var(--border)] bg-[var(--card)]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-[var(--text-primary)]">Dashboard</h1>
                            <p className="text-[var(--text-secondary)] mt-1">Real-time insights from your Shopify store</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <button
                                onClick={handleIngest}
                                disabled={ingesting}
                                className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[var(--success)] to-emerald-600 text-white font-medium rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                <RefreshCw className={`w-4 h-4 ${ingesting ? 'animate-spin' : ''}`} />
                                {ingesting ? 'Syncing...' : 'Sync Data'}
                            </button>
                            <ThemeToggle />
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <StatCard title="Total Revenue" value={`$${stats.revenue}`} icon={<DollarSign className="w-8 h-8 text-[var(--success)]" />} trend={12} trendLabel="vs last month" />
                    <StatCard title="Total Orders" value={stats.orders} icon={<ShoppingBag className="w-8 h-8 text-[var(--secondary)]" />} trend={8} />
                    <StatCard title="Total Customers" value={stats.customers} icon={<Users className="w-8 h-8 text-[var(--accent)]" />} trend={-2} />
                    <StatCard title="Total Products" value={stats.products} icon={<TrendingUp className="w-8 h-8 text-[var(--primary)]" />} trend={5} />
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <Section title="Orders Over Time" description="Order volume trends in your store">
                        <div className="h-72">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={ordersByDate} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                                    <XAxis dataKey="date" stroke="var(--text-secondary)" />
                                    <YAxis stroke="var(--text-secondary)" />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Line type="monotone" dataKey="count" stroke="var(--primary)" strokeWidth={2} dot={{ fill: 'var(--primary)' }} activeDot={{ r: 6 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </Section>

                    <Section title="Store Snapshot" description="Quick overview of your store metrics">
                        <div className="space-y-4">
                            <div className="flex justify-between items-center p-4 bg-[var(--bg-secondary)] rounded-lg">
                                <div>
                                    <p className="text-sm text-[var(--text-secondary)]">Avg Order Value</p>
                                    <p className="text-2xl font-bold text-[var(--success)]">${stats.revenue && stats.orders ? (parseFloat(stats.revenue) / Math.max(1, stats.orders)).toFixed(2) : '0'}</p>
                                </div>
                                <DollarSign className="w-8 h-8 text-[var(--warning)] opacity-50" />
                            </div>
                            <div className="flex justify-between items-center p-4 bg-[var(--bg-secondary)] rounded-lg">
                                <div>
                                    <p className="text-sm text-[var(--text-secondary)]">Customer Base</p>
                                    <p className="text-2xl font-bold text-[var(--text-primary)]">{stats.customers}</p>
                                </div>
                                <Users className="w-8 h-8 text-[var(--accent)] opacity-50" />
                            </div>
                            <div className="flex justify-between items-center p-4 bg-[var(--bg-secondary)] rounded-lg">
                                <div>
                                    <p className="text-sm text-[var(--text-secondary)]">Product Catalog</p>
                                    <p className="text-2xl font-bold text-[var(--text-primary)]">{stats.products}</p>
                                </div>
                                <ShoppingBag className="w-8 h-8 text-[var(--primary)] opacity-50" />
                            </div>
                        </div>
                    </Section>
                </div>

                <Section title="Top Customers" description="Your most valuable customers">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-[var(--border)]">
                                            <th className="px-4 py-3 text-left text-sm font-semibold text-[var(--text-primary)]">Name</th>
                                            <th className="px-4 py-3 text-left text-sm font-semibold text-[var(--text-primary)]">Orders</th>
                                            <th className="px-4 py-3 text-right text-sm font-semibold text-[var(--text-primary)]">Total Spent</th>
                                        </tr>
                            </thead>
                            <tbody>
                                {topCustomers.map((customer) => (
                                    <tr key={customer.id} className="border-b border-[var(--border)] hover:bg-[var(--bg-secondary)] transition-colors">
                                        <td className="px-4 py-3 text-sm text-[var(--text-primary)]">{(customer.firstName || customer.lastName) ? `${customer.firstName || ''} ${customer.lastName || ''}`.trim() : `Customer #${customer.id.slice(-4)}`}</td>
                                        <td className="px-4 py-3 text-sm text-[var(--text-primary)]">
                                            <span className="px-3 py-1 bg-[var(--primary)] bg-opacity-10 text-[var(--text-primary)] rounded-full text-xs font-medium">{customer.ordersCount ?? 0}</span>
                                        </td>
                                        <td className="px-4 py-3 text-sm font-medium text-right text-[var(--success)]">${customer.totalSpent ?? '0'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Section>
            </main>
        </div>
    );
}
