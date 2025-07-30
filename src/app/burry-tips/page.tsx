// src/app/burry-tips/page.tsx
'use client';

import { motion, useScroll, useSpring } from 'framer-motion';
import { BrainCircuit, Telescope, Microscope, Scaling, PieChart, CheckSquare, X, Shield, Activity, TrendingDown, Gem, BarChart2, Globe, Zap, Wind, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import AdvancedAnalysisInteractive from '@/components/burry-tips/AdvancedAnalysisInteractive'; // ADD THIS IMPORT

// --- Reusable Sub-Components for the Deluxe Page ---

const Section = ({ children }: { children: React.ReactNode }) => (
    <motion.section 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="mb-24 grid grid-cols-1 lg:grid-cols-12 lg:gap-12"
    >
        {children}
    </motion.section>
);

const SectionHeader = ({ title, icon }: { title: string, icon: React.ReactNode }) => (
    <div className="lg:col-span-4 mb-8 lg:mb-0">
        <div className="sticky top-28">
            <div className="flex items-center gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-indigo-500/10 flex items-center justify-center border border-slate-700">
                    {icon}
                </div>
                <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
            </div>
        </div>
    </div>
);

const SectionContent = ({ children }: { children: React.ReactNode }) => (
    <div className="lg:col-span-8">
        <div className="prose prose-lg prose-slate dark:prose-invert max-w-none prose-p:text-slate-300 prose-blockquote:text-slate-400">
            {children}
        </div>
    </div>
);

const PullQuote = ({ text, author }: { text: string, author: string }) => (
    <div className="relative my-10 lg:-ml-32">
        <blockquote className="border-l-4 border-indigo-500 pl-6 text-2xl font-light leading-relaxed text-slate-300">
            <p>"{text}"</p>
        </blockquote>
        <p className="mt-4 text-right font-semibold text-slate-400">- {author}</p>
    </div>
);

const InsightCard = ({ title, icon, children }: { title: string, icon: React.ReactNode, children: React.ReactNode }) => (
    <div className="p-6 bg-slate-800/50 border border-slate-700/50 rounded-xl not-prose h-full">
        {/* We can make the title even bigger to maintain hierarchy */}
        <h3 className="font-semibold text-3xl text-white mb-6 flex items-center gap-3">{icon} {title}</h3>

        {/* --- THE FIX IS HERE --- */}
        {/* This outer div sets the base font size and line height. */}
        <div className="text-[18px] leading-relaxed">
            {/* The inner div applies prose styling, which now inherits the 22px base size. */}
            <div className="prose dark:prose-invert max-w-none 
                            prose-p:text-inherit 
                            prose-li:text-inherit
                            prose-strong:text-white"
            >
                {children}
            </div>
        </div>
    </div>
);

const InteractiveTerm = ({ term, children }: { term: string, children: React.ReactNode }) => (
    <TooltipProvider delayDuration={100}>
        <Tooltip>
            <TooltipTrigger asChild>
                <strong className="text-indigo-300 border-b-2 border-indigo-400/50 cursor-help hover:text-indigo-200">
                    {term}
                </strong>
            </TooltipTrigger>
            <TooltipContent className="max-w-md p-4 bg-slate-800 border-slate-700 text-slate-200 shadow-xl">
                {children}
            </TooltipContent>
        </Tooltip>
    </TooltipProvider>
);

const AdvancedSection = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <details className="group border-t-2 border-amber-500/30 pt-12">
        <summary className="list-none flex items-center justify-between cursor-pointer">
            <div className="flex items-center gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-amber-500/10 flex items-center justify-center border border-amber-700">
                    <Zap className="w-7 h-7 text-amber-400" />
                </div>
                <h2 className="text-3xl font-bold tracking-tight text-amber-300 group-hover:text-amber-200 transition-colors">
                    {title}
                </h2>
            </div>
            <div className="transition-transform duration-300 group-open:rotate-90">
                <ChevronRight className="h-6 w-6 text-slate-400" />
            </div>
        </summary>
        <div className="mt-8 ml-16 prose prose-lg prose-slate dark:prose-invert max-w-none prose-p:text-slate-300 prose-blockquote:text-slate-400">
            {children}
        </div>
    </details>
);


