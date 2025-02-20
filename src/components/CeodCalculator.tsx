import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, CheckCircle, Info, Moon, Sun, Stethoscope } from 'lucide-react';
import { Switch } from '@headlessui/react';
import { CeodData, CeodResult } from '../types';

const calculateCeod = (data: CeodData): CeodResult => {
  const index = (data.carious + data.extracted + data.filled) / data.children;
  
  let level = 'very-low';
  let message = 'Índice de cárie controlado.';
  
  if (index <= 1.1) {
    level = 'very-low';
  } else if (index <= 2.6) {
    level = 'low';
  } else if (index <= 4.4) {
    level = 'moderate';
    message = 'Necessidade de uma intervenção odontológica incisiva.';
  } else if (index <= 6.5) {
    level = 'high';
    message = 'Necessidade de uma intervenção odontológica incisiva.';
  } else {
    level = 'very-high';
    message = 'Necessidade de uma intervenção odontológica incisiva.';
  }
  
  return { index, level: level as CeodResult['level'], message };
};

const levelColors = {
  'very-low': 'bg-green-500 dark:bg-green-600',
  'low': 'bg-lime-500 dark:bg-lime-600',
  'moderate': 'bg-amber-500 dark:bg-amber-600',
  'high': 'bg-red-500 dark:bg-red-600',
  'very-high': 'bg-red-600 dark:bg-red-700'
};

const levelGradients = {
  'very-low': 'from-green-500 to-green-600 dark:from-green-600 dark:to-green-700',
  'low': 'from-lime-500 to-lime-600 dark:from-lime-600 dark:to-lime-700',
  'moderate': 'from-amber-500 to-amber-600 dark:from-amber-600 dark:to-amber-700',
  'high': 'from-red-500 to-red-600 dark:from-red-600 dark:to-red-700',
  'very-high': 'from-red-600 to-red-700 dark:from-red-700 dark:to-red-800'
};

const levelText = {
  'very-low': 'Muito Baixo',
  'low': 'Baixo',
  'moderate': 'Moderado',
  'high': 'Alto',
  'very-high': 'Muito Alto'
};

export function CeodCalculator() {
  const [data, setData] = useState<CeodData>({
    carious: 0,
    extracted: 0,
    filled: 0,
    children: 1
  });
  
  const [showInfo, setShowInfo] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const result = calculateCeod(data);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData(prev => ({
      ...prev,
      [name]: Math.max(0, parseInt(value) || 0)
    }));
  };

  React.useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 px-4 py-6 sm:p-8 transition-colors duration-200">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden transition-colors duration-200"
        >
          {/* Header */}
          <div className="relative bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-800 dark:to-blue-900 p-6 sm:p-8">
            <div className="absolute inset-0 bg-grid-white/[0.2] [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]" />
            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Stethoscope className="w-8 h-8 text-white" />
                <h1 className="text-2xl sm:text-3xl font-bold text-white">
                  Índice CEO-D
                </h1>
              </div>
              <div className="flex items-center gap-4">
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
                <button
                  onClick={() => setShowInfo(!showInfo)}
                  className="p-2 rounded-full hover:bg-white/10 transition-colors"
                >
                  <Info className="w-6 h-6 text-white" />
                </button>
              </div>
            </div>
          </div>
          
          <AnimatePresence>
            {showInfo && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="bg-blue-50 dark:bg-blue-900/50 border-b border-blue-100 dark:border-blue-800 transition-colors duration-200"
              >
                <div className="p-4 text-sm text-blue-700 dark:text-blue-200">
                  <h3 className="font-semibold mb-2">Classificação do Índice ceo-d:</h3>
                  <ul className="space-y-1">
                    <li>• Muito Baixo: 0,0 a 1,1</li>
                    <li>• Baixo: 1,2 a 2,6</li>
                    <li>• Moderado: 2,7 a 4,4</li>
                    <li>• Alto: 4,5 a 6,5</li>
                    <li>• Muito Alto: 6,6 ou mais</li>
                  </ul>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          <div className="p-6 sm:p-8">
            <div className="space-y-8">
              {/* Input Fields */}
              <motion.div
                initial={false}
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ duration: 0.2 }}
                className="grid sm:grid-cols-2 gap-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                    Dentes Cariados
                  </label>
                  <input
                    type="number"
                    name="carious"
                    value={data.carious}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:focus:border-blue-400 dark:focus:ring-blue-400 transition-colors duration-200"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                    Dentes Extraídos
                  </label>
                  <input
                    type="number"
                    name="extracted"
                    value={data.extracted}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:focus:border-blue-400 dark:focus:ring-blue-400 transition-colors duration-200"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                    Dentes Obturados
                  </label>
                  <input
                    type="number"
                    name="filled"
                    value={data.filled}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:focus:border-blue-400 dark:focus:ring-blue-400 transition-colors duration-200"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                    Número de Crianças
                  </label>
                  <input
                    type="number"
                    name="children"
                    value={data.children}
                    onChange={handleInputChange}
                    min="1"
                    className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:focus:border-blue-400 dark:focus:ring-blue-400 transition-colors duration-200"
                  />
                </div>
              </motion.div>
              
              {/* Results */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl overflow-hidden"
              >
                <div className={`bg-gradient-to-br ${levelGradients[result.level]} p-6 text-white`}>
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-xl font-semibold">
                      Resultado
                    </h2>
                    <span className="px-3 py-1 rounded-full bg-white/20 text-sm font-medium backdrop-blur-sm">
                      {levelText[result.level]}
                    </span>
                  </div>
                  
                  <motion.p
                    key={result.index}
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-5xl font-bold mb-3"
                  >
                    {result.index.toFixed(1)}
                  </motion.p>
                  
                  <div className="flex items-start gap-2">
                    {result.level === 'very-low' || result.level === 'low' ? (
                      <CheckCircle className="w-5 h-5 mt-1 flex-shrink-0" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 mt-1 flex-shrink-0" />
                    )}
                    <p className="text-white/90">{result.message}</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}