// src/app/screener/page.tsx
'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Loader2, ArrowUp, ArrowDown } from 'lucide-react';
import { motion } from 'framer-motion';

interface CompanyData {
    symbol: string;
    companyName: string;
    marketCap: number; // This is now a rough proxy
    price: number;
    volume: number;
    exchange: string;
}

export default function ScreenerPage() {
    const [allCompanies, setAllCompanies] = useState<CompanyData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // --- Filter States ---
    const [nameFilter, setNameFilter] = useState('');
    const [priceFilter, setPriceFilter] = useState<[number, number]>([0, 5000]);

    // --- Sorting States ---
    const [sortKey, setSortKey] = useState<keyof CompanyData>('marketCap');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

    const router = useRouter();

    useEffect(() => {
        const fetchCompanies = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await fetch('/api/screener');
                const data = await response.json();
                if (!response.ok) throw new Error(data.error || 'Failed to fetch data');
                setAllCompanies(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };
        fetchCompanies();
    }, []);

    const filteredAndSortedCompanies = useMemo(() => {
        return allCompanies
            .filter(company => {
                const nameMatch = company.companyName?.toLowerCase().includes(nameFilter.toLowerCase());
                const priceMatch = company.price >= priceFilter[0] && company.price <= priceFilter[1];
                return nameMatch && priceMatch;
            })
            .sort((a, b) => {
                const valA = a[sortKey] ?? 0;
                const valB = b[sortKey] ?? 0;
                if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
                if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
                return 0;
            });
    }, [allCompanies, nameFilter, priceFilter, sortKey, sortOrder]);

    const handleSort = (key: keyof CompanyData) => {
        if (sortKey === key) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortKey(key);
            setSortOrder('desc');
        }
    };
    
    const formatMarketCap = (cap: number) => { /* ... same as before ... */ };

    if (isLoading) return <div className="flex items-center justify-center h-screen"><Loader2 className="h-16 w-16 animate-spin text-indigo-500" /></div>;
    if (error) return <div className="text-center text-red-500 p-8">{error}</div>;

    const SortableHeader = ({ tkey, label }: { tkey: keyof CompanyData, label: string }) => (
        <TableHead className="cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800" onClick={() => handleSort(tkey)}>
            <div className="flex items-center gap-2">
                {label}
                {sortKey === tkey && (sortOrder === 'desc' ? <ArrowDown className="h-4 w-4" /> : <ArrowUp className="h-4 w-4" />)}
            </div>
        </TableHead>
    );

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                    <h1 className="text-4xl font-extrabold tracking-tight">Stock Screener</h1>
                    <p className="mt-2 text-lg text-slate-600 dark:text-slate-400">Find investment ideas from a curated list of US stocks.</p>
                </motion.div>

                {/* --- Simplified Filter Controls --- */}
                <div className="my-6 grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-slate-100 dark:bg-slate-800/50 rounded-lg">
                    <div>
                        <label className="text-sm font-medium">Filter by Name</label>
                        <Input 
                            placeholder="e.g., Apple, Microsoft..."
                            value={nameFilter}
                            onChange={(e) => setNameFilter(e.target.value)}
                        />
                    </div>
                     <div>
                        <label className="text-sm font-medium">Filter by Price</label>
                        <p className="text-xs text-center">${priceFilter[0]} - ${priceFilter[1]}</p>
                        <Slider 
                            min={0} max={5000} step={10}
                            value={priceFilter} 
                            onValueChange={(value) => setPriceFilter(value as [number, number])}
                        />
                    </div>
                </div>

                {/* --- Results Table --- */}
                <p className="text-sm text-slate-500 mb-2">Showing {filteredAndSortedCompanies.length} of {allCompanies.length} companies.</p>
                <div className="border rounded-lg overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <SortableHeader tkey="companyName" label="Company" />
                                <SortableHeader tkey="symbol" label="Ticker" />
                                <SortableHeader tkey="price" label="Price" />
                                <SortableHeader tkey="exchange" label="Exchange" />
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredAndSortedCompanies.slice(0, 100).map(company => (
                                <TableRow 
                                    key={company.symbol} 
                                    className="cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800"
                                    onClick={() => router.push(`/stock-analysis?ticker=${company.symbol}`)}
                                >
                                    <TableCell className="font-medium">{company.companyName}</TableCell>
                                    <TableCell>{company.symbol}</TableCell>
                                    <TableCell>${company.price?.toFixed(2)}</TableCell>
                                    <TableCell>{company.exchange}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
}