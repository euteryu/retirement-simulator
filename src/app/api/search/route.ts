// src/app/api/search/route.ts

import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const keywords = searchParams.get('keywords');

  if (!keywords) {
    return NextResponse.json({ error: 'Keywords are required' }, { status: 400 });
  }

  const apiKey = process.env.ALPHA_VANTAGE_API_KEY;
  if (!apiKey) {
    console.error("ALPHA_VANTAGE_API_KEY is not defined in .env.local");
    return NextResponse.json({ error: 'API key is not configured' }, { status: 500 });
  }

  try {
    const response = await fetch(`https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${keywords}&apikey=${apiKey}`);
    if (!response.ok) {
        throw new Error('Failed to fetch search results from financial API.');
    }
    
    const data = await response.json();

    // Check for API limit message
    if (data['Note']) {
        throw new Error('API call frequency limit reached. Please wait a minute.');
    }

    // Process the results into a cleaner format
    const matches = data.bestMatches?.map((match: any) => ({
        symbol: match['1. symbol'],
        name: match['2. name'],
        region: match['4. region'],
    })) || [];

    return NextResponse.json(matches);

  } catch (error: any) {
    console.error("[API/search] Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}