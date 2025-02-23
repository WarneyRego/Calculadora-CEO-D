import React from 'react';
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import { useSpring, animated } from 'react-spring';

interface LocationFormProps {
  onSubmit: (city: string, neighborhood: string) => void;
}

export function LocationForm({ onSubmit }: LocationFormProps) {
  const [location, setLocation] = React.useState({
    city: '',
    neighborhood: ''
  });

  const formAnimation = useSpring({
    from: { opacity: 0, transform: 'translateY(20px)' },
    to: { opacity: 1, transform: 'translateY(0px)' },
    config: { tension: 280, friction: 20 }
  });

  const inputAnimation = useSpring({
    from: { transform: 'scale(1)' },
    to: { transform: 'scale(1)' },
    config: { tension: 300, friction: 10 }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (location.city && location.neighborhood) {
      onSubmit(location.city, location.neighborhood);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4">
      <animated.div style={formAnimation} className="w-full max-w-md">
        <motion.div
          className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-xl sm:rounded-2xl shadow-xl sm:shadow-2xl p-6 sm:p-8"
          whileHover={{ boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" }}
        >
          <div className="flex items-center gap-3 mb-8">
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <MapPin className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </motion.div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Cadastro do Local
            </h2>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <animated.div style={inputAnimation}>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                Cidade
              </label>
              <input
                type="text"
                value={location.city}
                onChange={(e) => setLocation(prev => ({ ...prev, city: e.target.value }))}
                required
                className="w-full h-12 px-4 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white/80 dark:bg-gray-700/80 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 dark:focus:border-blue-400 transition-all outline-none text-lg focus:ring-2 focus:ring-blue-500/20"
                placeholder="Digite a cidade"
              />
            </animated.div>
            
            <animated.div style={inputAnimation}>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                Bairro
              </label>
              <input
                type="text"
                value={location.neighborhood}
                onChange={(e) => setLocation(prev => ({ ...prev, neighborhood: e.target.value }))}
                required
                className="w-full h-12 px-4 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white/80 dark:bg-gray-700/80 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 dark:focus:border-blue-400 transition-all outline-none text-lg focus:ring-2 focus:ring-blue-500/20"
                placeholder="Digite o bairro"
              />
            </animated.div>
            
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-lg font-medium rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
            >
              Continuar
            </motion.button>
          </form>
        </motion.div>
      </animated.div>
    </div>
  );
} 