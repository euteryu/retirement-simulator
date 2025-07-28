// src/app/learn/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, TrendingUp, Building, CheckCircle, XCircle } from 'lucide-react';
import { learnContent } from '@/lib/learn-content';
import { useLanguage } from '@/context/LanguageContext';
import { SimpleBarChart } from '@/components/learn/SimpleBarChart';

const iconMap: { [key: string]: React.ReactNode } = {
    TrendingUp: <TrendingUp className="w-8 h-8 text-indigo-400"/>,
    Building: <Building className="w-8 h-8 text-indigo-400"/>,
};

export default function LearnPage() {
    const { t, language } = useLanguage();
    const [activeSection, setActiveSection] = useState('stockAnalysis');
    const lang = language;

    const contentKeys = Object.keys(learnContent);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setActiveSection(entry.target.id);
                    }
                });
            },
            { rootMargin: '-40% 0px -60% 0px' }
        );

        contentKeys.forEach(key => {
            const element = document.getElementById(key);
            if (element) observer.observe(element);
        });

        return () => observer.disconnect();
    }, [contentKeys]);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <BookOpen className="mx-auto h-12 w-12 text-indigo-500" />
                    <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
                        {t('learnTitle')}
                    </h1>
                    <p className="mt-4 text-xl text-slate-600 dark:text-slate-400">
                        {t('learnSubtitle')}
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-x-12 mt-16">
                    <aside className="lg:col-span-1 lg:sticky lg:top-24 h-fit">
                        <nav className="space-y-2">
                            <h3 className="font-semibold text-lg mb-4">Topics</h3>
                            {contentKeys.map(key => {
                                const section = learnContent[key]?.[lang];
                                if (!section) return null;

                                return (
                                    <a
                                        key={key}
                                        href={`#${key}`}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            document.getElementById(key)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                        }}
                                        className={`flex items-center gap-3 px-4 py-2 rounded-md transition-all duration-200 ${
                                            activeSection === key 
                                            ? 'bg-indigo-500/10 text-indigo-500 font-semibold' 
                                            : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                                        }`}
                                    >
                                        {iconMap[section.icon]}
                                        <span>{section.title}</span>
                                    </a>
                                );
                            })}
                        </nav>
                    </aside>

                    <main className="lg:col-span-3">
                        {contentKeys.map(sectionKey => {
                            const section = learnContent[sectionKey]?.[lang];
                            if (!section) return null;

                            return (
                                <motion.section
                                    key={sectionKey}
                                    id={sectionKey}
                                    className="mb-20 scroll-mt-24"
                                >
                                    <h2 className="text-3xl font-bold mb-2">{section.title}</h2>
                                    <p className="text-lg text-slate-500 dark:text-slate-400 mb-8">{section.description}</p>
                                    
                                    <div className="space-y-12">
                                        {Object.keys(section.metrics || {}).map(metricKey => {
                                            const metric = section.metrics[metricKey]?.[lang];
                                            if (!metric) return null;

                                            return (
                                                // --- THIS IS THE COMPLETE, INNER CONTENT BLOCK THAT WAS MISSING ---
                                                <div key={metricKey}>
                                                    <h3 className="text-2xl font-semibold border-b-2 border-slate-200 dark:border-slate-700 pb-2 mb-4">{metric.title}</h3>
                                                    <div className="prose prose-lg prose-slate dark:prose-invert max-w-none">
                                                        <p><strong>What is it?</strong> {metric.definition}</p>
                                                        <div dangerouslySetInnerHTML={{ __html: metric.importance }} />

                                                        {metricKey === 'peRatio' && (
                                                            <SimpleBarChart 
                                                                label="P/E Ratio"
                                                                data={[
                                                                    { name: 'Company A (Value)', value: 12, color: '#22c55e' },
                                                                    { name: 'Company B (Growth)', value: 35, color: '#ef4444' },
                                                                    { name: 'Industry Avg', value: 20, color: '#64748b' }
                                                                ]}
                                                            />
                                                        )}
                                                        {metricKey === 'eps' && (
                                                             <SimpleBarChart 
                                                                label="EPS ($) Growth"
                                                                data={[
                                                                    { name: '2021', value: 1.50, color: '#64748b' },
                                                                    { name: '2022', value: 1.75, color: '#64748b' },
                                                                    { name: '2023', value: 2.10, color: '#22c55e' }
                                                                ]}
                                                            />
                                                        )}
                                                        
                                                        <div className="flex flex-col md:flex-row gap-4 my-6">
                                                            <div className="flex-1 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                                                                <h4 className="font-semibold flex items-center gap-2 text-green-700 dark:text-green-400"><CheckCircle className="h-5 w-5" /> What is "Good"?</h4>
                                                                <p className="mt-2 text-sm" dangerouslySetInnerHTML={{ __html: metric.good }}/>
                                                            </div>
                                                            <div className="flex-1 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                                                                <h4 className="font-semibold flex items-center gap-2 text-red-700 dark:text-red-400"><XCircle className="h-5 w-5" /> What is "Bad"?</h4>
                                                                <p className="mt-2 text-sm" dangerouslySetInnerHTML={{ __html: metric.bad }}/>
                                                            </div>
                                                        </div>
                                                        <p className="text-sm italic text-slate-500 dark:text-slate-400"><strong>Source:</strong> {metric.source}</p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </motion.section> 
                            );
                        })}
                    </main>
                </div>
            </div>
        </div>
    );
}