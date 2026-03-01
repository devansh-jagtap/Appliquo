import { Sun, Moon } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className="fixed bottom-6 left-6 z-50 flex items-center justify-center rounded-2xl border border-border bg-card text-card-foreground p-3 shadow-lg transition-all duration-200 hover:scale-110 hover:bg-accent"
      style={{ width: 56, height: 56 }}
    >
      {theme === "dark" ? <Sun size={24} /> : <Moon size={24} />}
    </button>
  );
}
