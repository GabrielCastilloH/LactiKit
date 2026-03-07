import { useEffect } from 'react';
import { router } from 'expo-router';
import { ANALYZING_DURATION_MS } from '../lib/constants';

export function useAnalyzing(isAnalyzing: boolean) {
  useEffect(() => {
    if (!isAnalyzing) return;
    const timer = setTimeout(() => {
      router.replace('/results');
    }, ANALYZING_DURATION_MS);
    return () => clearTimeout(timer);
  }, [isAnalyzing]);
}
