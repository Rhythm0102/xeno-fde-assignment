"use client";

import { useState } from 'react';
import axios from 'axios';
import { Lock, Link as LinkIcon } from 'lucide-react';
import { ThemeToggle } from './ThemeProvider';

export default function ConnectStore({ onConnect }: { onConnect: (tenantId: string) => void }) {
    const [domain, setDomain] = useState('');
    const [token, setToken] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await axios.post('http://localhost:4000/ingest/tenant', {
                shopifyDomain: domain,
                accessToken: token,
                shopName: domain.split('.')[0],
            });
            onConnect(res.data.id);
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to connect store');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[var(--bg-primary)] flex flex-col">
            <div className="absolute top-4 right-4">
                <ThemeToggle />
            </div>

            <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
                <div className="w-full max-w-md">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="flex justify-center mb-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dark)] rounded-lg flex items-center justify-center">
                                <LinkIcon className="w-6 h-6 text-white" />
                            </div>
                        </div>
                        <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">
                            Urban
                        </h1>
                        <p className="text-[var(--text-secondary)]">
                            Connect your Shopify store to begin
                        </p>
                    </div>

                    {/* Form Card */}
                    <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-8 shadow-sm">
                        {error && (
                            <div className="mb-6 p-4 bg-[var(--danger)] bg-opacity-10 border border-[var(--danger)] rounded-lg">
                                <p className="text-[var(--danger)] text-sm font-medium">{error}</p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                                    Shopify Domain
                                </label>
                                <input
                                    type="text"
                                    placeholder="example.myshopify.com"
                                    value={domain}
                                    onChange={(e) => setDomain(e.target.value)}
                                    className="w-full px-4 py-2 border border-[var(--border)] rounded-lg bg-[var(--bg-primary)] text-[var(--text-primary)] placeholder-[var(--text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                                    required
                                />
                                <p className="text-xs text-[var(--text-tertiary)] mt-1">
                                    Your store's Shopify domain
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                                    Admin API Access Token
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 w-4 h-4 text-[var(--text-tertiary)]" />
                                    <input
                                        type="password"
                                        placeholder="shpat_..."
                                        value={token}
                                        onChange={(e) => setToken(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 border border-[var(--border)] rounded-lg bg-[var(--bg-primary)] text-[var(--text-primary)] placeholder-[var(--text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                                        required
                                    />
                                </div>
                                <p className="text-xs text-[var(--text-tertiary)] mt-1">
                                    Your Shopify Admin API token (kept secure)
                                </p>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-2.5 px-4 mt-6 bg-gradient-to-r from-[var(--primary)] to-[var(--primary-dark)] text-white font-medium rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                {loading ? 'Connecting...' : 'Connect Store'}
                            </button>
                        </form>

                        <p className="text-xs text-[var(--text-tertiary)] text-center mt-6">
                            Your credentials are sent securely and never stored
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
