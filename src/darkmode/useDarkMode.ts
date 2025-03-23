import { useEffect, useState } from "react";

export default function useDarkMode() {
  const getPreferredTheme = () => {
    if (typeof window === "undefined") return false;

    const storedTheme = localStorage.getItem("theme");
    if (storedTheme) return storedTheme === "dark";

    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  };

  const [isDarkMode, setIsDarkMode] = useState<boolean>(getPreferredTheme);

  // Apply theme to <html>
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  // Listen for OS preference changes
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = (e: MediaQueryListEvent) => {
      const storedTheme = localStorage.getItem("theme");

      // If user hasn't manually selected a theme, follow the system change
      if (!storedTheme) {
        setIsDarkMode(e.matches);
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const toggleDarkMode = () => {
    const newMode: boolean = !isDarkMode;
    setIsDarkMode(newMode);

    // Store user preference only if they explicitly toggle
    localStorage.setItem("theme", newMode ? "dark" : "light");
  };

  return { isDarkMode, toggleDarkMode };
}
