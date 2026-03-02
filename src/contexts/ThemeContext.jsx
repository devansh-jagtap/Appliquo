import { createContext, useContext, useState, useEffect } from "react";

// Create ThemeContext with default values
const ThemeContext = createContext({ theme: "light", toggleTheme: () => {} });

// Custom hook to use theme context
export const useTheme = () => useContext(ThemeContext);

// ThemeProvider component
export const ThemeProvider = ({ children }) => {
  // Always use dark theme
  const theme = "dark";

  useEffect(() => {
    // Force dark mode on mount
    const root = document.documentElement;
    const body = document.body;
    root.classList.add("dark");
    body.classList.add("dark");
  }, []);

  // Keep toggleTheme for backwards compatibility (does nothing)
  const toggleTheme = () => {};

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
