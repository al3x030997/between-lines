'use client';

import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

type SearchContextValue = {
  query: string;
  setQuery: (next: string) => void;
};

const SearchContext = createContext<SearchContextValue | null>(null);

/**
 * Holds the /read discover search query above both ReaderNav (which renders the
 * search input in the top bar) and the discover page content (which filters by
 * it). They're siblings under (reader)/layout.tsx and share no other state.
 */
export function SearchProvider({ children }: { children: ReactNode }) {
  const [query, setQuery] = useState('');
  const value = useMemo(() => ({ query, setQuery }), [query]);
  return <SearchContext.Provider value={value}>{children}</SearchContext.Provider>;
}

export function useDiscoverSearch(): SearchContextValue {
  const ctx = useContext(SearchContext);
  // Graceful no-op outside the provider so a stray consumer never crashes.
  return ctx ?? { query: '', setQuery: () => {} };
}
