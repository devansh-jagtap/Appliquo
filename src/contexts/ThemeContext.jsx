import { createContext, useContext, useState, useEffect } from "react";

// Create ThemeContext with default values
const ThemeContext = createContext({ theme: "light", toggleTheme: () => {} });

// Custom hook to use theme context
export const useTheme = () => useContext(ThemeContext);

// ThemeProvider component
export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    // Try to get theme from localStorage or system preference
    const saved =
      typeof window !== "undefined" && localStorage.getItem("theme");
    if (saved === "light" || saved === "dark") return saved;
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    )
      return "dark";
    return "light";
  });

  useEffect(() => {
    // Sync theme to localStorage and html class
    localStorage.setItem("theme", theme);
    const root = document.documentElement;
    const body = document.body;
    if (theme === "dark") {
      root.classList.add("dark");
      body.classList.add("dark");
    } else {
      root.classList.remove("dark");
      body.classList.remove("dark");
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
