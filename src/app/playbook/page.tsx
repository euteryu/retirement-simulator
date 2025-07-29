// src/app/playbook/page.tsx
'use client';

import { motion } from 'framer-motion';
import { Book, Compass, Microscope, Target, Scaling, Radar } from 'lucide-react';

const PhaseCard = ({ phase, title, icon, children }: { phase: number, title: string, icon: React.ReactNode, children: React.ReactNode }) => (
    <motion.div 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="mb-12"
    >
        <div className="flex items-center mb-4">
            <div className="flex-shrink-0 w-16 h-16 rounded-full bg-indigo-500/10 border-2 border-indigo-500/30 flex items-center justify-center mr-4">
                {icon}
            </div>
            <div>
                <span className="text-indigo-400 font-semibold">Phase {phase}</span>
                <h2 className="text-3xl font-bold">{title}</h2>
            </div>
        </div>
        <div className="prose prose-slate dark:prose-invert max-w-none prose-p:text-slate-300 prose-headings:text-white prose-strong:text-white prose-ul:text-slate-300 prose-li:marker:text-indigo-400">
            {children}
        </div>
    </motion.div>
);

export default function PlaybookPage() {
    return (
        <div className="min-h-screen bg-slate-900 text-white p-4 sm:p-6 lg:p-8">
            <div className="max-w-4xl mx-auto">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-16"
                >
                    <Book className="mx-auto h-16 w-16 text-indigo-400" />
                    <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-6xl">
                        The Stock Picker's Playbook
                    </h1>
                    <p className="mt-6 text-xl text-slate-400">
                        A disciplined, value-oriented framework for finding and analyzing investment ideas.
                    </p>
                </motion.div>

                <PhaseCard phase={1} title="Idea Sourcing" icon={<Compass className="w-8 h-8 text-indigo-400"/>}>
                    <h4>Sector & Thematic Scanning</h4>
                    <p>Start with a top-down view. Look for broad trends or sectors that are out of favor but have improving fundamentals.</p>
                    <ul>
                        <li><strong>Catalysts:</strong> Track industry-specific events like FDA calendars for biotech or policy shifts like the IRA for clean energy.</li>
                        <li><strong>Contrarian Screens:</strong> Screen for entire sectors down more than 30% YTD. Are inventories falling while demand is picking up?</li>
                    </ul>
                    <h4>Superinvestor Cloning & Dumpster Diving</h4>
                    <p>Stand on the shoulders of giants, then dig where they aren't looking.</p>
                    <ul>
                        <li><strong>Track 13F Filings:</strong> Use tools like Dataroma to see what the best investors are buying.</li>
                        <li><strong>Filter for Distress:</strong> Look for their positions that are down 40%+ from 52-week highs, but have high insider buying (Form 4 filings). This signals conviction.</li>
                    </ul>
                </PhaseCard>

                <PhaseCard phase={2} title="Business Quality Triage" icon={<Microscope className="w-8 h-8 text-indigo-400"/>}>
                    <h4>The 2-Sentence Test</h4>
                    <p>Before looking at any numbers, can you simply articulate the business's value proposition and competitive edge?</p>
                    <ul>
                        <li><strong>Pain Point Solved:</strong> "Company X solves [problem] with [unique solution]."</li>
                        <li><strong>Competitive Edge:</strong> "They are better than competitors because of [durable advantage]."</li>
                        <li><strong>Kill Criteria:</strong> If you can't do this clearly, pass on the idea.</li>
                    </ul>
                    <h4>Management BS Detector</h4>
                    <p>Great businesses can be ruined by poor management. Check their capital allocation track record.</p>
                    <ul>
                        <li><strong>ROIC (Return on Invested Capital):</strong> Is it consistently above 15%? This means they are investing capital wisely.</li>
                        <li><strong>Insider Ownership:</strong> Do executives own a significant amount of stock? This aligns their interests with shareholders.</li>
                    </ul>
                </PhaseCard>
                
                <PhaseCard phase={3} title="Deep Fundamental Forensics" icon={<Target className="w-8 h-8 text-indigo-400"/>}>
                    <h4>Financial Statement Autopsy</h4>
                    <p>This is where you verify the story with numbers. Focus on these key areas in the 10-K/10-Q reports:</p>
                    <ul>
                        <li><strong>Income Statement:</strong> Look for consistent revenue growth and expanding gross margins (pricing power).</li>
                        <li><strong>Balance Sheet:</strong> Check the debt. Can the company comfortably pay its short-term and long-term liabilities with its cash and cash flow?</li>
                        <li><strong>Cash Flow Statement:</strong> Is the company generating actual cash (Free Cash Flow)? Profit can be manipulated with accounting, but cash is king.</li>
                    </ul>
                </PhaseCard>

                <PhaseCard phase={4} title="Valuation & Margin of Safety" icon={<Scaling className="w-8 h-8 text-indigo-400"/>}>
                    <h4>Triangulate Value</h4>
                    <p>Never rely on a single valuation method. Use at least two to get a range.</p>
                    <ul>
                        <li><strong>Discounted Cash Flow (DCF):</strong> Project the company's future cash flows and discount them back to today's value. This estimates intrinsic value.</li>
                        <li><strong>Relative Valuation:</strong> Compare the company's metrics (like EV/EBITDA or P/E) to its direct competitors. Is it cheaper or more expensive for similar growth?</li>
                    </ul>
                    <h4>Margin of Safety</h4>
                    <p>This is the cornerstone of value investing. Only buy a stock when its market price is significantly below your estimate of its intrinsic value (e.g., price is less than 60% of your DCF value). This provides a buffer in case you are wrong.</p>
                </PhaseCard>

                 <PhaseCard phase={5} title="Continuous Monitoring" icon={<Radar className="w-8 h-8 text-indigo-400"/>}>
                    <h4>Thesis Tracking</h4>
                    <p>Your job isn't done after you buy. The world changes, and your investment thesis might be proven wrong.</p>
                    <ul>
                        <li><strong>Earnings Call Decoding:</strong> Listen to what management says (and doesn't say). Are they confident and clear ("reiterate full-year guidance") or vague and defensive ("challenging environment")?</li>
                        <li><strong>Red Flags Kill Switch:</strong> Have automatic sell triggers. If a core part of your thesis breaks (e.g., revenue starts declining, a major competitor emerges), sell the position, even at a loss.</li>
                    </ul>
                </PhaseCard>
            </div>
        </div>
    );
}