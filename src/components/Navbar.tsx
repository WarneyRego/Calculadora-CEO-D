import React from 'react';
import { Moon, Sun, Stethoscope } from 'lucide-react';
import { Switch } from '@headlessui/react';
import { useTheme } from '../contexts/ThemeContext';
import { Link } from 'react-router-dom';

export function Navbar() {
  const { darkMode, setDarkMode } = useTheme();

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-700 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <Stethoscope className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            <span className="text-xl font-bold text-gray-900 dark:text-white">CEO-D</span>
          </Link>

          <Switch
            checked={darkMode}
            onChange={setDarkMode}
            className={`${
              darkMode ? 'bg-blue-400' : 'bg-blue-300'
            } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2`}
          >
            <span className="sr-only">Alternar tema escuro</span>
            <span
              className={`${
                darkMode ? 'translate-x-6' : 'translate-x-1'
              } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
            />
            <Moon className={`absolute right-1.5 h-3.5 w-3.5 text-blue-900 ${darkMode ? 'opacity-100' : 'opacity-0'} transition-opacity`} />
            <Sun className={`absolute left-1.5 h-3.5 w-3.5 text-blue-900 ${darkMode ? 'opacity-0' : 'opacity-100'} transition-opacity`} />
          </Switch>
        </div>
      </div>
    </nav>
  );
} 