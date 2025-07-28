// src/app/api/screener/route.ts

import { NextResponse } from 'next/server';

const screenerCache = {
    // We will now cache the full, unfiltered list
    fullList: null as any[] | null,
    timestamp: 0,
};
const CACHE_DURATION_MS = 60 * 60 * 1000; // Cache the full list for 1 hour

export async function GET() {
    // 1. Check if the full list is already cached and fresh
    if (screenerCache.fullList && (Date.now() - screenerCache.timestamp < CACHE_DURATION_MS)) {
        console.log("[API/screener] Serving full list from cache.");
        return NextResponse.json(screenerCache.fullList);
    }

    const apiKey = process.env.FINANCIAL_MODELING_PREP_API_KEY;
    if (!apiKey) {
        console.error("FMP API key is not configured.");
        return NextResponse.json({ error: 'API key is not configured' }, { status: 500 });
    }

    try {
        console.log("[API/screener] Cache miss or stale. Fetching fresh tradable symbols list from FMP...");
        
        // THE FIX: Use a more reliable, free-tier-friendly endpoint
        const response = await fetch(`https://financialmodelingprep.com/api/v3/stock/list?apikey=${apiKey}`);
        
        if (!response.ok) {
            throw new Error('Failed to fetch company list from FMP. The API may be down or the key is invalid.');
        }

        const allCompanies = await response.json();
        
        // Filter for high-quality, relevant stocks on our server
        // This gives us our "S&P 500-like" universe without a premium API call
        const filteredList = allCompanies.filter((company: any) => 
            (company.exchangeShortName === "NASDAQ" || company.exchangeShortName === "NYSE") &&
            company.type === "stock" &&
            company.price != null && company.price > 1 // Filter out penny stocks
        );
        
        // We need to fetch additional details like sector and market cap. We'll do it for a smaller, curated list.
        // To be API-efficient, we'll fetch details in a batch for the top 500 by a simple metric (like price or volume).
        // For simplicity in this MVP, we will use the data we have. A more advanced version would batch requests for more details.
        
        // For now, let's map the data we have to the format our frontend expects
        const formattedList = filteredList.map((c: any) => ({
            symbol: c.symbol,
            companyName: c.name,
            marketCap: c.price * (c.volume || 1), // A very rough proxy for market cap
            sector: "N/A", // Not available in this endpoint, will show N/A in UI
            price: c.price,
            beta: 0, // Not available
            volume: c.volume,
            exchange: c.exchangeShortName,
            lastAnnualDividend: 0 // Not available
        }));

        // 3. Cache the fresh data
        screenerCache.fullList = formattedList;
        screenerCache.timestamp = Date.now();
        console.log(`[API/screener] Successfully fetched and cached ${formattedList.length} companies.`);

        return NextResponse.json(formattedList);

    } catch (error: any) {
        console.error(`[API/screener] Fetch failed: ${error.message}`);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}