// src/components/layout/Header.tsx
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PiggyBank, Briefcase } from 'lucide-react';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <PiggyBank className="h-6 w-6 text-indigo-600" />
          <span className="font-bold">Financially</span>
        </Link>
        <nav className="flex items-center space-x-6 text-sm font-medium">
          <Link href="/retirement-simulator" className="transition-colors hover:text-foreground/80 text-foreground/60">
            Retirement Simulator
          </Link>
          {/* Add more links to future tools here */}
        </nav>
        <div className="flex flex-1 items-center justify-end space-x-4">
           <Button>Get Started</Button>
        </div>
      </div>
    </header>
  );
}