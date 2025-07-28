// src/app/api/analyze-stock/route.ts

import { NextResponse } from 'next/server';

const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION_MS = 5 * 60 * 1000;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const ticker = searchParams.get('ticker');

  if (!ticker) {
    return NextResponse.json({ error: 'Ticker symbol is required' }, { status: 400 });
  }

  const cached = cache.get(ticker);
  if (cached && (Date.now() - cached.timestamp < CACHE_DURATION_MS)) {
    console.log(`[API] Serving cached data for ${ticker}.`);
    return NextResponse.json(cached.data);
  }

  const apiKey = process.env.TIINGO_API_KEY;
  if (!apiKey) {
    console.error("TIINGO_API_KEY is not defined in .env.local");
    return NextResponse.json({ error: 'API key is not configured' }, { status: 500 });
  }
  
  // THE CORE FIX: Create a reusable headers object for authentication.
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Token ${apiKey}`
  };

  try {
    console.log(`[API] Cache miss for ${ticker}. Fetching from Tiingo...`);
    
    // Fetch metadata and news in parallel, now with headers
    const [metaRes, newsRes] = await Promise.all([
        fetch(`https://api.tiingo.com/tiingo/daily/${ticker}`, { headers }),
        fetch(`https://api.tiingo.com/tiingo/news?tickers=${ticker}`, { headers })
    ]);

    if (!metaRes.ok) {
        if (metaRes.status === 404) {
          const errorData = await metaRes.json();
          throw new Error(errorData.detail || `No data found for the ticker symbol "${ticker}".`);
        }
        throw new Error(`Tiingo metadata API failed with status: ${metaRes.status}`);
    }

    if (!newsRes.ok) {
      // We can consider news a non-critical failure. We can still proceed.
      console.warn(`Could not fetch news for ${ticker}. Status: ${newsRes.status}`);
    }

    const metaData = await metaRes.json();
    const newsData = newsRes.ok ? await newsRes.json() : []; // Default to empty array on failure

    const analysis = {
      symbol: metaData.ticker,
      name: metaData.name,
      description: metaData.description,
      exchange: metaData.exchangeCode,
      startDate: metaData.startDate,
      endDate: metaData.endDate,
      
      // We will add price data in the next step, for now focus on what we have.
      marketCap: "N/A",
      peRatio: null,
      eps: null,
      
      news: newsData.slice(0, 10).map((article: any) => ({
        id: article.id,
        title: article.title,
        url: article.url,
        description: article.description,
        publishedDate: article.publishedDate,
        source: article.source,
      })) || [],
    };
    
    cache.set(ticker, { data: analysis, timestamp: Date.now() });
    console.log(`[API] Successfully fetched and cached data for ${ticker} from Tiingo.`);
    
    return NextResponse.json(analysis);

  } catch (error: any) {
    console.error(`[API] Tiingo fetch failed for ${ticker}: ${error.message}`);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}