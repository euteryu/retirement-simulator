// src/context/ThemeProvider.tsx
"use client"

import * as React from "react"
// THE FIX IS HERE: Import BOTH the component and its props type from the main package.
import { ThemeProvider as NextThemesProvider, type ThemeProviderProps } from "next-themes"

// This component is a simple wrapper around the real provider from the library.
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}