"use client";

import useGlobalStorage from "@/components/modules/Storages/GlobalStorage";
import { ThemeProvider as NextThemeProvider } from "next-themes";
import React, { useEffect } from "react";

interface IThemeProvider {
	children: React.ReactNode;
}

export const ThemeProvider: React.FC<IThemeProvider> = ({ children }) => {
	const { triggerReload } = useGlobalStorage();

	useEffect(() => {
		triggerReload();
	}, [triggerReload]);

	return (
		<NextThemeProvider defaultTheme={"light"} attribute="class">
			{" "}
			{children}{" "}
		</NextThemeProvider>
	);
};