export default function BurryTipsPage() {
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    return (
        <>
            <motion.div className="fixed top-0 left-0 right-0 h-1 bg-indigo-500 origin-left z-50" style={{ scaleX }} />
            <div className="min-h-screen bg-slate-900 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="text-center pt-16 pb-20"
                    >
                        <div className="inline-block p-4 bg-slate-800/50 rounded-full border border-slate-700">
                            <BrainCircuit className="h-16 w-16 text-indigo-400" />
                        </div>
                        <h1 className="mt-6 text-4xl font-extrabold tracking-tight sm:text-7xl">
                            The Michael Burry Playbook
                        </h1>
                        <p className="mt-6 text-xl text-slate-400 max-w-3xl mx-auto">
                            An analysis of his investment philosophy, distilled from his own writings into an actionable framework.
                        </p>
                    </motion.div>

                    <div className="mt-12">
                        {/* --- THE CLASSIC PLAYBOOK --- */}
                        <Section>
                            <SectionHeader title="Core Philosophy" icon={<Shield className="w-8 h-8 text-indigo-400"/>} />
                            <SectionContent>
                                <p>Burry is a pure value investor in the tradition of Benjamin Graham. His strategy is not complex; it is a disciplined application of core principles.</p>
                                <PullQuote text="My strategy isn't very complex. I try to buy shares of unpopular companies when they look like roadkill, and sell them when they've been polished up a bit." author="Michael Burry" />
                                <InsightCard title="The Graham-and-Dodd Foundation" icon={<Gem className="text-amber-400" />}>
                                    <p>"All my stock picking is 100% based on the concept of a <InteractiveTerm term="Margin of Safety">
                                        <p className="font-bold mb-2">Margin of Safety</p>
                                        <p>The core principle of value investing from Benjamin Graham's 'Security Analysis'. It is the difference between a stock's market price and your conservative estimate of its intrinsic value. This buffer is your protection against errors and bad luck.</p>
                                    </InteractiveTerm>... the net is that I want to protect my downside to prevent permanent loss of capital."</p>
                                    <p className="mt-2">For Burry, "sheer, outrageous value is enough" and specific, known catalysts are not necessary.</p>
                                </InsightCard>
                            </SectionContent>
                        </Section>

                        <Section>
                            <SectionHeader title="The Hunt" icon={<Telescope className="w-8 h-8 text-indigo-400"/>} />
                            <SectionContent>
                                <InsightCard title="Rule #1: Hunt in Out-of-Favor Industries" icon={<TrendingDown className="text-red-400" />}>
                                    <p>"I find out-of-favor industries a particularly fertile ground for best-of-breed shares at steep discounts. MSN MoneyCentral's Stock Screener is a great tool for uncovering such bargains."</p>
                                    <p className="mt-2 text-sm">The modern equivalent of this is a powerful online screener. The goal is to find where the market is most pessimistic.</p>
                                    <Link href="/screener" className="inline-block mt-4 text-indigo-300 font-semibold hover:text-indigo-200">
                                        Use our Screener to find unpopular sectors →
                                    </Link>
                                </InsightCard>
                                <h4>No Artificial Limits</h4>
                                <p>He puts very few restrictions on his search. "They can be large-cap stocks, small cap, mid cap, micro cap, tech or non-tech. It doesn't matter. If I can find value in it, it becomes a candidate... It strikes me as ridiculous to put limits on my possibilities."</p>
                            </SectionContent>
                        </Section>

                        <Section>
                            <SectionHeader title="The Analysis" icon={<Microscope className="w-8 h-8 text-indigo-400"/>} />
                            <SectionContent>
                                <p>Burry uses a quantitative screen to find a large number of potentially cheap companies, then digs deeper to verify the value.</p>
                                <InsightCard title="Primary Screening Method" icon={<Scaling className="text-amber-400" />}>
                                    {/* --- THE FIX IS HERE --- */}
                                    <p>"How do I determine the discount? I usually focus on <InteractiveTerm term="Free Cash Flow">
                                        <p className="font-bold mb-2">Free Cash Flow (FCF)</p>
                                        <p>The actual cash a business generates after ALL expenses and investments. FCF = Cash from Operations - Capital Expenditures. It is the ultimate reality check because it is much harder to manipulate than accounting profit.</p>
                                        </InteractiveTerm> and <InteractiveTerm term="Enterprise Value">
                                        <p className="font-bold mb-2">Enterprise Value (EV)</p>
                                        <p>The total value of a company, often considered a more comprehensive alternative to market cap. It's calculated as: Market Cap + Total Debt - Cash.</p>
                                    </InteractiveTerm>... I will screen through large numbers of companies by looking at the price/enterprise value/EBITDA ratio..."</p>
                                </InsightCard>
                                
                                <InsightCard title="'Rare Bird' Investments" icon={<Gem className="text-amber-400" />}>
                                    <p>"I also invest in rare birds..." This refers to special situations where value is often clear and deeply misunderstood by the market.</p>
                                    <ul className="list-none pl-0 mt-4 space-y-3">
                                        <li className="flex items-start"><Gem className="h-5 w-5 text-indigo-400 mr-3 mt-1 flex-shrink-0" /><div><strong>Asset Plays & Net-Nets:</strong> "companies selling at less than two-thirds of <InteractiveTerm term="Net-Net Value">
                                            <p className="font-bold mb-2">Net-Net Value (NCAV)</p>
                                            <p>A formula from Benjamin Graham: Net Current Asset Value = (Current Assets - Total Liabilities). If a company's market cap is less than its NCAV, you are essentially buying its liquid assets for a discount and getting the long-term assets (factories, patents, brand) for free.</p>
                                        </InteractiveTerm>)."</div></li>
                                        <li className="flex items-start"><Gem className="h-5 w-5 text-indigo-400 mr-3 mt-1 flex-shrink-0" /><div><strong>Buffett-Style Compounders:</strong> "companies favored by Warren Buffett -- those with a sustainable competitive advantage... if they become available at good prices."</div></li>
                                    </ul>
                                </InsightCard>
                            </SectionContent>
                        </Section>
                        
                        <Section>
                            <SectionHeader title="The Final Decision" icon={<CheckSquare className="w-8 h-8 text-indigo-400"/>}/>
                            <SectionContent>
                                <p>This is where Burry blends deep fundamental value with pragmatic, rules-based risk management.</p>
                                <PullQuote text="I balance the fact that I am fundamentally inclined... with the fact that since implementing this rule I haven't had a single misfortune blow up my entire portfolio." author="Michael Burry" />
                                <InsightCard title="The Buy Rule: Value Meets Confirmation" icon={<CheckSquare className="text-green-400" />}>
                                    <p>"I prefer to buy at or around **within 10% to 15% of a 52-week low** that has shown itself to be **firm over time**."</p>
                                    <h4 className="font-semibold text-white mt-4">What "Firm Over Time" Means:</h4>
                                    <p className="text-sm mt-2">This is a rule of patience. He waits for the chart to show that panic-selling has stopped and a new floor of support has been established. This can take weeks or months.</p>
                                    <div className="mt-4 p-4 bg-slate-900 rounded-lg text-center"><BarChart2 className="mx-auto mt-2 h-20 w-20 text-slate-600"/></div>
                                </InsightCard>
                                <InsightCard title="The Sell Rule: The 'Trader's Pact'" icon={<X className="text-red-400" />}>
                                     <p>"If a stock... **breaks to a new low** [after I've bought it], in most cases I **cut it fast**."</p>
                                     <p className="mt-2 text-sm">This is his ultimate, non-negotiable risk control. It is an admission that the market may know something he doesn't.</p>
                                </InsightCard>
                            </SectionContent>
                        </Section>

                        {/* --- THE NEW, COLLAPSIBLE SECTION --- */}
                        <AdvancedAnalysisInteractive />
                    </div>
                </div>
            </div>
        </>
    );
}