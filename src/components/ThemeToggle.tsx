import { useEffect, useState } from "react";
import { MoonIcon, SunIcon } from "@phosphor-icons/react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";

type Theme = "light" | "dark";

const THEME_STORAGE_KEY = "theme";
const SOUND_VOLUME = 0.5;
const ANIMATION_DURATION = 0.1;
const INITIAL_SCALE = 0.8;
const INITIAL_OPACITY = 0.8;
const BLUR_AMOUNT = "4px";

const ThemeToggle = () => {
  const [theme, setTheme] = useState<Theme>("light");
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const getThemePreference = (): Theme => {
      // Check if dark class is already on html element (from inline script)
      if (document.documentElement.classList.contains("dark")) {
        return "dark";
      }
      if (typeof localStorage !== "undefined" && localStorage.getItem(THEME_STORAGE_KEY)) {
        return localStorage.getItem(THEME_STORAGE_KEY) as Theme;
      }
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    };
    
    setTheme(getThemePreference());

    const handleThemeToggle = (e: CustomEvent<{ theme: Theme }>) => {
      setTheme(e.detail.theme);
    };
    
    window.addEventListener("theme-toggle", handleThemeToggle as EventListener);
    
    return () => {
      window.removeEventListener("theme-toggle", handleThemeToggle as EventListener);
    };
  }, []);

  useEffect(() => {
    const isDark = theme === "dark";
    document.documentElement.classList[isDark ? "add" : "remove"]("dark");
    
    if (typeof localStorage !== "undefined") {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    }
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    
    const audio = new Audio("/light-switch.mp3");
    audio.volume = SOUND_VOLUME;
    audio.play().catch(() => {
      // Ignore audio play errors (e.g., user hasn't interacted with page yet)
    });
    
    setTheme(newTheme);
    
    // Dispatch custom event for other components
    window.dispatchEvent(new CustomEvent("theme-toggle", { detail: { theme: newTheme } }));
  };

  const ariaLabel = theme === "dark" ? "Switch to light theme" : "Switch to dark theme";

  const initialState = prefersReducedMotion
    ? false
    : { opacity: INITIAL_OPACITY, scale: INITIAL_SCALE, filter: `blur(${BLUR_AMOUNT})` };

  const exitState = prefersReducedMotion
    ? undefined
    : { opacity: INITIAL_OPACITY, scale: INITIAL_SCALE, filter: `blur(${BLUR_AMOUNT})` };

  const transition = prefersReducedMotion
    ? { duration: 0 }
    : { duration: ANIMATION_DURATION, ease: [0.4, 0, 0.2, 1] as const };

  return (
    <button
      onClick={toggleTheme}
      aria-label={ariaLabel}
      className="relative flex items-center justify-center size-10 rounded-full bg-button-bg backdrop-blur-sm border border-border hover:bg-button-hover transition-colors text-foreground active:scale-95 overflow-hidden cursor-pointer"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={theme}
          initial={initialState}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          exit={exitState}
          transition={transition}
          className="flex items-center justify-center"
        >
          {theme === "dark" ? <SunIcon aria-hidden="true" /> : <MoonIcon aria-hidden="true" />}
        </motion.span>
      </AnimatePresence>
    </button>
  );
};

export default ThemeToggle;
