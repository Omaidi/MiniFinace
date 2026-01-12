import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

export const exportToPDF = (transactions, summary, orgName) => {
    const doc = new jsPDF();

    // Header
    doc.setFontSize(18);
    doc.text(`Laporan Keuangan - ${orgName}`, 14, 20);
    doc.setFontSize(11);
    doc.text(`Tanggal Cetak: ${new Date().toLocaleDateString('id-ID')}`, 14, 28);

    // Summary
    doc.setFontSize(14);
    doc.text('Ringkasan', 14, 40);

    const summaryData = [
        ['Total Pemasukan', `Rp ${summary.income.toLocaleString('id-ID')}`],
        ['Total Pengeluaran', `Rp ${summary.expense.toLocaleString('id-ID')}`],
        ['Saldo Akhir', `Rp ${summary.balance.toLocaleString('id-ID')}`],
    ];

    doc.autoTable({
        startY: 45,
        head: [['Keterangan', 'Jumlah']],
        body: summaryData,
        theme: 'grid',
        headStyles: { fillColor: [99, 102, 241] } // Indigo Color
    });

    // Transactions
    doc.text('Rincian Transaksi', 14, doc.lastAutoTable.finalY + 15);

    const transactionRows = transactions.map(t => [
        t.date,
        t.description,
        t.category,
        t.type === 'income' ? 'Pemasukan' : 'Pengeluaran',
        `Rp ${Number(t.amount).toLocaleString('id-ID')}`
    ]);

    doc.autoTable({
        startY: doc.lastAutoTable.finalY + 20,
        head: [['Tanggal', 'Deskripsi', 'Kategori', 'Tipe', 'Jumlah']],
        body: transactionRows,
        theme: 'striped',
        headStyles: { fillColor: [75, 85, 99] }
    });

    doc.save(`Laporan_Keuangan_${orgName.replace(/\s+/g, '_')}_${Date.now()}.pdf`);
};

export const exportToExcel = (transactions, summary, orgName) => {
    const wb = XLSX.utils.book_new();

    // Summary Sheet
    const summaryWs = XLSX.utils.json_to_sheet([
        { Keterangan: 'Nama Organisasi', Nilai: orgName },
        { Keterangan: 'Tanggal Cetak', Nilai: new Date().toLocaleDateString('id-ID') },
        { Keterangan: 'Total Pemasukan', Nilai: summary.income },
        { Keterangan: 'Total Pengeluaran', Nilai: summary.expense },
        { Keterangan: 'Saldo Akhir', Nilai: summary.balance },
    ]);
    XLSX.utils.book_append_sheet(wb, summaryWs, "Ringkasan");

    // Transactions Sheet
    const transactionData = transactions.map(t => ({
        Tanggal: t.date,
        Deskripsi: t.description,
        Kategori: t.category,
        Tipe: t.type === 'income' ? 'Pemasukan' : 'Pengeluaran',
        Jumlah: Number(t.amount)
    }));

    const transWs = XLSX.utils.json_to_sheet(transactionData);
    XLSX.utils.book_append_sheet(wb, transWs, "Transaksi");

    XLSX.writeFile(wb, `Laporan_Keuangan_${orgName.replace(/\s+/g, '_')}_${Date.now()}.xlsx`);
};
