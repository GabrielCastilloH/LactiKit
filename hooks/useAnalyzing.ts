import { useEffect } from 'react';
import { ANALYZING_DURATION_MS } from '../lib/constants';

export function useAnalyzing(isAnalyzing: boolean, onComplete?: () => void) {
  useEffect(() => {
    if (!isAnalyzing) return;
    const timer = setTimeout(() => {
      onComplete?.();
    }, ANALYZING_DURATION_MS);
    return () => clearTimeout(timer);
  }, [isAnalyzing]);
}
