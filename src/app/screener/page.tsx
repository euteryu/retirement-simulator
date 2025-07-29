// src/app/playbook/page.tsx
'use client';

import { motion, useScroll, useSpring } from 'framer-motion';
import { Book, BrainCircuit, SlidersHorizontal, Microscope, Target, CheckSquare, Info, Activity } from 'lucide-react';
import Link from 'next/link';
import { InlineMath, BlockMath } from 'react-katex';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// --- Reusable Sub-Components for the Deluxe Playbook ---

const PhaseCard = ({ children }: { children: React.ReactNode }) => (
    <motion.section 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="mb-20"
    >
        {children}
    </motion.section>
);

const PhaseHeader = ({ phase, title, icon }: { phase: string, title: string, icon: React.ReactNode }) => (
    <div className="flex items-center mb-8 border-b border-slate-700/50 pb-4">
        <div className="flex-shrink-0 w-16 h-16 rounded-full bg-indigo-500/10 border-2 border-indigo-500/30 flex items-center justify-center mr-5">
            {icon}
        </div>
        <div>
            <span className="text-indigo-400 font-semibold">{phase}</span>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">{title}</h2>
        </div>
    </div>
);

// NEW: Component to visually separate and style each step
const StepBox = ({ step, title, children }: { step: string, title: string, children: React.ReactNode }) => (
    <div className="relative pl-12 mb-12">
        <div className="absolute left-0 top-1 flex items-center justify-center w-8 h-8 rounded-full bg-slate-700 text-indigo-300 font-bold">
            {step}
        </div>
        <h3 className="text-2xl font-semibold text-white mb-3">{title}</h3>
        <div className="prose prose-lg prose-slate dark:prose-invert max-w-none prose-p:text-slate-300 prose-ul:text-slate-300 prose-li:marker:text-indigo-400">
            {children}
        </div>
    </div>
);

// NEW: Scroll-triggered quote component
const ScrollQuote = ({ text, author }: { text: string, author: string }) => {
    return (
        <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="hidden xl:block absolute left-full ml-20 w-72 text-slate-400 italic"
        >
            <p className="text-xl">"{text}"</p>
            <p className="text-right not-italic font-semibold text-slate-500 mt-2">- {author}</p>
        </motion.div>
    );
};

