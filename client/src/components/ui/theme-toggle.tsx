import { Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "@/hooks/use-theme";

export function ThemeToggle() {
  const { isDark, setTheme } = useTheme();

  const handleToggle = () => {
    // Direct setting of theme rather than using toggleTheme
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <motion.button
      onClick={handleToggle}
      className="rounded-full w-10 h-10 relative flex items-center justify-center transition-all duration-300 bg-white dark:bg-gray-800 shadow-md"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      aria-label="Toggle theme"
      type="button"
    >
      <Sun className={`h-5 w-5 absolute transition-all duration-300 text-yellow-500 ${isDark ? 'opacity-0 scale-0 rotate-90' : 'opacity-100 scale-100 rotate-0'}`} />
      <Moon className={`h-5 w-5 absolute transition-all duration-300 text-blue-400 ${!isDark ? 'opacity-0 scale-0 rotate-90' : 'opacity-100 scale-100 rotate-0'}`} />
    </motion.button>
  );
}
