import React, { createContext, useCallback, useContext, useState } from 'react';
import { ScanResult } from '../types';

interface ScanEntry extends ScanResult {
  id: string;
}

interface ScanHistoryContextValue {
  scans: ScanEntry[];
  addScan: (result: ScanResult) => string;
  getScan: (id: string) => ScanEntry | undefined;
}

const ScanHistoryContext = createContext<ScanHistoryContextValue | null>(null);

export function ScanHistoryProvider({ children }: { children: React.ReactNode }) {
  const [scans, setScans] = useState<ScanEntry[]>([]);

  const addScan = useCallback((result: ScanResult): string => {
    const id = Date.now().toString();
    setScans(prev => [{ ...result, id }, ...prev]);
    return id;
  }, []);

  const getScan = useCallback((id: string): ScanEntry | undefined => {
    return scans.find(s => s.id === id);
  }, [scans]);

  return (
    <ScanHistoryContext.Provider value={{ scans, addScan, getScan }}>
      {children}
    </ScanHistoryContext.Provider>
  );
}

export function useScanHistory(): ScanHistoryContextValue {
  const ctx = useContext(ScanHistoryContext);
  if (!ctx) throw new Error('useScanHistory must be used within ScanHistoryProvider');
  return ctx;
}
