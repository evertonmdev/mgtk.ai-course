"use client";

import { ThemeProvider as NextThemeProvider } from 'next-themes';
import React from 'react';

interface IThemeProvider {
    children: React.ReactNode
}

export const ThemeProvider: React.FC<IThemeProvider> = ({ children }) => {
    return <NextThemeProvider defaultTheme={"light"} attribute='class'> {children} </NextThemeProvider>
}