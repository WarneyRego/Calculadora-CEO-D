import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Result } from '../types';

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

export const generateResultsPDF = (results: Result[]) => {
  try {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const margin = 15;
    const usableWidth = pageWidth - (2 * margin);

    // Cabeçalho
    doc.setFillColor(41, 128, 185);
    doc.rect(0, 0, pageWidth, 35, 'F');
    doc.setTextColor(255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.text('Relatório CEO-D', margin, 25);

    // Box de Informações
    doc.setFillColor(245, 247, 250);
    doc.roundedRect(margin, 45, pageWidth - (2 * margin), 45, 3, 3, 'F');

    // Estatísticas
    const averageIndex = results.reduce((acc, curr) => acc + curr.result.index, 0) / results.length;
    const totalChildren = results.reduce((acc, curr) => acc + curr.children, 0);
    const totalCarious = results.reduce((acc, curr) => acc + curr.carious, 0);
    const totalExtracted = results.reduce((acc, curr) => acc + curr.extracted, 0);
    const totalFilled = results.reduce((acc, curr) => acc + curr.filled, 0);

    // Título do Box
    doc.setTextColor(41, 128, 185);
    doc.setFontSize(12);
    doc.text('Resumo Geral', margin + 5, 55);

    // Informações em duas colunas
    doc.setTextColor(80);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');

    const col1X = margin + 5;
    const col2X = pageWidth / 2;
    const startY = 65;
    const lineHeight = 12;

    // Coluna 1
    doc.text(`Data: ${new Date().toLocaleDateString('pt-BR')}`, col1X, startY);
    doc.text(`Total de registros: ${results.length}`, col1X, startY + lineHeight);
    doc.text(`Total de crianças: ${totalChildren}`, col1X, startY + lineHeight * 2);

    // Coluna 2
    doc.text(`Média CEO-D: ${averageIndex.toFixed(2)}`, col2X, startY);
    doc.text(`Cariados: ${totalCarious}`, col2X, startY + lineHeight);
    doc.text(`Extraídos/Obturados: ${totalExtracted + totalFilled}`, col2X, startY + lineHeight * 2);

    // Configuração da tabela
    const columnWidths = {
      0: usableWidth * 0.17,
      1: usableWidth * 0.17,
      2: usableWidth * 0.08,
      3: usableWidth * 0.15,
      4: usableWidth * 0.08,
      5: usableWidth * 0.08,
      6: usableWidth * 0.08,
      7: usableWidth * 0.09,
      8: usableWidth * 0.10
    };

    const tableData = results.map(result => [
      result.city,
      result.neighborhood,
      result.result.index.toFixed(1),
      translateLevel(result.result.level),
      result.carious.toString(),
      result.extracted.toString(),
      result.filled.toString(),
      result.children.toString(),
      new Date(result.timestamp.seconds * 1000).toLocaleDateString('pt-BR')
    ]);

    autoTable(doc, {
      head: [['Cidade', 'Bairro', 'CEO-D', 'Nível', 'C', 'E', 'O', 'Crianças', 'Data']],
      body: tableData,
      startY: 100,
      margin: { left: margin, right: margin },
      styles: {
        fontSize: 8,
        cellPadding: { top: 4, right: 3, bottom: 4, left: 3 },
        font: 'helvetica',
        lineColor: [220, 220, 220],
        lineWidth: 0.1
      },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontStyle: 'bold',
        fontSize: 8,
        minCellHeight: 10
      },
      columnStyles: {
        0: { cellWidth: columnWidths[0], halign: 'left' },
        1: { cellWidth: columnWidths[1], halign: 'left' },
        2: { cellWidth: columnWidths[2], halign: 'center' },
        3: { cellWidth: columnWidths[3], halign: 'center' },
        4: { cellWidth: columnWidths[4], halign: 'center' },
        5: { cellWidth: columnWidths[5], halign: 'center' },
        6: { cellWidth: columnWidths[6], halign: 'center' },
        7: { cellWidth: columnWidths[7], halign: 'center' },
        8: { cellWidth: columnWidths[8], halign: 'center' }
      },
      didDrawPage: (data) => {
        const footerY = pageHeight - 15;
        doc.setDrawColor(220, 220, 220);
        doc.line(margin, footerY - 10, pageWidth - margin, footerY - 10);
        doc.setFontSize(8);
        doc.setTextColor(100);
        doc.text('C: Cariados | E: Extraídos | O: Obturados', margin, footerY);
        doc.text(`Página ${data.pageNumber}`, pageWidth - margin - 20, footerY);

        if (data.pageNumber > 1) {
          doc.setFillColor(41, 128, 185);
          doc.rect(0, 0, pageWidth, 20, 'F');
          doc.setTextColor(255);
          doc.setFontSize(12);
          doc.text('Relatório CEO-D', margin, 14);
        }
      }
    });

    doc.save('relatorio-ceod.pdf');
  } catch (error) {
    console.error('Erro ao gerar PDF:', error);
    throw new Error('Falha ao gerar o PDF');
  }
}; 