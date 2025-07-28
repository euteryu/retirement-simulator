// src/app/api/analyze-stock/route.ts

import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const ticker = searchParams.get('ticker');

  // --- Step 1: Check for Ticker ---
  if (!ticker) {
    return NextResponse.json({ error: 'Ticker symbol is required' }, { status: 400 });
  }

  // --- Step 2: Check for API Key ---
  const apiKey = process.env.ALPHA_VANTAGE_API_KEY;
  if (!apiKey) {
    console.error("ALPHA_VANTAGE_API_KEY is not defined in .env.local");
    return NextResponse.json({ error: 'API key is not configured on the server. Please check environment variables.' }, { status: 500 });
  }
  
  console.log(`[API] Fetching data for ticker: ${ticker}`);

  try {
    // --- Step 3: Fetch Data in Parallel ---
    const [overviewRes, earningsRes] = await Promise.all([
      fetch(`https://www.alphavantage.co/query?function=OVERVIEW&symbol=${ticker}&apikey=${apiKey}`),
      fetch(`https://www.alphavantage.co/query?function=EARNINGS&symbol=${ticker}&apikey=${apiKey}`)
    ]);

    if (!overviewRes.ok || !earningsRes.ok) {
        console.error("Alpha Vantage API request failed with status:", overviewRes.status, earningsRes.status);
        throw new Error('Failed to fetch data from the financial API.');
    }

    const overviewData = await overviewRes.json();
    const earningsData = await earningsRes.json();

    // --- Step 4: Gracefully Handle API Limits or Errors from Alpha Vantage ---
    if (overviewData['Note'] || overviewData['Information']) {
      console.warn("[API] Alpha Vantage API limit likely reached:", overviewData);
      throw new Error('API call frequency limit reached. Please wait a minute and try again.');
    }
    if (Object.keys(overviewData).length === 0 || overviewData['Error Message']) {
        console.warn("[API] Invalid ticker or no data found:", overviewData);
        throw new Error(`No data found for the ticker symbol "${ticker}". Please check if the symbol is correct.`);
    }

    // --- Step 5: Process and Structure the Data ---
    const analysis = {
      symbol: overviewData.Symbol,
      name: overviewData.Name,
      description: overviewData.Description,
      sector: overviewData.Sector,
      industry: overviewData.Industry,
      marketCap: parseFloat(overviewData.MarketCapitalization).toLocaleString(),
      peRatio: parseFloat(overviewData.PERatio),
      eps: parseFloat(overviewData.EPS),
      beta: parseFloat(overviewData.Beta),
      dividendYield: parseFloat(overviewData.DividendYield) * 100,
      yearHigh: parseFloat(overviewData['52WeekHigh']),
      yearLow: parseFloat(overviewData['52WeekLow']),
      analystTargetPrice: parseFloat(overviewData.AnalystTargetPrice),
      recentEarnings: earningsData.quarterlyEarnings?.slice(0, 4).map((q: any) => ({
        fiscalDateEnding: q.fiscalDateEnding,
        reportedEPS: parseFloat(q.reportedEPS),
        estimatedEPS: parseFloat(q.estimatedEPS),
      })) || [],
    };
    
    console.log(`[API] Successfully fetched and processed data for ${ticker}.`);
    return NextResponse.json(analysis);

  } catch (error: any) {
    console.error("[API] An error occurred in the analysis route:", error.message);
    // Send a JSON response even on error
    return NextResponse.json({ error: error.message || 'An internal server error occurred' }, { status: 500 });
  }
}