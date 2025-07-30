// src/app/api/search/route.ts

import { NextResponse } from 'next/server';

// Define the shape of the object we expect from the Tiingo search API
interface TiingoSearchResult {
    ticker: string;
    name: string;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const keywords = searchParams.get('keywords');

  if (!keywords) {
    return NextResponse.json({ error: 'Keywords are required' }, { status: 400 });
  }

  const apiKey = process.env.TIINGO_API_KEY;
  if (!apiKey) {
    console.error("TIINGO_API_KEY is not defined in .env.local");
    return NextResponse.json({ error: 'API key is not configured' }, { status: 500 });
  }
  
  const headers = {
    'Authorization': `Token ${apiKey}`
  };

  try {
    const response = await fetch(`https://api.tiingo.com/tiingo/utilities/search?query=${keywords}`, { headers });
    
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to fetch search results from Tiingo API.');
    }
    
    const data: TiingoSearchResult[] = await response.json(); // Type the response data

    // Map to the format our frontend expects, ensuring no `any` is used
    const matches = data.map((match: TiingoSearchResult) => ({
        symbol: match.ticker,
        name: match.name,
    }));

    return NextResponse.json(matches);

  } catch (error: unknown) { // FIX: Use `unknown` instead of `any`
    const message = error instanceof Error ? error.message : String(error);
    console.error("[API/search] Tiingo Error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}