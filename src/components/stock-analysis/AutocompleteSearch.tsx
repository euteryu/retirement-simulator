// src/components/stock-analysis/AutocompleteSearch.tsx
'use client';

import { useState, useCallback, useEffect, useRef } from 'react'; // <-- Add useRef
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
  const [isDropdownVisible, setIsDropdownVisible] = useState(false); // More explicit state
  const searchContainerRef = useRef<HTMLDivElement>(null); // Ref for the container

  const debouncedQuery = useDebounce(query, 300);

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
      if (response.ok) {
        setResults(data);
      } else {
        console.error("Search API Error:", data.error);
        setResults([]);
      }
    } catch (error) {
      console.error("Failed to fetch search results:", error);
      setResults([]);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (debouncedQuery) {
        performSearch(debouncedQuery);
    } else {
        setResults([]);
    }
  }, [debouncedQuery, performSearch]);

  const handleSelect = (ticker: string) => {
    setQuery('');
    setResults([]);
    setIsDropdownVisible(false);
    onSelect(ticker);
  };

  // THE CORE FIX: Handle clicks outside the component to close the dropdown.
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsDropdownVisible(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  return (
    // We remove the <form> wrapper as we handle submission via button clicks.
    <div className="relative w-80 md:w-96" ref={searchContainerRef}>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setIsDropdownVisible(true)} // Directly control visibility on focus
        placeholder="Search Company or Ticker..."
        autoComplete="off"
        className="w-full h-16 px-6 text-lg text-center text-white
                    bg-white/5 backdrop-blur-md border border-white/10 
                    rounded-full shadow-lg outline-none 
                    placeholder-slate-400 focus:ring-2 focus:ring-indigo-400
                    transition-all"
      />
      {/* The dropdown is now controlled by `isDropdownVisible` state */}
      {isDropdownVisible && query.length > 0 && (
        <div className="absolute top-full mt-2 w-full bg-slate-800/90 backdrop-blur-lg border border-slate-700 rounded-2xl shadow-xl overflow-hidden z-20">
          {isLoading && <div className="p-4 flex items-center justify-center text-slate-400"><Loader2 className="h-6 w-6 animate-spin" /></div>}
          
          {!isLoading && results.length > 0 && (
            <ul className="max-h-60 overflow-y-auto">
              {results.map(result => (
                <li key={result.symbol}>
                  {/* Use a simple onClick. It will now work reliably. */}
                  <button
                    type="button"
                    onClick={() => handleSelect(result.symbol)}
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
  );
};