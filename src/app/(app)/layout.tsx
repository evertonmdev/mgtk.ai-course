import { RootContextProvider } from "@/components/modules/Contexts/RootContext";
import ToasterContainer from "@/components/ui/Toaster";
import { cn } from "@/lib/cn";
import { ThemeProvider } from "@/utils/Theme/ThemeProvider";
import { font_primary } from "@/utils/fonts";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt" className={cn(font_primary.className)}>
      <body className="flex flex-col justify-start items-center w-full h-dvh ">
        <ThemeProvider>
          <RootContextProvider>
            {children}
          </RootContextProvider>

          <ToasterContainer />
        </ThemeProvider>
      </body>
    </html>
  );
}