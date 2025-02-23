import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calculator, ListFilter } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 10
    }
  }
};

export function Dashboard() {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-4xl" ref={ref}>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="text-center mb-12"
        >
          <motion.h1 
            variants={itemVariants}
            className="text-4xl font-bold text-gray-900 dark:text-white mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400"
          >
            Bem-vindo!
          </motion.h1>
          <motion.p 
            variants={itemVariants}
            className="text-lg text-gray-600 dark:text-gray-300"
          >
            Selecione uma opção para continuar
          </motion.p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto"
        >
          <motion.div variants={itemVariants}>
            <Link to="/calculator" className="block group">
              <div className="h-full p-8 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white transition-all cursor-pointer shadow-lg hover:shadow-xl backdrop-blur-sm transform hover:-translate-y-1 duration-300 relative overflow-hidden">
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <Calculator className="w-12 h-12 mb-6 mx-auto transform group-hover:scale-110 transition-transform duration-300" />
                <h2 className="text-2xl font-semibold mb-3 text-center">Novo Cálculo</h2>
                <p className="text-blue-100 text-center">
                  Realizar novo cálculo do índice CEO-D
                </p>
              </div>
            </Link>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <Link to="/results" className="block group">
              <div className="h-full p-8 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white transition-all cursor-pointer shadow-lg hover:shadow-xl backdrop-blur-sm transform hover:-translate-y-1 duration-300 relative overflow-hidden">
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <ListFilter className="w-12 h-12 mb-6 mx-auto transform group-hover:scale-110 transition-transform duration-300" />
                <h2 className="text-2xl font-semibold mb-3 text-center">Resultados</h2>
                <p className="text-indigo-100 text-center">
                  Visualizar todos os resultados cadastrados
                </p>
              </div>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
} 