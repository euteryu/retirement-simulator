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

interface TranslationMap {
  [key: string]: {
    en: MetricContent;
    kr: MetricContent;
  };
}

export const learnContent: TranslationMap = {
  peRatio: {
    en: {
      title: "P/E Ratio (Price-to-Earnings)",
      short: "P/E Ratio",
      definition: "The P/E ratio is a number that represents how much investors are willing to pay for every dollar of a company's profit.",
      importance: "It's one of the most common ways to quickly gauge if a stock is potentially overvalued (expensive) or undervalued (cheap) compared to its own history or other companies in the same industry.",
      good: "A low P/E (e.g., under 15) can indicate a 'value' stock. This might mean the market is underestimating the company's future potential.",
      bad: "A very high P/E (e.g., over 40) suggests high growth expectations are built into the price, which can be risky. A negative P/E means the company is currently unprofitable.",
      source: "Calculated by dividing the current Stock Price by the Earnings Per Share (EPS).",
    },
    kr: {
      title: "주가수익비율 (PER)",
      short: "PER",
      definition: "PER은 투자자들이 회사의 1달러 수익에 대해 얼마를 지불할 의향이 있는지를 나타내는 숫자입니다.",
      importance: "주식이 과거 기록이나 동일 업계의 다른 회사에 비해 잠재적으로 고평가(비쌈)되었는지 또는 저평가(저렴)되었는지를 신속하게 측정하는 가장 일반적인 방법 중 하나입니다.",
      good: "낮은 PER(예: 15 미만)은 '가치주'를 나타낼 수 있습니다. 이는 시장이 회사의 미래 잠재력을 과소평가하고 있음을 의미할 수 있습니다.",
      bad: "매우 높은 PER(예: 40 초과)은 가격에 높은 성장 기대치가 반영되어 있어 위험할 수 있습니다. 마이너스 PER은 회사가 현재 수익성이 없음을 의미합니다.",
      source: "현재 주가를 주당순이익(EPS)으로 나누어 계산됩니다.",
    }
  },
  eps: {
    en: {
      title: "EPS (Earnings Per Share)",
      short: "EPS",
      definition: "EPS is the portion of a company's profit that is allocated to each outstanding share of common stock.",
      importance: "It's a key indicator of a company's profitability. A consistently growing EPS is a very strong sign of a healthy, growing business.",
      good: "Positive and consistently increasing EPS year-over-year shows the company is becoming more profitable for its shareholders.",
      bad: "A negative EPS means the company is losing money. A declining EPS trend suggests profitability is weakening.",
      source: "Found directly in a company's quarterly and annual earnings reports (10-Q and 10-K filings).",
    },
    kr: {
      title: "주당순이익 (EPS)",
      short: "EPS",
      definition: "EPS는 회사의 이익 중 보통주 1주에 할당되는 부분입니다.",
      importance: "회사의 수익성을 나타내는 핵심 지표입니다. 꾸준히 성장하는 EPS는 건강하고 성장하는 사업의 매우 강력한 신호입니다.",
      good: "매년 꾸준히 증가하는 양수의 EPS는 회사가 주주들에게 더 많은 이익을 가져다주고 있음을 보여줍니다.",
      bad: "마이너스 EPS는 회사가 손실을 보고 있음을 의미합니다. 감소하는 EPS 추세는 수익성이 약화되고 있음을 시사합니다.",
      source: "회사의 분기별 및 연간 실적 보고서(10-Q 및 10-K 서류)에서 직접 찾을 수 있습니다.",
    }
  },
  beta: {
    en: {
        title: "Beta",
        short: "Beta",
        definition: "Beta measures a stock's volatility, or systematic risk, in comparison to the entire market (usually the S&P 500).",
        importance: "It tells you how much the stock's price is expected to move when the overall market moves. It helps you understand the risk profile of a stock.",
        good: "A Beta less than 1 (e.g., 0.7) means the stock is less volatile than the market. It may not rise as much in a bull market, but it also may not fall as much in a bear market. Good for conservative investors.",
        bad: "A Beta greater than 1 (e.g., 1.5) means the stock is more volatile than the market. It has the potential for higher returns but also for larger losses. Higher risk.",
        source: "Calculated using regression analysis against a market index. It is provided by most financial data services."
    },
    kr: {
        title: "베타 (Beta)",
        short: "베타",
        definition: "베타는 전체 시장(보통 S&P 500)과 비교하여 주식의 변동성, 즉 체계적 위험을 측정합니다.",
        importance: "전체 시장이 움직일 때 해당 주식의 가격이 얼마나 움직일 것으로 예상되는지 알려줍니다. 주식의 위험 프로파일을 이해하는 데 도움이 됩니다.",
        good: "1 미만의 베타(예: 0.7)는 주식이 시장보다 덜 변동적임을 의미합니다. 상승장에서는 많이 오르지 않을 수 있지만, 하락장에서는 덜 떨어질 수 있습니다. 보수적인 투자자에게 좋습니다.",
        bad: "1보다 큰 베타(예: 1.5)는 주식이 시장보다 더 변동적임을 의미합니다. 더 높은 수익의 가능성이 있지만 더 큰 손실의 가능성도 있습니다. 위험이 더 높습니다.",
        source: "시장 지수에 대한 회귀 분석을 사용하여 계산됩니다. 대부분의 금융 데이터 서비스에서 제공됩니다."
    }
  },
  // You would continue to add all other metrics like marketCap, dividendYield, etc. here
};