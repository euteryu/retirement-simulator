// src/lib/learn-content.ts

interface MetricContent {
  title: string;
  short: string;
  definition: string;
  importance: string;
  good: string;
  bad: string;
  source: string;
}

interface ContentSection {
  title: string;
  icon: string;
  description: string;
  metrics: {
    [key: string]: {
      en: MetricContent;
      kr: MetricContent;
    };
  };
}

interface TranslationMap {
  [key: string]: {
    en: ContentSection;
    kr: ContentSection;
  };
}

export const learnContent: TranslationMap = {
  stockAnalysis: {
    en: {
      title: "Analyzing Stocks",
      icon: "TrendingUp",
      description: "Learn to evaluate a company's health and value using fundamental metrics.",
      metrics: {
        marketCap: {
          en: { // <-- THE FIX: Added the 'en' wrapper
            title: "Market Capitalization", short: "Market Cap",
            definition: "The total value of all a company's shares. It's calculated by multiplying the stock price by the number of outstanding shares.",
            importance: "It's the primary way to measure a company's size, which often correlates with risk and growth potential.",
            good: "<strong>Large-Cap (> $10B):</strong> Generally stable, well-established companies. <strong>Mid-Cap ($2B - $10B):</strong> A blend of growth and stability. <strong>Small-Cap (< $2B):</strong> High growth potential but higher risk.",
            bad: "There isn't a 'bad' market cap, but it's crucial to understand the risk profile. Small-caps can be very volatile, and large-caps may have slower growth ahead.",
            source: "Publicly available on all financial news websites. Changes daily with the stock price."
          },
          kr: { // <-- THE FIX: Added the 'kr' wrapper
            title: "시가 총액", short: "시가총액",
            definition: "회사의 모든 주식의 총 가치입니다. 주가에 발행 주식 수를 곱하여 계산됩니다.",
            importance: "회사의 규모를 측정하는 주요 방법으로, 종종 위험 및 성장 잠재력과 관련이 있습니다.",
            good: "<strong>대형주 (> 100억 달러):</strong> 일반적으로 안정적인 회사. <strong>중형주 (20억 - 100억 달러):</strong> 성장과 안정성의 조화. <strong>소형주 (< 20억 달러):</strong> 높은 성장 잠재력과 높은 위험.",
            bad: "'나쁜' 시가총액은 없지만, 위험 프로파일을 이해하는 것이 중요합니다. 소형주는 변동성이 클 수 있습니다.",
            source: "모든 금융 뉴스 웹사이트에서 공개적으로 이용 가능하며, 주가에 따라 매일 변경됩니다."
          }
        },
        peRatio: {
          en: { // <-- THE FIX
            title: "P/E Ratio (Price-to-Earnings)", short: "P/E Ratio",
            definition: "Represents how much investors are willing to pay for every dollar of a company's profit.",
            importance: "It's a quick way to gauge if a stock is potentially overvalued (expensive) or undervalued (cheap) compared to its peers or its own history.",
            good: "A low P/E (e.g., under 15) can indicate a 'value' stock. This might mean the market is underestimating the company's future potential.",
            bad: "A very high P/E (e.g., over 40) suggests high growth expectations are built in. A negative P/E means the company is unprofitable.",
            source: "Calculated by dividing the current Stock Price by the Earnings Per Share (EPS)."
          },
          kr: { // <-- THE FIX
            title: "주가수익비율 (PER)", short: "PER",
            definition: "투자자들이 회사의 1달러 수익에 대해 얼마를 지불할 의향이 있는지를 나타냅니다.",
            importance: "주식이 동종 업계나 과거에 비해 고평가되었는지 또는 저평가되었는지를 신속하게 측정하는 방법입니다.",
            good: "낮은 PER(예: 15 미만)은 '가치주'를 나타낼 수 있습니다. 시장이 미래 잠재력을 과소평가하고 있을 수 있습니다.",
            bad: "매우 높은 PER(예: 40 초과)은 높은 성장 기대치가 반영되었음을 시사합니다. 마이너스 PER은 회사가 수익성이 없음을 의미합니다.",
            source: "현재 주가를 주당순이익(EPS)으로 나누어 계산됩니다."
          }
        },
        eps: {
          en: { // <-- THE FIX
            title: "EPS (Earnings Per Share)", short: "EPS",
            definition: "The portion of a company's profit allocated to each share of stock. The fundamental measure of per-share profitability.",
            importance: `<p class="mb-4">"In the long run, the market is a weighing machine." - Warren Buffett</p><p>A rising stock price almost always follows rising earnings over the long term. This is the 'weight' the market eventually recognizes.</p>`,
            good: "Positive and consistently increasing EPS year-over-year shows the company is becoming more profitable for its shareholders.",
            bad: "A negative EPS means the company is losing money. A declining trend suggests profitability is weakening.",
            source: "Found directly in a company's quarterly (10-Q) and annual (10-K) earnings reports."
          },
          kr: { // <-- THE FIX
            title: "주당순이익 (EPS)", short: "EPS",
            definition: "회사의 이익 중 주식 1주에 할당되는 부분입니다. 주당 수익성의 근본적인 척도입니다.",
            importance: `<p class="mb-4">"장기적으로 시장은 저울이다." - 워렌 버핏</p><p>주가 상승은 장기적으로 거의 항상 수익 상승을 따릅니다. 이것이 시장이 결국 인식하는 '무게'입니다.</p>`,
            good: "매년 꾸준히 증가하는 양수의 EPS는 회사가 주주들에게 더 많은 이익을 가져다주고 있음을 보여줍니다.",
            bad: "마이너스 EPS는 회사가 손실을 보고 있음을 의미합니다. 감소 추세는 수익성이 약화되고 있음을 시사합니다.",
            source: "회사의 분기별(10-Q) 및 연간(10-K) 실적 보고서에서 찾을 수 있습니다."
          }
        },
        beta: {
          en: { // <-- THE FIX
            title: "Beta (β)", short: "Beta",
            definition: "Beta measures a stock's volatility (price swings) in comparison to the overall market, which is assigned a beta of 1.0.",
            importance: "It tells you how much the stock's price is expected to move when the overall market moves. It helps you understand the risk profile of a stock.",
            good: "<strong>Beta < 1.0:</strong> A 'defensive' stock. It's less volatile than the market. Good for conservative investors.",
            bad: "<strong>Beta > 1.0:</strong> An 'aggressive' stock. It's more volatile than the market. Higher risk, higher potential reward.",
            source: "Calculated using regression analysis against a market index (like the S&P 500)."
          },
          kr: { // <-- THE FIX
            title: "베타 (β)", short: "베타",
            definition: "베타는 베타 값이 1.0인 전체 시장과 비교하여 주식의 변동성(가격 변동)을 측정합니다.",
            importance: "전체 시장이 움직일 때 해당 주식의 가격이 얼마나 움직일 것으로 예상되는지 알려줍니다. 주식의 위험 프로파일을 이해하는 데 도움이 됩니다.",
            good: "<strong>베타 < 1.0:</strong> '방어주'입니다. 시장보다 변동성이 적습니다. 보수적인 투자자에게 좋습니다.",
            bad: "<strong>베타 > 1.0:</strong> '공격적인' 주식입니다. 시장보다 변동성이 큽니다. 위험이 더 높고 잠재적 보상도 더 높습니다.",
            source: "시장 지수(예: S&P 500)에 대한 회귀 분석을 사용하여 계산됩니다."
          }
        },
      }
    },
    // The kr section for 'stockAnalysis' is no longer needed here, as translations are nested within each metric.
    kr: {
        title: "주식 분석하기",
        icon: "TrendingUp",
        description: "기본 지표를 사용하여 회사의 건전성과 가치를 평가하는 방법을 배웁니다.",
        metrics: {
            marketCap: { en: {} as any, kr: {} as any }, // Placeholder, real data is above
            peRatio: { en: {} as any, kr: {} as any },
            eps: { en: {} as any, kr: {} as any },
            beta: { en: {} as any, kr: {} as any },
        }
    }
  },
  assetTypes: {
    en: {
        title: "Asset Types & Diversification",
        icon: "Building",
        description: "Understand the different building blocks of a portfolio.",
        metrics: {
            bonds: {
              en: { // <-- THE FIX
                title: "Bonds", short: "Bonds",
                definition: "A bond is a loan you make to a government or corporation. In return, they promise to pay you back with regular interest payments.",
                importance: "Bonds are the bedrock of stability in a portfolio. They are generally less volatile than stocks and provide a predictable income stream.",
                good: "<strong>Investment Grade:</strong> Issued by stable governments and large, profitable companies. Low risk of default.",
                bad: "<strong>High-Yield ('Junk'):</strong> Issued by less stable companies. They offer higher interest to compensate for higher risk.",
                source: "Governments issue Treasury bonds, and corporations issue corporate bonds."
              },
              kr: { // <-- THE FIX
                title: "채권", short: "채권",
                definition: "채권은 정부나 기업에 돈을 빌려주는 대출입니다. 그 대가로 정기적인 이자 지급과 함께 원금을 상환할 것을 약속합니다.",
                importance: "채권은 포트폴리오 안정성의 기반입니다. 일반적으로 주식보다 변동성이 적고 예측 가능한 수입원을 제공합니다.",
                good: "<strong>투자 등급:</strong> 안정적인 정부와 수익성 있는 대기업이 발행합니다. 채무 불이행 위험이 낮습니다.",
                bad: "<strong>고수익('정크'):</strong> 덜 안정적인 회사가 발행합니다. 더 높은 위험을 보상하기 위해 더 높은 이자를 제공합니다.",
                source: "정부는 국채를 발행하고, 기업은 회사채를 발행합니다."
              }
            },
            etfs: {
              en: { // <-- THE FIX
                title: "ETFs & REITs", short: "ETFs & REITs",
                definition: "An ETF (Exchange-Traded Fund) is a single investment that holds a basket of hundreds or thousands of stocks or bonds.",
                importance: "ETFs are the easiest way to achieve instant diversification. Buying one share of an S&P 500 ETF makes you a part-owner of all 500 companies.",
                good: "Look for broad-market, low-cost index ETFs as the core of a portfolio.",
                bad: "Niche or leveraged ETFs can be very complex and risky for new investors.",
                source: "Traded on stock exchanges just like individual stocks."
              },
              kr: { // <-- THE FIX
                title: "ETF와 리츠(REITs)", short: "ETF & 리츠",
                definition: "ETF(상장지수펀드)는 수백 또는 수천 개의 주식이나 채권을 담고 있는 단일 투자 상품입니다.",
                importance: "ETF는 즉각적인 분산 투자를 달성하는 가장 쉬운 방법입니다. S&P 500 ETF 한 주를 사면 500개 회사 모두의 일부 소유주가 됩니다.",
                good: "포트폴리오의 핵심으로 광범위한 시장을 추종하는 저비용 인덱스 ETF를 찾으세요.",
                bad: "틈새 또는 레버리지 ETF는 신규 투자자에게 매우 복잡하고 위험할 수 있습니다.",
                source: "개별 주식처럼 증권 거래소에서 거래됩니다."
              }
            },
            dividendYield: {
              en: { // <-- THE FIX
                title: "Dividend Yield", short: "Div. Yield",
                definition: "The percentage of a company's stock price that it pays out in dividends each year.",
                importance: "Represents the return you get from dividends alone. Important for income-focused investors.",
                good: "A stable and growing yield (e.g., 2-5%) from a profitable company is often a sign of a healthy, mature business.",
                bad: "An extremely high yield (e.g., > 8-10%) can be a 'yield trap'—a warning sign that the market believes the company may have to cut its dividend.",
                source: "Calculated from public dividend announcements and the current stock price."
              },
              kr: { // <-- THE FIX
                title: "배당 수익률", short: "배당수익률",
                definition: "회사가 매년 배당금으로 지급하는 금액을 현재 주가의 백분율로 나타낸 것입니다.",
                importance: "배당금만으로 얻는 수익을 나타냅니다. 소득 중심 투자자에게 중요합니다.",
                good: "수익성 있는 회사의 안정적이고 성장하는 수익률(예: 2-5%)은 종종 건강하고 성숙한 사업의 신호입니다.",
                bad: "매우 높은 수익률(예: 8-10% 이상)은 '수익률 함정'일 수 있습니다. 이는 시장이 회사가 배당금을 삭감해야 할 수도 있다고 믿는 경고 신호입니다.",
                source: "공개된 배당 발표 및 현재 주가로부터 계산됩니다."
              }
            }
        }
    },
    // This second `kr` block is now redundant because the translations are nested. We can remove it,
    // but to avoid breaking the top-level structure I'll just clean it up.
    kr: {
        title: "자산 유형과 분산 투자",
        icon: "Building",
        description: "포트폴리오의 다양한 구성 요소를 이해하고 모든 계란을 한 바구니에 담지 말아야 하는 이유를 알아보세요.",
        metrics: {
            bonds: { en: {} as any, kr: {} as any },
            etfs: { en: {} as any, kr: {} as any },
            dividendYield: { en: {} as any, kr: {} as any },
        }
    }
  }
};