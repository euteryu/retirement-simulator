// scripts/fetch-universe.js
const fs = require('fs');
require('dotenv').config({ path: './.env.local' });

// Helper function to sleep between batches to respect API limits
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function fetchCompanyUniverse() {
    const apiKey = process.env.FINANCIAL_MODELING_PREP_API_KEY;
    if (!apiKey) {
        console.error("FMP API Key not found in .env.local file.");
        return;
    }
    
    console.log("--- FINANCIALLY: COMPREHENSIVE DATA FETCH INITIATED ---");
    
    try {
        // --- STEP 1: Get the entire universe of US-listed stock tickers ---
        console.log("Step 1/3: Fetching master list of all US tradable stocks...");
        const listResponse = await fetch(`https://financialmodelingprep.com/api/v3/stock/list?apikey=${apiKey}`);
        if (!listResponse.ok) throw new Error("Could not fetch the master stock list.");
        
        let allSymbols = await listResponse.json();
        
        // Filter for common stocks on major exchanges to create a high-quality list
        const tickers = allSymbols
            .filter(s => s.type === "stock" && (s.exchangeShortName === "NASDAQ" || s.exchangeShortName === "NYSE") && s.price > 1)
            .map(s => s.symbol);
        
        console.log(`Found ${tickers.length} high-quality tickers. Starting detailed data enrichment...`);
        console.log("This will take several minutes. Please be patient.");

        const allCompanyData = [];
        
        // --- STEP 2: Enrich each ticker with detailed data in batches ---
        const batchSize = 10; // Small batch size to stay well within API limits
        for (let i = 0; i < tickers.length; i += batchSize) {
            const batchTickers = tickers.slice(i, i + batchSize);
            
            const promises = batchTickers.map(async (ticker) => {
                try {
                    // Fetch key metrics and enterprise values in parallel for each ticker
                    const [metricsRes, enterpriseRes] = await Promise.all([
                        fetch(`https://financialmodelingprep.com/api/v3/key-metrics-ttm/${ticker}?apikey=${apiKey}`),
                        fetch(`https://financialmodelingprep.com/api/v3/enterprise-values/${ticker}?limit=1&apikey=${apiKey}`)
                    ]);
                    
                    if (!metricsRes.ok || !enterpriseRes.ok) return null;
                    
                    const metricsData = await metricsRes.json();
                    const enterpriseData = await enterpriseRes.json();
                    
                    if (metricsData.length > 0 && enterpriseData.length > 0) {
                        const metrics = metricsData[0];
                        const enterprise = enterpriseData[0];
                        
                        // Merge into a single, clean object
                        return {
                            symbol: metrics.symbol,
                            // We can infer companyName from the main list if needed, but symbol is key
                            companyName: allSymbols.find(s => s.symbol === ticker)?.name || ticker,
                            marketCap: enterprise.marketCapitalization,
                            sector: null, // Sector info requires another premium call, so we omit it
                            price: enterprise.stockPrice,
                            beta: null, // Beta requires another premium call
                            volume: null, // And so on
                            exchange: allSymbols.find(s => s.symbol === ticker)?.exchangeShortName || null,
                            dividendYield: metrics.dividendYieldTTM,
                            peRatio: metrics.peRatioTTM,
                            roe: metrics.roeTTM,
                            debtToEquity: metrics.debtToEquityTTM,
                            enterpriseValue: enterprise.enterpriseValue,
                            evToEbitda: metrics.enterpriseValueOverEBITDATTM,
                            yearHigh: null, // This would require another API call per stock
                            yearLow: null,
                        };
                    }
                    return null;
                } catch (e) {
                    console.warn(`- Error processing ${ticker}: ${e.message}. Skipping.`);
                    return null;
                }
            });

            const batchResults = await Promise.all(promises);
            allCompanyData.push(...batchResults.filter(c => c && c.marketCap && c.marketCap > 0)); // Only add valid results
            
            // Progress update
            const progress = (((i + batchSize) / tickers.length) * 100).toFixed(2);
            console.log(`Processed batch ${Math.ceil((i+1)/batchSize)}/${Math.ceil(tickers.length/batchSize)}... Progress: ${progress}% (${allCompanyData.length} valid companies found)`);
            
            // Crucial sleep to respect rate limits (e.g., FMP allows ~300 calls/min)
            await sleep(1200); // 1.2 seconds between batches of 10*2=20 calls
        }

        // --- STEP 3: Save the final, massive dataset ---
        const outputPath = './src/lib/company-universe.json';
        fs.writeFileSync(outputPath, JSON.stringify(allCompanyData, null, 2));
        
        console.log(`\n✅ SUCCESS! Saved comprehensive data for ${allCompanyData.length} companies to ${outputPath}`);

    } catch (error) {
        console.error("❌ FATAL ERROR during data fetch:", error.message);
    }
}

fetchCompanyUniverse();