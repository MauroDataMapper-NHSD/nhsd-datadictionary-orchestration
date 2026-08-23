import { createContext, useContext } from 'react';
import type { BranchSummary } from 'api-client';

export interface BranchesContextValue {
  branches: BranchSummary[];
  loading: boolean;
  error: string | null;
}

export const BranchesContext = createContext<BranchesContextValue>({
  branches: [],
  loading: true,
  error: null
});

export function useBranchesContext(): BranchesContextValue {
  return useContext(BranchesContext);
}
