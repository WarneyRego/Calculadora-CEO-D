import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { collection, query, orderBy, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { ArrowLeft, Moon, Sun, Trash2, Edit2, X, Save, Download } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Switch } from '@headlessui/react';
import { useTheme } from '../contexts/ThemeContext';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { generateResultsPDF } from '../utils/pdfGenerator';

interface Result {
  id: string;
  city: string;
  neighborhood: string;
  carious: number;
  extracted: number;
  filled: number;
  children: number;
  result: {
    index: number;
    level: string;
    message: string;
  };
  timestamp: any;
}

const translateLevel = (level: string): string => {
  switch (level) {
    case 'very low':
      return 'Muito Baixo';
    case 'low':
      return 'Baixo';
    case 'moderate':
      return 'Moderado';
    case 'high':
      return 'Alto';
    case 'very high':
      return 'Muito Alto';
    default:
      return level;
  }
};

interface CellStyle {
  fontStyle?: 'normal' | 'bold' | 'italic';
  textColor?: number[];
  fillColor?: number[] | null;
  halign?: 'left' | 'center' | 'right';
}

interface CustomCell {
  content: string | number;
  styles?: CellStyle;
}

export function ResultsList() {
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<Result> | null>(null);
  const { darkMode, setDarkMode } = useTheme();

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const q = query(collection(db, "ceodResults"), orderBy("timestamp", "desc"));
        const querySnapshot = await getDocs(q);
        const fetchedResults = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Result[];
        setResults(fetchedResults);
      } catch (error) {
        console.error("Erro ao buscar resultados:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este registro?')) return;
    
    try {
      await deleteDoc(doc(db, "ceodResults", id));
      setResults(prev => prev.filter(result => result.id !== id));
      alert('Registro excluído com sucesso!');
    } catch (error) {
      console.error("Erro ao excluir:", error);
      alert('Erro ao excluir registro.');
    }
  };

  const handleEdit = (result: Result) => {
    setEditingId(result.id);
    setEditData(result);
  };

  const handleSave = async () => {
    if (!editingId || !editData) return;
    
    try {
      await updateDoc(doc(db, "ceodResults", editingId), editData);
      setResults(prev => prev.map(result => 
        result.id === editingId ? { ...result, ...editData } : result
      ));
      setEditingId(null);
      setEditData(null);
      alert('Registro atualizado com sucesso!');
    } catch (error) {
      console.error("Erro ao atualizar:", error);
      alert('Erro ao atualizar registro.');
    }
  };

  const handleGeneratePDF = async () => {
    try {
      await generateResultsPDF(results);
    } catch (error) {
      alert('Erro ao gerar o PDF. Por favor, tente novamente.');
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-xl sm:rounded-2xl shadow-xl sm:shadow-2xl p-4 sm:p-6 md:p-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
            <div className="flex items-center justify-between sm:justify-start gap-4">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                Resultados Cadastrados
              </h1>
           
            </div>
            <div className="flex items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleGeneratePDF}
                className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors shadow-lg hover:shadow-xl"
              >
                <Download className="w-4 h-4" />
                <span>Exportar PDF</span>
              </motion.button>

              <Link
                to="/"
                className="inline-flex items-center justify-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors bg-white/50 dark:bg-gray-700/50 rounded-lg px-4 py-2"
              >
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Voltar</span>
              </Link>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-400">Carregando resultados...</p>
            </div>
          ) : results.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400">Nenhum resultado cadastrado.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {results.map((result) => (
                <motion.div
                  key={result.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-white dark:bg-gray-700 rounded-lg shadow-md hover:shadow-lg transition-shadow p-4 sm:p-5"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                    <div className="flex-1 space-y-2">
                      {editingId === result.id ? (
                        <div className="space-y-3">
                          <input
                            type="text"
                            value={editData?.city || ''}
                            onChange={e => setEditData(prev => ({ ...prev, city: e.target.value }))}
                            className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-2"
                            placeholder="Cidade"
                          />
                          <input
                            type="text"
                            value={editData?.neighborhood || ''}
                            onChange={e => setEditData(prev => ({ ...prev, neighborhood: e.target.value }))}
                            className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-2"
                            placeholder="Bairro"
                          />
                        </div>
                      ) : (
                        <>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                              {result.city} - {result.neighborhood}
                            </h3>
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                              result.result.level.includes('low') 
                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' 
                                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
                            }`}>
                              Índice: {result.result.index.toFixed(1)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {new Date(result.timestamp.seconds * 1000).toLocaleDateString('pt-BR')}
                          </p>
                        </>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2 self-end sm:self-start">
                      {editingId === result.id ? (
                        <>
                          <button
                            onClick={handleSave}
                            className="p-2 rounded-lg bg-green-100 text-green-600 hover:bg-green-200 dark:bg-green-900/50 dark:text-green-400 dark:hover:bg-green-900 transition-colors"
                          >
                            <Save className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600 transition-colors"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleEdit(result)}
                            className="p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 dark:bg-blue-900/50 dark:text-blue-400 dark:hover:bg-blue-900 transition-colors"
                          >
                            <Edit2 className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(result.id)}
                            className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900/50 dark:text-red-400 dark:hover:bg-red-900 transition-colors"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4 text-sm bg-gray-50 dark:bg-gray-600/50 rounded-lg p-4">
                    <div>
                      <p className="text-gray-500 dark:text-gray-400 mb-1">Cariados</p>
                      <p className="font-medium text-gray-900 dark:text-white text-lg">{result.carious}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 dark:text-gray-400 mb-1">Extraídos</p>
                      <p className="font-medium text-gray-900 dark:text-white text-lg">{result.extracted}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 dark:text-gray-400 mb-1">Obturados</p>
                      <p className="font-medium text-gray-900 dark:text-white text-lg">{result.filled}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 dark:text-gray-400 mb-1">Crianças</p>
                      <p className="font-medium text-gray-900 dark:text-white text-lg">{result.children}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
} 