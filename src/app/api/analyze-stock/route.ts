// src/app/api/analyze-stock/route.ts

import { NextResponse } from 'next/server';

// --- Simple In-Memory Cache ---
const cache = new Map<string, { data: Record<string, unknown>; timestamp: number }>();
const CACHE_DURATION_MS = 5 * 60 * 1000; // 5 minutes cache for news

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const ticker = searchParams.get('ticker');

  if (!ticker) {
    return NextResponse.json({ error: 'Ticker symbol is required' }, { status: 400 });
  }

  // Check Cache
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

  try {
    console.log(`[API] Cache miss for ${ticker}. Fetching from Tiingo...`);
    
    // Fetch metadata and news in parallel
    const [metaRes, newsRes] = await Promise.all([
        fetch(`https://api.tiingo.com/tiingo/daily/${ticker}?token=${apiKey}`),
        fetch(`https://api.tiingo.com/tiingo/news?tickers=${ticker}&token=${apiKey}`)
    ]);

    if (!metaRes.ok) {
        if (metaRes.status === 404) {
            const errorData = await metaRes.json();
            throw new Error(errorData.detail || `No data found for the ticker symbol "${ticker}".`);
        }
        throw new Error(`Tiingo metadata API failed with status: ${metaRes.status}`);
    }

    if (!newsRes.ok) {
      console.warn(`Could not fetch news for ${ticker}. Status: ${newsRes.status}`);
    }

    const metaData = await metaRes.json();
    const newsData = newsRes.ok ? await newsRes.json() : [];

    // Define a type for the news articles to avoid `any`
    type NewsArticle = {
        id: number;
        title: string;
        url: string;
        description: string;
        publishedDate: string;
        source: string;
    }

    const analysis = {
      symbol: metaData.ticker,
      name: metaData.name,
      description: metaData.description,
      exchange: metaData.exchangeCode,
      startDate: metaData.startDate,
      endDate: metaData.endDate,
      marketCap: "N/A",
      peRatio: null,
      eps: null,
      news: newsData.slice(0, 10).map((article: NewsArticle) => ({
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

  } catch (error: unknown) { // FIX: Use `unknown` instead of `any`
    const message = error instanceof Error ? error.message : String(error);
    console.error(`[API] Tiingo fetch failed for ${ticker}: ${message}`);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}