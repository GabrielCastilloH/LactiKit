import React, { createContext, useCallback, useContext, useState } from 'react';
import { TestResult } from '../types';
import { FAKE_TEST_RESULTS } from '../lib/constants';

interface TestHistoryContextValue {
  tests: TestResult[];
  addTest: (result: Omit<TestResult, 'id'>) => string;
  getTest: (id: string) => TestResult | undefined;
  updateTestOverview: (id: string, aiOverview: string) => void;
  pendingTest: TestResult | null;
  setPendingTest: (test: TestResult | null) => void;
}

const TestHistoryContext = createContext<TestHistoryContextValue | null>(null);

export function ScanHistoryProvider({ children }: { children: React.ReactNode }) {
  const [tests, setTests] = useState<TestResult[]>(FAKE_TEST_RESULTS);
  const [pendingTest, setPendingTest] = useState<TestResult | null>(null);

  const addTest = useCallback((result: Omit<TestResult, 'id'>): string => {
    const id = Date.now().toString();
    const newTest: TestResult = { ...result, id };
    setTests(prev => [newTest, ...prev]);
    return id;
  }, []);

  const getTest = useCallback((id: string): TestResult | undefined => {
    return tests.find(t => t.id === id);
  }, [tests]);

  const updateTestOverview = useCallback((id: string, aiOverview: string) => {
    setTests(prev => prev.map(t => t.id === id ? { ...t, aiOverview } : t));
  }, []);

  return (
    <TestHistoryContext.Provider value={{ tests, addTest, getTest, updateTestOverview, pendingTest, setPendingTest }}>
      {children}
    </TestHistoryContext.Provider>
  );
}

export function useTestHistory(): TestHistoryContextValue {
  const ctx = useContext(TestHistoryContext);
  if (!ctx) throw new Error('useTestHistory must be used within ScanHistoryProvider');
  return ctx;
}

/** @deprecated use useTestHistory */
export const useScanHistory = useTestHistory;
