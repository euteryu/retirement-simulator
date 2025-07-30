// src/app/api/screener/route.ts

import { NextResponse } from 'next/server';

// Define a type for the company object from the FMP API
interface FMPCompany {
    symbol: string;
    companyName: string;
    marketCap: number | null;
    sector: string | null;
    price: number | null;
    beta: number | null;
    volume: number | null;
    exchange: string | null; // THE FIX: Renamed from `exchangeShortName` to `exchange`
    dividendYield: number | null;
    peRatio: number | null;
    roe: number | null;
    debtToEquity: number | null;
    yearHigh: number | null;
    yearLow: number | null;
}

const screenerCache = {
    data: null as FMPCompany[] | null,
    timestamp: 0,
};
const CACHE_DURATION_MS = 60 * 60 * 1000;

export async function GET() {
    if (screenerCache.data && (Date.now() - screenerCache.timestamp < CACHE_DURATION_MS)) {
        console.log("[API/screener] Serving cached screener list.");
        return NextResponse.json(screenerCache.data);
    }

    const apiKey = process.env.FINANCIAL_MODELING_PREP_API_KEY;
    if (!apiKey) {
        console.error("FMP API key is not configured.");
        return NextResponse.json({ error: 'API key is not configured' }, { status: 500 });
    }

    try {
        console.log("[API/screener] Cache miss. Fetching fresh screener list from FMP...");
        
        const screenerUrl = `https://financialmodelingprep.com/api/v3/stock-screener?marketCapMoreThan=50000000&priceMoreThan=1&isActivelyTrading=true&exchange=NASDAQ,NYSE&apikey=${apiKey}`;
        
        const response = await fetch(screenerUrl);
        
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`API call failed with status: ${response.status}. Response: ${errorText}`);
        }

        const companies = await response.json();

        if (!companies || companies.length === 0 || companies["Error Message"]) {
            throw new Error("FMP Screener API returned an empty list or an error.");
        }

        console.log(`Successfully fetched raw data for ${companies.length} companies.`);
        
        // This mapping now perfectly aligns with our FMPCompany interface
        const formattedCompanies: FMPCompany[] = companies.map((c: any) => ({
            symbol: c.symbol,
            companyName: c.companyName,
            marketCap: c.marketCap,
            sector: c.sector,
            price: c.price,
            beta: c.beta,
            volume: c.volume,
            exchange: c.exchangeShortName, // The source data has 'exchangeShortName', we map it to 'exchange'
            dividendYield: c.dividendYield,
            peRatio: c.peRatio,
            roe: c.roe,
            debtToEquity: c.debtToEquity,
            yearHigh: c.yearHigh,
            yearLow: c.yearLow
        }));
        
        screenerCache.data = formattedCompanies;
        screenerCache.timestamp = Date.now();
        console.log(`[API/screener] Successfully fetched and cached ${formattedCompanies.length} companies.`);

        return NextResponse.json(formattedCompanies);

    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error);
        console.error(`[API/screener] Fetch failed: ${message}`);
        return NextResponse.json({ error: message }, { status: 500 });
    }
}