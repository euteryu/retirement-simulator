// src/app/api/screener/route.ts

import { NextResponse } from 'next/server';

// We will use a more persistent cache for this list
const screenerCache = {
    data: null as any[] | null,
    timestamp: 0,
};
const CACHE_DURATION_MS = 60 * 60 * 1000; // Cache for 1 hour

export async function GET() {
    // 1. Check Cache First
    if (screenerCache.data && (Date.now() - screenerCache.timestamp < CACHE_DURATION_MS)) {
        console.log("[API/screener] Serving cached S&P 500 list.");
        return NextResponse.json(screenerCache.data);
    }

    const apiKey = process.env.FINANCIAL_MODELING_PREP_API_KEY;
    if (!apiKey) {
        // ... error handling
    }

    try {
        console.log("[API/screener] Cache miss. Fetching fresh S&P 500 list from FMP...");
        // 2. Make one API call to get all S&P 500 constituents with key metrics
        const response = await fetch(`https://financialmodelingprep.com/api/v3/stock-screener?marketCapMoreThan=1000000000&isEtf=false&isActivelyTrading=true§or=Technology,Communication%20Services,Financial%20Services,Healthcare,Industrials,Consumer%20Cyclical,Consumer%20Defensive,Energy,Utilities,Real%20Estate,Basic%20Materials&limit=500&exchange=NASDAQ,NYSE&apikey=${apiKey}`);
        
        if (!response.ok) {
            throw new Error('Failed to fetch screener data from FMP.');
        }

        const data = await response.json();
        
        // 3. Cache the fresh data
        screenerCache.data = data;
        screenerCache.timestamp = Date.now();
        console.log(`[API/screener] Successfully fetched and cached ${data.length} companies.`);

        return NextResponse.json(data);

    } catch (error: any) {
        console.error(`[API/screener] Fetch failed: ${error.message}`);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}