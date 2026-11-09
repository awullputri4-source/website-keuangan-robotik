import React, { useState, useMemo } from 'react';
import { 
  FileText, 
  Printer, 
  Download, 
  Calendar, 
  Wallet, 
  ShoppingCart, 
  TrendingUp, 
  RotateCcw, 
  ShieldCheck, 
  Bot,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { formatRupiah, formatDate, downloadCSV } from '../utils/formatters';

export const FinancialReports: React.FC = () => {
  const { summary, kasPayments, events, resetToDefaultData } = useFinance();
  const [filterType, setFilterType] = useState<'all' | 'in' | 'out'>('all');

  // Build unified chronological transactions (Buku Kas Umum)
  const unifiedLedger = useMemo(() => {
    const list: Array<{
      id: string;
      date: string;
      description: string;
      category: string;
      type: 'in' | 'out';
      inAmount: number;
      outAmount: number;
      methodOrEvent: string;
      actor: string;
    }> = [];

    // Kas Payments (Inflows)
    kasPayments.forEach((p) => {
      list.push({
        id: p.id,
        date: p.paymentDate,
        description: `Setoran Uang Kas: ${p.memberName} (${p.nim}) - ${p.period}`,
        category: 'Iuran Kas Anggota',
        type: 'in',
        inAmount: p.amount,
        outAmount: 0,
        methodOrEvent: p.paymentMethod === 'cash' ? 'Tunai (Cash)' : `Transfer ${p.bankOrWallet || ''}`,
        actor: p.verifiedBy,
      });
    });

    // Event Expenses (Outflows)
    events.forEach((ev) => {
      (ev.expenses || []).forEach((item) => {
        list.push({
          id: item.id,
          date: item.purchaseDate,
          description: `Belanja: ${item.name} (${item.quantity} ${item.unit})`,
          category: item.category,
          type: 'out',
          inAmount: 0,
          outAmount: item.totalPrice,
          methodOrEvent: ev.name,
          actor: item.purchasedBy || 'Anggota',
        });
      });
    });

    // Sort ascending by date for ledger calculation
    list.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // Calculate running balance
    let running = 0;
    const ledgerWithBalance = list.map((tx) => {
      if (tx.type === 'in') {
        running += tx.inAmount;
      } else {
        running -= tx.outAmount;
      }
      return {
        ...tx,
        balance: running,
      };
    });

    // Return descending for preview table, or can be sorted as needed
    return ledgerWithBalance.reverse();
  }, [kasPayments, events]);

  const filteredLedger = useMemo(() => {
    if (filterType === 'all') return unifiedLedger;
    return unifiedLedger.filter((t) => t.type === filterType);
  }, [unifiedLedger, filterType]);

  const handleExportCSV = () => {
    const headers = [
      'No',
      'Tanggal',
      'Keterangan Transaksi',
      'Kategori',
      'Jenis',
      'Pemasukan (Rp)',
      'Pengeluaran (Rp)',
      'Saldo Berjalan (Rp)',
      'Metode / Acara',
      'PJ / Penerima',
    ];

    const rows = filteredLedger.map((tx, idx) => [
      idx + 1,
      tx.date,
      tx.description,
      tx.category,
      tx.type === 'in' ? 'KAS MASUK' : 'PENGELUARAN',
      tx.inAmount,
      tx.outAmount,
      tx.balance,
      tx.methodOrEvent,
      tx.actor,
    ]);

    downloadCSV('Buku-Kas-Umum-Robotik.csv', [headers, ...rows]);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <FileText className="w-6 h-6 text-cyan-400" />
            Laporan Keuangan & Buku Kas Umum
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Rekapitulasi pembukuan kas masuk dan pengeluaran belanja organisasi siap cetak untuk LPJ.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold transition"
          >
            <Download className="w-4 h-4 text-cyan-400" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-cyan-950/40 transition active:scale-95"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Laporan LPJ</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Total Pemasukan Kas</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-emerald-400 mt-2">
            {formatRupiah(summary.totalKasIn)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1 flex gap-2">
            <span>Cash: {formatRupiah(summary.totalCashKas)}</span>
            <span>•</span>
            <span>Transfer: {formatRupiah(summary.totalTransferKas)}</span>
          </div>
        </div>

        <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Total Pengeluaran Belanja</span>
            <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center">
              <ArrowDownRight className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-rose-400 mt-2">
            {formatRupiah(summary.totalEventExpenses)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Realisasi dari seluruh acara & workshop
          </div>
        </div>

        <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Saldo Akhir Kas Tersedia</span>
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className={`text-2xl font-bold mt-2 ${summary.currentBalance >= 0 ? 'text-cyan-400' : 'text-rose-400'}`}>
            {formatRupiah(summary.currentBalance)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Status: {summary.currentBalance >= 0 ? 'Surplus Kas' : 'Defisit Anggaran'}
          </div>
        </div>

      </div>

      {/* Filter Tabs (Hidden on Print) */}
      <div className="no-print flex items-center justify-between bg-slate-800/60 border border-slate-700/80 p-2 rounded-2xl">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
              filterType === 'all'
                ? 'bg-cyan-500 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Semua Mutasi ({unifiedLedger.length})
          </button>
          <button
            onClick={() => setFilterType('in')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
              filterType === 'in'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Pemasukan Kas Saja
          </button>
          <button
            onClick={() => setFilterType('out')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
              filterType === 'out'
                ? 'bg-rose-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Pengeluaran Belanja Saja
          </button>
        </div>

        <button
          onClick={() => {
            if (confirm('Reset ulang data keuangan ke data contoh bawaan? Seluruh perubahan lokal akan dikembalikan.')) {
              resetToDefaultData();
            }
          }}
          className="text-xs text-slate-400 hover:text-rose-400 px-3 py-1 flex items-center gap-1.5 transition"
          title="Reset ke data awal"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Data Bawaan</span>
        </button>
      </div>

      {/* Printable Report Wrapper */}
      <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl overflow-hidden shadow-sm p-4 sm:p-6 print:p-0 print:border-none print:bg-white print:text-black">
        
        {/* Printable Letterhead (Kop Surat) */}
        <div className="border-b-2 border-slate-700 pb-4 mb-6 text-center print:border-black print:pb-3 print:mb-4">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Bot className="w-6 h-6 text-cyan-400 print:text-black" />
            <h2 className="text-lg font-black tracking-wider uppercase text-white print:text-black">
              UNIT KEGIATAN MAHASISWA ROBOTIKA KAMPUS
            </h2>
          </div>
          <p className="text-xs text-slate-300 print:text-black">
            Gedung Student Center Lt. 2, Laboratorium Robotika & Otomasi Kampus
          </p>
          <p className="text-[11px] text-slate-400 print:text-gray-600">
            Email: robotik@kampus.ac.id • Website: robotika.kampus.ac.id
          </p>
          <div className="mt-3 pt-2 border-t border-slate-700/60 print:border-gray-400">
            <h3 className="text-sm font-bold uppercase tracking-wider text-cyan-300 print:text-black">
              BUKU KAS UMUM & LAPORAN REALISASI KEUANGAN
            </h3>
            <p className="text-xs text-slate-400 print:text-black">
              Periode Buku Tahun Anggaran 2024 / 2025
            </p>
          </div>
        </div>

        {/* Ledger Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300 print:text-black">
            <thead className="bg-slate-800 text-slate-300 uppercase font-semibold text-[11px] tracking-wider border-b border-slate-700 print:bg-gray-100 print:text-black print:border-black">
              <tr>
                <th className="py-2.5 px-3">No</th>
                <th className="py-2.5 px-3">Tanggal</th>
                <th className="py-2.5 px-3">Uraian Transaksi</th>
                <th className="py-2.5 px-3">Kategori</th>
                <th className="py-2.5 px-3">Acara / Metode</th>
                <th className="py-2.5 px-3 text-right">Debet (Masuk)</th>
                <th className="py-2.5 px-3 text-right">Kredit (Keluar)</th>
                <th className="py-2.5 px-3 text-right">Saldo Kas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/60 print:divide-gray-300">
              {filteredLedger.map((tx, idx) => (
                <tr key={tx.id} className="hover:bg-slate-800/40 print:hover:bg-transparent">
                  <td className="py-2.5 px-3 text-slate-500 print:text-gray-700">{idx + 1}</td>
                  <td className="py-2.5 px-3 whitespace-nowrap font-medium text-slate-200 print:text-black">
                    {formatDate(tx.date)}
                  </td>
                  <td className="py-2.5 px-3">
                    <div className="font-semibold text-white print:text-black">{tx.description}</div>
                    <div className="text-[10px] text-slate-400 print:text-gray-600">PJ: {tx.actor}</div>
                  </td>
                  <td className="py-2.5 px-3 whitespace-nowrap">
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300 print:border-gray-400 print:text-black print:bg-white">
                      {tx.category}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-400 print:text-gray-700 whitespace-nowrap">
                    {tx.methodOrEvent}
                  </td>
                  <td className="py-2.5 px-3 text-right font-bold text-emerald-400 print:text-emerald-800 whitespace-nowrap">
                    {tx.inAmount > 0 ? formatRupiah(tx.inAmount) : '-'}
                  </td>
                  <td className="py-2.5 px-3 text-right font-bold text-rose-400 print:text-rose-800 whitespace-nowrap">
                    {tx.outAmount > 0 ? formatRupiah(tx.outAmount) : '-'}
                  </td>
                  <td className="py-2.5 px-3 text-right font-bold text-white print:text-black whitespace-nowrap">
                    {formatRupiah(tx.balance)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-slate-800/90 font-bold border-t-2 border-slate-600 print:bg-gray-100 print:border-black print:text-black">
              <tr>
                <td colSpan={5} className="py-3 px-3 text-right uppercase text-slate-300 print:text-black">
                  Total Akumulasi:
                </td>
                <td className="py-3 px-3 text-right text-emerald-400 print:text-emerald-800">
                  {formatRupiah(summary.totalKasIn)}
                </td>
                <td className="py-3 px-3 text-right text-rose-400 print:text-rose-800">
                  {formatRupiah(summary.totalEventExpenses)}
                </td>
                <td className="py-3 px-3 text-right text-cyan-300 print:text-black">
                  {formatRupiah(summary.currentBalance)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Signature Section for LPJ Print */}
        <div className="mt-12 pt-6 border-t border-slate-700/60 print:border-black text-xs text-slate-300 print:text-black">
          <div className="grid grid-cols-3 text-center gap-4">
            <div>
              <p>Mengetahui,</p>
              <p className="font-semibold">Ketua Umum UKM Robotik</p>
              <div className="h-16"></div>
              <p className="font-bold underline">Muhammad Farhan</p>
              <p className="text-[10px] text-slate-500 print:text-gray-600">NIM. 21053461201</p>
            </div>

            <div>
              <p>Diperiksa Oleh,</p>
              <p className="font-semibold">Pembina Robotika Kampus</p>
              <div className="h-16"></div>
              <p className="font-bold underline">Dr. Ir. Hendra Wijaya, M.T.</p>
              <p className="text-[10px] text-slate-500 print:text-gray-600">NIP. 197805122005011002</p>
            </div>

            <div>
              <p>Dibuat Oleh,</p>
              <p className="font-semibold">Bendahara Umum</p>
              <div className="h-16"></div>
              <p className="font-bold underline">Nabila Syahrani</p>
              <p className="text-[10px] text-slate-500 print:text-gray-600">NIM. 22053461245</p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

