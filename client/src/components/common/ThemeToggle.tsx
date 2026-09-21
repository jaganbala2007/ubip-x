import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon, Sparkles } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface ThemeToggleProps {
  variant?: 'compact' | 'pill' | 'switch';
  className?: string;
  showLabel?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  variant = 'compact',
  className = '',
  showLabel = false
}) => {
  const { theme, isDark, toggleTheme, setTheme } = useTheme();

  if (variant === 'pill') {
    return (
      <div 
        className={`inline-flex items-center p-1 rounded-full border transition-all duration-300 ${
          isDark 
            ? 'bg-[#18181B] border-white/10 shadow-inner' 
            : 'bg-white border-zinc-300 shadow-sm'
        } ${className}`}
        role="group"
        aria-label="Theme selection"
      >
        <button
          onClick={() => setTheme('dark')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 relative ${
            isDark 
              ? 'text-white' 
              : 'text-zinc-500 hover:text-zinc-900'
          }`}
          title="Switch to Dark Mode"
        >
          {isDark && (
            <motion.div
              layoutId="theme-pill-active"
              className="absolute inset-0 rounded-full bg-gradient-to-r from-[#E8622C] to-[#C2410C] shadow-md shadow-[#E8622C]/25"
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            />
          )}
          <Moon className="w-3.5 h-3.5 relative z-10" />
          <span className="relative z-10 font-mono text-[11px]">Dark</span>
        </button>

        <button
          onClick={() => setTheme('light')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 relative ${
            !isDark 
              ? 'text-zinc-950 font-bold' 
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
          title="Switch to Light Mode"
        >
          {!isDark && (
            <motion.div
              layoutId="theme-pill-active"
              className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 shadow-md shadow-amber-500/25"
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            />
          )}
          <Sun className="w-3.5 h-3.5 relative z-10" />
          <span className="relative z-10 font-mono text-[11px]">Light</span>
        </button>
      </div>
    );
  }

  // Compact variant (standard for Top Navigation bar)
  return (
    <motion.button
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.94 }}
      onClick={toggleTheme}
      className={`relative px-3 py-1.5 rounded-xl border flex items-center gap-2 font-medium text-xs transition-all duration-300 group select-none ${
        isDark
          ? 'bg-[#1A1A1C] hover:bg-[#27272A] border-white/[0.08] hover:border-amber-400/40 text-zinc-300 hover:text-white'
          : 'bg-white hover:bg-zinc-50 border-zinc-200 hover:border-amber-500/50 text-zinc-700 hover:text-zinc-950 shadow-sm'
      } ${className}`}
      aria-label={`Toggle theme (currently ${theme})`}
      title={isDark ? 'Switch to Light Mode (Daylight Command)' : 'Switch to Dark Mode (Warm Titanium)'}
    >
      <div className="relative w-4 h-4 flex items-center justify-center overflow-hidden">
        {isDark ? (
          <motion.div
            key="sun-icon"
            initial={{ rotate: -90, scale: 0.5, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            exit={{ rotate: 90, scale: 0.5, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 350, damping: 20 }}
            className="text-amber-400 group-hover:text-amber-300"
          >
            <Sun className="w-4 h-4 fill-amber-400/20" />
          </motion.div>
        ) : (
          <motion.div
            key="moon-icon"
            initial={{ rotate: 90, scale: 0.5, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            exit={{ rotate: -90, scale: 0.5, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 350, damping: 20 }}
            className="text-indigo-600 group-hover:text-indigo-700"
          >
            <Moon className="w-4 h-4 fill-indigo-500/20" />
          </motion.div>
        )}
      </div>

      {showLabel && (
        <span className="font-mono text-[11px] font-bold tracking-tight">
          {isDark ? 'Light Mode' : 'Dark Mode'}
        </span>
      )}

      {/* Subtle indicator dot */}
      <span className={`w-1.5 h-1.5 rounded-full transition-colors ${
        isDark ? 'bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.6)]' : 'bg-indigo-600 shadow-[0_0_6px_rgba(79,70,229,0.5)]'
      }`} />
    </motion.button>
  );
};
