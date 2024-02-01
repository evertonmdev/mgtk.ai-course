import { useTheme as nextUseTheme } from "next-themes"

type Theme = "light" | "dark"

export const useTheme = () => {
    const { theme, setTheme } = nextUseTheme()
    return { theme, setTheme } as { theme: Theme, setTheme: (theme: Theme) => void }
}