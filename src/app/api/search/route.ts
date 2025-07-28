// src/app/api/search/route.ts

import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const keywords = searchParams.get('keywords');

  if (!keywords) {
    return NextResponse.json({ error: 'Keywords are required' }, { status: 400 });
  }

  const apiKey = process.env.TIINGO_API_KEY;
  if (!apiKey) {
    // ... error handling ...
  }
  
  const headers = {
    'Authorization': `Token ${apiKey}`
  };

  try {
    // Use the URL parameter method here as the docs specifically show it for this endpoint
    const response = await fetch(`https://api.tiingo.com/tiingo/utilities/search?query=${keywords}`, { headers });
    
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to fetch search results from Tiingo API.');
    }
    
    const data = await response.json();

    const matches = data.map((match: any) => ({
        symbol: match.ticker,
        name: match.name,
    }));

    return NextResponse.json(matches);

  } catch (error: any) {
    console.error("[API/search] Tiingo Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}