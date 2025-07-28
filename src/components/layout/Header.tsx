// src/components/layout/Header.tsx
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PiggyBank, Moon, Sun } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from 'next-themes';

export function Header() {
  const { language, setLanguage } = useLanguage();
  const { theme, setTheme } = useTheme();

  const toggleLanguage = () => setLanguage(language === 'en' ? 'kr' : 'en');
  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <PiggyBank className="h-6 w-6 text-indigo-500" />
          <span className="font-bold">Financially</span>
        </Link>
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          {/* New link for the Screener page */}
          <Link href="/screener" className="transition-colors hover:text-foreground/80 text-foreground/60">
            Screener
          </Link>
          <Link href="/retirement-simulator" className="transition-colors hover:text-foreground/80 text-foreground/60">
            Simulator
          </Link>
          <Link href="/stock-analysis" className="transition-colors hover:text-foreground/80 text-foreground/60">
            Analysis
          </Link>
          <Link href="/learn" className="transition-colors hover:text-foreground/80 text-foreground/60">
            Learn
          </Link>
        </nav>
        <div className="flex flex-1 items-center justify-end space-x-2 md:space-x-4">
           <Button variant="outline" size="sm" onClick={toggleLanguage}>
             {language === 'en' ? '🇰🇷' : '🇬🇧'}
           </Button>
           <Button variant="ghost" size="icon" onClick={toggleTheme}>
             <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
             <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
             <span className="sr-only">Toggle theme</span>
           </Button>
        </div>
      </div>
    </header>
  );
}