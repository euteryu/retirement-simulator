// src/app/layout.tsx
import type { Metadata } from 'next';
// 1. Import Poppins instead of Inter
import { Poppins } from 'next/font/google';
import './globals.css';
import 'katex/dist/katex.min.css'; // <-- ADD THIS LINE
import { Header } from '@/components/layout/Header';
import { LanguageProvider } from '@/context/LanguageContext';
import { ThemeProvider } from '@/context/ThemeProvider';

// 2. Configure the Poppins font with desired weights and a CSS variable
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700', '900'],
  variable: '--font-poppins',
});

export const metadata: Metadata = { /* ... */ };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/* 3. Apply the font variable to the body */}
      <body className={`${poppins.variable} font-sans`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <LanguageProvider>
            <Header />
            <main>{children}</main>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}