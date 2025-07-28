import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable'; // Mengimpor autoTable sebagai fungsi
import { Transaction } from '../types/Transaction';
import { formatCurrency, formatDate } from './dateUtils';
import toast from 'react-hot-toast'; // Import toast
import { format } from 'date-fns'; // Import format dari date-fns
import { id } from 'date-fns/locale'; // Import locale id

export const generateMonthlyReport = (transactions: Transaction[], month: number, year: number) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;

  // Filter transactions for the specific month and year
  const monthlyTransactions = transactions.filter(t => {
    const transactionDate = new Date(t.date);
    return transactionDate.getMonth() === month && transactionDate.getFullYear() === year;
  });

  // Tanggal Cetak di pojok kanan atas
  const printDate = format(new Date(), 'dd MMMM yyyy', { locale: id });
  doc.setFontSize(10);
  doc.text(`Tanggal Cetak: ${printDate}`, pageWidth - margin, 20, { align: 'right' });

  // Header (dipindahkan ke tengah)
  doc.setFontSize(20);
  doc.text('Laporan Keuangan Bulanan', pageWidth / 2, 30, { align: 'center' });
  doc.setFontSize(14);
  doc.text(`${monthNames[month]} ${year}`, pageWidth / 2, 40, { align: 'center' });

  // Summary
  const totalIncome = monthlyTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalExpense = monthlyTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpense;

  doc.setFontSize(12);
  doc.text(`Total Pemasukan: ${formatCurrency(totalIncome)}`, margin, 55);
  doc.text(`Total Pengeluaran: ${formatCurrency(totalExpense)}`, margin, 65);
  doc.text(`Saldo: ${formatCurrency(balance)}`, margin, 75);

  // Transaction table
  const tableData = monthlyTransactions.map(t => [
    formatDate(t.date),
    t.title,
    t.category,
    t.type === 'income' ? formatCurrency(t.amount) : '-',
    t.type === 'expense' ? formatCurrency(t.amount) : '-'
  ]);

  autoTable(doc, {
    head: [['Tanggal', 'Deskripsi', 'Kategori', 'Pemasukan', 'Pengeluaran']],
    body: tableData,
    startY: 85, // Sesuaikan startY agar tidak menabrak summary
    styles: { 
      fontSize: 10,
      lineColor: [0, 0, 0], // Warna garis hitam
      lineWidth: 0.1 // Ketebalan garis
    },
    headStyles: { 
      fillColor: [168, 230, 207], // Warna latar belakang
      textColor: [0, 0, 0], // Warna teks hitam
      fontStyle: 'bold' // Teks tebal
    },
    didDrawPage: (data) => {
      // Footer
      const footerText = 'MoneyTracker - Anang Creative Production';
      const footerFontSize = 10;
      const textLineSpacing = 5; // Jarak antara garis dan teks footer

      doc.setFontSize(footerFontSize);
      doc.setTextColor(100); // Warna abu-abu untuk footer

      // Hitung posisi Y untuk garis bawah
      const bottomLineY = pageHeight - 20; // 20 unit dari bawah halaman

      // Gambar satu garis
      doc.line(margin, bottomLineY, pageWidth - margin, bottomLineY); 

      // Tambahkan teks footer
      doc.text(footerText, pageWidth / 2, bottomLineY + textLineSpacing, { align: 'center' });
    }
  });

  doc.save(`laporan-${monthNames[month].toLowerCase()}-${year}.pdf`);
  toast.success('Laporan bulanan berhasil diunduh!'); // Success toast
};

export const generateYearlyReport = (transactions: Transaction[], year: number) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  
  // Filter transactions for the specific year
  const yearlyTransactions = transactions.filter(t => {
    const transactionDate = new Date(t.date);
    return transactionDate.getFullYear() === year;
  });

  // Tanggal Cetak di pojok kanan atas
  const printDate = format(new Date(), 'dd MMMM yyyy', { locale: id });
  doc.setFontSize(10);
  doc.text(`Tanggal Cetak: ${printDate}`, pageWidth - margin, 20, { align: 'right' });

  // Header (dipindahkan ke tengah)
  doc.setFontSize(20);
  doc.text('Laporan Keuangan Tahunan', pageWidth / 2, 30, { align: 'center' });
  doc.setFontSize(14);
  doc.text(`Tahun ${year}`, pageWidth / 2, 40, { align: 'center' });

  // Summary
  const totalIncome = yearlyTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalExpense = yearlyTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpense;

  doc.setFontSize(12);
  doc.text(`Total Pemasukan: ${formatCurrency(totalIncome)}`, margin, 55);
  doc.text(`Total Pengeluaran: ${formatCurrency(totalExpense)}`, margin, 65);
  doc.text(`Saldo: ${formatCurrency(balance)}`, margin, 75);

  // Monthly breakdown
  const monthlyData = [];
  for (let month = 0; month < 12; month++) {
    const monthTransactions = yearlyTransactions.filter(t => {
      const transactionDate = new Date(t.date);
      return transactionDate.getMonth() === month;
    });

    const monthIncome = monthTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const monthExpense = monthTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    monthlyData.push([
      monthNames[month],
      formatCurrency(monthIncome),
      formatCurrency(monthExpense),
      formatCurrency(monthIncome - monthExpense)
    ]);
  }

  autoTable(doc, {
    head: [['Bulan', 'Pemasukan', 'Pengeluaran', 'Saldo']],
    body: monthlyData,
    startY: 85, // Sesuaikan startY agar tidak menabrak summary
    styles: { 
      fontSize: 10,
      lineColor: [0, 0, 0], // Warna garis hitam
      lineWidth: 0.1 // Ketebalan garis
    },
    headStyles: { 
      fillColor: [168, 230, 207], // Warna latar belakang
      textColor: [0, 0, 0], // Warna teks hitam
      fontStyle: 'bold' // Teks tebal
    },
    didDrawPage: (data) => {
      // Footer
      const footerText = 'MoneyTracker - Anang Creative Production';
      const footerFontSize = 10;
      const textLineSpacing = 5; // Jarak antara garis dan teks footer

      doc.setFontSize(footerFontSize);
      doc.setTextColor(100); // Warna abu-abu untuk footer

      // Hitung posisi Y untuk garis bawah
      const bottomLineY = pageHeight - 20; // 20 unit dari bawah halaman

      // Gambar satu garis
      doc.line(margin, bottomLineY, pageWidth - margin, bottomLineY); 

      // Tambahkan teks footer
      doc.text(footerText, pageWidth / 2, bottomLineY + textLineSpacing, { align: 'center' });
    }
  });

  doc.save(`laporan-tahunan-${year}.pdf`);
  toast.success('Laporan tahunan berhasil diunduh!'); // Success toast
};

const monthNames = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];