"use client";

import { ThemeProvider as NextThemeProvider } from 'next-themes';
import React from 'react';
import { Toaster } from 'sonner';

interface IThemeProvider {
    children: React.ReactNode
}

export const ThemeProvider: React.FC<IThemeProvider> = ({ children }) => {
    return <NextThemeProvider defaultTheme={"dark"} attribute='class'> {children} </NextThemeProvider>
}