const ActionBox = ({ title, children, ctaLink, ctaText }: { title: string, children: React.ReactNode, ctaLink: string, ctaText: string }) => (
    <div className="my-8 p-6 bg-slate-800/50 border border-slate-700/50 rounded-xl not-prose">
        <h4 className="font-semibold text-xl text-white mb-3 flex items-center gap-2"><Activity className="text-indigo-400"/> {title}</h4>
        <div className="text-slate-300 border-l-2 border-indigo-500 pl-4">{children}</div>
        {ctaLink && (
            <Link href={ctaLink} target={ctaLink.startsWith('http') ? '_blank' : '_self'} rel="noopener noreferrer">
                <div className="inline-block mt-6 px-5 py-2.5 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-500 transition-colors">
                    {ctaText} →
                </div>
            </Link>
        )}
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

export default function PlaybookPage() {
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
                <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="text-center pt-16 pb-20"
                    >
                        <Book className="mx-auto h-16 w-16 text-indigo-400" />
                        <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-6xl">
                            The Stock Picker's Playbook
                        </h1>
                        <p className="mt-6 text-xl text-slate-400 max-w-3xl mx-auto">
                            A Disciplined Funnel for Finding and Analyzing High-Quality Investments.
                        </p>
                    </motion.div>

                    <div className="relative">
                        <PhaseCard>
                            <PhaseHeader phase="Phase 1" title="The Mindset: You Are a Business Analyst" icon={<BrainCircuit className="w-8 h-8 text-indigo-400"/>}/>
                            <StepBox step="1.1" title="Embrace the Philosophy">
                                <p>We don't bet on tickers; we purchase ownership in businesses. Our goal is to find wonderful companies at fair prices, or fair companies at wonderful prices, always with a <InteractiveTerm term="Margin of Safety">
                                    <p className="font-bold mb-2">Margin of Safety</p>
                                    <p>The core principle of value investing. It's the gap between a company's estimated intrinsic value and its market price. A large margin of safety protects you from errors and bad luck.</p>
                                    </InteractiveTerm>.</p>
                                <ScrollQuote text="My weapon of choice as a stock picker is research; it's critical for me to understand a company's value before laying down a dime." author="Michael Burry" />
                            </StepBox>
                            <StepBox step="1.2" title="Learn the Language">
                                <p>You cannot value what you don't understand. You must be able to read the three core financial statements. They are the audited story of a business, told in numbers.</p>
                                <ActionBox title="Prerequisite: Learn Accounting" ctaLink="https://www.youtube.com/playlist?list=PLUkh9m2BorqmKa_5gQ_Y4q_G9A7gC-C5l" ctaText="Watch Damodaran's Accounting 101 Course →">
                                    <p>Professor Aswath Damodaran provides one of the best, finance-focused accounting courses for free.</p>
                                </ActionBox>
                            </StepBox>
                        </PhaseCard>

                        <PhaseCard>
                            <PhaseHeader phase="Phase 2" title="The Broad Quantitative Screen" icon={<SlidersHorizontal className="w-8 h-8 text-indigo-400"/>}/>
                            <p>An analyst's most valuable asset is time. Our first job is to eliminate the "junk" with a ruthless, unemotional, purely quantitative screen. At this stage, we ignore the company's name, story, and stock chart. We only care if it passes a basic set of financial health checks.</p>
                            
                            <div className="relative mt-8">
                                <ScrollQuote text="I tend to ignore price-earnings ratios. Return on equity is deceptive and dangerous. I prefer minimal debt..." author="Michael Burry" />
                                <StepBox step="2.1" title="The 'Don't Waste My Time' Quality Screen">
                                    <p>We eliminate any company that is not consistently profitable, is dangerously leveraged, or is inefficient at deploying capital.</p>
                                    <ul className="list-none pl-0 mt-4 space-y-3">
                                        <li className="flex items-start">
                                            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center mr-3 mt-1 font-bold">✓</div>
                                            <div>
                                                <strong>Profitability:</strong> Must Be Profitable (<InlineMath math="P/E > 0" />). We only want to analyze businesses that have a proven ability to make money.
                                            </div>
                                        </li>
                                        <li className="flex items-start">
                                            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center mr-3 mt-1 font-bold">✓</div>
                                            <div>
                                                <strong>Efficiency:</strong> <InlineMath math="ROE > 10\%" />. <InteractiveTerm term="Return on Equity">
                                                <p className="font-bold mb-2">Return on Equity (ROE)</p>
                                                <p>Measures how effectively management uses shareholder money to generate profits. A value below 10% suggests the business is less efficient than a simple market index fund.</p>
                                                </InteractiveTerm> is a measure of management's effectiveness.
                                            </div>
                                        </li>
                                        <li className="flex items-start">
                                            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center mr-3 mt-1 font-bold">✓</div>
                                            <div>
                                                <strong>Solvency:</strong> <InlineMath math="\frac{Debt}{Equity} < 1.5" />. A high <InteractiveTerm term="Debt-to-Equity">
                                                <p className="font-bold mb-2">Debt-to-Equity Ratio</p>
                                                <p>Compares a company's total liabilities to its shareholder equity. It's a key measure of financial leverage. A high ratio can be a death sentence in a downturn.</p>
                                                </InteractiveTerm> ratio can be a death sentence in a downturn.
                                            </div>
                                        </li>
                                    </ul>
                                </StepBox>

                                <StepBox step="2.2" title="The 'Is It Remotely Cheap?' Value Screen">
                                    <p>We are value-oriented investors. We must eliminate anything obviously priced for perfection and carrying extreme valuation risk.</p>
                                    <ul className="list-none pl-0 mt-4 space-y-3">
                                        <li className="flex items-start">
                                            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center mr-3 mt-1 font-bold">✓</div>
                                            <div>
                                                <strong>Valuation:</strong> <InlineMath math="EV/EBITDA < 25" />. The <InteractiveTerm term="EV/EBITDA">
                                                <p className="font-bold mb-2">Enterprise Value to EBITDA</p>
                                                <BlockMath math="EV/EBITDA = \frac{Market\,Cap + Debt - Cash}{EBITDA}" />
                                                <p className="mt-2">This is Michael Burry's preferred valuation metric because it's harder to manipulate than P/E. It assesses the entire company's value against its raw cash earnings. A value above 25 often implies heroic assumptions about future growth are baked into the price.</p>
                                                </InteractiveTerm> ratio is a robust valuation metric. This filter helps us avoid speculative bubbles.
                                            </div>
                                        </li>
                                    </ul>
                                </StepBox>
                            </div>

                            <ActionBox title="Action: Generate Your Preliminary List" ctaLink="/screener" ctaText="Go to the Interactive Screener →">
                                <p>Use the Screener to apply the filters above. This will take the universe of 8,000+ stocks and instantly narrow it down to a more manageable list of a few hundred statistically viable companies. This is your starting pool of ideas.</p>
                            </ActionBox>
                        </PhaseCard>
                        
                        <PhaseCard>
                            <PhaseHeader phase="Phase 3" title="The Deep Dive - Building the Thesis" icon={<Target className="w-8 h-8 text-indigo-400"/>}/>
                            <p>Your screener gives you a shortlist. This is not a "buy list"; it is a "list of companies worthy of your time." Now, the real, qualitative research begins. For each company, you must build an investment thesis.</p>
                            
                            <div className="relative mt-8">
                                <ScrollQuote text="Most management teams of companies aren't great. Actually listen to earnings calls..." author="Anonymous Redditor" />
                                <StepBox step="3.1" title="The Management 'BS Detector'">
                                    <p>You are about to partner with this management team. You need to know if they are competent, honest, and shareholder-aligned. Find and listen to the company's most recent earnings call or a long-form interview with the CEO.</p>
                                    <ul className="list-disc pl-5 mt-4">
                                        <li><strong>Listen for:</strong> Do they speak clearly and directly, or do they rely on corporate jargon?</li>
                                        <li><strong>Listen for:</strong> Do they take responsibility for failures, or do they blame "macro factors"?</li>
                                        <li><strong>Listen for:</strong> Do they discuss long-term value creation and <InteractiveTerm term="Free Cash Flow">
                                            {/* The tooltip content is now pulled from learn-content.ts */}
                                            <p className="font-bold mb-2">Free Cash Flow (FCF)</p>
                                            <p>The actual cash a business generates after ALL expenses and investments. It is the ultimate reality check.</p>
                                            <div className="my-2 p-2 bg-slate-700 rounded">
                                                <BlockMath math="FCF = Cash\,from\,Operations - Capital\,Expenditures" />
                                            </div>
                                            <p>A company with growing profits but negative FCF is a major red flag.</p>
                                        </InteractiveTerm>?</li>
                                    </ul>
                                </StepBox>

                                <StepBox step="3.2" title="The 10-K Deep Dive (The Hacker's Method)">
                                    <p>Verify management's story with the audited facts in their annual report (10-K). You don't need to read all 200 pages. The goal is to verify three things:</p>
                                    <ol className="list-decimal pl-5 mt-4 space-y-2">
                                        <li><strong>Revenue & Margins:</strong> Is revenue growing consistently? Are profit margins stable or expanding? (Check the Income Statement)</li>
                                        <li><strong>Debt Load:</strong> Is the debt manageable? (Check the Balance Sheet)</li>
                                        <li><strong>The Ultimate Reality Check:</strong> Is the company's profit converting into actual cash? Check for positive and growing <InteractiveTerm term="Free Cash Flow">
                                            {/* This tooltip uses the same content as above */}
                                            <p className="font-bold mb-2">Free Cash Flow (FCF)</p>
                                            <p>The actual cash a business generates after ALL expenses and investments. It is the ultimate reality check.</p>
                                            <div className="my-2 p-2 bg-slate-700 rounded">
                                                <BlockMath math="FCF = Cash\,from\,Operations - Capital\,Expenditures" />
                                            </div>
                                            <p>A company with growing profits but negative FCF is a major red flag.</p>
                                        </InteractiveTerm>. (Check the Cash Flow Statement)</li>
                                    </ol>
                                    <ActionBox title="Action: Get the 10-K" ctaLink="https://www.sec.gov/edgar/searchedgar/companysearch" ctaText="Search EDGAR Database →">
                                        <p>Use the SEC's EDGAR database to find any company's annual report. You can also upload the PDF to an AI with this prompt:</p>
                                        <blockquote className="border-l-4 border-slate-600 pl-4 text-slate-400 italic my-4 text-base">"You are a skeptical financial analyst. Summarize this 10-K. Focus on: revenue drivers, margin evolution, debt, and the top 3 'Risk Factors'."</blockquote>
                                    </ActionBox>
                                </StepBox>
                                
                                <StepBox step="3.3" title="Intrinsic Value Deep Dive (The DCF Model)">
                                    <ScrollQuote text="Sheer, outrageous value is enough." author="Michael Burry" />
                                    <p>A company's true value is the sum of all the cash it will generate for its owners for the rest of its life, discounted back to today. This is a <InteractiveTerm term="Discounted Cash Flow (DCF)">
                                        <p className="font-bold mb-2">Discounted Cash Flow (DCF)</p>
                                        <p>A valuation method used to estimate the value of an investment based on its expected future cash flows. A DCF analysis attempts to figure out the value of a company today, based on projections of how much money it's going to make in the future.</p>
                                        </InteractiveTerm> analysis.</p>
                                    <ActionBox title="Action: Learn Valuation" ctaLink="https://www.youtube.com/playlist?list=PLUkh9m2BorqkJ_T_I_I3KP3M4sWd_1n_g-o" ctaText="Watch Damodaran's Valuation Course →">
                                        <p>This is an advanced technique. The goal is not perfect precision, but to understand the key drivers of value. Use a free template (like those from Damodaran's website) and perform a sensitivity analysis. How much does your valuation change if revenue growth is 5% instead of 10% for the next five years? This exercise will reveal the core assumptions you are making in your investment.</p>
                                    </ActionBox>
                                </StepBox>
                            </div>
                        </PhaseCard>

                         <PhaseCard>
                            <PhaseHeader phase="Phase 4" title="The Final Decision" icon={<CheckSquare className="w-8 h-8 text-indigo-400"/>}/>
                            <p>Your research is complete. The final decision rests on one question: Is the current Market Price significantly below your conservative estimate of Intrinsic Value? If your DCF suggests a company is worth $100 per share, and it's trading at $60, you have a 40% Margin of Safety. This is the primary reason to buy.</p>
                            <h4>Position Sizing</h4>
                            <p>Your level of conviction dictates your position size. A high-conviction idea might be 5% of your portfolio. A more speculative one, only 1%.</p>
                        </PhaseCard>
                    </div>
                </div>
            </div>
        </>
    );
}