import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme } from '@/store';
import { Button } from '@/components/ui/button';

const ThemeToggle = () => {
  const dispatch = useDispatch();
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);

  return (
    <Button
      variant="ghost"
      size="icon"
      className="select-none group relative px-4 py-2 text-cyan-500 transition-all duration-300 bg-transparent hover:bg-transparent hover:text-cyan-400"
      onClick={() => dispatch(toggleTheme())}
    >
      <div className="relative z-10">
        {isDarkMode ? (
          <Sun className="h-4 w-4 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12" />
        ) : (
          <Moon className="h-4 w-4 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12" />
        )}
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/10 to-cyan-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
      <div className="absolute inset-0 bg-cyan-900/5 scale-95 opacity-0 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 rounded-lg blur-sm"></div>
    </Button>
  );
};

export default ThemeToggle;
