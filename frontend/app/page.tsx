"use client";

import { useState } from 'react';
import ConnectStore from '@/components/ConnectStore';
import Dashboard from '@/components/Dashboard';

export default function Home() {
  const [tenantId, setTenantId] = useState<string | null>(null);

  if (!tenantId) {
    return <ConnectStore onConnect={setTenantId} />;
  }

  return <Dashboard tenantId={tenantId} />;
}
