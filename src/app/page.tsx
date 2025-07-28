// src/app/page.tsx
'use client';

import Link from 'next/link';
import { ArrowRight, BarChart, Shield, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';
import { InteractiveFintechBackgroundV2 } from '@/components/ui/interactive-fintech-background-v2';
import { useLanguage } from '@/context/LanguageContext';

const ToolCard = ({ href, icon, title, children, cta }: { href: string; icon: React.ReactNode; title: string; children: React.ReactNode; cta: string; }) => (
    <Link href={href} className="group block h-full">
        <motion.div 
            whileHover={{ y: -8, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="h-full p-6 bg-slate-50/[.03] backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl shadow-black/30 overflow-hidden"
        >
            <div 
                className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                aria-hidden="true" 
            />
            <div className="relative z-10">
                <div className="mb-4 inline-block p-3 bg-slate-900/50 border border-white/10 rounded-lg">{icon}</div>
                <h2 className="text-2xl font-bold text-white">{title}</h2>
                <p className="text-slate-300 mt-2 mb-6 leading-relaxed">{children}</p>
                <div className="flex items-center text-indigo-300 font-semibold transition-colors duration-300 group-hover:text-white">
                    {cta} <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </div>
            </div>
        </motion.div>
    </Link>
);

export default function HomePage() {
    const { t } = useLanguage();

    const content = {
        en: {
            title: "Clarity in Complexity.",
            subtitle: "An intelligent toolkit designed to transform financial data into clear, actionable insights for your future.",
            simulatorTitle: "Retirement Simulator",
            simulatorText: "Visualize your financial future. Test strategies against decades of real market data.",
            simulatorCTA: "Launch Simulator",
            analysisTitle: "Stock Analysis",
            analysisText: "Get a real-time fundamental snapshot of any stock with data-driven analysis.",
            analysisCTA: "Start Analyzing",
            learnTitle: "Learning Center",
            learnText: "Demystify complex topics. From P/E ratios to diversification, become a more confident investor.",
            learnCTA: "Explore Topics",
        },
        kr: {
            title: "복잡함 속 명확함.",
            subtitle: "금융 데이터를 당신의 미래를 위한 명확하고 실행 가능한 통찰력으로 변환하도록 설계된 지능형 툴킷입니다.",
            simulatorTitle: "은퇴 시뮬레이터",
            simulatorText: "당신의 금융 미래를 시각화하세요. 수십 년간의 실제 시장 데이터를 바탕으로 전략을 테스트하세요.",
            simulatorCTA: "시뮬레이터 시작",
            analysisTitle: "주식 분석",
            analysisText: "데이터 기반 분석으로 모든 주식의 실시간 기본 정보를 확인하세요.",
            analysisCTA: "분석 시작하기",
            learnTitle: "학습 센터",
            learnText: "복잡한 주제를 쉽게 이해하세요. P/E 비율부터 분산 투자까지, 더 자신감 있는 투자자가 되세요.",
            learnCTA: "주제 탐색하기",
        }
    };

    const currentContent = content[t('language' as any) === 'kr' ? 'kr' : 'en'];

    const titleContainerVariants = {
        hidden: { opacity: 0 },
        visible: { 
            opacity: 1,
            transition: { staggerChildren: 0.2, delayChildren: 0.3 } 
        },
    };

    const titleWordVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } },
    };
    
    // THE FIX FOR THE FRAMER MOTION ERROR IS HERE
    const clarityVariants = {
        hidden: { opacity: 0, scale: 0.5 },
        visible: {
            opacity: 1,
            scale: [1, 1.3, 1],
            // Use 'tween' or 'keyframes' for array-based animations instead of 'spring'.
            // Also specify 'times' to control the timing of each keyframe.
            transition: { duration: 0.8, ease: "easeInOut", times: [0, 0.5, 1] }
        },
    };

    return (
        <div className="relative w-full h-screen overflow-hidden flex flex-col items-center justify-center p-4">
            <InteractiveFintechBackgroundV2 />
            
            <div className="relative z-10 flex flex-col items-center w-full max-w-7xl">
                <motion.div
                    variants={titleContainerVariants}
                    initial="hidden"
                    animate="visible"
                    className="text-center"
                >
                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter pb-3">
                        <motion.span variants={clarityVariants} className="text-green-400">
                            {currentContent.title.split(' ')[0]}
                        </motion.span>{' '}
                        <motion.span variants={titleWordVariants} className="text-white">
                            {currentContent.title.split(' ')[1]}
                        </motion.span>{' '}
                        <motion.span variants={titleWordVariants} className="text-violet-400">
                            {currentContent.title.split(' ')[2]}
                        </motion.span>
                    </h1>
                    <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 1.2 }}
                        className="mt-2 max-w-3xl text-lg md:text-xl text-slate-300"
                    >
                        {currentContent.subtitle}
                    </motion.p>
                </motion.div>

                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={{
                        visible: { transition: { staggerChildren: 0.2, delayChildren: 1.5 } }
                    }}
                    className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 w-full"
                >
                    <motion.div variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}>
                        <ToolCard 
                            href="/retirement-simulator"
                            icon={<BarChart className="h-10 w-10 text-indigo-300" />}
                            title={currentContent.simulatorTitle}
                            cta={currentContent.simulatorCTA}
                        >
                            {currentContent.simulatorText}
                        </ToolCard>
                    </motion.div>
                    
                    <motion.div variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}>
                        <ToolCard
                            href="/stock-analysis"
                            icon={<Shield className="h-10 w-10 text-indigo-300" />}
                            title={currentContent.analysisTitle}
                            cta={currentContent.analysisCTA}
                        >
                            {currentContent.analysisText}
                        </ToolCard>
                    </motion.div>

                    <motion.div variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}>
                        <ToolCard
                            href="/learn"
                            icon={<BookOpen className="h-10 w-10 text-indigo-300" />}
                            title={currentContent.learnTitle}
                            cta={currentContent.learnCTA}
                        >
                            {currentContent.learnText}
                        </ToolCard>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
}