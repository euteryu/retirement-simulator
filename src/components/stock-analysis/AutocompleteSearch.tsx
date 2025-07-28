// src/components/stock-analysis/AutocompleteSearch.tsx
'use client';

import { useState, useCallback, useEffect } from 'react'; // <-- Import useEffect
import { useDebounce } from '@/hooks/useDebounce';
import { Loader2 } from 'lucide-react';

interface SearchResult {
  symbol: string;
  name: string;
}

interface AutocompleteSearchProps {
  onSelect: (ticker: string) => void;
}

export const AutocompleteSearch = ({ onSelect }: AutocompleteSearchProps) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  // Debounce the user's input to avoid firing API calls on every keystroke
  const debouncedQuery = useDebounce(query, 300);

  // The function that performs the API call
  const performSearch = useCallback(async (searchQuery: string) => {
    if (searchQuery.length < 2) {
      setResults([]);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch(`/api/search?keywords=${searchQuery}`);
      const data = await response.json();
      if (response.ok && Array.isArray(data)) {
        setResults(data);
      } else {
        setResults([]);
      }
    } catch (error) {
      console.error("Search failed:", error);
      setResults([]);
    }
    setIsLoading(false);
  }, []);

  // THE CORE FIX: Use useEffect to watch for changes in the debounced query
  useEffect(() => {
    performSearch(debouncedQuery);
  }, [debouncedQuery, performSearch]);

  const handleSelect = (ticker: string) => {
    setQuery('');
    setResults([]);
    onSelect(ticker);
  };
  
  return (
    <form onSubmit={(e) => { e.preventDefault(); if (results.length > 0) handleSelect(results[0].symbol); }}>
      <div className="relative w-80 md:w-96">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)} // Delay blur to allow click
          placeholder="Search Company or Ticker..."
          className="w-full h-16 px-6 text-lg text-center text-white
                     bg-white/5 backdrop-blur-md border border-white/10 
                     rounded-full shadow-lg outline-none 
                     placeholder-slate-400 focus:ring-2 focus:ring-indigo-400
                     transition-all"
        />
        {isFocused && query.length > 1 && (
          <div className="absolute top-full mt-2 w-full bg-slate-800/90 backdrop-blur-lg border border-slate-700 rounded-2xl shadow-xl overflow-hidden z-20">
            {isLoading && <div className="p-4 flex items-center justify-center text-slate-400"><Loader2 className="h-6 w-6 animate-spin" /></div>}
            {!isLoading && results.length > 0 && (
              <ul className="max-h-60 overflow-y-auto">
                {results.map(result => (
                  <li key={result.symbol}>
                    <button
                      type="button"
                      onMouseDown={(e) => { e.preventDefault(); handleSelect(result.symbol); }}
                      className="w-full text-left px-4 py-3 hover:bg-indigo-500/20 transition-colors"
                    >
                      <span className="font-bold text-white">{result.symbol}</span>
                      <span className="ml-3 text-slate-300">{result.name}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
            {!isLoading && results.length === 0 && debouncedQuery.length > 1 && (
              <div className="p-4 text-center text-slate-400">No results found.</div>
            )}
          </div>
        )}
      </div>
    </form>
  );
};