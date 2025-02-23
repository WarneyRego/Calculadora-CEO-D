import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { Dashboard } from './components/Dashboard';
import { CeodCalculator } from './components/CeodCalculator';
import { ResultsList } from './components/ResultsList';
import { Navbar } from './components/Navbar';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
          {/* Círculos decorativos */}
          <div className="absolute top-0 left-0 w-96 h-96 bg-blue-400/10 dark:bg-blue-500/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-400/10 dark:bg-indigo-500/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
          
          <Navbar />
          <div className="pt-16 relative">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/calculator" element={<CeodCalculator />} />
              <Route path="/results" element={<ResultsList />} />
            </Routes>
          </div>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;