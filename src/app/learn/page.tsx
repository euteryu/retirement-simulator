// src/app/learn/page.tsx
'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { DollarSign, Scale, TrendingUp, BookOpen, Building } from 'lucide-react';
import { useLanguage } from "@/context/LanguageContext";

const LearnCard = ({ icon, title, children }: { icon: React.ReactNode, title: string, children: React.ReactNode }) => (
    <Card className="bg-white/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700/50 w-full">
        <CardHeader>
            <CardTitle className="flex items-center gap-3">
                {icon}
                <span className="text-xl">{title}</span>
            </CardTitle>
        </CardHeader>
        <CardContent className="prose prose-slate dark:prose-invert max-w-none prose-p:text-slate-600 dark:prose-p:text-slate-300 prose-strong:text-slate-800 dark:prose-strong:text-slate-100">
            {children}
        </CardContent>
    </Card>
);

export default function LearnPage() {
    const { t } = useLanguage();

    const stockContent = {
        en: {
            intro: "Choosing individual stocks requires research. Here's a basic framework for analyzing a company's health and value.",
            earningsTitle: "Quarterly Earnings Reports",
            earningsItems: [
                "<strong>Revenue (Top Line):</strong> Is the company's total sales growing consistently year-over-year? Look for steady growth, not erratic spikes.",
                "<strong>Net Income (Bottom Line):</strong> Is the company actually profitable after all expenses? This is the ultimate measure of success.",
                "<strong>Earnings Per Share (EPS):</strong> This shows how much profit is attributed to each share. A rising EPS is a very positive sign.",
                "<strong>Guidance:</strong> What does the company's management predict for the next quarter or year? Be cautious, as this is a forecast, not a guarantee.",
            ],
            peTitle: "P/E Ratio (Price-to-Earnings)",
            peIntro: "The P/E ratio is a quick way to gauge if a stock is cheap or expensive relative to its earnings. It's calculated as: <strong>Stock Price / Earnings Per Share</strong>.",
            peItems: [
                "<strong>Low P/E (e.g., < 15):</strong> May indicate a 'value' stock that is potentially undervalued, or a company in a slow-growth industry.",
                "<strong>High P/E (e.g., > 30):</strong> Often seen in 'growth' stocks where investors expect high future earnings growth. It can also signal an overvalued stock.",
                "<strong>Key Context:</strong> A P/E ratio is useless in isolation. You must compare it to the company's own historical P/E and to other companies in the same industry.",
            ]
        },
        kr: {
            intro: "개별 주식을 선택하려면 조사가 필요합니다. 다음은 회사의 건전성과 가치를 분석하기 위한 기본 프레임워크입니다.",
            earningsTitle: "분기별 실적 보고서",
            earningsItems: [
                "<strong>매출 (Top Line):</strong> 회사의 총 매출이 전년 대비 꾸준히 성장하고 있나요? 불규칙한 급등이 아닌 안정적인 성장을 찾으세요.",
                "<strong>순이익 (Bottom Line):</strong> 모든 비용을 제외하고 회사가 실제로 수익성이 있나요? 이것이 성공의 궁극적인 척도입니다.",
                "<strong>주당 순이익 (EPS):</strong> 각 주식에 귀속되는 이익이 얼마인지 보여줍니다. EPS 상승은 매우 긍정적인 신호입니다.",
                "<strong>가이던스:</strong> 회사 경영진이 다음 분기나 연도에 대해 어떻게 예측하나요? 이는 보장이 아닌 예측이므로 신중해야 합니다.",
            ],
            peTitle: "주가수익비율 (P/E Ratio)",
            peIntro: "P/E 비율은 주식이 수익에 비해 저렴한지 비싼지를 빠르게 가늠할 수 있는 방법입니다. <strong>주가 / 주당 순이익</strong>으로 계산됩니다.",
            peItems: [
                "<strong>낮은 P/E (예: < 15):</strong> 잠재적으로 저평가된 '가치주'이거나 저성장 산업의 회사임을 나타낼 수 있습니다.",
                "<strong>높은 P/E (예: > 30):</strong> 투자자들이 미래의 높은 수익 성장을 기대하는 '성장주'에서 자주 볼 수 있습니다. 과대평가된 주식의 신호일 수도 있습니다.",
                "<strong>핵심 맥락:</strong> P/E 비율만으로는 쓸모가 없습니다. 회사의 과거 P/E 및 동일 산업의 다른 회사와 비교해야 합니다.",
            ]
        }
    };

    const bondContent = {
        en: {
            intro: "Bonds are essentially loans you make to a government or corporation. They are generally safer than stocks and provide steady income.",
            items: [
                "<strong>Good Bonds (Investment Grade):</strong> Issued by financially stable governments (like UK Gilts or US Treasuries) and large, profitable corporations. They have a low risk of default, but also lower interest payments (yield).",
                "<strong>'Bad' Bonds (High-Yield / Junk):</strong> Issued by less stable companies. They offer much higher interest rates to compensate for the higher risk that the company could go bankrupt.",
                "<strong>Interest Rate Risk:</strong> If the central bank raises interest rates, newly issued bonds become more attractive. This makes existing, lower-rate bonds less valuable, causing their price to fall."
            ]
        },
        kr: {
            intro: "채권은 본질적으로 정부나 기업에 돈을 빌려주는 것입니다. 일반적으로 주식보다 안전하며 안정적인 수입을 제공합니다.",
            items: [
                "<strong>우량 채권 (투자 등급):</strong> 재정적으로 안정된 정부(영국 국채 또는 미국 국채 등) 및 대규모 우량 기업이 발행합니다. 채무 불이행 위험이 낮지만 이자 지급(수익률)도 낮습니다.",
                "<strong>'불량' 채권 (고수익/정크):</strong> 덜 안정적인 회사가 발행합니다. 회사가 파산할 수 있는 더 높은 위험을 보상하기 위해 훨씬 높은 이자율을 제공합니다.",
                "<strong>금리 위험:</strong> 중앙은행이 금리를 인상하면 새로 발행된 채권이 더 매력적으로 변합니다. 이로 인해 기존의 낮은 금리 채권의 가치가 하락하여 가격이 떨어집니다."
            ]
        }
    };
    
    const etfContent = {
        en: {
            intro: "ETFs and REITs are popular tools for easy diversification.",
            items: [
                "<strong>ETFs (Exchange-Traded Funds):</strong> An ETF is a basket that holds hundreds of stocks or bonds. Buying one share of an ETF (like one tracking the S&P 500) instantly makes you a part-owner of all 500 companies, significantly lowering your risk.",
                "<strong>REITs (Real Estate Investment Trusts):</strong> A REIT is a company that owns and operates income-producing real estate. Buying a REIT is like being a landlord without the hassle, and they often pay high dividends from rental income."
            ]
        },
        kr: {
            intro: "ETF와 리츠는 손쉬운 분산 투자를 위한 인기 있는 도구입니다.",
            items: [
                "<strong>ETF (상장지수펀드):</strong> ETF는 수백 개의 주식이나 채권을 담고 있는 바구니입니다. S&P 500을 추종하는 ETF 한 주를 사면 즉시 500개 회사 모두의 일부 소유주가 되어 위험을 크게 낮출 수 있습니다.",
                "<strong>REITs (부동산 투자 신탁):</strong> 리츠는 임대 수익을 창출하는 부동산을 소유하고 운영하는 회사입니다. 리츠를 사는 것은 번거로움 없이 집주인이 되는 것과 같으며, 종종 임대 수입으로 높은 배당금을 지급합니다."
            ]
        }
    };

    const currentLang = t('language' as any) === 'kr' ? 'kr' : 'en';
    const currentStock = stockContent[currentLang];
    const currentBond = bondContent[currentLang];
    const currentEtf = etfContent[currentLang];
    
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-4 sm:p-6 lg:p-8">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <BookOpen className="mx-auto h-16 w-16 text-indigo-500" />
                    <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 sm:text-5xl">
                        {t('learnTitle')}
                    </h1>
                    <p className="mt-4 text-xl text-slate-600 dark:text-slate-400">
                        {t('learnSubtitle')}
                    </p>
                </div>

                <div className="space-y-8">
                    <LearnCard icon={<TrendingUp className="text-indigo-500" />} title={t('learnAnalyzingStocks')}>
                        <p>{currentStock.intro}</p>
                        <Accordion type="single" collapsible className="w-full">
                            <AccordionItem value="earnings">
                                <AccordionTrigger>{currentStock.earningsTitle}</AccordionTrigger>
                                <AccordionContent>
                                    <ul className="list-disc pl-5 space-y-2" dangerouslySetInnerHTML={{ __html: currentStock.earningsItems.map(item => `<li>${item}</li>`).join('') }} />
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="pe">
                                <AccordionTrigger>{currentStock.peTitle}</AccordionTrigger>
                                <AccordionContent>
                                    <p>{currentStock.peIntro}</p>
                                    <ul className="list-disc pl-5 space-y-2 mt-2" dangerouslySetInnerHTML={{ __html: currentStock.peItems.map(item => `<li>${item}</li>`).join('') }} />
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </LearnCard>
                    
                    {/* RESTORED AND TRANSLATED SECTIONS */}
                    <LearnCard icon={<Scale className="text-indigo-500" />} title={t('learnUnderstandingBonds')}>
                        <p>{currentBond.intro}</p>
                        <ul className="list-disc pl-5 space-y-2 mt-4" dangerouslySetInnerHTML={{ __html: currentBond.items.map(item => `<li>${item}</li>`).join('') }} />
                    </LearnCard>

                    <LearnCard icon={<Building className="text-indigo-500" />} title={t('learnWhatAreEtfs')}>
                        <p>{currentEtf.intro}</p>
                        <ul className="list-disc pl-5 space-y-2 mt-4" dangerouslySetInnerHTML={{ __html: currentEtf.items.map(item => `<li>${item}</li>`).join('') }} />
                    </LearnCard>
                </div>
            </div>
        </div>
    );
}